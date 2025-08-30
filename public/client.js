const socket = io();
const validPlaces = [
  // Countries
  'Afghanistan','Albania','Algeria','Andorra','Angola','Antigua and Barbuda','Argentina','Armenia','Australia','Austria','Azerbaijan',
  'Bahamas','Bahrain','Bangladesh','Barbados','Belarus','Belgium','Belize','Benin','Bhutan','Bolivia','Bosnia and Herzegovina','Botswana','Brazil','Brunei','Bulgaria','Burkina Faso','Burundi',
  'Cabo Verde','Cambodia','Cameroon','Canada','Central African Republic','Chad','Chile','China','Colombia','Comoros','Congo','Costa Rica','Croatia','Cuba','Cyprus','Czech Republic',
  'Denmark','Djibouti','Dominica','Dominican Republic',
  'Ecuador','Egypt','El Salvador','Equatorial Guinea','Eritrea','Estonia','Eswatini','Ethiopia',
  'Fiji','Finland','France',
  'Gabon','Gambia','Georgia','Germany','Ghana','Greece','Grenada','Guatemala','Guinea','Guinea-Bissau','Guyana',
  'Haiti','Honduras','Hungary',
  'Iceland','India','Indonesia','Iran','Iraq','Ireland','Israel','Italy',
  'Jamaica','Japan','Jordan',
  'Kazakhstan','Kenya','Kiribati','Kuwait','Kyrgyzstan',
  'Laos','Latvia','Lebanon','Lesotho','Liberia','Libya','Liechtenstein','Lithuania','Luxembourg',
  'Madagascar','Malawi','Malaysia','Maldives','Mali','Malta','Marshall Islands','Mauritania','Mauritius','Mexico','Micronesia','Moldova','Monaco','Mongolia','Montenegro','Morocco','Mozambique','Myanmar',
  'Namibia','Nauru','Nepal','Netherlands','New Zealand','Nicaragua','Niger','Nigeria','North Korea','North Macedonia','Norway',
  'Oman','Pakistan','Palau','Palestine','Panama','Papua New Guinea','Paraguay','Peru','Philippines','Poland','Portugal',
  'Qatar','Romania','Russia','Rwanda',
  'Saint Kitts and Nevis','Saint Lucia','Saint Vincent and the Grenadines','Samoa','San Marino','Sao Tome and Principe','Saudi Arabia','Senegal','Serbia','Seychelles','Sierra Leone','Singapore','Slovakia','Slovenia','Solomon Islands','Somalia','South Africa','South Korea','South Sudan','Spain','Sri Lanka','Sudan','Suriname','Sweden','Switzerland','Syria',
  'Taiwan','Tajikistan','Tanzania','Thailand','Timor-Leste','Togo','Tonga','Trinidad and Tobago','Tunisia','Turkey','Turkmenistan','Tuvalu',
  'Uganda','Ukraine','United Arab Emirates','United Kingdom','United States','Uruguay','Uzbekistan','Vanuatu','Vatican City','Venezuela','Vietnam',
  'Yemen','Zambia','Zimbabwe',

  // Cities (expanded)
  'New York','London','Paris','Tokyo','Berlin','Madrid','Rome','Beijing','Moscow','Sydney','Los Angeles','Toronto','Delhi','Mumbai','Shanghai','Istanbul','Dubai','Seoul','Bangkok','Singapore','Hong Kong','Barcelona','Chicago','San Francisco','Lisbon','Vienna','Prague','Budapest','Dublin','Amsterdam','Brussels','Copenhagen','Stockholm','Helsinki','Warsaw','Athens','Jakarta','Kuala Lumpur','Manila','Buenos Aires','Rio de Janeiro','Sao Paulo','Cape Town','Lagos','Cairo','Nairobi','Lima','Mexico City','Santiago','Tehran','Baghdad','Riyadh','Karachi','Lahore','Kathmandu','Hanoi','Ho Chi Minh City','Melbourne','Osaka','Auckland','Vancouver','Zurich','Geneva','Adelaide','Brisbane','Perth','Canberra','Gold Coast','Beirut','Kiev','Helsinki','Oslo','Stockholm','Helsinki','Havana','Casablanca','Accra','Addis Ababa','Montevideo','Porto','Edinburgh','Glasgow','Munich','Frankfurt','Naples','Venice','Florence','Hamburg','Barcelona','Seville','Valencia','Lisbon','Porto','Madrid','Malaga','Seoul','Busan','Kyoto','Nagoya','Sapporo','Fukuoka','Hiroshima',

  // Oceans
  'Pacific Ocean','Atlantic Ocean','Indian Ocean','Southern Ocean','Arctic Ocean',

  // Seas
  'Mediterranean Sea','Caribbean Sea','Baltic Sea','Black Sea','Red Sea','North Sea','Caspian Sea','South China Sea','Coral Sea','Arabian Sea','Bering Sea','Okhotsk Sea','Philippine Sea','Japan Sea','Tasman Sea','Adriatic Sea','Aegean Sea',

  // Islands
  'Greenland','Madagascar','Borneo','Sumatra','Sicily','Honshu','Great Britain','Iceland','Sri Lanka','Hawaii','Fiji','Maldives','Bali','Tasmania','New Guinea','Sardinia','Corsica','Puerto Rico','Jamaica','Cuba'
];

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

  if (!validPlaces.map(p => p.toLowerCase()).includes(input.toLowerCase())) {
    showMessage("Invalid place!");
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

function resetUI(preGame = false) {
  yourTurn = false;
  gameStarted = false;
  players = [];
  currentTurn = 0;
  lastLetterGlobal = null;

  document.getElementById("game").style.display = preGame ? "block" : "none";
  document.getElementById("lobby").style.display = preGame ? "block" : "block";
  document.getElementById("history").innerHTML = "";
  document.getElementById("playersList").innerHTML = "";
  showMessage("");
  document.getElementById("turnInfo").innerText = "";
  inputField.style.display = "none";
  inputField.disabled = false;
  document.querySelector(".buttons").style.display = "none";
  document.getElementById("startGameBtn").style.display = isLeader ? "inline-block" : "none";
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

socket.on("gameStarted", () => {
  gameStarted = true;
  inputField.style.display = "block";
  document.querySelector(".buttons").style.display = "flex";
  document.getElementById("startGameBtn").style.display = "none";
});

socket.on("gameOver", (winner) => {
  document.getElementById("winnerName").innerText = winner.name === "No one" ? "No one wins!" : `${winner.name} wins!`;
  document.getElementById("winnerModal").style.display = "flex";

  if (countdownInterval) clearInterval(countdownInterval);
});

socket.on("resetGame", () => {
  // Reset UI and return to pre-game lobby
  resetUI(true);
});

socket.on("yourTurn", (lastLetter) => {
  yourTurn = true;
  lastLetterGlobal = lastLetter;
  inputField.disabled = false;
  inputField.style.display = "block";

  let timeLeft = 15;
  document.getElementById("turnInfo").innerText = lastLetter ? `Your turn! Start with "${lastLetter.toUpperCase()}" (${timeLeft}s)` : `Your turn! (${timeLeft}s)`;
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
  players.forEach(p => {
    const li = document.createElement("li");
    li.innerText = p.name;
    list.appendChild(li);
  });
}

function updateHistory(history) {
  const list = document.getElementById("history");
  list.innerHTML = "";
  history.forEach(h => {
    const li = document.createElement("li");
    li.innerText = h;
    list.appendChild(li);
  });
}

function showMessage(msg) { document.getElementById("message").innerText = msg; }

// --- PLAY AGAIN BUTTON ---
function playAgain() {
  socket.emit("playAgain", roomId);
  // Reset UI to pre-game state
  resetUI(true);
}
