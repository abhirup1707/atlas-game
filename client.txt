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
  
  'Paris', 'Madrid', 'Tokyo', 'Rome', 'Milan', 'New York City', 'Amsterdam', 'Sydney', 'Singapore', 'Barcelona', 'Taipei', 'Seoul', 'London', 'Dubai', 'Berlin', 'Osaka', 'Bangkok', 'Los Angeles', 'Istanbul', 'Melbourne', 'Hong Kong', 'Munich', 'Las Vegas', 'Florence', 'Prague', 'Dublin', 'Kyoto', 'Vienna', 'Lisbon', 'Venice', 'Kuala Lumpur', 'Athens', 'Orlando', 'Toronto', 'Miami', 'San Francisco', 'Shanghai', 'Frankfurt am Main', 'Copenhagen', 'Zurich', 'Washington', 'Vancouver', 'Stockholm', 'Mexico City', 'Oslo', 'São Paulo', 'Helsinki', 'Brussels', 'Budapest', 'Guangzhou', 'Nice', 'Montreal', 'Cancún', 'Bologna', 'Rhodes', 'Verona', 'Porto', 'Ho Chi Minh City', 'Buenos Aires', 'Rio de Janeiro', 'Kraków', 'Hanoi', 'Tel Aviv', 'Lima', 'Riyadh', 'Tallinn', 'Marrakech', 'Santiago', 'Vilnius', 'Shanghai', 'Dhaka', 'Cairo', 'Beijing', 'Chongqing', 'Karachi', 'Kinshasa', 'Lagos', 'Manila', 'Tianjin', 'Lahore', 'Shenzhen', 'Moscow', 'Bogota', 'Jakarta', 'Luanda', 'Tehran', 'Nanjing', 'Chengdu', 'Toronto', 'Vancouver', 'Mexico City', 'São Paulo', 'Buenos Aires', 'Rio de Janeiro', 'Bangkok', 'Ho Chi Minh City', 'Shanghai', 'Hong Kong', 'Tokyo', 'Osaka', 'London', 'Paris', 'Beijing', 'Cairo', 'Lagos', 'Kinshasa', 'Guangzhou', 'Buenos Aires', 'Moscow', 'Istanbul', 'Dhaka', 'Karachi', 'Bogota', 'Jakarta', 'Lima', 'Tehran', 'Riyadh', 'Hanoi', 'Kuala Lumpur', 'Bangkok', 'Marrakech', 'Santiago', 'Tel Aviv', 'Lima', 'Riyadh', 'Athens', 'Moscow', 'Dubai',
'California', 'Texas', 'New York', 'Florida', 'Illinois', 'Pennsylvania', 'Ohio', 'Georgia', 'Michigan', 'North Carolina', 'Ontario', 'Quebec', 'British Columbia', 'Bavaria', 'Berlin', 'Hamburg', 'Saxony', 'North Rhine-Westphalia', 'Île-de-France', 'Provence-Alpes-Côte d’Azur', 'Normandy', 'New South Wales', 'Victoria', 'Queensland', 'Guangdong', 'Sichuan', 'Zhejiang', 'São Paulo (state)', 'Rio de Janeiro (state)', 'Jalisco', 'Nuevo León', 'Moscow Oblast', 'Saint Petersburg', 'Tokyo Prefecture', 'Osaka Prefecture', 'Gauteng', 'Western Cape', 'Buenos Aires Province', 'Catalonia', 'Andalusia', 'Hong Kong (SAR)', 'Macau (SAR)', 'Azores', 'Greenland', 
 
  // Continents
  'Africa','Antarctica','Asia','Europe','North America','Oceania','South America',

  // Oceans
  'Pacific Ocean','Atlantic Ocean','Indian Ocean','Southern Ocean','Arctic Ocean',

  // Indian States and Territories
  'Andhra Pradesh', 'Arunachal Pradesh', 'Assam', 'Bihar', 'Chhattisgarh', 'Goa', 'Gujarat', 'Haryana', 'Himachal Pradesh', 'Jharkhand', 'Karnataka', 'Kerala', 'Madhya Pradesh', 'Maharashtra', 'Manipur', 'Meghalaya', 'Mizoram', 'Nagaland', 'Odisha', 'Punjab', 'Rajasthan', 'Sikkim', 'Tamil Nadu', 'Telangana', 'Tripura', 'Uttar Pradesh', 'Uttarakhand', 'West Bengal', 
  'Andaman and Nicobar Islands', 'Chandigarh', 'Dadra and Nagar Haveli and Daman and Diu', 'Delhi (National Capital Territory)', 'Jammu and Kashmir', 'Ladakh', 'Lakshadweep', 'Puducherry',

  // Indian Rivers
  'Ganges','Yamuna','Brahmaputra','Indus','Godavari','Krishna','Narmada','Tapi','Mahanadi','Cauvery','Sutlej','Beas','Chenab','Ravi','Ghaghara','Kosi','Son',

  //Indian Mountains
  'Himalayas','Vindhya','Aravalli','Satpura','Nilgiri','Annamalai','Cardamom','Dhauladhar','Pir Panjal','Zanskar',

  //Indian Lakes
  'Dal Lake','Wular Lake','Chilika Lake','Sambhar Lake','Vembanad Lake','Loktak Lake','Pangong Lake','Tso Moriri','Nainital Lake','Pushkar Lake',
  'Sardar Sarovar','Hussain Sagar','Bhimtal Lake','Ranganathittu',
  'Kolleru Lake','Manasbal Lake','Kailash Lake','Renuka Lake','Gobind Sagar','Anchar Lake','Nalsarovar','Sambhar Salt Lake',
  'Banasura Sagar Dam','Srisailam Dam','Tehri Dam','Idukki Dam','Nagarjuna Sagar Dam','Bhakra Nangal Dam','Hirakud Dam','Tungabhadra Dam',
  'Mettur Dam','Rihand Dam','Indira Sagar Dam','Koyna Dam','Sardar Sarovar Dam',
  'Upper Bhavani Dam','Kundah Dam','Pong Dam','Chamera Dam','Dindi Dam',
  'Mullaperiyar Dam','Srisailam Dam','Nagarjuna Sagar Dam','Hirakud Dam','Tehri Dam',
  'Bhakra Nangal Dam','Koyna Dam','Indira Sagar Dam','Sardar Sarovar Dam',
  'Tungabhadra Dam','Pong Dam','Chamera Dam','Dindi Dam','Upper Bhavani Dam',
  'Kundah Dam','Mullaperiyar Dam',

  //Indian Deserts
  'Thar Desert','Rann of Kutch','Chambal Valley','Aravalli Range Desert','Kutch Desert','Luni Desert',
  'Great Rann of Kutch','Little Rann of Kutch','Marusthali Desert','Banni Grasslands','Dholavira Desert',
  'Pokhran Desert','Kharan Desert','Cholistan Desert','Tharparkar Desert',
  'Kachchh Desert','Barmer Desert','Jaisalmer Desert','Jodhpur Desert','Bikaner Desert',
  'Jungle Broom Desert','Ladakh Desert','Spiti Desert','Cold Desert of Himachal Pradesh',

  //Indian Cities and Towns
  'Port Blair', 'Adoni', 'Amaravati', 'Anantapur', 'Chandragiri', 'Chittoor', 'Dowlaiswaram', 'Eluru', 'Guntur', 'Kadapa', 'Kakinada', 'Kurnool', 
  'Machilipatnam', 'Nagarjunakoṇḍa', 'Rajahmundry', 'Srikakulam', 'Tirupati', 'Vijayawada', 'Visakhapatnam', 'Vizianagaram', 'Yemmiganur', 'Itanagar', 'Dhuburi', 'Dibrugarh', 'Dispur', 'Guwahati', 'Jorhat', 'Nagaon', 'Sivasagar', 'Silchar', 'Tezpur', 'Tinsukia', 'Ara', 'Barauni', 'Begusarai', 'Bettiah', 'Bhagalpur', 'Bihar Sharif', 'Bodh Gaya', 'Buxar', 'Chapra', 'Darbhanga', 'Dehri', 'Dinapur Nizamat', 'Gaya', 'Hajipur', 'Jamalpur', 'Katihar', 'Madhubani', 'Motihari', 'Munger', 'Muzaffarpur', 'Patna', 'Purnia', 'Pusa', 'Saharsa', 'Samastipur', 'Sasaram', 'Sitamarhi', 'Siwan', 'Chandigarh', 'Ambikapur', 'Bhilai', 'Bilaspur', 'Dhamtari', 'Durg', 'Jagdalpur', 'Raipur', 'Rajnandgaon', 'Daman', 'Diu', 'Silvassa', 'Delhi', 'New Delhi', 'Madgaon', 'Panaji', 'Ahmadabad', 'Amreli', 'Bharuch', 'Bhavnagar', 'Bhuj', 'Dwarka', 'Gandhinagar', 'Godhra', 'Jamnagar', 'Junagadh', 'Kandla', 'Khambhat', 'Kheda', 'Mahesana', 'Morbi', 'Nadiad', 'Navsari', 'Okha', 'Palanpur', 'Patan', 'Porbandar', 'Rajkot', 
  'Surat', 'Surendranagar', 'Valsad', 'Veraval', 'Ambala', 'Bhiwani', 'Faridabad', 'Firozpur Jhirka', 'Gurugram', 'Hansi', 'Hisar', 'Jind', 'Kaithal', 'Karnal', 'Kurukshetra', 'Panipat', 'Pehowa', 'Rewari', 'Rohtak', 'Sirsa', 'Sonipat', 'Bilaspur', 'Chamba', 'Dalhousie', 'Dharmshala', 'Hamirpur', 'Kangra', 'Kullu', 'Mandi', 'Nahan', 'Shimla', 'Una', 'Anantnag', 'Baramula', 'Doda', 'Gulmarg', 'Jammu', 'Kathua', 'Punch', 'Rajouri', 'Srinagar', 'Udhampur', 'Bokaro', 'Chaibasa', 'Deoghar', 'Dhanbad', 'Dumka', 'Giridih', 'Hazaribag', 'Jamshedpur', 'Jharia', 'Rajmahal', 'Ranchi', 'Saraikela', 'Badami', 'Ballari', 'Bengaluru', 'Belagavi', 'Bhadravati', 'Bidar', 'Chikkamagaluru', 'Chitradurga', 'Davangere', 'Halebid', 'Hassan', 'Hubballi-Dharwad', 'Kalaburagi', 'Kolar', 'Madikeri', 'Mandya', 'Mangaluru', 'Mysuru', 'Raichur', 'Shivamogga', 'Shravanabelagola', 'Shrirangapattana', 'Tumakuru', 'Vijayapura', 'Alappuzha', 'Vatakara', 'Idukki', 'Kannur', 'Kochi', 'Kollam', 'Kottayam', 'Kozhikode', 'Mattancheri', 'Palakkad', 'Thalassery', 'Thiruvananthapuram', 'Thrissur', 'Kargil', 'Leh', 'Balaghat', 'Barwani', 'Betul', 'Bharhut', 'Bhind', 'Bhojpur', 'Bhopal', 'Burhanpur', 
  'Chhatarpur', 'Chhindwara', 'Damoh', 'Datia', 'Dewas', 'Dhar', 'Dr. Ambedkar Nagar (Mhow)', 'Guna', 'Gwalior', 'Hoshangabad', 'Indore', 'Itarsi', 'Jabalpur', 'Jhabua', 'Khajuraho', 'Khandwa', 'Khargone', 'Maheshwar', 'Mandla', 'Mandsaur', 'Morena', 'Murwara', 'Narsimhapur', 'Narsinghgarh', 'Narwar', 'Neemuch', 'Nowgong', 'Orchha', 'Panna', 'Raisen', 'Rajgarh', 'Ratlam', 'Rewa', 'Sagar', 'Sarangpur', 'Satna', 'Sehore', 'Seoni', 'Shahdol', 'Shajapur', 'Sheopur', 'Shivpuri', 'Ujjain', 'Vidisha', 'Ahmadnagar', 'Akola', 'Amravati', 'Aurangabad', 'Bhandara', 'Bhusawal', 'Bid', 'Buldhana', 'Chandrapur', 'Daulatabad', 'Dhule', 'Jalgaon', 'Kalyan', 'Karli', 'Kolhapur', 'Mahabaleshwar', 'Malegaon', 'Matheran', 'Mumbai', 'Nagpur', 'Nanded', 'Nashik', 'Osmanabad', 'Pandharpur', 'Parbhani', 'Pune', 'Ratnagiri', 'Sangli', 'Satara', 'Sevagram', 'Solapur', 'Thane', 'Ulhasnagar', 'Vasai-Virar', 'Wardha', 'Yavatmal', 'Imphal', 'Cherrapunji', 'Shillong', 'Aizawl', 'Lunglei', 'Kohima', 'Mon', 'Phek', 'Wokha', 'Zunheboto', 'Balangir', 'Baleshwar', 'Baripada', 'Bhubaneshwar', 'Brahmapur', 'Cuttack', 'Dhenkanal', 'Kendujhar', 'Konark', 'Koraput', 'Paradip', 'Phulabani', 'Puri', 'Sambalpur', 'Udayagiri', 'Karaikal', 'Mahe', 'Puducherry', 'Yanam', 'Amritsar', 
  'Batala', 'Faridkot', 'Firozpur', 'Gurdaspur', 'Hoshiarpur', 'Jalandhar', 'Kapurthala', 'Ludhiana', 'Nabha', 'Patiala', 'Rupnagar', 'Sangrur', 'Abu', 'Ajmer', 'Alwar', 'Amer', 'Barmer', 'Beawar', 'Bharatpur', 'Bhilwara', 'Bikaner', 'Bundi', 'Chittaurgarh', 'Churu', 'Dhaulpur', 'Dungarpur', 'Ganganagar', 'Hanumangarh', 'Jaipur', 'Jaisalmer', 'Jalor', 'Jhalawar', 'Jhunjhunu', 'Jodhpur', 'Kishangarh', 'Kota', 'Merta', 'Nagaur', 'Nathdwara', 'Pali', 'Phalodi', 'Pushkar', 'Sawai Madhopur', 'Shahpura', 'Sikar', 'Sirohi', 'Tonk', 'Udaipur', 'Gangtok', 'Gyalshing', 'Lachung', 'Mangan', 'Arcot', 'Chengalpattu', 'Chennai', 'Chidambaram', 'Coimbatore', 'Cuddalore', 'Dharmapuri', 'Dindigul', 'Erode', 'Kanchipuram', 'Kanniyakumari', 'Kodaikanal', 'Kumbakonam', 'Madurai', 'Mamallapuram', 'Nagappattinam', 'Nagercoil', 'Palayamkottai', 'Pudukkottai', 'Rajapalayam', 'Ramanathapuram', 'Salem', 'Thanjavur', 'Tiruchchirappalli', 'Tirunelveli', 'Tiruppur', 'Thoothukudi', 'Udhagamandalam', 'Vellore', 'Hyderabad', 'Karimnagar', 'Khammam', 'Mahbubnagar', 'Nizamabad', 'Sangareddi', 'Warangal', 'Agartala', 'Agra', 'Aligarh', 'Amroha', 'Ayodhya', 'Azamgarh', 'Bahraich', 'Ballia', 'Banda', 'Bara Banki', 'Bareilly', 'Basti', 'Bijnor', 'Bithur', 'Budaun', 'Bulandshahr', 'Deoria', 'Etah', 'Etawah', 'Faizabad', 'Farrukhabad-cum-Fatehgarh', 'Fatehpur', 'Fatehpur Sikri', 'Ghaziabad', 'Ghazipur', 'Gonda', 'Gorakhpur', 'Hamirpur', 'Hardoi', 'Hathras', 'Jalaun', 'Jaunpur', 'Jhansi', 'Kannauj', 'Kanpur', 'Lakhimpur', 'Lalitpur', 'Lucknow', 'Mainpuri', 'Mathura', 'Meerut', 'Mirzapur-Vindhyachal', 'Moradabad', 'Muzaffarnagar', 'Partapgarh', 'Pilibhit', 'Prayagraj', 'Rae Bareli', 'Rampur', 'Saharanpur', 'Sambhal', 'Shahjahanpur', 'Sitapur', 'Sultanpur', 'Tehri', 'Varanasi', 'Almora', 'Dehra Dun', 'Haridwar', 'Mussoorie', 'Nainital', 'Pithoragarh', 'Alipore', 'Alipur Duar', 'Asansol', 'Baharampur', 'Bally', 'Balurghat', 'Bankura', 'Baranagar', 'Barasat', 'Barrackpore', 'Basirhat', 'Bhatpara', 'Bishnupur', 'Budge Budge', 'Burdwan', 'Chandernagore', 'Darjeeling', 'Diamond Harbour', 'Dum Dum', 'Durgapur', 'Halisahar', 'Haora', 'Hugli', 'Ingraj Bazar', 'Jalpaiguri', 'Kalimpong', 'Kamarhati', 'Kanchrapara', 'Kharagpur', 'Cooch Behar', 'Kolkata', 'Krishnanagar', 'Malda', 'Midnapore', 'Murshidabad', 'Nabadwip', 'Palashi', 'Panihati', 'Purulia', 'Raiganj', 'Santipur', 'Shantiniketan', 'Shrirampur', 'Siliguri', 'Siuri', 'Tamluk', 'Titagarh', 
  
  // Seas
  'Adriatic Sea', 'Aegean Sea', 'Alboran Sea', 'Amundsen Sea', 'Andaman Sea', 'Arabian Sea', 'Aral Sea', 'Argentine Sea', 'Baffin Bay (sometimes called Baffin Sea)', 'Balearic Sea', 'Bali Sea', 'Banda Sea', 'Barents Sea', 'Beaufort Sea', 'Bellingshausen Sea', 'Bering Sea', 'Black Sea', 'Bothnian Sea', 'Caribbean Sea', 'Caspian Sea', 'Celebes Sea', 'Celtic Sea', 'Chukchi Sea', 'Cooperation Sea', 'Coral Sea', 'Davis Sea', 'East China Sea', 'East Siberian Sea', 'Flores Sea', 'Greenland Sea', 'Halmahera Sea', 'Hudson Bay (sometimes called Hudson Sea)', 'Ionian Sea', 'Irish Sea', 'Java Sea', 'Kara Sea', 'Koro Sea', 'Laptev Sea', 'Ligurian Sea', 'Lincoln Sea', 'Marmara Sea', 'Mediterranean Sea', 'Molucca Sea', 'Norwegian Sea', 'Okhotsk Sea', 'Philippine Sea', 'Red Sea', 'Ross Sea', 'Sargasso Sea', 'Scotia Sea', 'Sea of Azov', 'Sea of Japan (East Sea)', 'Sea of Okhotsk', 'Seram Sea', 'Sibuyan Sea', 'Solomon Sea', 'South China Sea', 'Tasman Sea', 'Thracian Sea', 'Timor Sea', 'Tyrrhenian Sea', 'Weddell Sea', 'White Sea', 'Yellow Sea',


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
  currentTurn = 0;
  lastLetterGlobal = null;

  // Game container
  document.getElementById("game").style.display = preGame ? "block" : "none";

  // Lobby container
  // Leader who already has a room should not see create/join box
  if (preGame) {
    document.getElementById("lobby").style.display = isLeader ? "none" : "block";
  } else {
    document.getElementById("lobby").style.display = "block";
  }

  // Clear game-specific elements
  document.getElementById("history").innerHTML = "";
  showMessage("");
  document.getElementById("turnInfo").innerText = "";
  inputField.style.display = "none";
  inputField.disabled = false;
  document.querySelector(".buttons").style.display = "none";

  // Show start game button only if leader and preGame
  document.getElementById("startGameBtn").style.display = isLeader && preGame ? "inline-block" : "none";

  // Keep players list intact
  updatePlayersList(players);

  // Winner modal logic
  // Do NOT show winner modal in resetUI. Winner modal is handled separately in gameOver
  document.getElementById("winnerModal").style.display = "none";


  // Clear countdown
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

  // Show the game UI properly for midgame joiners
  showGameUI(false);       // not leader
  if (gameStarted) {
    inputField.style.display = "block";
    document.querySelector(".buttons").style.display = "flex";
  }
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
  document.getElementById("winnerName").innerText =
    winner.name === "No one" ? "No one wins!" : `${winner.name} wins!`;
  
  // Show the winner modal with Play Again button
  document.getElementById("winnerModal").style.display = "flex";
  
  // Disable input field and buttons
  inputField.style.display = "none";
  document.querySelector(".buttons").style.display = "none";
  
  if (countdownInterval) clearInterval(countdownInterval);
});


socket.on("resetGame", () => {
  // Keep players list intact
  updatePlayersList(players);

  // Show pre-game UI
  document.getElementById("lobby").style.display = isLeader ? "none" : "block";
  document.getElementById("game").style.display = "block";

  // Show start button for leader
  document.getElementById("startGameBtn").style.display = isLeader ? "inline-block" : "none";

  // Reset game variables
  yourTurn = false;
  gameStarted = false;
  currentTurn = 0;
  lastLetterGlobal = null;
  document.getElementById("history").innerHTML = "";
  showMessage("");
  document.getElementById("turnInfo").innerText = "";
  inputField.style.display = "none";
  inputField.disabled = false;
  document.querySelector(".buttons").style.display = "none";

  if (countdownInterval) clearInterval(countdownInterval);
});



socket.on("yourTurn", (lastLetter) => {
  yourTurn = true;
  lastLetterGlobal = lastLetter;
  inputField.disabled = false;
  inputField.style.display = "block";

  let timeLeft = 20;
  document.getElementById("turnInfo").innerText = lastLetter ? `Your turn! Start with "${lastLetter.toUpperCase()}" (${timeLeft}s)` : `Your turn! (${timeLeft}s)`;
  document.getElementById("turnInfo").dataset.lastLetter = lastLetter || "";

  if (countdownInterval) clearInterval(countdownInterval);
  countdownInterval = setInterval(() => {
    timeLeft--;
    document.getElementById("turnInfo").innerText = lastLetter ? `Your turn! Start with "${lastLetter.toUpperCase()}" (${timeLeft}s)` : `Your turn! (${timeLeft}s)`;
    if (timeLeft <= 0) clearInterval(countdownInterval);
  }, 1000);
});

socket.on("notYourTurn", ({ playerName: currentPlayerName, lastLetter }) => {
  yourTurn = false;
  inputField.disabled = true;

  // Stop any running countdown
  if (countdownInterval) {
    clearInterval(countdownInterval);
    countdownInterval = null;
  }

  // Update the info text
  if (currentPlayerName) {
    if (lastLetter) {
      document.getElementById("turnInfo").innerText = `Waiting for ${currentPlayerName} to answer (letter starting with "${lastLetter.toUpperCase()}")...`;
    } else {
      document.getElementById("turnInfo").innerText = `Waiting for ${currentPlayerName} to answer...`;
    }
  } else {
    document.getElementById("turnInfo").innerText = "Waiting for other players...";
  }
});



// --- UTILITY ---
function updatePlayersList(players) {
  const list = document.getElementById("playersList");
  list.innerHTML = "";

  // Show leader first
  const sortedPlayers = [...players].sort((a,b) => b.isLeader - a.isLeader);

  sortedPlayers.forEach(p => {
    const li = document.createElement("li");
    li.innerText = p.name + (p.isLeader ? " (Leader)" : "");
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

function playAgain() {
  socket.emit("playAgain", roomId);

  // Hide winner modal
  document.getElementById("winnerModal").style.display = "none";

  // Reset game variables
  yourTurn = false;
  gameStarted = false;
  currentTurn = 0;
  lastLetterGlobal = null;
  document.getElementById("history").innerHTML = "";
  showMessage("");
  document.getElementById("turnInfo").innerText = "";
  inputField.style.display = "none";
  inputField.disabled = false;
  document.querySelector(".buttons").style.display = "none";

  // Show start game button only for leader
  document.getElementById("startGameBtn").style.display = isLeader ? "inline-block" : "none";

  // Show pre-game UI and keep players visible
  document.getElementById("lobby").style.display = isLeader ? "none" : "block";
  updatePlayersList(players);
}



