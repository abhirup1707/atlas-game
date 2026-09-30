// Atlas Multiplayer & Solo Engine
// Localhost connects to local server; other hosts connect to Render deployment
const socket = (window.location.protocol.startsWith('http') && (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1'))
  ? io()
  : io("https://atlas-game-4w24.onrender.com");

// ==========================================================================
// VALID PLACES DATABASE (PRESERVED IN FULL)
// ==========================================================================
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

  // Cities & Regions (expanded)
  'Paris', 'Madrid', 'Tokyo', 'Rome', 'Milan', 'New York City', 'Amsterdam', 'Sydney', 'Singapore', 'Barcelona', 'Taipei', 'Seoul', 'London', 'Dubai', 'Berlin', 'Osaka', 'Bangkok', 'Los Angeles', 'Istanbul', 'Melbourne', 'Hong Kong', 'Munich', 'Las Vegas', 'Florence', 'Prague', 'Dublin', 'Kyoto', 'Vienna', 'Lisbon', 'Venice', 'Kuala Lumpur', 'Athens', 'Orlando', 'Toronto', 'Miami', 'San Francisco', 'Shanghai', 'Frankfurt am Main', 'Copenhagen', 'Zurich', 'Washington', 'Vancouver', 'Stockholm', 'Mexico City', 'Oslo', 'São Paulo', 'Helsinki', 'Brussels', 'Budapest', 'Guangzhou', 'Nice', 'Montreal', 'Cancún', 'Bologna', 'Rhodes', 'Verona', 'Porto', 'Ho Chi Minh City', 'Buenos Aires', 'Rio de Janeiro', 'Kraków', 'Hanoi', 'Tel Aviv', 'Lima', 'Riyadh', 'Tallinn', 'Marrakech', 'Santiago', 'Vilnius', 'Shanghai', 'Dhaka', 'Cairo', 'Beijing', 'Chongqing', 'Karachi', 'Kinshasa', 'Lagos', 'Manila', 'Tianjin', 'Lahore', 'Shenzhen', 'Moscow', 'Bogota', 'Jakarta', 'Luanda', 'Tehran', 'Nanjing', 'Chengdu',
  'California', 'Texas', 'New York', 'Florida', 'Illinois', 'Pennsylvania', 'Ohio', 'Georgia', 'Michigan', 'North Carolina', 'Ontario', 'Quebec', 'British Columbia', 'Bavaria', 'Hamburg', 'Saxony', 'North Rhine-Westphalia', 'Île-de-France', 'Provence-Alpes-Côte d’Azur', 'Normandy', 'New South Wales', 'Victoria', 'Queensland', 'Guangdong', 'Sichuan', 'Zhejiang', 'São Paulo (state)', 'Rio de Janeiro (state)', 'Jalisco', 'Nuevo León', 'Moscow Oblast', 'Saint Petersburg', 'Tokyo Prefecture', 'Osaka Prefecture', 'Gauteng', 'Western Cape', 'Buenos Aires Province', 'Catalonia', 'Andalusia', 'Hong Kong (SAR)', 'Macau (SAR)', 'Azores', 'Greenland', 
 
  // Continents
  'Africa','Antarctica','Asia','Europe','North America','Oceania','South America',

  // Oceans
  'Pacific Ocean','Atlantic Ocean','Indian Ocean','Southern Ocean','Arctic Ocean',

  // Indian States and Territories
  'Andhra Pradesh', 'Arunachal Pradesh', 'Assam', 'Bihar', 'Chhattisgarh', 'Goa', 'Gujarat', 'Haryana', 'Himachal Pradesh', 'Jharkhand', 'Karnataka', 'Kerala', 'Madhya Pradesh', 'Maharashtra', 'Manipur', 'Meghalaya', 'Mizoram', 'Nagaland', 'Odisha', 'Punjab', 'Rajasthan', 'Sikkim', 'Tamil Nadu', 'Telangana', 'Tripura', 'Uttar Pradesh', 'Uttarakhand', 'West Bengal', 
  'Andaman and Nicobar Islands', 'Chandigarh', 'Dadra and Nagar Haveli and Daman and Diu', 'Delhi (National Capital Territory)', 'Jammu and Kashmir', 'Ladakh', 'Lakshadweep', 'Puducherry',

  // Indian Rivers
  'Ganges','Yamuna','Brahmaputra','Indus','Godavari','Krishna','Narmada','Tapi','Mahanadi','Cauvery','Sutlej','Beas','Chenab','Ravi','Ghaghara','Kosi','Son',

  // Indian Mountains
  'Himalayas','Vindhya','Aravalli','Satpura','Nilgiri','Annamalai','Cardamom','Dhauladhar','Pir Panjal','Zanskar',

  // Indian Lakes & Dams
  'Dal Lake','Wular Lake','Chilika Lake','Sambhar Lake','Vembanad Lake','Loktak Lake','Pangong Lake','Tso Moriri','Nainital Lake','Pushkar Lake',
  'Sardar Sarovar','Hussain Sagar','Bhimtal Lake','Ranganathittu',
  'Kolleru Lake','Manasbal Lake','Kailash Lake','Renuka Lake','Gobind Sagar','Anchar Lake','Nalsarovar','Sambhar Salt Lake',
  'Banasura Sagar Dam','Srisailam Dam','Tehri Dam','Idukki Dam','Nagarjuna Sagar Dam','Bhakra Nangal Dam','Hirakud Dam','Tungabhadra Dam',
  'Mettur Dam','Rihand Dam','Indira Sagar Dam','Koyna Dam','Sardar Sarovar Dam',
  'Upper Bhavani Dam','Kundah Dam','Pong Dam','Chamera Dam','Dindi Dam',
  'Mullaperiyar Dam',

  // Indian Deserts
  'Thar Desert','Rann of Kutch','Chambal Valley','Aravalli Range Desert','Kutch Desert','Luni Desert',
  'Great Rann of Kutch','Little Rann of Kutch','Marusthali Desert','Banni Grasslands','Dholavira Desert',
  'Pokhran Desert','Kharan Desert','Cholistan Desert','Tharparkar Desert',
  'Kachchh Desert','Barmer Desert','Jaisalmer Desert','Jodhpur Desert','Bikaner Desert',
  'Jungle Broom Desert','Ladakh Desert','Spiti Desert','Cold Desert of Himachal Pradesh',

  // Indian Cities and Towns
  'Port Blair', 'Adoni', 'Amaravati', 'Anantapur', 'Chandragiri', 'Chittoor', 'Dowlaiswaram', 'Eluru', 'Guntur', 'Kadapa', 'Kakinada', 'Kurnool', 
  'Machilipatnam', 'Nagarjunakoṇḍa', 'Rajahmundry', 'Srikakulam', 'Tirupati', 'Vijayawada', 'Visakhapatnam', 'Vizianagaram', 'Yemmiganur', 'Itanagar', 'Dhuburi', 'Dibrugarh', 'Dispur', 'Guwahati', 'Jorhat', 'Nagaon', 'Sivasagar', 'Silchar', 'Tezpur', 'Tinsukia', 'Ara', 'Barauni', 'Begusarai', 'Bettiah', 'Bhagalpur', 'Bihar Sharif', 'Bodh Gaya', 'Buxar', 'Chapra', 'Darbhanga', 'Dehri', 'Dinapur Nizamat', 'Gaya', 'Hajipur', 'Jamalpur', 'Katihar', 'Madhubani', 'Motihari', 'Munger', 'Muzaffarpur', 'Patna', 'Purnia', 'Pusa', 'Saharsa', 'Samastipur', 'Sasaram', 'Sitamarhi', 'Siwan', 'Ambikapur', 'Bhilai', 'Bilaspur', 'Dhamtari', 'Durg', 'Jagdalpur', 'Raipur', 'Rajnandgaon', 'Daman', 'Diu', 'Silvassa', 'Delhi', 'New Delhi', 'Madgaon', 'Panaji', 'Ahmadabad', 'Amreli', 'Bharuch', 'Bhavnagar', 'Bhuj', 'Dwarka', 'Gandhinagar', 'Godhra', 'Jamnagar', 'Junagadh', 'Kandla', 'Khambhat', 'Kheda', 'Mahesana', 'Morbi', 'Nadiad', 'Navsari', 'Okha', 'Palanpur', 'Patan', 'Porbandar', 'Rajkot', 
  'Surat', 'Surendranagar', 'Valsad', 'Veraval', 'Ambala', 'Bhiwani', 'Faridabad', 'Firozpur Jhirka', 'Gurugram', 'Hansi', 'Hisar', 'Jind', 'Kaithal', 'Karnal', 'Kurukshetra', 'Panipat', 'Pehowa', 'Rewari', 'Rohtak', 'Sirsa', 'Sonipat', 'Chamba', 'Dalhousie', 'Dharmshala', 'Hamirpur', 'Kangra', 'Kullu', 'Mandi', 'Nahan', 'Shimla', 'Una', 'Anantnag', 'Baramula', 'Doda', 'Gulmarg', 'Jammu', 'Kathua', 'Punch', 'Rajouri', 'Srinagar', 'Udhampur', 'Bokaro', 'Chaibasa', 'Deoghar', 'Dhanbad', 'Dumka', 'Giridih', 'Hazaribag', 'Jamshedpur', 'Jharia', 'Rajmahal', 'Ranchi', 'Saraikela', 'Badami', 'Ballari', 'Bengaluru', 'Belagavi', 'Bhadravati', 'Bidar', 'Chikkamagaluru', 'Chitradurga', 'Davangere', 'Halebid', 'Hassan', 'Hubballi-Dharwad', 'Kalaburagi', 'Kolar', 'Madikeri', 'Mandya', 'Mangaluru', 'Mysuru', 'Raichur', 'Shivamogga', 'Shravanabelagola', 'Shrirangapattana', 'Tumakuru', 'Vijayapura', 'Alappuzha', 'Vatakara', 'Idukki', 'Kannur', 'Kochi', 'Kollam', 'Kottayam', 'Kozhikode', 'Mattancheri', 'Palakkad', 'Thalassery', 'Thiruvananthapuram', 'Thrissur', 'Kargil', 'Leh', 'Balaghat', 'Barwani', 'Betul', 'Bharhut', 'Bhind', 'Bhojpur', 'Bhopal', 'Burhanpur', 
  'Chhatarpur', 'Chhindwara', 'Damoh', 'Datia', 'Dewas', 'Dhar', 'Dr. Ambedkar Nagar (Mhow)', 'Guna', 'Gwalior', 'Hoshangabad', 'Indore', 'Itarsi', 'Jabalpur', 'Jhabua', 'Khajuraho', 'Khandwa', 'Khargone', 'Maheshwar', 'Mandla', 'Mandsaur', 'Morena', 'Murwara', 'Narsimhapur', 'Narsinghgarh', 'Narwar', 'Neemuch', 'Nowgong', 'Orchha', 'Panna', 'Raisen', 'Rajgarh', 'Ratlam', 'Rewa', 'Sagar', 'Sarangpur', 'Satna', 'Sehore', 'Seoni', 'Shahdol', 'Shajapur', 'Sheopur', 'Shivpuri', 'Ujjain', 'Vidisha', 'Ahmadnagar', 'Akola', 'Amravati', 'Aurangabad', 'Bhandara', 'Bhusawal', 'Bid', 'Buldhana', 'Chandrapur', 'Daulatabad', 'Dhule', 'Jalgaon', 'Kalyan', 'Karli', 'Kolhapur', 'Mahabaleshwar', 'Malegaon', 'Matheran', 'Mumbai', 'Nagpur', 'Nanded', 'Nashik', 'Osmanabad', 'Pandharpur', 'Parbhani', 'Pune', 'Ratnagiri', 'Sangli', 'Satara', 'Sevagram', 'Solapur', 'Thane', 'Ulhasnagar', 'Vasai-Virar', 'Wardha', 'Yavatmal', 'Imphal', 'Cherrapunji', 'Shillong', 'Aizawl', 'Lunglei', 'Kohima', 'Mon', 'Phek', 'Wokha', 'Zunheboto', 'Balangir', 'Baleshwar', 'Baripada', 'Bhubaneshwar', 'Brahmapur', 'Cuttack', 'Dhenkanal', 'Kendujhar', 'Konark', 'Koraput', 'Paradip', 'Phulabani', 'Puri', 'Sambalpur', 'Udayagiri', 'Karaikal', 'Mahe', 'Yanam', 'Amritsar', 
  'Batala', 'Faridkot', 'Firozpur', 'Gurdaspur', 'Hoshiarpur', 'Jalandhar', 'Kapurthala', 'Ludhiana', 'Nabha', 'Patiala', 'Rupnagar', 'Sangrur', 'Abu', 'Ajmer', 'Alwar', 'Amer', 'Barmer', 'Beawar', 'Bharatpur', 'Bhilwara', 'Bikaner', 'Bundi', 'Chittaurgarh', 'Churu', 'Dhaulpur', 'Dungarpur', 'Ganganagar', 'Hanumangarh', 'Jaipur', 'Jaisalmer', 'Jalor', 'Jhalawar', 'Jhunjhunu', 'Jodhpur', 'Kishangarh', 'Kota', 'Merta', 'Nagaur', 'Nathdwara', 'Pali', 'Phalodi', 'Pushkar', 'Sawai Madhopur', 'Shahpura', 'Sikar', 'Sirohi', 'Tonk', 'Udaipur', 'Gangtok', 'Gyalshing', 'Lachung', 'Mangan', 'Arcot', 'Chengalpattu', 'Chennai', 'Chidambaram', 'Coimbatore', 'Cuddalore', 'Dharmapuri', 'Dindigul', 'Erode', 'Kanchipuram', 'Kanniyakumari', 'Kodaikanal', 'Kumbakonam', 'Madurai', 'Mamallapuram', 'Nagappattinam', 'Nagercoil', 'Palayamkottai', 'Pudukkottai', 'Rajapalayam', 'Ramanathapuram', 'Salem', 'Thanjavur', 'Tiruchchirappalli', 'Tirunelveli', 'Tiruppur', 'Thoothukudi', 'Udhagamandalam', 'Vellore', 'Hyderabad', 'Karimnagar', 'Khammam', 'Mahbubnagar', 'Nizamabad', 'Sangareddi', 'Warangal', 'Agartala', 'Agra', 'Aligarh', 'Amroha', 'Ayodhya', 'Azamgarh', 'Bahraich', 'Ballia', 'Banda', 'Bara Banki', 'Bareilly', 'Basti', 'Bijnor', 'Bithur', 'Budaun', 'Bulandshahr', 'Deoria', 'Etah', 'Etawah', 'Faizabad', 'Farrukhabad-cum-Fatehgarh', 'Fatehpur', 'Fatehpur Sikri', 'Ghaziabad', 'Ghazipur', 'Gonda', 'Gorakhpur', 'Hardoi', 'Hathras', 'Jalaun', 'Jaunpur', 'Jhansi', 'Kannauj', 'Kanpur', 'Lakhimpur', 'Lalitpur', 'Lucknow', 'Mainpuri', 'Mathura', 'Meerut', 'Mirzapur-Vindhyachal', 'Moradabad', 'Muzaffarnagar', 'Partapgarh', 'Pilibhit', 'Prayagraj', 'Rae Bareli', 'Rampur', 'Saharanpur', 'Sambhal', 'Shahjahanpur', 'Sitapur', 'Sultanpur', 'Tehri', 'Varanasi', 'Almora', 'Dehra Dun', 'Haridwar', 'Mussoorie', 'Pithoragarh', 'Alipore', 'Alipur Duar', 'Asansol', 'Baharampur', 'Bally', 'Balurghat', 'Bankura', 'Baranagar', 'Barasat', 'Barrackpore', 'Basirhat', 'Bhatpara', 'Bishnupur', 'Budge Budge', 'Burdwan', 'Chandernagore', 'Darjeeling', 'Diamond Harbour', 'Dum Dum', 'Durgapur', 'Halisahar', 'Haora', 'Hugli', 'Ingraj Bazar', 'Jalpaiguri', 'Kalimpong', 'Kamarhati', 'Kanchrapara', 'Kharagpur', 'Cooch Behar', 'Kolkata', 'Krishnanagar', 'Malda', 'Midnapore', 'Murshidabad', 'Nabadwip', 'Palashi', 'Panihati', 'Purulia', 'Raiganj', 'Santipur', 'Shantiniketan', 'Shrirampur', 'Siliguri', 'Siuri', 'Tamluk', 'Titagarh', 
  
  // Seas
  'Adriatic Sea', 'Aegean Sea', 'Alboran Sea', 'Amundsen Sea', 'Andaman Sea', 'Arabian Sea', 'Aral Sea', 'Argentine Sea', 'Baffin Bay', 'Balearic Sea', 'Bali Sea', 'Banda Sea', 'Barents Sea', 'Beaufort Sea', 'Bellingshausen Sea', 'Bering Sea', 'Black Sea', 'Bothnian Sea', 'Caribbean Sea', 'Caspian Sea', 'Celebes Sea', 'Celtic Sea', 'Chukchi Sea', 'Cooperation Sea', 'Coral Sea', 'Davis Sea', 'East China Sea', 'East Siberian Sea', 'Flores Sea', 'Greenland Sea', 'Halmahera Sea', 'Hudson Bay', 'Ionian Sea', 'Irish Sea', 'Java Sea', 'Kara Sea', 'Koro Sea', 'Laptev Sea', 'Ligurian Sea', 'Lincoln Sea', 'Marmara Sea', 'Mediterranean Sea', 'Molucca Sea', 'Norwegian Sea', 'Okhotsk Sea', 'Philippine Sea', 'Red Sea', 'Ross Sea', 'Sargasso Sea', 'Scotia Sea', 'Sea of Azov', 'Sea of Japan', 'Sea of Okhotsk', 'Seram Sea', 'Sibuyan Sea', 'Solomon Sea', 'South China Sea', 'Tasman Sea', 'Thracian Sea', 'Timor Sea', 'Tyrrhenian Sea', 'Weddell Sea', 'White Sea', 'Yellow Sea',

  // Islands
  'Greenland','Madagascar','Borneo','Sumatra','Sicily','Honshu','Great Britain','Iceland','Sri Lanka','Hawaii','Fiji','Maldives','Bali','Tasmania','New Guinea','Sardinia','Corsica','Puerto Rico','Jamaica','Cuba'
];

const validPlacesLowerSet = new Set(validPlaces.map(p => p.toLowerCase()));

function getPlaceCategory(place) {
  const p = place.toLowerCase();
  if (p.includes('ocean') || p.includes('sea') || p.includes('bay')) return '🌊 Sea / Ocean';
  if (p.includes('river') || p.includes('lake') || p.includes('dam') || p.includes('ganges') || p.includes('yamuna') || p.includes('indus')) return '🏞️ River / Lake';
  if (p.includes('desert') || p.includes('valley') || p.includes('rann')) return '🏜️ Desert';
  if (p.includes('mountain') || p.includes('range') || p.includes('himalayas') || p.includes('aravalli') || p.includes('nilgiri')) return '⛰️ Mountain';
  if (['africa','antarctica','asia','europe','north america','oceania','south america'].includes(p)) return '🗺️ Continent';
  if (['greenland','madagascar','borneo','sumatra','sicily','honshu','hawaii','fiji','maldives','bali','tasmania'].includes(p)) return '🏝️ Island';
  return '📍 Destination';
}

// ==========================================================================
// STATE VARIABLES
// ==========================================================================
let roomId = null;
let playerName = null;
let selectedAvatar = '🌍';
let yourTurn = false;
let isLeader = false;
let players = [];
let currentTurn = 0;
let lastLetterGlobal = null;
let gameStarted = false;
let mySocketId = null;
let countdownInterval = null;
let currentTotalRounds = 3;
let currentRoundNum = 1;

// SOLO / AI BOT ENGINE STATE
let isSoloMode = false;
let soloDifficulty = 'medium';
let soloBotName = 'Ibn Battuta';
let soloBotAvatar = '🤖';
let soloTurnTimeout = null;

// TACTICAL LIFELINES & STATS
let hintTokensLeft = 1;
let passTicketsLeft = 1;
let currentStreak = 0;
let turnStartTime = 0;
let fastestMoveSeconds = Infinity;
let totalDistanceTraveledKm = 0;
let lastVisitedPlace = null;
const visitedContinents = new Set();
let placesExploredHistory = [];

// DOM Elements
const inputField = document.getElementById("countryInput");
const startGameBtn = document.getElementById("startGameBtn");
const createRoomBtn = document.getElementById("createRoomBtn");
const countryImage = document.getElementById("countryImage");

// ==========================================================================
// SOUND SYNTHESIS ENGINE (Web Audio API)
// ==========================================================================
const sound = {
  ctx: null,
  enabled: localStorage.getItem('atlas_sound') !== 'false',

  init() {
    if (!this.ctx) {
      const AudioCtx = window.AudioContext || window.webkitAudioContext;
      if (AudioCtx) this.ctx = new AudioCtx();
    }
    if (this.ctx && this.ctx.state === 'suspended') {
      this.ctx.resume();
    }
  },

  toggle() {
    this.enabled = !this.enabled;
    localStorage.setItem('atlas_sound', this.enabled ? 'true' : 'false');
    updateAudioIcon();
    return this.enabled;
  },

  playTurn() {
    if (!this.enabled) return;
    this.init();
    if (!this.ctx) return;
    const now = this.ctx.currentTime;
    [ { f: 659.25, t: now, d: 0.12 }, { f: 880.00, t: now + 0.1, d: 0.28 } ].forEach(n => {
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(n.f, n.t);
      gain.gain.setValueAtTime(0.12, n.t);
      gain.gain.exponentialRampToValueAtTime(0.001, n.t + n.d);
      osc.connect(gain);
      gain.connect(this.ctx.destination);
      osc.start(n.t);
      osc.stop(n.t + n.d);
    });
  },

  playTick(urgent) {
    if (!this.enabled) return;
    this.init();
    if (!this.ctx) return;
    const now = this.ctx.currentTime;
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();
    osc.type = urgent ? 'sawtooth' : 'triangle';
    osc.frequency.setValueAtTime(urgent ? 880 : 540, now);
    gain.gain.setValueAtTime(urgent ? 0.08 : 0.035, now);
    gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.05);
    osc.connect(gain);
    gain.connect(this.ctx.destination);
    osc.start(now);
    osc.stop(now + 0.05);
  },

  playSuccess() {
    if (!this.enabled) return;
    this.init();
    if (!this.ctx) return;
    const now = this.ctx.currentTime;
    [ { f: 523.25, t: now, d: 0.09 }, { f: 659.25, t: now + 0.08, d: 0.09 }, { f: 783.99, t: now + 0.16, d: 0.28 } ].forEach(n => {
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(n.f, n.t);
      gain.gain.setValueAtTime(0.14, n.t);
      gain.gain.exponentialRampToValueAtTime(0.001, n.t + n.d);
      osc.connect(gain);
      gain.connect(this.ctx.destination);
      osc.start(n.t);
      osc.stop(n.t + n.d);
    });
  },

  playError() {
    if (!this.enabled) return;
    this.init();
    if (!this.ctx) return;
    const now = this.ctx.currentTime;
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();
    osc.type = 'sawtooth';
    osc.frequency.setValueAtTime(180, now);
    osc.frequency.exponentialRampToValueAtTime(110, now + 0.18);
    gain.gain.setValueAtTime(0.14, now);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.2);
    osc.connect(gain);
    gain.connect(this.ctx.destination);
    osc.start(now);
    osc.stop(now + 0.2);
  },

  playFanfare() {
    if (!this.enabled) return;
    this.init();
    if (!this.ctx) return;
    const now = this.ctx.currentTime;
    [ { f: 523.25, t: now, d: 0.12 }, { f: 659.25, t: now + 0.12, d: 0.12 }, { f: 783.99, t: now + 0.24, d: 0.16 }, { f: 1046.50, t: now + 0.40, d: 0.55 } ].forEach(n => {
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      osc.type = 'triangle';
      osc.frequency.setValueAtTime(n.f, n.t);
      gain.gain.setValueAtTime(0.18, n.t);
      gain.gain.exponentialRampToValueAtTime(0.001, n.t + n.d);
      osc.connect(gain);
      gain.connect(this.ctx.destination);
      osc.start(n.t);
      osc.stop(n.t + n.d);
    });
  }
};

function updateAudioIcon() {
  const icon = document.getElementById("audioIcon");
  if (icon) icon.innerText = sound.enabled ? "🔊" : "🔇";
}

window.toggleAudio = function() {
  sound.toggle();
};

// ==========================================================================
// PEXELS IMAGE FETCHER
// ==========================================================================
async function fetchPlaceImage(place) {
  const apiKey = "iq9AWxAKJEfoEQlH6AdK72Bi1BQ6qMF6Oo0ootH1XhJqF5vnUeT2Er8l";
  try {
    const response = await fetch(
      `https://api.pexels.com/v1/search?query=${encodeURIComponent(place)}&per_page=1`,
      { headers: { Authorization: apiKey } }
    );
    const data = await response.json();
    if (data.photos && data.photos.length > 0) {
      const photo = data.photos[0];
      return photo.src.large || photo.src.medium || photo.src.original;
    }
    return null;
  } catch (error) {
    console.error("Error fetching image from Pexels:", error);
    return null;
  }
}

// ==========================================================================
// TACTICAL LIFELINES & STREAKS
// ==========================================================================
window.useHintLifeline = function() {
  if (!yourTurn) {
    showMessage("Hints can only be used during your turn!", "error");
    return;
  }
  if (hintTokensLeft <= 0) {
    showMessage("No hint tokens remaining in this expedition!", "error");
    return;
  }

  // Find unused matching words
  const required = lastLetterGlobal ? lastLetterGlobal.toLowerCase() : null;
  const usedSet = new Set(placesExploredHistory.map(p => p.toLowerCase()));

  const candidates = validPlaces.filter(p => {
    const low = p.toLowerCase();
    if (usedSet.has(low)) return false;
    if (required && low[0] !== required) return false;
    return true;
  });

  if (candidates.length === 0) {
    showMessage("No hints found! Try thinking of uncommon rivers or islands.", "info");
    return;
  }

  // Pick a random candidate
  const sample = candidates[Math.floor(Math.random() * candidates.length)];
  const continent = getContinentForPlace(sample);
  const cat = getPlaceCategory(sample);
  const length = sample.length;

  hintTokensLeft--;
  const hintBtn = document.getElementById("hintBtn");
  const hintCountBadge = document.getElementById("hintCountBadge");
  if (hintCountBadge) hintCountBadge.innerText = `(${hintTokensLeft})`;
  if (hintTokensLeft <= 0 && hintBtn) hintBtn.disabled = true;

  sound.playSuccess();
  const hintMsg = continent 
    ? `💡 Clue: A ${cat} in ${continent} with ${length} letters (starts with "${(required || sample[0]).toUpperCase()}").`
    : `💡 Clue: A ${cat} with ${length} letters (starts with "${(required || sample[0]).toUpperCase()}").`;

  showMessage(hintMsg, "info");
};

window.usePassTicket = function() {
  if (!yourTurn) {
    showMessage("Pass tickets can only be used during your turn!", "error");
    return;
  }
  if (passTicketsLeft <= 0) {
    showMessage("No pass tickets remaining!", "error");
    return;
  }

  passTicketsLeft--;
  const passBtn = document.getElementById("passBtn");
  const passCountBadge = document.getElementById("passCountBadge");
  if (passCountBadge) passCountBadge.innerText = `(${passTicketsLeft})`;
  if (passTicketsLeft <= 0 && passBtn) passBtn.disabled = true;

  sound.playTurn();
  showMessage("🎲 Free pass used! Turn skipped without penalty.", "info");

  if (isSoloMode) {
    yourTurn = false;
    triggerSoloBotTurn();
  } else {
    // In multiplayer: safely pass without elimination
    window.giveUp();
  }
};

function updateStreak(timeTakenSec) {
  if (timeTakenSec <= 5.5) {
    currentStreak++;
  } else {
    currentStreak = 0;
  }

  const badge = document.getElementById("streakBadge");
  const mult = document.getElementById("streakMultiplier");
  if (currentStreak >= 2) {
    if (badge) badge.style.display = "flex";
    if (mult) mult.innerText = `${currentStreak}x`;
  } else {
    if (badge) badge.style.display = "none";
  }
}

// ==========================================================================
// SUBMIT & GAME ACTIONS
// ==========================================================================
window.submitCountry = function submitCountry() {
  if (!yourTurn) {
    showMessage("Please wait for your turn!", "error");
    sound.playError();
    return;
  }
  const input = inputField.value.trim();
  if (!input) {
    showMessage("Please enter a place!", "error");
    sound.playError();
    inputField.focus();
    return;
  }

  const lastLetter = document.getElementById("turnInfo").dataset.lastLetter;
  if (lastLetter && input[0].toLowerCase() !== lastLetter.toLowerCase()) {
    showMessage(`Must start with letter "${lastLetter.toUpperCase()}"!`, "error");
    sound.playError();
    inputField.classList.add("invalid-match");
    inputField.focus();
    return;
  }

  if (!validPlacesLowerSet.has(input.toLowerCase())) {
    showMessage(`"${input}" is not recognized as a valid place!`, "error");
    sound.playError();
    inputField.classList.add("invalid-match");
    inputField.focus();
    return;
  }

  // Duplicate check
  const alreadyUsed = placesExploredHistory.some(p => p.toLowerCase() === input.toLowerCase());
  if (alreadyUsed) {
    showMessage(`"${input}" has already been used in this expedition!`, "error");
    sound.playError();
    inputField.classList.add("invalid-match");
    inputField.focus();
    return;
  }

  // Calculate speed and score bonus
  const timeTaken = Math.max(1, (Date.now() - turnStartTime) / 1000);
  fastestMoveSeconds = Math.min(fastestMoveSeconds, timeTaken);
  updateStreak(timeTaken);

  sound.playSuccess();
  inputField.value = "";
  inputField.classList.remove("valid-match", "invalid-match");
  updateInputHint("");
  showMessage("");

  if (isSoloMode) {
    handleSoloPlayerSubmit(input, timeTaken);
  } else {
    socket.emit("submitCountry", { roomId, name: playerName, place: input });
    yourTurn = false;
  }
};

window.giveUp = function giveUp() {
  if (isSoloMode) {
    handleSoloGameOver(soloBotName);
    return;
  }
  if (!roomId) return;
  sound.playError();
  socket.emit("giveUp", { roomId, name: playerName });
};

window.leaveRoom = function leaveRoom() {
  if (isSoloMode) {
    resetUI();
    return;
  }
  if (!roomId) return;
  socket.emit("leaveRoom", roomId);
  resetUI();
};

window.playAgain = function playAgain() {
  window.location.reload();
};

// ==========================================================================
// SOLO / AI BOT EXPEDITION ENGINE
// ==========================================================================
window.switchGameMode = function(mode) {
  const multiBtn = document.getElementById("modeMultiBtn");
  const soloBtn = document.getElementById("modeSoloBtn");
  const multiSec = document.getElementById("multiplayerSection");
  const soloSec = document.getElementById("soloSection");

  if (mode === 'multi') {
    isSoloMode = false;
    multiBtn.classList.add("active");
    soloBtn.classList.remove("solo-active");
    multiSec.style.display = "block";
    soloSec.style.display = "none";
  } else {
    isSoloMode = true;
    soloBtn.classList.add("solo-active");
    multiBtn.classList.remove("active");
    soloSec.style.display = "flex";
    multiSec.style.display = "none";
    document.getElementById("soloPlayerName").focus();
  }
};

window.selectBotDifficulty = function(diff, el) {
  document.querySelectorAll("#botDifficultyPills .round-pill").forEach(p => p.classList.remove("active"));
  el.classList.add("active");
  soloDifficulty = diff;
  if (diff === 'easy') {
    soloBotName = 'Marco Polo';
    soloBotAvatar = '🧭';
  } else if (diff === 'medium') {
    soloBotName = 'Ibn Battuta';
    soloBotAvatar = '📜';
  } else {
    soloBotName = 'Ferdinand Magellan';
    soloBotAvatar = '⛵';
  }
};

window.selectSoloRounds = function(rounds, el) {
  document.querySelectorAll("#soloRoundPills .round-pill").forEach(p => p.classList.remove("active"));
  el.classList.add("active");
  currentTotalRounds = rounds;
};

window.syncSoloName = function(val) {
  playerName = val;
};

window.startSoloGame = function() {
  playerName = document.getElementById("soloPlayerName").value.trim() || "Explorer";
  roomId = "SOLO-" + Math.random().toString(36).substring(2, 6).toUpperCase();
  isSoloMode = true;
  gameStarted = true;
  currentRoundNum = 1;

  players = [
    { name: playerName, points: 0, isLeader: true, turnsRemaining: currentTotalRounds * 5 },
    { name: soloBotName, points: 0, isLeader: false, turnsRemaining: currentTotalRounds * 5 }
  ];

  placesExploredHistory = [];
  lastVisitedPlace = null;
  totalDistanceTraveledKm = 0;
  visitedContinents.clear();

  showGameUI(true);
  initAtlasGlobe();

  // Hide multiplayer-specific elements
  document.getElementById("btnCopyCode").style.display = "none";

  // Player starts first
  startSoloTurn(true, null);
};

function startSoloTurn(isPlayerTurn, lastLetter) {
  yourTurn = isPlayerTurn;
  lastLetterGlobal = lastLetter;

  if (isPlayerTurn) {
    turnStartTime = Date.now();
    sound.playTurn();

    inputField.disabled = false;
    inputField.style.display = "block";
    inputField.value = "";
    inputField.focus();

    const playCard = document.getElementById("activePlayCard");
    if (playCard) playCard.classList.add("is-your-turn");

    const turnBadge = document.getElementById("turnBadge");
    if (turnBadge) {
      turnBadge.className = "turn-badge your-turn";
      document.getElementById("turnStatusText").innerText = "🎯 YOUR TURN!";
    }

    const targetTile = document.getElementById("targetLetterTile");
    const targetInstr = document.getElementById("targetInstruction");
    const targetLabel = document.getElementById("targetLetterLabel");

    if (lastLetter) {
      targetTile.innerText = lastLetter.toUpperCase();
      targetTile.classList.remove("any-letter");
      targetInstr.innerText = `Must start with "${lastLetter.toUpperCase()}"`;
      targetLabel.innerText = "Required Starting Letter";
    } else {
      targetTile.innerText = "★";
      targetTile.classList.add("any-letter");
      targetInstr.innerText = "Free Choice - Name Any Place!";
      targetLabel.innerText = "Round Opening Move";
    }

    document.getElementById("turnInfo").dataset.lastLetter = lastLetter || "";

    // Timer
    let timeLeft = 20;
    const timerBar = document.getElementById("timerBar");
    const timerClock = document.getElementById("timerClock");
    const timeLabel = document.getElementById("turnTimeLabel");

    if (timerBar) { timerBar.style.width = "100%"; timerBar.className = "timer-bar"; }
    if (timerClock) { timerClock.innerText = "20s"; timerClock.classList.remove("urgent"); }

    if (countdownInterval) clearInterval(countdownInterval);
    countdownInterval = setInterval(() => {
      timeLeft--;
      const percentage = Math.max(0, (timeLeft / 20) * 100);

      if (timerBar) {
        timerBar.style.width = `${percentage}%`;
        if (timeLeft <= 5) timerBar.className = "timer-bar critical";
        else if (timeLeft <= 10) timerBar.className = "timer-bar warning";
      }

      if (timerClock) {
        timerClock.innerText = `${timeLeft}s`;
        if (timeLeft <= 5) { timerClock.classList.add("urgent"); sound.playTick(true); }
        else if (timeLeft <= 10) sound.playTick(false);
      }

      if (timeLabel) timeLabel.innerText = `${timeLeft}s remaining`;

      if (timeLeft <= 0) {
        clearInterval(countdownInterval);
        yourTurn = false;
        showMessage("Time's up! The bot claims this round.", "error");
        handleSoloGameOver(soloBotName);
      }
    }, 1000);

  } else {
    // Bot's Turn
    if (countdownInterval) clearInterval(countdownInterval);

    const playCard = document.getElementById("activePlayCard");
    if (playCard) playCard.classList.remove("is-your-turn");

    const turnBadge = document.getElementById("turnBadge");
    if (turnBadge) {
      turnBadge.className = "turn-badge other-turn";
      document.getElementById("turnStatusText").innerText = `🤖 ${soloBotName} is searching the atlas...`;
    }

    const timerClock = document.getElementById("timerClock");
    if (timerClock) timerClock.innerText = "--";

    triggerSoloBotTurn();
  }
}

function handleSoloPlayerSubmit(place, timeTaken) {
  if (countdownInterval) clearInterval(countdownInterval);

  // Scoring
  const timeRemaining = Math.max(0, 20 - timeTaken);
  let points = timeRemaining >= 15 ? 200 - (20 - timeRemaining) * 5 : Math.max(20, 140 - (14 - timeRemaining) * 10);
  if (currentStreak >= 2) points += 50; // Streak bonus!

  players[0].points += Math.floor(points);
  players[0].turnsRemaining--;

  recordExploredPlace(playerName, place);

  const lastChar = place[place.length - 1].toLowerCase();

  // Hand turn to bot
  startSoloTurn(false, lastChar);
}

function triggerSoloBotTurn() {
  const delays = { easy: 5000 + Math.random() * 2500, medium: 3500 + Math.random() * 2000, hard: 1800 + Math.random() * 1200 };
  const delay = delays[soloDifficulty] || 3500;

  soloTurnTimeout = setTimeout(() => {
    const required = lastLetterGlobal ? lastLetterGlobal.toLowerCase() : null;
    const usedSet = new Set(placesExploredHistory.map(p => p.toLowerCase()));

    const candidates = validPlaces.filter(p => {
      const low = p.toLowerCase();
      if (usedSet.has(low)) return false;
      if (required && low[0] !== required) return false;
      return true;
    });

    if (candidates.length === 0) {
      // Bot is stuck, player wins!
      handleSoloGameOver(playerName);
      return;
    }

    // Bot picks a word
    const chosen = candidates[Math.floor(Math.random() * candidates.length)];
    const botPoints = Math.floor(120 + Math.random() * 60);

    players[1].points += botPoints;
    players[1].turnsRemaining--;

    recordExploredPlace(soloBotName, chosen);

    const nextChar = chosen[chosen.length - 1].toLowerCase();

    // Check if turns exhausted
    if (players[0].turnsRemaining <= 0 && players[1].turnsRemaining <= 0) {
      const winner = players[0].points >= players[1].points ? players[0] : players[1];
      handleSoloGameOver(winner.name);
      return;
    }

    // Hand turn back to player
    startSoloTurn(true, nextChar);
  }, delay);
}

function recordExploredPlace(author, place) {
  // Update flight distance & globe
  if (lastVisitedPlace) {
    const c1 = getCoordinatesForPlace(lastVisitedPlace);
    const c2 = getCoordinatesForPlace(place);
    const dist = calculateDistanceKm(c1, c2);
    totalDistanceTraveledKm += dist;

    if (atlasGlobeInstance) {
      atlasGlobeInstance.addFlightArc(lastVisitedPlace, place);
    }
  } else {
    if (atlasGlobeInstance) atlasGlobeInstance.addInitialPin(place);
  }
  lastVisitedPlace = place;

  // Track continents
  const cont = getContinentForPlace(place);
  if (cont) visitedContinents.add(cont);

  placesExploredHistory.push(place);

  // Update history UI
  const fullHistory = placesExploredHistory.map((p, idx) => {
    const isBot = (idx % 2 === 1 && isSoloMode);
    const name = isBot ? soloBotName : playerName;
    return `${name}: ${p}`;
  });
  updateHistory(fullHistory);
  updatePlayersList(players);

  // Update image & trivia
  updateLocationSpotlight(place);
}

function handleSoloGameOver(winnerName) {
  if (countdownInterval) clearInterval(countdownInterval);
  if (soloTurnTimeout) clearTimeout(soloTurnTimeout);

  const winner = players.find(p => p.name === winnerName) || { name: winnerName, points: 0 };
  triggerGameOverCelebration(winner);
}

// ==========================================================================
// LOCATION SPOTLIGHT & TRIVIA PRESENTER
// ==========================================================================
async function updateLocationSpotlight(place) {
  const placeholder = document.getElementById("spotlightPlaceholder");
  const badge = document.getElementById("spotlightBadge");
  const title = document.getElementById("spotlightPlaceTitle");
  const catBadge = document.getElementById("spotlightCategory");
  const flagEl = document.getElementById("spotlightFlag");
  const triviaBox = document.getElementById("spotlightTrivia");
  const triviaText = document.getElementById("triviaText");

  if (title) title.innerText = place;
  if (flagEl) flagEl.innerText = getFlagForPlace(place);

  if (catBadge) {
    catBadge.style.display = "inline-block";
    catBadge.innerText = getPlaceCategory(place);
  }

  // Display Fun Geographic Trivia Fact
  if (triviaBox && triviaText) {
    triviaText.innerText = getTriviaForPlace(place);
    triviaBox.style.display = "flex";
  }

  const imageUrl = await fetchPlaceImage(place);
  if (imageUrl) {
    countryImage.src = imageUrl;
    countryImage.style.display = "block";
    if (placeholder) placeholder.style.display = "none";
    if (badge) {
      badge.innerText = `${getFlagForPlace(place)} ${place}`;
      badge.style.display = "block";
    }
  } else {
    countryImage.style.display = "none";
    if (placeholder) {
      placeholder.style.display = "flex";
      placeholder.innerHTML = `
        <div class="placeholder-globe">${getFlagForPlace(place)}</div>
        <div style="font-size: 1.25rem; font-weight: 800; color: #fff;">${escapeHtml(place)}</div>
        <div style="font-size: 0.84rem; color: var(--primary-light);">${getPlaceCategory(place)}</div>
      `;
    }
  }
}

// ==========================================================================
// LOBBY & NAVIGATION CONTROLS
// ==========================================================================
window.switchLobbyTab = function(tab) {
  const createBtn = document.getElementById("tabCreateBtn");
  const joinBtn = document.getElementById("tabJoinBtn");
  const createSec = document.getElementById("createTabContent");
  const joinSec = document.getElementById("joinTabContent");

  if (tab === 'create') {
    createBtn.classList.add("active");
    joinBtn.classList.remove("active");
    createSec.style.display = "flex";
    joinSec.style.display = "none";
    document.getElementById("playerName").focus();
  } else {
    joinBtn.classList.add("active");
    createBtn.classList.remove("active");
    joinSec.style.display = "flex";
    createSec.style.display = "none";
    document.getElementById("joinPlayerName").focus();
  }
};

window.selectQuickRounds = function(rounds, el) {
  document.querySelectorAll("#roundPills .round-pill").forEach(p => p.classList.remove("active"));
  el.classList.add("active");
  const select = document.getElementById("roundsSelect");
  if (select) select.value = String(rounds);
};

window.selectAvatar = function(avatar, el) {
  document.querySelectorAll("#avatarPicker .round-pill").forEach(p => p.classList.remove("active"));
  el.classList.add("active");
  selectedAvatar = avatar;
};

window.syncJoinName = function(val) {
  document.getElementById("playerName").value = val;
};

window.copyRoomCode = function() {
  if (!roomId) return;
  navigator.clipboard.writeText(roomId).then(() => {
    const copyLabel = document.getElementById("copyLabel");
    if (copyLabel) {
      const orig = copyLabel.innerText;
      copyLabel.innerText = "Copied! ✨";
      setTimeout(() => copyLabel.innerText = orig, 1800);
    }
  }).catch(() => {
    showMessage(`Room code is: ${roomId}`, "info");
  });
};

window.openRulesModal = function() {
  document.getElementById("rulesModal").classList.add("show");
};

window.closeRulesModal = function() {
  document.getElementById("rulesModal").classList.remove("show");
};

function updateInputHint(text, isError = false) {
  const hint = document.getElementById("inputHint");
  if (!hint) return;
  if (!text) {
    hint.style.display = "none";
    hint.innerText = "";
  } else {
    hint.style.display = "block";
    hint.innerText = text;
    hint.style.color = isError ? "var(--accent-rose)" : "var(--accent-emerald)";
  }
}

// ==========================================================================
// UI STATE MANAGEMENT
// ==========================================================================
function resetUI(preGame = false) {
  yourTurn = false;
  gameStarted = false;
  currentTurn = 0;
  lastLetterGlobal = null;
  countryImage.style.display = "none";
  countryImage.src = "";

  document.getElementById("game").style.display = preGame ? "block" : "none";
  document.getElementById("lobby").style.display = preGame ? (isLeader ? "none" : "block") : "block";

  document.getElementById("history").innerHTML = "";
  showMessage("");
  document.getElementById("turnInfo").innerText = "";
  inputField.style.display = "none";
  inputField.disabled = false;
  document.querySelector(".buttons").style.display = "none";

  if (startGameBtn) {
    startGameBtn.style.display = isLeader && preGame ? "inline-flex" : "none";
  }

  updatePlayersList(players);
}

function showGameUI(leader) {
  isLeader = leader;
  document.getElementById("lobby").style.display = "none";
  document.getElementById("game").style.display = "block";
  document.getElementById("roomTitle").innerText = "Room: " + roomId;

  const codeDisplay = document.getElementById("roomCodeDisplay");
  if (codeDisplay) codeDisplay.innerText = roomId;
  const inviteCodeBig = document.getElementById("inviteCodeBig");
  if (inviteCodeBig) inviteCodeBig.innerText = roomId;

  const waitingCard = document.getElementById("waitingRoomCard");
  const activePlayCard = document.getElementById("activePlayCard");
  const guestNotice = document.getElementById("guestWaitingNotice");

  if (!gameStarted) {
    if (waitingCard) waitingCard.style.display = "flex";
    if (activePlayCard) activePlayCard.style.display = "none";
    if (startGameBtn) startGameBtn.style.display = leader ? "inline-flex" : "none";
    if (guestNotice) guestNotice.style.display = leader ? "none" : "flex";
  } else {
    if (waitingCard) waitingCard.style.display = "none";
    if (activePlayCard) activePlayCard.style.display = "flex";
    inputField.style.display = "block";
    document.querySelector(".buttons").style.display = "flex";
  }

  updatePlayersList(players);
  setTimeout(initAtlasGlobe, 100);
}

function updatePlayersList(pl) {
  const list = document.getElementById("playersList");
  if (!list) return;
  list.innerHTML = "";

  const sorted = [...pl].sort((a, b) => b.points - a.points || b.isLeader - a.isLeader);

  const countBadge = document.getElementById("playerCountBadge");
  if (countBadge) countBadge.innerText = `${pl.length} Explorer${pl.length === 1 ? '' : 's'}`;

  const medals = ['🥇', '🥈', '🥉'];

  sorted.forEach((p, index) => {
    const li = document.createElement("li");
    li.className = "player-card";

    const isActivePlayer = (pl[currentTurn] && pl[currentTurn].name === p.name && gameStarted);
    if (isActivePlayer) li.classList.add("active-turn");

    const rankDisplay = medals[index] || `#${index + 1}`;
    const avatar = p.name === soloBotName ? soloBotAvatar : (p.name === playerName ? selectedAvatar : '🧭');

    li.innerHTML = `
      <div class="player-left">
        <div class="player-rank">${rankDisplay}</div>
        <div class="player-avatar">${avatar}</div>
        <div class="player-info">
          <div class="player-name">
            ${escapeHtml(p.name)}
            ${p.isLeader ? '<span class="host-crown" title="Host">👑</span>' : ''}
            ${p.name === playerName ? '<span style="font-size: 0.72rem; color: var(--primary-light);">(You)</span>' : ''}
          </div>
          <div class="player-subtext">${p.turnsRemaining !== undefined ? `${p.turnsRemaining} turns left` : 'Active'}</div>
        </div>
      </div>
      <div class="player-points">
        ${p.points}
        <span class="pts-label">POINTS</span>
      </div>
    `;
    list.appendChild(li);
  });
}

function updateHistory(historyList) {
  const list = document.getElementById("history");
  if (!list) return;
  list.innerHTML = "";

  const countBadge = document.getElementById("chainCountBadge");
  if (countBadge) countBadge.innerText = `${historyList.length} Place${historyList.length === 1 ? '' : 's'}`;

  historyList.slice(-25).forEach(h => {
    const splitIndex = h.indexOf(":");
    let author = "";
    let place = h;
    if (splitIndex !== -1) {
      author = h.substring(0, splitIndex).trim();
      place = h.substring(splitIndex + 1).trim();
    }

    const firstLetter = place[0] || '';
    const lastLetter = place.length > 1 ? place[place.length - 1] : '';
    const midString = place.length > 2 ? place.slice(1, -1) : '';

    const category = getPlaceCategory(place);
    const flag = getFlagForPlace(place);

    const li = document.createElement("li");
    li.className = "history-item";
    li.innerHTML = `
      <div class="history-meta">
        <span class="history-author">👤 ${escapeHtml(author)}</span>
        <span class="history-category">${category}</span>
      </div>
      <div class="history-place">
        <span class="history-flag">${flag}</span>
        <span>
          <span class="letter-highlight">${escapeHtml(firstLetter)}</span>${escapeHtml(midString)}${lastLetter ? `<span class="letter-end">${escapeHtml(lastLetter)}</span>` : ''}
        </span>
      </div>
    `;
    list.appendChild(li);
  });

  list.scrollTop = 0;
}

function showMessage(msg, type = "info") {
  const msgEl = document.getElementById("message");
  if (!msgEl) return;
  if (!msg) {
    msgEl.classList.remove("show", "error", "info");
    msgEl.innerText = "";
  } else {
    msgEl.innerText = msg;
    msgEl.className = `message show ${type}`;
  }
}

function escapeHtml(str) {
  if (!str) return '';
  return String(str)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');
}

// ==========================================================================
// CONFETTI CELEBRATION & EXPEDITION PASSPORT
// ==========================================================================
function triggerConfetti() {
  const canvas = document.getElementById("confettiCanvas");
  if (!canvas) return;
  const ctx = canvas.getContext("2d");
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;

  const particles = [];
  const colors = ['#38bdf8', '#10b981', '#fbbf24', '#f43f5e', '#a855f7', '#ffffff'];

  for (let i = 0; i < 90; i++) {
    particles.push({
      x: canvas.width * 0.5,
      y: canvas.height * 0.45,
      r: Math.random() * 6 + 3,
      d: Math.random() * 60 + 20,
      color: colors[Math.floor(Math.random() * colors.length)],
      tilt: Math.floor(Math.random() * 10) - 10,
      tiltAngleIncremental: Math.random() * 0.07 + 0.05,
      tiltAngle: 0,
      vx: (Math.random() - 0.5) * 16,
      vy: (Math.random() - 0.7) * 18,
      gravity: 0.35,
      opacity: 1
    });
  }

  function render() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    let activeCount = 0;

    particles.forEach(p => {
      p.tiltAngle += p.tiltAngleIncremental;
      p.y += (Math.cos(p.d) + 1 + p.r / 2) / 2 + p.vy;
      p.x += Math.sin(p.d) + p.vx;
      p.vy += p.gravity;
      p.opacity -= 0.007;

      if (p.opacity > 0) {
        activeCount++;
        ctx.beginPath();
        ctx.lineWidth = p.r;
        ctx.strokeStyle = p.color;
        ctx.globalAlpha = Math.max(0, p.opacity);
        ctx.moveTo(p.x + p.tilt + p.r / 2, p.y);
        ctx.lineTo(p.x + p.tilt, p.y + p.tilt + p.r / 2);
        ctx.stroke();
      }
    });

    ctx.globalAlpha = 1;

    if (activeCount > 0) requestAnimationFrame(render);
    else ctx.clearRect(0, 0, canvas.width, canvas.height);
  }

  render();
}

function triggerGameOverCelebration(winner) {
  sound.playFanfare();
  triggerConfetti();

  const winnerModal = document.getElementById("winnerModal");
  const winnerNameEl = document.getElementById("winnerName");
  const winnerSubtext = document.getElementById("winnerSubtext");

  if (winner.name === "No one") {
    winnerNameEl.innerHTML = `No Winner This Time!`;
    if (winnerSubtext) winnerSubtext.innerText = `All players exhausted their turns.`;
  } else {
    winnerNameEl.innerHTML = `<span class="winner-highlight">${escapeHtml(winner.name)}</span> Wins!`;
    if (winnerSubtext) winnerSubtext.innerHTML = `Conquered the world with <span class="winner-points">${winner.points}</span> total points! 🌍`;
  }

  // Populate Expedition Passport Stats
  const distEl = document.getElementById("passportDistance");
  if (distEl) distEl.innerText = `${totalDistanceTraveledKm.toLocaleString()} km`;

  const contEl = document.getElementById("passportContinents");
  if (contEl) contEl.innerText = `${visitedContinents.size} / 7`;

  const speedEl = document.getElementById("passportSpeed");
  if (speedEl) speedEl.innerText = fastestMoveSeconds !== Infinity ? `${fastestMoveSeconds.toFixed(1)}s` : `--`;

  const badgesRow = document.getElementById("passportBadges");
  if (badgesRow) {
    badgesRow.innerHTML = "";
    const badges = [];
    if (fastestMoveSeconds <= 4.5) badges.push({ icon: '⚡', title: 'Speed Demon' });
    if (visitedContinents.size >= 3) badges.push({ icon: '🧭', title: 'Globetrotter' });
    if (totalDistanceTraveledKm >= 15000) badges.push({ icon: '✈️', title: 'World Voyager' });
    if (winner.name === playerName) badges.push({ icon: '👑', title: 'Atlas Grandmaster' });

    if (badges.length === 0) badges.push({ icon: '🗺️', title: 'Daring Adventurer' });

    badges.forEach(b => {
      const chip = document.createElement("span");
      chip.className = "passport-badge-chip";
      chip.innerHTML = `<span>${b.icon}</span> <span>${b.title}</span>`;
      badgesRow.appendChild(chip);
    });
  }

  winnerModal.classList.add("show");

  if (countdownInterval) clearInterval(countdownInterval);
  inputField.style.display = "none";
  document.querySelector(".buttons").style.display = "none";
}

// ==========================================================================
// INITIALIZATION & SOCKET EVENT LISTENERS
// ==========================================================================
document.addEventListener("DOMContentLoaded", () => {
  initializeUI();
  updateAudioIcon();
  initAtlasGlobe();

  // Enter Key Handler
  if (inputField) {
    inputField.addEventListener("keydown", (e) => {
      if (e.key === "Enter") {
        e.preventDefault();
        window.submitCountry();
      }
    });

    inputField.addEventListener("input", () => {
      const val = inputField.value.trim();
      const lastLetter = document.getElementById("turnInfo").dataset.lastLetter;

      if (!val) {
        inputField.classList.remove("valid-match", "invalid-match");
        updateInputHint("");
        return;
      }

      if (lastLetter) {
        if (val[0].toLowerCase() !== lastLetter.toLowerCase()) {
          inputField.classList.add("invalid-match");
          inputField.classList.remove("valid-match");
          updateInputHint(`⚠️ Must start with letter "${lastLetter.toUpperCase()}"`, true);
        } else {
          inputField.classList.remove("invalid-match");
          inputField.classList.add("valid-match");
          updateInputHint(`✓ Starts with "${lastLetter.toUpperCase()}" - Press Enter ↵ to submit!`, false);
        }
      }
    });
  }

  const roomIdIn = document.getElementById("roomIdInput");
  if (roomIdIn) {
    roomIdIn.addEventListener("input", () => {
      roomIdIn.value = roomIdIn.value.toUpperCase();
    });
    roomIdIn.addEventListener("keydown", (e) => {
      if (e.key === "Enter") {
        e.preventDefault();
        window.joinRoom();
      }
    });
  }

  const playerNameIn = document.getElementById("playerName");
  if (playerNameIn) {
    playerNameIn.addEventListener("keydown", (e) => {
      if (e.key === "Enter") {
        e.preventDefault();
        window.createRoom();
      }
    });
  }
});

function initializeUI() {
  window.createRoom = function createRoom() {
    isSoloMode = false;
    playerName = document.getElementById("playerName").value.trim();
    const rounds = parseInt(document.getElementById("roundsSelect").value) || 3;
    if (!playerName) {
      alert("Please enter your name!");
      document.getElementById("playerName").focus();
      return;
    }
    currentTotalRounds = rounds;
    socket.emit("createRoom", { playerName, rounds });
  };

  window.joinRoom = function joinRoom() {
    isSoloMode = false;
    playerName = document.getElementById("playerName").value.trim() || document.getElementById("joinPlayerName").value.trim();
    roomId = document.getElementById("roomIdInput").value.trim().toUpperCase();
    if (!playerName) {
      alert("Please enter your name!");
      return;
    }
    if (!roomId) {
      alert("Please enter a Room ID!");
      return;
    }
    socket.emit("joinRoom", { playerName, roomId });
    showGameUI(false);
  };

  window.startGame = function startGame() {
    if (isSoloMode) return;
    if (!isLeader || !roomId) return;
    sound.playSuccess();
    socket.emit("startGame", roomId);
    if (startGameBtn) startGameBtn.style.display = "none";
    gameStarted = true;

    const waitingCard = document.getElementById("waitingRoomCard");
    const activePlayCard = document.getElementById("activePlayCard");
    if (waitingCard) waitingCard.style.display = "none";
    if (activePlayCard) activePlayCard.style.display = "flex";

    inputField.style.display = "block";
    document.querySelector(".buttons").style.display = "flex";
  };

  // MULTIPLAYER SOCKET EVENT HANDLERS
  socket.on("connect", () => {
    mySocketId = socket.id;
    const statusEl = document.getElementById("connectionStatus");
    if (statusEl) statusEl.innerText = "Online";
    const dot = document.querySelector(".badge-status .status-dot");
    if (dot) dot.style.background = "var(--accent-emerald)";
  });

  socket.on("disconnect", () => {
    const statusEl = document.getElementById("connectionStatus");
    if (statusEl) statusEl.innerText = "Disconnected";
    const dot = document.querySelector(".badge-status .status-dot");
    if (dot) dot.style.background = "var(--accent-rose)";
  });

  socket.on("roomCreated", (data) => {
    roomId = data.id;
    isLeader = true;
    currentTotalRounds = data.rounds || 3;
    players = [{ name: playerName, points: 0, isLeader: true, socketId: socket.id, turnsRemaining: (data.rounds || 3) * 5 }];
    showGameUI(true);
    sound.playSuccess();
  });

  socket.on("initState", ({ history, players: pl, turnIndex, lastLetter, started }) => {
    if (isSoloMode) return;
    players = pl;
    currentTurn = turnIndex;
    lastLetterGlobal = lastLetter;
    gameStarted = started;
    updatePlayersList(players);
    updateHistory(history);
    showGameUI(isLeader);

    if (gameStarted) {
      const waitingCard = document.getElementById("waitingRoomCard");
      const activePlayCard = document.getElementById("activePlayCard");
      if (waitingCard) waitingCard.style.display = "none";
      if (activePlayCard) activePlayCard.style.display = "flex";
      inputField.style.display = "block";
      document.querySelector(".buttons").style.display = "flex";
    }
  });

  socket.on("updatePlayers", (pl) => {
    if (isSoloMode) return;
    players = pl;
    updatePlayersList(players);
  });

  socket.on("updateHistory", (history) => {
    if (isSoloMode) return;
    updateHistory(history);

    // Track latest word for globe and trivia
    if (history.length > 0) {
      const lastEntry = history[history.length - 1];
      const colonIdx = lastEntry.indexOf(":");
      const place = colonIdx !== -1 ? lastEntry.substring(colonIdx + 1).trim() : lastEntry.trim();

      if (!placesExploredHistory.includes(place)) {
        placesExploredHistory.push(place);
        if (lastVisitedPlace) {
          const c1 = getCoordinatesForPlace(lastVisitedPlace);
          const c2 = getCoordinatesForPlace(place);
          totalDistanceTraveledKm += calculateDistanceKm(c1, c2);
          if (atlasGlobeInstance) atlasGlobeInstance.addFlightArc(lastVisitedPlace, place);
        } else {
          if (atlasGlobeInstance) atlasGlobeInstance.addInitialPin(place);
        }
        lastVisitedPlace = place;

        const cont = getContinentForPlace(place);
        if (cont) visitedContinents.add(cont);
      }
    }
  });

  socket.on("message", (msg) => {
    showMessage(msg, msg.includes("already") || msg.includes("Must start") || msg.includes("not exist") ? "error" : "info");
  });

  socket.on("gameStarted", () => {
    if (isSoloMode) return;
    gameStarted = true;
    sound.playSuccess();

    const waitingCard = document.getElementById("waitingRoomCard");
    const activePlayCard = document.getElementById("activePlayCard");
    if (waitingCard) waitingCard.style.display = "none";
    if (activePlayCard) activePlayCard.style.display = "flex";

    inputField.style.display = "block";
    document.querySelector(".buttons").style.display = "flex";
    if (startGameBtn) startGameBtn.style.display = "none";
  });

  // MULTIPLAYER YOUR TURN
  socket.on("yourTurn", ({ lastLetter }) => {
    if (isSoloMode) return;
    yourTurn = true;
    lastLetterGlobal = lastLetter;
    turnStartTime = Date.now();

    inputField.disabled = false;
    inputField.style.display = "block";
    inputField.value = "";
    inputField.focus();

    sound.playTurn();

    const playCard = document.getElementById("activePlayCard");
    if (playCard) playCard.classList.add("is-your-turn");

    const turnBadge = document.getElementById("turnBadge");
    if (turnBadge) {
      turnBadge.className = "turn-badge your-turn";
      document.getElementById("turnStatusText").innerText = "🎯 YOUR TURN!";
    }

    const targetTile = document.getElementById("targetLetterTile");
    const targetInstr = document.getElementById("targetInstruction");
    const targetLabel = document.getElementById("targetLetterLabel");

    if (lastLetter) {
      targetTile.innerText = lastLetter.toUpperCase();
      targetTile.classList.remove("any-letter");
      targetInstr.innerText = `Must start with "${lastLetter.toUpperCase()}"`;
      targetLabel.innerText = "Required Starting Letter";
    } else {
      targetTile.innerText = "★";
      targetTile.classList.add("any-letter");
      targetInstr.innerText = "Free Choice - Name Any Place!";
      targetLabel.innerText = "Round Opening Move";
    }

    document.getElementById("turnInfo").dataset.lastLetter = lastLetter || "";
    document.getElementById("turnInfo").innerText = lastLetter ? `Your turn! Start with "${lastLetter.toUpperCase()}"` : `Your turn!`;

    let timeLeft = 20;
    const timerBar = document.getElementById("timerBar");
    const timerClock = document.getElementById("timerClock");
    const timeLabel = document.getElementById("turnTimeLabel");
    const scorePot = document.getElementById("scorePotentialText");

    if (timerBar) { timerBar.style.width = "100%"; timerBar.className = "timer-bar"; }
    if (timerClock) { timerClock.innerText = "20s"; timerClock.classList.remove("urgent"); }

    if (countdownInterval) clearInterval(countdownInterval);
    countdownInterval = setInterval(() => {
      timeLeft--;
      const percentage = Math.max(0, (timeLeft / 20) * 100);

      if (timerBar) {
        timerBar.style.width = `${percentage}%`;
        if (timeLeft <= 5) timerBar.className = "timer-bar critical";
        else if (timeLeft <= 10) timerBar.className = "timer-bar warning";
        else timerBar.className = "timer-bar";
      }

      if (timerClock) {
        timerClock.innerText = `${timeLeft}s`;
        if (timeLeft <= 5) { timerClock.classList.add("urgent"); sound.playTick(true); }
        else if (timeLeft <= 10) sound.playTick(false);
      }

      if (timeLabel) timeLabel.innerText = `${timeLeft}s remaining`;

      if (scorePot) {
        const potential = timeLeft >= 15 ? Math.floor(200 - (20 - timeLeft) * 5) : Math.floor(Math.max(0, 140 - (14 - timeLeft) * 10));
        scorePot.innerText = `⚡ Speed Bonus: ~${potential} pts`;
      }

      if (timeLeft <= 0) {
        clearInterval(countdownInterval);
        yourTurn = false;
        if (timerClock) timerClock.innerText = "0s";
        showMessage("Time's up!", "error");
      }
    }, 1000);
  });

  // MULTIPLAYER NOT YOUR TURN
  socket.on("notYourTurn", ({ playerName: currentPlayerName, lastLetter }) => {
    if (isSoloMode) return;
    yourTurn = false;
    inputField.disabled = true;

    if (countdownInterval) {
      clearInterval(countdownInterval);
      countdownInterval = null;
    }

    const playCard = document.getElementById("activePlayCard");
    if (playCard) playCard.classList.remove("is-your-turn");

    const turnBadge = document.getElementById("turnBadge");
    if (turnBadge) {
      turnBadge.className = "turn-badge other-turn";
      document.getElementById("turnStatusText").innerText = `Waiting for ${currentPlayerName || "player"}...`;
    }

    const targetTile = document.getElementById("targetLetterTile");
    const targetInstr = document.getElementById("targetInstruction");
    const targetLabel = document.getElementById("targetLetterLabel");

    if (lastLetter) {
      targetTile.innerText = lastLetter.toUpperCase();
      targetTile.classList.remove("any-letter");
      targetInstr.innerText = `${currentPlayerName} is answering with "${lastLetter.toUpperCase()}"...`;
      targetLabel.innerText = "Active Target Letter";
    } else {
      targetTile.innerText = "★";
      targetTile.classList.add("any-letter");
      targetInstr.innerText = `${currentPlayerName} has free choice...`;
      targetLabel.innerText = "Round Opening Move";
    }

    const timerClock = document.getElementById("timerClock");
    if (timerClock) { timerClock.innerText = "--"; timerClock.classList.remove("urgent"); }

    const timerBar = document.getElementById("timerBar");
    if (timerBar) timerBar.style.width = "100%";

    const timeLabel = document.getElementById("turnTimeLabel");
    if (timeLabel) timeLabel.innerText = "Opponent thinking...";

    document.getElementById("turnInfo").innerText = lastLetter
      ? `Waiting for ${currentPlayerName} (starts with "${lastLetter.toUpperCase()}")...`
      : `Waiting for ${currentPlayerName}...`;
  });

  // MULTIPLAYER GAME OVER
  socket.on("gameOver", (winner) => {
    if (isSoloMode) return;
    triggerGameOverCelebration(winner);
  });

  // MULTIPLAYER UPDATE IMAGE
  socket.on("updateImage", async (place) => {
    if (isSoloMode) return;
    updateLocationSpotlight(place);
  });

  // MULTIPLAYER RESET GAME
  socket.on("resetGame", () => {
    if (isSoloMode) return;
    updatePlayersList(players);
    document.getElementById("lobby").style.display = isLeader ? "none" : "block";
    document.getElementById("game").style.display = "block";
    if (startGameBtn) startGameBtn.style.display = isLeader ? "inline-flex" : "none";
    yourTurn = false;
    gameStarted = false;
    currentTurn = 0;
    lastLetterGlobal = null;
    countryImage.style.display = "none";
    countryImage.src = "";
    document.getElementById("history").innerHTML = "";
    showMessage("");
    document.getElementById("turnInfo").innerText = "";
    inputField.style.display = "none";
    inputField.disabled = false;
    document.querySelector(".buttons").style.display = "none";
    if (countdownInterval) clearInterval(countdownInterval);
  });
}