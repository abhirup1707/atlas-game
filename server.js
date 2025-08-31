const express = require("express");
const http = require("http");
const socketIO = require("socket.io");

const app = express();
const server = http.createServer(app);
const io = socketIO(server);

app.use(express.static("public"));

const rooms = {};

function generateRoomId() {
  return Math.random().toString(36).substring(2, 8).toUpperCase();
}

function startPlayerTurn(roomId) {
  const room = rooms[roomId];
  if (!room || !room.players.length) return;

  const currentPlayer = room.players[room.turnIndex];
  if (!currentPlayer) return;

  // Set the start time for the current turn
  room.turnStartTime = Date.now();
  io.to(roomId).emit("yourTurn", { lastLetter: room.lastLetter });

  const currentPlayerSocket = io.sockets.sockets.get(currentPlayer.socketId);
  if (currentPlayerSocket) {
    currentPlayerSocket.emit("yourTurn", { lastLetter: room.lastLetter });
  } else {
    room.turnIndex = (room.turnIndex + 1) % room.players.length;
    startPlayerTurn(roomId);
    return;
  }

  // Notify others it's not their turn
  room.players.forEach((p, i) => {
    if (i !== room.turnIndex) {
      const playerSocket = io.sockets.sockets.get(p.socketId);
      if (playerSocket) {
        playerSocket.emit("notYourTurn", { playerName: currentPlayer.name, lastLetter: room.lastLetter });
      }
    }
  });

  if (room.turnTimeouts[roomId]) clearTimeout(room.turnTimeouts[roomId]);
  room.turnTimeouts[roomId] = setTimeout(() => {
    giveUpTurn(roomId, currentPlayer.name);
  }, 20000); // 20 seconds turn limit
}

function giveUpTurn(roomId, name) {
  const room = rooms[roomId];
  if (!room) return;

  const playerIndex = room.players.findIndex(p => p.name === name);
  if (playerIndex !== -1) {
    const eliminatedPlayer = room.players.splice(playerIndex, 1)[0]; // Remove the player
    console.log(`${eliminatedPlayer.name} has given up and been eliminated from room ${roomId}`);
    io.to(roomId).emit("message", `${eliminatedPlayer.name} has given up!`);

    // Adjust turnIndex if the current player was eliminated
    if (playerIndex === room.turnIndex) {
      room.turnIndex = (room.turnIndex) % room.players.length; // Move to next player
      if (room.turnIndex === playerIndex) room.turnIndex = (room.turnIndex + 1) % room.players.length; // Skip if same
    } else if (playerIndex < room.turnIndex) {
      room.turnIndex--; // Adjust turnIndex if player was before current
    }

    io.to(roomId).emit("updatePlayers", room.players);
    io.to(roomId).emit("updateHistory", room.history);

    checkGameOver(roomId);
    startPlayerTurn(roomId);
  }
}

function checkGameOver(roomId) {
  const room = rooms[roomId];
  if (!room) return;

  // Check if all players have used their turns for the current round
  const allTurnsExhausted = room.players.every(p => p.turnsRemaining <= 0);
  if (allTurnsExhausted) {
    if (room.currentRound < room.totalRounds) {
      // Move to next round
      room.currentRound++;
      room.players.forEach(p => p.turnsRemaining = room.totalRounds * 5); // Reset turns for next round
      room.history = []; // Clear history for new round
      room.lastLetter = null;
      io.to(roomId).emit("message", `Round ${room.currentRound} of ${room.totalRounds} started!`);
      startPlayerTurn(roomId);
    } else {
      // Game over after all rounds
      const winner = room.players.reduce((max, player) => max.points > player.points ? max : player, { points: -Infinity });
      io.to(roomId).emit("gameOver", { name: winner.name, points: winner.points });
      if (room.turnTimeouts[roomId]) clearTimeout(room.turnTimeouts[roomId]);
      delete room.turnTimeouts[roomId];
    }
    return;
  }

  if (room.players.length === 1) {
    const winner = room.players[0];
    io.to(roomId).emit("gameOver", { name: winner.name, points: winner.points });
  } else if (room.players.length === 0) {
    io.to(roomId).emit("gameOver", { name: "No one", points: 0 });
    if (room.turnTimeouts[roomId]) clearTimeout(room.turnTimeouts[roomId]);
    delete rooms[roomId];
  }
}

io.on("connection", (socket) => {
  socket.on("createRoom", ({ playerName, rounds }) => {
    const roomId = generateRoomId();
    const leaderPlayer = { name: playerName, points: 0, isLeader: true, socketId: socket.id, turnsRemaining: rounds * 5 };
    rooms[roomId] = {
      players: [leaderPlayer],
      originalPlayers: [JSON.parse(JSON.stringify(leaderPlayer))], // Deep copy
      history: [],
      turnIndex: 0,
      lastLetter: null,
      turnTimeouts: {},
      totalRounds: rounds,
      currentRound: 1
    };
    socket.join(roomId);
    socket.emit("roomCreated", { id: roomId, rounds }); // Send rounds back to client
    socket.emit("initState", {
      history: rooms[roomId].history,
      players: rooms[roomId].players,
      turnIndex: rooms[roomId].turnIndex,
      lastLetter: rooms[roomId].lastLetter,
      started: false
    }); // Initialize leader's state
  });

  socket.on("joinRoom", ({ playerName, roomId }) => {
    if (!rooms[roomId]) {
      socket.emit("message", "Room does not exist!");
      return;
    }
    if (rooms[roomId].players.some(p => p.name === playerName)) {
      socket.emit("message", "Name already taken in this room!");
      return;
    }
    const newPlayer = { name: playerName, points: 0, isLeader: false, socketId: socket.id, turnsRemaining: rooms[roomId].totalRounds * 5 };
    rooms[roomId].players.push(newPlayer);
    rooms[roomId].originalPlayers.push(JSON.parse(JSON.stringify(newPlayer))); // Deep copy to original
    socket.join(roomId);
    io.to(roomId).emit("updatePlayers", rooms[roomId].players);
    socket.emit("initState", {
      history: rooms[roomId].history,
      players: rooms[roomId].players,
      turnIndex: rooms[roomId].turnIndex,
      lastLetter: rooms[roomId].lastLetter,
      started: false
    });
  });

  socket.on("startGame", (roomId) => {
    const room = rooms[roomId];
    if (!room || !room.players.some(p => p.isLeader && p.socketId === socket.id)) return;

    room.players.forEach(p => p.turnsRemaining = room.totalRounds * 5); // Initialize turns
    io.to(roomId).emit("gameStarted");
    startPlayerTurn(roomId);
  });

  socket.on("submitCountry", ({ roomId, name, place }) => {
    const room = rooms[roomId];
    if (!room) return;

    const lowerPlace = place.toLowerCase();

    // ✅ Check duplicate
    const alreadyUsed = room.history.some(entry => {
      const usedWord = entry.split(": ")[1].toLowerCase();
      return usedWord === lowerPlace;
    });
    if (alreadyUsed) {
      socket.emit("message", `${place} is already used! Try another word.`);
      socket.emit("yourTurn", { lastLetter: room.lastLetter });
      return;
    }

    // ✅ Check last letter
    if (room.lastLetter && lowerPlace[0] !== room.lastLetter) {
      socket.emit("message", `Must start with "${room.lastLetter.toUpperCase()}"!`);
      socket.emit("yourTurn", { lastLetter: room.lastLetter });
      return;
    }

    // Calculate points based on time remaining
    const timeTaken = (Date.now() - room.turnStartTime) / 1000;
    const timeRemaining = Math.max(0, 20 - timeTaken);
    let pointsEarned;
    if (timeRemaining >= 15) {
      pointsEarned = 200 - (20 - timeRemaining) * 5;
    } else if (timeRemaining >= 14) {
      pointsEarned = 150 - (15 - timeRemaining) * 10;
    } else {
      pointsEarned = Math.max(0, 140 - (14 - timeRemaining) * 10);
    }
    pointsEarned = Math.floor(pointsEarned);
    console.log(`Calculated points for ${name}: ${pointsEarned}, timeRemaining: ${timeRemaining}, timeTaken: ${timeTaken}`); // Debug log

    const player = room.players.find(p => p.name === name);
    if (player) {
      player.points += pointsEarned; // Add points earned
      player.turnsRemaining--;
      console.log(`Updated points for ${name} to ${player.points}`); // Debug log
    }

    // Proceed
    if (room.turnTimeouts[roomId]) clearTimeout(room.turnTimeouts[roomId]);

    room.history.push(`${name}: ${place}`);
    room.lastLetter = lowerPlace[lowerPlace.length - 1];

    room.turnIndex = (room.turnIndex + 1) % room.players.length;
    io.to(roomId).emit("updateHistory", room.history);
    io.to(roomId).emit("updatePlayers", room.players);

    checkGameOver(roomId);
    startPlayerTurn(roomId);
  });

  socket.on("giveUp", ({ roomId, name }) => {
    giveUpTurn(roomId, name);
  });

  socket.on("leaveRoom", (roomId) => {
    if (!rooms[roomId]) return;
    const playerIndex = rooms[roomId].players.findIndex(p => p.socketId === socket.id);
    if (playerIndex !== -1) {
      rooms[roomId].players.splice(playerIndex, 1);
      io.to(roomId).emit("updatePlayers", rooms[roomId].players);
      socket.leave(roomId);
      if (room.players.length === 0) {
        if (rooms[roomId].turnTimeouts[roomId]) clearTimeout(rooms[roomId].turnTimeouts[roomId]);
        delete rooms[roomId];
      } else {
        checkGameOver(roomId);
      }
    }
  });

  socket.on("playAgain", (roomId) => {
    const room = rooms[roomId];
    if (!room || !room.players.some(p => p.isLeader && p.socketId === socket.id)) return;

    // Restore original players
    room.players = JSON.parse(JSON.stringify(room.originalPlayers)); // Deep copy

    room.players.forEach(p => {
      p.points = 0;
      p.turnsRemaining = room.totalRounds * 5;
    });
    room.history = [];
    room.turnIndex = 0;
    room.lastLetter = null;
    room.currentRound = 1;
    io.to(roomId).emit("resetGame");
    io.to(roomId).emit("updatePlayers", room.players);
    io.to(roomId).emit("updateHistory", room.history);
  });
});

const PORT = process.env.PORT || 3000;
server.listen(PORT, () => console.log(`Server running on port ${PORT}`));