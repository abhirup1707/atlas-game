const express = require("express");
const http = require("http");
const { Server } = require("socket.io");
const path = require("path");

const app = express();
const server = http.createServer(app);
const io = new Server(server);

app.use(express.static(path.join(__dirname, "public")));

const rooms = {};        // roomId -> room data
const turnTimeouts = {}; // roomId -> timeout id

io.on("connection", (socket) => {
  console.log("Player connected:", socket.id);

  // --- CREATE ROOM ---
  socket.on("createRoom", (name) => {
    const roomId = Math.random().toString(36).substring(2, 8);
    rooms[roomId] = {
      players: [{ id: socket.id, name, isLeader: true, points: 0 }], // add points
      history: [],
      turnIndex: 0,
      lastLetter: null,
      started: false,
      leaderId: socket.id,
      used: new Set(),
    };
    socket.join(roomId);
    io.to(roomId).emit("roomCreated", roomId);
    io.to(roomId).emit("updatePlayers", rooms[roomId].players);
  });

  // --- JOIN ROOM ---
  socket.on("joinRoom", ({ roomId, playerName }) => {
    const room = rooms[roomId];
    if (!room) {
      socket.emit("errorMessage", "Room does not exist");
      return;
    }

    const newPlayer = { id: socket.id, name: playerName, active: true, isLeader: false, points: 0 }; // add points
    room.players.push(newPlayer);
    socket.join(roomId);

    // Send full game state to the new player
    socket.emit("initState", {
      history: room.history,
      players: room.players,
      turnIndex: room.turnIndex,
      lastLetter: room.lastLetter,
      started: room.started
    });

    io.to(roomId).emit("updatePlayers", room.players);
  });

  // --- START GAME ---
  socket.on("startGame", (roomId) => {
    const room = rooms[roomId];
    if (!room || room.started) return;

    room.started = true;
    room.turnIndex = 0;
    room.lastLetter = null;
    room.used = new Set();
    room.players.forEach(p => p.points = 0); // reset points

    io.to(roomId).emit("gameStarted");
    io.to(roomId).emit("updatePlayers", room.players); // emit updated players
    startPlayerTurn(roomId);
  });

  // --- SUBMIT COUNTRY ---
// ... (previous code unchanged until submitCountry)

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
  const timeRemaining = Math.max(0, 20 - timeTaken); // 20s turn limit
  let pointsEarned;
  if (timeRemaining >= 15) {
    pointsEarned = 200 - (20 - timeRemaining) * 5; // Linear decrease from 200 at 20s
  } else if (timeRemaining >= 14) {
    pointsEarned = 150 - (15 - timeRemaining) * 10; // Drop to 140 at 14s
  } else {
    pointsEarned = Math.max(0, 140 - (14 - timeRemaining) * 10); // Further decrease
  }
  pointsEarned = Math.floor(pointsEarned); // Ensure integer points

  const player = room.players.find(p => p.name === name);
  if (player) {
    player.points += pointsEarned > 0 ? pointsEarned : 0; // Only add positive points
  }

  // Proceed
  if (turnTimeouts[roomId]) clearTimeout(turnTimeouts[roomId]);

  room.history.push(`${name}: ${place}`);
  room.lastLetter = lowerPlace[lowerPlace.length - 1];

  room.turnIndex = (room.turnIndex + 1) % room.players.length;
  io.to(roomId).emit("updateHistory", room.history);
  io.to(roomId).emit("updatePlayers", room.players);

  checkGameOver(roomId);
  startPlayerTurn(roomId);
});

// ... (rest of the code unchanged)

  // --- GIVE UP ---
  socket.on("giveUp", ({ roomId, name }) => {
    const room = rooms[roomId];
    if (!room) return;

    room.players = room.players.filter(p => p.name !== name);
    io.to(roomId).emit("updatePlayers", room.players);

    checkGameOver(roomId);
  });

  // --- LEAVE ROOM ---
  socket.on("leaveRoom", (roomId) => {
    const room = rooms[roomId];
    if (!room) return;

    room.players = room.players.filter(p => p.id !== socket.id);
    io.to(roomId).emit("updatePlayers", room.players);

    checkGameOver(roomId);
  });

  // --- PLAY AGAIN ---
  socket.on("playAgain", (roomId) => {
    const room = rooms[roomId];
    if (!room) return;

    const leader = room.players.find(p => p.id === room.leaderId);
    room.players = leader ? [leader] : [];
    room.players.forEach(p => p.points = 0); // reset points

    room.history = [];
    room.turnIndex = 0;
    room.lastLetter = null;
    room.started = false;
    room.used = new Set();
    io.to(roomId).emit("resetGame");
    io.to(roomId).emit("updatePlayers", room.players);
  });

  // --- DISCONNECT ---
  socket.on("disconnect", () => {
    for (const roomId in rooms) {
      const room = rooms[roomId];
      const idx = room.players.findIndex(p => p.id === socket.id);
      if (idx !== -1) {
        room.players.splice(idx, 1);
        io.to(roomId).emit("updatePlayers", room.players);
        checkGameOver(roomId);
      }
    }
  });

  // --- HELPERS ---
  function startPlayerTurn(roomId) {
    const room = rooms[roomId];
    if (!room || room.players.length === 0) return;

    room.turnStartTime = Date.now(); // start time for turn

    const currentPlayer = room.players[room.turnIndex];

    // Tell everyone whose turn it is and the required starting letter
    room.players.forEach(p => {
      if (p.id === currentPlayer.id) {
        io.to(p.id).emit("yourTurn", room.lastLetter);
      } else {
        io.to(p.id).emit("notYourTurn", {
          playerName: currentPlayer.name,
          lastLetter: room.lastLetter
        });
      }
    });

    // Reset old timeout
    if (turnTimeouts[roomId]) clearTimeout(turnTimeouts[roomId]);

    // Start countdown (20s)
    turnTimeouts[roomId] = setTimeout(() => {
      io.to(roomId).emit("message", `${currentPlayer.name} ran out of time and is disqualified!`);

      // Remove the player
      room.players = room.players.filter(p => p.id !== currentPlayer.id);
      io.to(roomId).emit("updatePlayers", room.players);

      checkGameOver(roomId);

      if (room.players.length > 1) {
        if (room.turnIndex >= room.players.length) room.turnIndex = 0;
        startPlayerTurn(roomId);
      }
    }, 20000);
  }

// ... (previous code unchanged until checkGameOver)

function checkGameOver(roomId) {
  const room = rooms[roomId];
  if (!room) return;

  if (room.players.length === 1) {
    const winner = room.players[0];
    io.to(roomId).emit("gameOver", { name: winner.name, points: winner.points });
  } else if (room.players.length === 0) {
    io.to(roomId).emit("gameOver", { name: "No one", points: 0 });
    if (turnTimeouts[roomId]) clearTimeout(turnTimeouts[roomId]);
    delete rooms[roomId];
  }
}

// ... (rest of the code unchanged)
});

// --- SERVER ---
const PORT = process.env.PORT || 3000;
if (!PORT) {
  console.error("❌ PORT not defined! Railway provides process.env.PORT");
  process.exit(1);
}

server.listen(PORT, () => {
  console.log(`✅ Server running on port ${PORT}`);
});