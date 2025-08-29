const socket = io();

let roomId = null;
let playerName = null;
let yourTurn = false;
let isLeader = false;

const validPlaces = [
  // Countries
  "Afghanistan","Albania","Algeria","Andorra","Angola","Antigua and Barbuda","Argentina","Armenia","Australia","Austria","Azerbaijan",
  "Bahamas","Bahrain","Bangladesh","Barbados","Belarus","Belgium","Belize","Benin","Bhutan","Bolivia","Bosnia and Herzegovina","Botswana","Brazil","Brunei","Bulgaria","Burkina Faso","Burundi",
  "Cabo Verde","Cambodia","Cameroon","Canada","Central African Republic","Chad","Chile","China","Colombia","Comoros","Congo","Costa Rica","Croatia","Cuba","Cyprus","Czech Republic",
  "Denmark","Djibouti","Dominica","Dominican Republic",
  "Ecuador","Egypt","El Salvador","Equatorial Guinea","Eritrea","Estonia","Eswatini","Ethiopia",
  "Fiji","Finland","France",
  "Gabon","Gambia","Georgia","Germany","Ghana","Greece","Grenada","Guatemala","Guinea","Guinea-Bissau","Guyana",
  "Haiti","Honduras","Hungary",
  "Iceland","India","Indonesia","Iran","Iraq","Ireland","Israel","Italy",
  "Jamaica","Japan","Jordan",
  "Kazakhstan","Kenya","Kiribati","Kuwait","Kyrgyzstan",
  "Laos","Latvia","Lebanon","Lesotho","Liberia","Libya","Liechtenstein","Lithuania","Luxembourg",
  "Madagascar","Malawi","Malaysia","Maldives","Mali","Malta","Marshall Islands","Mauritania","Mauritius","Mexico","Micronesia","Moldova","Monaco","Mongolia","Montenegro","Morocco","Mozambique","Myanmar",
  "Namibia","Nauru","Nepal","Netherlands","New Zealand","Nicaragua","Niger","Nigeria","North Korea","North Macedonia","Norway",
  "Oman",
  "Pakistan","Palau","Palestine","Panama","Papua New Guinea","Paraguay","Peru","Philippines","Poland","Portugal",
  "Qatar",
  "Romania","Russia","Rwanda",
  "Saint Kitts and Nevis","Saint Lucia","Saint Vincent and the Grenadines","Samoa","San Marino","Sao Tome and Principe","Saudi Arabia","Senegal","Serbia","Seychelles","Sierra Leone","Singapore","Slovakia","Slovenia","Solomon Islands","Somalia","South Africa","South Korea","South Sudan","Spain","Sri Lanka","Sudan","Suriname","Sweden","Switzerland","Syria",
  "Taiwan","Tajikistan","Tanzania","Thailand","Timor-Leste","Togo","Tonga","Trinidad and Tobago","Tunisia","Turkey","Turkmenistan","Tuvalu",
  "Uganda","Ukraine","United Arab Emirates","United Kingdom","United States","Uruguay","Uzbekistan",
  "Vanuatu","Vatican City","Venezuela","Vietnam",
  "Yemen",
  "Zambia","Zimbabwe",

  // Cities
  "New York","London","Paris","Tokyo","Berlin","Madrid","Rome","Beijing","Moscow","Sydney","Los Angeles","Toronto","Delhi","Mumbai","Shanghai","Istanbul","Dubai","Seoul","Bangkok","Singapore","Hong Kong","Barcelona","Chicago","San Francisco","Lisbon","Vienna","Prague","Budapest","Dublin","Amsterdam","Brussels","Copenhagen","Stockholm","Helsinki","Warsaw","Athens","Jakarta","Kuala Lumpur","Manila","Buenos Aires","Rio de Janeiro","Sao Paulo","Cape Town","Lagos","Cairo","Nairobi","Lima","Mexico City","Santiago","Tehran","Baghdad","Riyadh","Karachi","Lahore","Kathmandu","Hanoi","Ho Chi Minh City",

  // Oceans
  "Pacific Ocean","Atlantic Ocean","Indian Ocean","Southern Ocean","Arctic Ocean",

  // Seas
  "Mediterranean Sea","Caribbean Sea","Baltic Sea","Black Sea","Red Sea","North Sea","Caspian Sea","South China Sea","Coral Sea","Arabian Sea","Bering Sea","Okhotsk Sea","Philippine Sea","Japan Sea","Tasman Sea","Adriatic Sea","Aegean Sea",

  // Islands
  "Greenland","Madagascar","Borneo","Sumatra","Sicily","Honshu","Great Britain","Iceland","Sri Lanka","Hawaii","Fiji","Maldives","Bali","Tasmania","New Guinea","Sardinia","Corsica","Puerto Rico","Jamaica","Cuba"
];


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

  // Switch to game view
  document.getElementById("lobby").style.display = "none";
  document.getElementById("game").style.display = "block";
  document.getElementById("roomTitle").innerText = "Room: " + roomId;

  // Hide Start Game button for non-leader
  document.getElementById("startGameBtn").style.display = "none";
}


function startGame() {
  if (!isLeader || !roomId) return;
  socket.emit("startGame", roomId);
  document.getElementById("startGameBtn").style.display = "none";
}

function submitCountry() {
    if (!yourTurn) return;
    const input = document.getElementById("countryInput").value.trim();
    if (!input) return;

    // Get lastLetter from the turnInfo div
    const lastLetter = document.getElementById("turnInfo").dataset.lastLetter;

    // Check if the input starts with the required letter
    if (lastLetter && input[0].toLowerCase() !== lastLetter) {
        document.getElementById("message").innerText = `Must start with "${lastLetter.toUpperCase()}"!`;
        return;
    }

    // Check valid place
    if (!validPlaces.map(p => p.toLowerCase()).includes(input.toLowerCase())) {
        document.getElementById("message").innerText = "Invalid place!";
        return;
    }

    document.getElementById("countryInput").value = "";
    document.getElementById("message").innerText = "";

    socket.emit("submitCountry", { roomId, name: playerName, place: input });
    yourTurn = false;
}





function giveUp() {
  socket.emit("giveUp", { roomId, name: playerName });
}

function leaveRoom() {
  if (!roomId) return;
  socket.emit("leaveRoom", roomId);
  resetUI();
}

function resetUI() {
  roomId = null;
  yourTurn = false;
  isLeader = false;
  document.getElementById("game").style.display = "none";
  document.getElementById("lobby").style.display = "block";
  document.getElementById("history").innerHTML = "";
  document.getElementById("playersList").innerHTML = "";
  document.getElementById("message").innerText = "";
  document.getElementById("turnInfo").innerText = "";
  document.getElementById("countryInput").style.display = "none";
  document.querySelector(".buttons").style.display = "none";
  document.getElementById("startGameBtn").style.display = "none";
  document.getElementById("playerName").value = "";
  document.getElementById("roomIdInput").value = "";
  document.getElementById("winnerModal").style.display = "none";
}

// Socket events
socket.on("roomCreated", (id) => {
  roomId = id;
  isLeader = true;
  document.getElementById("lobby").style.display = "none";
  document.getElementById("game").style.display = "block";
  document.getElementById("roomTitle").innerText = "Room: " + id;
  document.getElementById("startGameBtn").style.display = "inline-block";
});

socket.on("updatePlayers", (players) => {
  const list = document.getElementById("playersList");
  list.innerHTML = "";
  players.forEach(p => {
    const li = document.createElement("li");
    li.innerText = p.name;
    list.appendChild(li);
  });
});

socket.on("updateHistory", (history) => {
  const list = document.getElementById("history");
  list.innerHTML = "";
  history.forEach(h => {
    const li = document.createElement("li");
    li.innerText = h;
    list.appendChild(li);
  });
});

socket.on("yourTurn", (lastLetter) => {
    yourTurn = true;

    if (lastLetter) {
        document.getElementById("turnInfo").innerText = `Your turn! Start with "${lastLetter.toUpperCase()}"`;
        document.getElementById("turnInfo").dataset.lastLetter = lastLetter;
    } else {
        document.getElementById("turnInfo").innerText = "Your turn!";
        document.getElementById("turnInfo").dataset.lastLetter = ""; // empty string for first turn
    }
});



socket.on("notYourTurn", () => {
  yourTurn = false;
  document.getElementById("turnInfo").innerText = "Waiting for other players...";
});

socket.on("message", (msg) => {
  document.getElementById("message").innerText = msg;
});

socket.on("gameStarted", () => {
  document.getElementById("countryInput").style.display = "block";
  document.querySelector(".buttons").style.display = "flex";
});

socket.on("gameOver", (winner) => {
  if (!roomId) return;
  document.getElementById("winnerName").innerText = winner.name;
  document.getElementById("winnerModal").style.display = "flex";
});

socket.on("resetGame", () => {
  resetUI();
});
