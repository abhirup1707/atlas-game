// Atlas Geography Engine - Coordinates, Flags, Trivia & Continent Data
// ==========================================================================

const GEO_COORDS = {
  // Countries / Centers
  'france': [46.6033, 1.8883], 'spain': [40.4637, -3.7492], 'germany': [51.1657, 10.4515],
  'italy': [41.8719, 12.5674], 'united kingdom': [55.3781, -3.4360], 'uk': [55.3781, -3.4360],
  'england': [52.3555, -1.1743], 'scotland': [56.4907, -4.2026], 'wales': [52.1307, -3.7837],
  'united states': [37.0902, -95.7129], 'usa': [37.0902, -95.7129], 'america': [37.0902, -95.7129],
  'canada': [56.1304, -106.3468], 'brazil': [-14.2350, -51.9253], 'argentina': [-38.4161, -63.6167],
  'japan': [36.2048, 138.2529], 'china': [35.8617, 104.1954], 'india': [20.5937, 78.9629],
  'australia': [-25.2744, 133.7751], 'russia': [61.5240, 105.3188], 'egypt': [26.8206, 30.8025],
  'south africa': [-30.5595, 22.9375], 'mexico': [23.6345, -102.5528], 'indonesia': [-0.7893, 113.9213],
  'turkey': [38.9637, 35.2433], 'saudi arabia': [23.8859, 45.0792], 'norway': [60.4720, 8.4689],
  'sweden': [60.1282, 18.6435], 'switzerland': [46.8182, 8.2275], 'greece': [39.0742, 21.8243],
  'portugal': [39.3999, -8.2245], 'netherlands': [52.1326, 5.2913], 'new zealand': [-40.9006, 174.8860],
  'thailand': [15.8700, 100.9925], 'vietnam': [14.0583, 108.2772], 'kenya': [-0.0236, 37.9062],
  'peru': [-9.1899, -75.0152], 'chile': [-35.6751, -71.5430], 'colombia': [4.5709, -74.2973],
  'nigeria': [9.0820, 8.6753], 'morocco': [31.7917, -7.0926], 'singapore': [1.3521, 103.8198],
  'south korea': [35.9078, 127.7669], 'korea': [35.9078, 127.7669], 'north korea': [40.3399, 127.5101],
  'iceland': [64.9631, -19.0208], 'philippines': [12.8797, 121.7740], 'malaysia': [4.2105, 101.9758],
  'pakistan': [30.3753, 69.3451], 'bangladesh': [23.6850, 90.3563], 'nepal': [28.3949, 84.1240],
  'sri lanka': [7.8731, 80.7718], 'bhutan': [27.5142, 90.4336], 'myanmar': [21.9162, 95.9560],
  'afghanistan': [33.9391, 67.7100], 'iran': [32.4279, 53.6880], 'iraq': [33.2232, 43.6793],
  'israel': [31.0461, 34.8516], 'jordan': [30.5852, 36.2384], 'lebanon': [33.8547, 35.8623],
  'syria': [34.8021, 38.9968], 'united arab emirates': [23.4241, 53.8478], 'uae': [23.4241, 53.8478],
  'qatar': [25.3548, 51.1839], 'kuwait': [29.3117, 47.4818], 'oman': [21.4735, 55.9754],
  'yemen': [15.5527, 48.5164], 'bahrain': [26.0667, 50.5577], 'algeria': [28.0339, 1.6596],
  'tunisia': [33.8869, 9.5375], 'libya': [26.3351, 17.2283], 'sudan': [12.8628, 30.2176],
  'ethiopia': [9.1450, 40.4897], 'ghana': [7.9465, -1.0232], 'tanzania': [-6.3690, 34.8888],
  'uganda': [1.3733, 32.2903], 'zambia': [-13.1339, 27.8493], 'zimbabwe': [-19.0154, 29.1549],
  'madagascar': [-18.7669, 46.8691], 'poland': [51.9194, 19.1451], 'ukraine': [48.3794, 31.1656],
  'austria': [47.5162, 14.5501], 'belgium': [50.5039, 4.4699], 'denmark': [56.2639, 9.5018],
  'finland': [61.9241, 25.7482], 'ireland': [53.1424, -7.6921], 'czech republic': [49.8175, 15.4730],
  'czechia': [49.8175, 15.4730], 'hungary': [47.1625, 19.5033], 'romania': [45.9432, 24.9668],
  'bulgaria': [42.7339, 25.4858], 'croatia': [45.1000, 15.2000], 'serbia': [44.0165, 21.0059],
  'slovakia': [48.6690, 19.6990], 'slovenia': [46.1512, 14.9955], 'kazakhstan': [48.0196, 66.9237],
  'uzbekistan': [41.3775, 64.5853], 'mongolia': [46.8625, 103.8467], 'taiwan': [23.6978, 120.9605],
  'cuba': [21.5218, -77.7812], 'jamaica': [-18.1096, -77.2975], 'panama': [8.5379, -80.7821],
  'costa rica': [9.7489, -83.7534], 'venezuela': [6.4238, -66.5897], 'ecuador': [-1.8312, -78.1834],
  'bolivia': [-16.2902, -63.5887], 'uruguay': [-32.5228, -55.7658], 'paraguay': [-23.4425, -58.4438],
  'fiji': [-17.7134, 178.0650], 'papua new guinea': [-6.3150, 143.9555], 'greenland': [71.7069, -42.6043],
  'maldives': [3.2028, 73.2207], 'mauritius': [-20.3484, 57.5522], 'monaco': [43.7384, 7.4246],

  // Cities
  'paris': [48.8566, 2.3522], 'london': [51.5074, -0.1278], 'tokyo': [35.6762, 139.6503],
  'new york city': [40.7128, -74.0060], 'new york': [40.7128, -74.0060], 'rome': [41.9028, 12.4964],
  'berlin': [52.5200, 13.4050], 'madrid': [40.4168, -3.7038], 'amsterdam': [52.3676, 4.9041],
  'sydney': [-33.8688, 151.2093], 'cairo': [30.0444, 31.2357], 'dubai': [25.2048, 55.2708],
  'bangkok': [13.7563, 100.5018], 'seoul': [37.5665, 126.9780], 'los angeles': [34.0522, -118.2437],
  'istanbul': [41.0082, 28.9784], 'rio de janeiro': [-22.9068, -43.1729], 'são paulo': [-23.5505, -46.6333],
  'toronto': [43.6532, -79.3832], 'vancouver': [49.2827, -123.1207], 'moscow': [55.7558, 37.6173],
  'beijing': [39.9042, 116.4074], 'shanghai': [31.2304, 121.4737], 'buenos aires': [-34.6037, -58.3816],
  'mexico city': [19.4326, -99.1332], 'athens': [37.9838, 23.7275], 'vienna': [48.2082, 16.3738],
  'prague': [50.0755, 14.4378], 'delhi': [28.6139, 77.2090], 'new delhi': [28.6139, 77.2090],
  'mumbai': [19.0760, 72.8777], 'kolkata': [22.5726, 88.3639], 'bengaluru': [12.9716, 77.5946],
  'chennai': [13.0827, 80.2707], 'hyderabad': [17.3850, 78.4867], 'jaipur': [26.9124, 75.7873],
  'alipurduar': [26.4916, 89.5271], 'alipur duar': [26.4916, 89.5271],

  // Seas & Oceans
  'andaman sea': [10.5000, 95.0000], 'red sea': [20.2802, 38.5126], 'arabian sea': [15.0000, 65.0000],
  'mediterranean sea': [35.0000, 18.0000], 'black sea': [44.0000, 35.0000], 'caspian sea': [41.5000, 51.0000],
  'caribbean sea': [15.0000, -75.0000], 'baltic sea': [58.0000, 20.0000], 'north sea': [56.0000, 3.0000],
  'south china sea': [12.0000, 113.0000], 'east china sea': [29.0000, 125.0000], 'sea of japan': [40.0000, 135.0000],
  'pacific ocean': [0.0, -160.0], 'atlantic ocean': [0.0, -30.0], 'indian ocean': [-20.0, 80.0], 'arctic ocean': [85.0, 0.0],

  // Continents
  'africa': [1.6508, 17.6875], 'asia': [34.0479, 100.6197], 'europe': [54.5260, 15.2551],
  'north america': [54.5260, -105.2551], 'south america': [-8.7832, -55.4915], 'oceania': [-22.7359, 140.0188],
  'antarctica': [-82.8628, 135.0000],

  // Mountains & Rivers
  'himalayas': [27.9881, 86.9250], 'ganges': [25.3176, 82.9739], 'yamuna': [27.1767, 78.0081],
  'thar desert': [27.0238, 71.7228], 'dal lake': [34.1135, 74.8711], 'hawaii': [19.8968, -155.5828]
};

// Continent assignments for passport stats
const GEO_CONTINENTS = {
  // Asia
  'india': 'Asia', 'japan': 'Asia', 'china': 'Asia', 'thailand': 'Asia', 'singapore': 'Asia',
  'vietnam': 'Asia', 'south korea': 'Asia', 'indonesia': 'Asia', 'malaysia': 'Asia', 'philippines': 'Asia',
  'saudi arabia': 'Asia', 'united arab emirates': 'Asia', 'turkey': 'Asia', 'russia': 'Asia',
  'nepal': 'Asia', 'pakistan': 'Asia', 'bangladesh': 'Asia', 'sri lanka': 'Asia', 'israel': 'Asia',
  'tokyo': 'Asia', 'delhi': 'Asia', 'beijing': 'Asia', 'dubai': 'Asia', 'seoul': 'Asia', 'bangkok': 'Asia',
  'alipurduar': 'Asia', 'alipur duar': 'Asia', 'andaman sea': 'Asia', 'asia': 'Asia',
  // Europe
  'france': 'Europe', 'germany': 'Europe', 'italy': 'Europe', 'spain': 'Europe', 'united kingdom': 'Europe',
  'switzerland': 'Europe', 'netherlands': 'Europe', 'sweden': 'Europe', 'norway': 'Europe', 'greece': 'Europe',
  'portugal': 'Europe', 'austria': 'Europe', 'ireland': 'Europe', 'iceland': 'Europe', 'poland': 'Europe',
  'paris': 'Europe', 'london': 'Europe', 'rome': 'Europe', 'madrid': 'Europe', 'berlin': 'Europe', 'amsterdam': 'Europe',
  'europe': 'Europe',
  // North America
  'united states': 'North America', 'canada': 'North America', 'mexico': 'North America', 'cuba': 'North America',
  'jamaica': 'North America', 'panama': 'North America', 'costa rica': 'North America',
  'new york': 'North America', 'new york city': 'North America', 'los angeles': 'North America', 'toronto': 'North America',
  'north america': 'North America',
  // South America
  'brazil': 'South America', 'argentina': 'South America', 'chile': 'South America', 'colombia': 'South America',
  'peru': 'South America', 'ecuador': 'South America', 'bolivia': 'South America', 'uruguay': 'South America',
  'rio de janeiro': 'South America', 'buenos aires': 'South America', 'são paulo': 'South America', 'lima': 'South America',
  'south america': 'South America',
  // Africa
  'egypt': 'Africa', 'south africa': 'Africa', 'nigeria': 'Africa', 'kenya': 'Africa', 'morocco': 'Africa',
  'ghana': 'Africa', 'ethiopia': 'Africa', 'madagascar': 'Africa', 'algeria': 'Africa', 'cairo': 'Africa',
  'africa': 'Africa', 'red sea': 'Africa',
  // Oceania
  'australia': 'Oceania', 'new zealand': 'Oceania', 'fiji': 'Oceania', 'samoa': 'Oceania',
  'sydney': 'Oceania', 'melbourne': 'Oceania', 'oceania': 'Oceania'
};

const GEO_TRIVIA = {
  'paris': 'Paris was originally a Celtic settlement called Lutetia around 250 BC!',
  'tokyo': 'Tokyo is the most populous metropolitan area on Earth with over 37 million residents!',
  'rome': 'Rome features over 280 fountains and more than 900 historic churches!',
  'cairo': 'The Great Pyramid of Giza near Cairo is the oldest and only surviving ancient wonder of the world!',
  'new york city': 'Over 800 languages are spoken in New York City, making it the most linguistically diverse city.',
  'sydney': 'Sydney Opera House has over 1 million ceramic roof tiles imported from Sweden.',
  'iceland': 'Iceland has no mosquitoes and gets nearly 100% of its electricity from renewable geothermal sources!',
  'japan': 'Japan consists of over 6,800 islands, with Honshu being the largest.',
  'india': 'India is home to the world’s highest cricket ground at Chail, Himachal Pradesh (2,444m).',
  'brazil': 'Brazil contains approximately 60% of the Amazon rainforest, producing 20% of Earth’s river flow.',
  'australia': 'Australia is wider than the Moon! (Australia: ~4,000 km, Moon diameter: ~3,400 km).',
  'canada': 'Canada has more lakes than all the other countries in the world combined!',
  'egypt': 'Ancient Egyptians invented bowling around 3200 BC!',
  'greece': 'Greece has thousands of islands, but only about 227 are permanently inhabited.',
  'madagascar': 'Over 90% of all plant and animal species found in Madagascar are found nowhere else on Earth.',
  'himalayas': 'The Himalayas continue to grow about 5 mm taller every year due to tectonic pressure.',
  'ganges': 'The Ganges River basin is the most populated river basin in the world with over 400 million residents.',
  'thar desert': 'The Thar Desert is the most densely populated desert in the world (83 people per km²).',
  'russia': 'Russia spans 11 time zones and covers more surface area than Pluto!',
  'singapore': 'Singapore is one of only three surviving sovereign city-states in the world.',
  'andaman sea': 'The Andaman Sea connects the Bay of Bengal to the Strait of Malacca, a major world shipping route.',
  'red sea': 'The Red Sea is one of the warmest and saltiest bodies of seawater in the world.',
  'africa': 'Africa is the second-largest continent, home to the Nile River and the Sahara Desert.',
  'asia': 'Asia is Earth’s largest continent, spanning 30% of total land area and 60% of human population.'
};

const CATEGORY_TRIVIA = {
  'ocean': 'Oceans cover more than 70% of Earth’s surface and hold 97% of all planet water!',
  'sea': 'Seas are generally located where land and ocean meet, rich in marine ecosystems.',
  'mountain': 'Mountains are formed by tectonic movements over tens of millions of years!',
  'river': 'Rivers carve deep valleys, transfer freshwater, and support civilizations across history.',
  'desert': 'Deserts receive less than 25 cm of rainfall per year and experience extreme temperatures.'
};

function getCoordinatesForPlace(place) {
  const p = place.toLowerCase().trim();
  if (GEO_COORDS[p]) return GEO_COORDS[p];

  for (const [key, coords] of Object.entries(GEO_COORDS)) {
    if (p === key || p.includes(key) || key.includes(p)) return coords;
  }

  // Deterministic fallback latitude/longitude within landmass zones
  let hash = 0;
  for (let i = 0; i < p.length; i++) hash = (hash * 31 + p.charCodeAt(i)) & 0xffffffff;
  const lat = ((Math.abs(hash) % 100) - 40);
  const lon = ((Math.abs(hash >> 5) % 320) - 160);
  return [lat, lon];
}

function calculateDistanceKm(c1, c2) {
  if (!c1 || !c2) return 0;
  const R = 6371;
  const dLat = (c2[0] - c1[0]) * Math.PI / 180;
  const dLon = (c2[1] - c1[1]) * Math.PI / 180;
  const lat1 = c1[0] * Math.PI / 180;
  const lat2 = c2[0] * Math.PI / 180;

  const a = Math.sin(dLat / 2) * Math.sin(dLat / 2) +
            Math.sin(dLon / 2) * Math.sin(dLon / 2) * Math.cos(lat1) * Math.cos(lat2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return Math.round(R * c);
}

function getTriviaForPlace(place) {
  const p = place.toLowerCase().trim();
  if (GEO_TRIVIA[p]) return GEO_TRIVIA[p];

  for (const [key, fact] of Object.entries(GEO_TRIVIA)) {
    if (p.includes(key) || key.includes(p)) return fact;
  }

  if (p.includes('ocean')) return CATEGORY_TRIVIA['ocean'];
  if (p.includes('sea')) return CATEGORY_TRIVIA['sea'];
  if (p.includes('mountain') || p.includes('range')) return CATEGORY_TRIVIA['mountain'];
  if (p.includes('river') || p.includes('lake')) return CATEGORY_TRIVIA['river'];
  if (p.includes('desert')) return CATEGORY_TRIVIA['desert'];

  return `Explored on the Atlas expedition! Great choice chaining places across the globe.`;
}

// Clean visual icon indicator (avoids Windows 2-letter ISO country code font glitch)
function getFlagForPlace(place) {
  const p = place.toLowerCase().trim();
  if (p.includes('ocean') || p.includes('sea') || p.includes('bay')) return '🌊';
  if (p.includes('river') || p.includes('lake') || p.includes('dam')) return '🏞️';
  if (p.includes('desert') || p.includes('valley')) return '🏜️';
  if (p.includes('mountain') || p.includes('range') || p.includes('himalayas')) return '⛰️';
  if (['africa','antarctica','asia','europe','north america','oceania','south america'].includes(p)) return '🗺️';
  if (['greenland','madagascar','borneo','sumatra','sicily','honshu','hawaii','fiji','maldives','bali'].includes(p)) return '🏝️';
  return '📍';
}

function getContinentForPlace(place) {
  const p = place.toLowerCase().trim();
  if (GEO_CONTINENTS[p]) return GEO_CONTINENTS[p];
  for (const [key, cont] of Object.entries(GEO_CONTINENTS)) {
    if (p.includes(key) || key.includes(p)) return cont;
  }
  return null;
}
