const express = require("express");
const app = express();
const http = require("http").createServer(app);
const io = require("socket.io")(http);

app.use(express.static("public"));

const rooms = {}; // roomId -> { players: [{id,name}], history: [], turnIndex }

io.on("connection", (socket) => {
  console.log("Player connected:", socket.id);

  socket.on("createRoom", (name) => {
  const roomId = Math.random().toString(36).substring(2, 8);

  // Add lastLetter property here
  rooms[roomId] = { 
    players: [{id: socket.id, name}], 
    history: [], 
    turnIndex: 0,
    lastLetter: null // <-- this tracks the last letter of the previous submission
  };

  socket.join(roomId);
  socket.emit("roomCreated", roomId);
  io.to(roomId).emit("updatePlayers", rooms[roomId].players);
});


  socket.on("joinRoom", ({playerName, roomId}) => {
    const room = rooms[roomId];
    if (!room) return socket.emit("message", "Room not found!");
    room.players.push({id: socket.id, name: playerName});
    socket.join(roomId);
    io.to(roomId).emit("updatePlayers", room.players);
  });

  socket.on("startGame", (roomId) => {
    const room = rooms[roomId];
    if (!room) return;

    io.to(roomId).emit("gameStarted");

    // First player's turn: no last letter yet
    room.turnIndex = 0;
    io.to(room.players[0].id).emit("yourTurn",  room.lastLetter);
});


socket.on("submitCountry", ({roomId, name, place}) => {
    const room = rooms[roomId];
    if (!room) return;

    const lowerPlace = place.toLowerCase();

    // 1️⃣ Check last-letter rule if it exists
    if (room.lastLetter && lowerPlace[0] !== room.lastLetter) {
        socket.emit("message", `Must start with "${room.lastLetter.toUpperCase()}"!`);
        return;
    }

    // 2️⃣ Valid submission
    room.history.push(`${name}: ${place}`);

    // 3️⃣ Update lastLetter for the **next player**
    const newLastLetter = lowerPlace[lowerPlace.length - 1];
    room.lastLetter = newLastLetter;

    // 4️⃣ Move to next player
    room.turnIndex = (room.turnIndex + 1) % room.players.length;

    // 5️⃣ Update all clients with history
    io.to(roomId).emit("updateHistory", room.history);

    // 6️⃣ Notify next player of their turn, sending the correct lastLetter
    io.to(room.players[room.turnIndex].id).emit("yourTurn", room.lastLetter);

    // 7️⃣ Notify all others it’s not their turn
    room.players.forEach(p => {
        if (p.id !== room.players[room.turnIndex].id)
            io.to(p.id).emit("notYourTurn");
    });
});



  socket.on("giveUp", ({roomId, name}) => {
    const room = rooms[roomId];
    if (!room) return;

    room.players = room.players.filter(p => p.name !== name);
    io.to(roomId).emit("updatePlayers", room.players);

    if (room.players.length === 1) {
      const winner = room.players[0];
      io.to(roomId).emit("gameOver", { name: winner.name });
      setTimeout(() => {
        io.to(roomId).emit("resetGame");
        delete rooms[roomId];
      }, 5000);
    }
  });

  socket.on("leaveRoom", (roomId) => {
    const room = rooms[roomId];
    if (!room) return;

    room.players = room.players.filter(p => p.id !== socket.id);
    io.to(roomId).emit("updatePlayers", room.players);
    if (room.players.length === 0) delete rooms[roomId];
  });

  socket.on("disconnect", () => {
    for (const roomId in rooms) {
      const room = rooms[roomId];
      room.players = room.players.filter(p => p.id !== socket.id);
      io.to(roomId).emit("updatePlayers", room.players);
      if (room.players.length === 0) delete rooms[roomId];
    }
  });
});

http.listen(3006, () => console.log("Server running on port 3006"));
