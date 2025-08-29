const socket = io();

let roomId = null;
let playerName = null;
let yourTurn = false;
let isLeader = false;
let players = [];
let currentTurn = 0;
let lastLetterGlobal = null;
let gameStarted = false;
let mySocketId = null;
let countdownInterval = null;

const inputField = document.getElementById("countryInput");

// --- CREATE / JOIN ROOM ---
function createRoom() {
  playerName = document.getElementById("playerName").value.trim();
  if (!playerName) return alert("Enter your name!");
  socket.emit("createRoom", playerName);
}

function joinRoom() {
  playerName = document.getElementById("playerName").value.trim();
  roomId = document.getElementById("roomIdInput").value.trim();
  if (!playerName || !roomId) return alert("Enter name and room ID!");
  socket.emit("joinRoom", { playerName, roomId });
  showGameUI(false);
}

// --- GAME UI ---
function showGameUI(leader) {
  isLeader = leader;
  document.getElementById("lobby").style.display = "none";
  document.getElementById("game").style.display = "block";
  document.getElementById("roomTitle").innerText = "Room: " + roomId;
  document.getElementById("startGameBtn").style.display = leader ? "inline-block" : "none";
  inputField.style.display = gameStarted ? "block" : "none";
  document.querySelector(".buttons").style.display = gameStarted ? "flex" : "none";
}

// --- START / SUBMIT / GIVE UP ---
function startGame() {
  if (!isLeader || !roomId) return;
  socket.emit("startGame", roomId);
  document.getElementById("startGameBtn").style.display = "none";
}

function submitCountry() {
  if (!yourTurn) return;
  const input = inputField.value.trim();
  if (!input) return;

  const lastLetter = document.getElementById("turnInfo").dataset.lastLetter;
  if (lastLetter && input[0].toLowerCase() !== lastLetter) {
    showMessage(`Must start with "${lastLetter.toUpperCase()}"!`);
    return;
  }

  inputField.value = "";
  showMessage("");
  socket.emit("submitCountry", { roomId, name: playerName, place: input });
  yourTurn = false;

  if (countdownInterval) clearInterval(countdownInterval);
}

function giveUp() {
  if (!roomId) return;
  socket.emit("giveUp", { roomId, name: playerName });
}

function leaveRoom() {
  if (!roomId) return;
  socket.emit("leaveRoom", roomId);
  resetUI();
}

function resetUI() {
  yourTurn = false;
  gameStarted = false;
  players = [];
  currentTurn = 0;
  lastLetterGlobal = null;

  document.getElementById("game").style.display = "none";
  document.getElementById("lobby").style.display = "block";
  document.getElementById("history").innerHTML = "";
  document.getElementById("playersList").innerHTML = "";
  showMessage("");
  document.getElementById("turnInfo").innerText = "";
  inputField.style.display = "none";
  document.querySelector(".buttons").style.display = "none";
  document.getElementById("startGameBtn").style.display = "none";
  document.getElementById("winnerModal").style.display = "none";

  if (countdownInterval) clearInterval(countdownInterval);
}

// --- SOCKET EVENTS ---
socket.on("connect", () => { mySocketId = socket.id; });

socket.on("roomCreated", (id) => {
  roomId = id;
  isLeader = true;
  showGameUI(true);
});

socket.on("initState", ({ history, players: pl, turnIndex, lastLetter, started }) => {
  players = pl;
  currentTurn = turnIndex;
  lastLetterGlobal = lastLetter;
  gameStarted = started;

  updatePlayersList(players);
  updateHistory(history);
});

socket.on("updatePlayers", (pl) => { players = pl; updatePlayersList(players); });
socket.on("updateHistory", (history) => updateHistory(history));
socket.on("message", showMessage);
socket.on("gameStarted", () => { gameStarted = true; inputField.style.display = "block"; document.querySelector(".buttons").style.display = "flex"; });

socket.on("gameOver", (winner) => {
  document.getElementById("winnerName").innerText = `${winner.name} wins!`;
  document.getElementById("winnerModal").style.display = "flex";
});

socket.on("resetGame", resetUI);

socket.on("yourTurn", (lastLetter) => {
  yourTurn = true;
  lastLetterGlobal = lastLetter;
  inputField.disabled = false;
  inputField.style.display = "block";

  let timeLeft = 15;
  document.getElementById("turnInfo").innerText = lastLetter ? `Your turn! Start with "${lastLetter.toUpperCase()}" (15s)` : `Your turn! (15s)`;
  document.getElementById("turnInfo").dataset.lastLetter = lastLetter || "";

  if (countdownInterval) clearInterval(countdownInterval);
  countdownInterval = setInterval(() => {
    timeLeft--;
    document.getElementById("turnInfo").innerText = lastLetter ? `Your turn! Start with "${lastLetter.toUpperCase()}" (${timeLeft}s)` : `Your turn! (${timeLeft}s)`;
    if (timeLeft <= 0) clearInterval(countdownInterval);
  }, 1000);
});

socket.on("notYourTurn", () => {
  yourTurn = false;
  inputField.disabled = true;
  document.getElementById("turnInfo").innerText = "Waiting for other players...";
  if (countdownInterval) clearInterval(countdownInterval);
});

// --- UTILITY ---
function updatePlayersList(players) {
  const list = document.getElementById("playersList");
  list.innerHTML = "";
  players.forEach(p => { const li = document.createElement("li"); li.innerText = p.name; list.appendChild(li); });
}

function updateHistory(history) {
  const list = document.getElementById("history");
  list.innerHTML = "";
  history.forEach(h => { const li = document.createElement("li"); li.innerText = h; list.appendChild(li); });
}

function showMessage(msg) { document.getElementById("message").innerText = msg; }

// --- PLAY AGAIN BUTTON ---
function playAgain() {
  socket.emit("playAgain", roomId);
  document.getElementById("winnerModal").style.display = "none";
}
