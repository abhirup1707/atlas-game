
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
    players: [{ id: socket.id, name, isLeader: true }], // mark leader
    history: [],
    turnIndex: 0,
    lastLetter: null,
    started: false,
    leaderId: socket.id // store leader's socket id
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

  const newPlayer = { id: socket.id, name: playerName, active: true, isLeader: false };
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

    io.to(roomId).emit("gameStarted");
    startPlayerTurn(roomId);
  });

  // --- SUBMIT COUNTRY ---
  socket.on("submitCountry", ({ roomId, name, place }) => {
    const room = rooms[roomId];
    if (!room) return;

    const lowerPlace = place.toLowerCase();
    if (room.lastLetter && lowerPlace[0] !== room.lastLetter) {
      socket.emit("message", `Must start with "${room.lastLetter.toUpperCase()}"!`);
      return;
    }

    room.history.push(`${name}: ${place}`);
    room.lastLetter = lowerPlace[lowerPlace.length - 1];

    if (turnTimeouts[roomId]) clearTimeout(turnTimeouts[roomId]);

    room.turnIndex = (room.turnIndex + 1) % room.players.length;
    io.to(roomId).emit("updateHistory", room.history);

    startPlayerTurn(roomId);
  });

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
// --- PLAY AGAIN ---
// --- PLAY AGAIN ---
socket.on("playAgain", (roomId) => {
  const room = rooms[roomId];
  if (!room) return;

  const leader = room.players.find(p => p.id === room.leaderId); // find leader explicitly
  room.players = leader ? [leader] : []; // keep only leader

  room.history = [];
  room.turnIndex = 0;
  room.lastLetter = null;
  room.started = false;

  io.to(roomId).emit("resetGame"); // client resets UI
  io.to(roomId).emit("updatePlayers", room.players); // show leader in players list
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

  // Reset any old timeout
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



function checkGameOver(roomId) {
  const room = rooms[roomId];
  if (!room) return;

  if (room.players.length === 1) {
    const winner = room.players[0];
    io.to(roomId).emit("gameOver", { name: winner.name });
    // Do NOT reset yet — wait for playAgain
  } else if (room.players.length === 0) {
    io.to(roomId).emit("gameOver", { name: "No one" });
    if (turnTimeouts[roomId]) clearTimeout(turnTimeouts[roomId]);
    delete rooms[roomId];
  }
}



});

// --- SERVER ---
const PORT = process.env.PORT ;
if (!PORT) {
  console.error("❌ PORT not defined! Railway provides process.env.PORT");
  process.exit(1);
}

server.listen(PORT, () => {
  console.log(`✅ Server running on port ${PORT}`);
});
