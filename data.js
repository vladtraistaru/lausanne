// All content for the guide. Coordinates are from OpenStreetMap; opening hours and prices
// change, so every place carries an official link to check before you go.
const CATS = {
  sight:  { label: "Sights",       icon: "🏰", color: "#1d6fa5" },
  museum: { label: "Museums",      icon: "🎨", color: "#7b3fa0" },
  food:   { label: "Eat & drink",  icon: "🍽️", color: "#d9480f" },
  view:   { label: "Views & nature", icon: "🌅", color: "#2b8a3e" },
  trip:   { label: "Day trip",     icon: "🍇", color: "#a61e4d" },
  hub:    { label: "Transport",    icon: "🚇", color: "#495057" },
};

const PLACES = {
  palud: {
    name: "Place de la Palud & Escaliers du Marché", cat: "sight", lat: 46.52231, lng: 6.63226,
    desc: "Lausanne's oldest square, with the Fountain of Justice (1726) and the town hall. A clock-figure show plays on the hour. The covered wooden stairs next to it climb straight up to the cathedral.",
    tip: "Wednesday and Saturday mornings the Old Town fills with a farmers' market.",
    price: "Free", url: "https://www.lausanne-tourisme.ch/en/",
  },
  cathedral: {
    name: "Cathédrale Notre-Dame", cat: "sight", lat: 46.52258, lng: 6.63536,
    desc: "Switzerland's finest Gothic cathedral, consecrated in 1275. Inside, look for the painted portal and the rose window. Climb the tower for a 360° view over the lake and the Alps.",
    tip: "A night watchman still calls out the hours from the tower every night from 22:00 to 02:00 — a tradition since 1405.",
    price: "Church free · tower ≈ CHF 5", url: "https://www.cathedrale-lausanne.ch/en/",
  },
  chateau: {
    name: "Château Saint-Maire", cat: "sight", lat: 46.52479, lng: 6.63567,
    desc: "A 15th-century brick fortress that now houses the Vaud cantonal government. You can walk into the courtyard and admire the architecture from the esplanade.",
    tip: "Go through the courtyard and down to the Place de la Cathédrale for the best photo of the cathedral.",
    price: "Free (exterior)", url: "https://www.vd.ch/",
  },
  historique: {
    name: "Musée historique de Lausanne", cat: "museum", lat: 46.52221, lng: 6.63492,
    desc: "Housed in the former bishop's palace. A huge scale model of Lausanne in 1638 shows how the city grew up its three hills.",
    tip: "Short on time? Skip it and keep the afternoon for Plateforme 10.",
    price: "Cheap · free first Saturday of the month", url: "https://www.lausanne.ch/museehistorique",
  },
  montbenon: {
    name: "Esplanade de Montbenon", cat: "view", lat: 46.52006, lng: 6.62592,
    desc: "A leafy terrace above the Flon district with a wide view over the rooftops to Lake Geneva and the French mountains. Locals come for a coffee or a game of pétanque.",
    tip: "The Cinémathèque suisse is right here if you need a rainy-day break.",
    price: "Free", url: "https://www.lausanne-tourisme.ch/en/",
  },
  plateforme10: {
    name: "Plateforme 10", cat: "museum", lat: 46.51839, lng: 6.62443,
    desc: "Lausanne's art district beside the station — three museums in one: the MCBA (fine arts), mudac (design) and Photo Elysée (photography). A single ticket covers all three.",
    tip: "Open until 20:00 on Thursdays. Combined ticket ≈ CHF 15 (reduced CHF 12), valid 3 months. MCBA closes Mondays; mudac and Photo Elysée close Tuesdays.",
    price: "≈ CHF 15 for all three", url: "https://plateforme10.ch/en/information",
  },
  grutli: {
    name: "Café du Grütli", cat: "food", lat: 46.52179, lng: 6.63358,
    desc: "A Lausanne institution since 1849 on Place de la Palud, known among locals for one of the best cheese fondues in town.",
    tip: "Book ahead for dinner, or come at lunch when it's quieter.",
    price: "$$", url: "https://www.lausanne-tourisme.ch/en/guide/regional-cuisine/", food: "Fondue, Vaud classics",
  },
  besson: {
    name: "La Pinte Besson", cat: "food", lat: 46.52328, lng: 6.62960,
    desc: "The oldest restaurant in Lausanne (since 1780). Honest Vaud cooking — fondue moitié-moitié, rösti, seasonal meat and fish — with an excellent Swiss wine list.",
    tip: "Order the fondue with a glass of local Chasselas white wine.",
    price: "$$", url: "https://www.lausanne-tourisme.ch/en/guide/eat-fondue", food: "Fondue, rösti, Swiss wines",
  },
  romand: {
    name: "Café Romand", cat: "food", lat: 46.51988, lng: 6.63249,
    desc: "No-fuss, old-school Swiss café tucked off Place Saint-François, popular with locals for traditional dishes at fair prices.",
    tip: "Try the malakoff (fried Vaud cheese fritters) and the papet vaudois.",
    price: "$", url: "https://www.lausanne-tourisme.ch/en/guide/regional-cuisine/", food: "Malakoff, papet vaudois",
  },
  ouchy_cafe: {
    name: "Café du Vieil-Ouchy", cat: "food", lat: 46.50718, lng: 6.62787,
    desc: "Regional cuisine on a terrace steps from the lake, right by the old port. A good place for perch fillets (filets de perche) — the classic Lake Geneva dish.",
    tip: "Sit outside if the sun is out; it's one of the best lunch spots on the waterfront.",
    price: "$$", url: "https://www.lausanne-tourisme.ch/en/guide/regional-cuisine/", food: "Lake perch, regional cooking",
  },
  degrees57: {
    name: "57 Degree Grill — Château d'Ouchy", cat: "food", lat: 46.50667, lng: 6.62744,
    desc: "Grill restaurant inside the medieval château on the lake at Ouchy, in a five-star hotel. A scenic dinner with a view over the water.",
    tip: "Ideal for a special evening on the lakeshore.",
    price: "$$$", url: "https://www.chateaudouchy.ch/en", food: "Grill, view dinner",
  },
  forbici: {
    name: "Forbici", cat: "food", lat: 46.52093, lng: 6.62975,
    desc: "Lively Italian restaurant in the Flon district — a good choice when you want a change from fondue.",
    tip: "Flon is the city's evening neighbourhood: after dinner, stay for a drink on one of the terraces.",
    price: "$$", url: "https://www.lausanne-tourisme.ch/en/", food: "Italian, modern",
  },
  beaurivage: {
    name: "Beau-Rivage Palace (Anne-Sophie Pic)", cat: "food", lat: 46.50792, lng: 6.63040,
    desc: "The grand lakeside palace hotel, home to the Michelin-starred restaurant of chef Anne-Sophie Pic. This is the big splurge.",
    tip: "Not in the budget? Walk through the gardens and have a coffee on the terrace.",
    price: "$$$$", url: "https://www.brp.ch/en", food: "Fine dining",
  },
  ouchy: {
    name: "Ouchy waterfront & Château d'Ouchy", cat: "sight", lat: 46.50667, lng: 6.62744,
    desc: "The lakeside promenade where Lausanne comes to relax: palm trees, old paddle steamers, a medieval château-turned-hotel, and the Alps rising across the lake.",
    tip: "Evian-les-Bains on the French shore is visible straight across — boats run there from the Ouchy pier.",
    price: "Free", url: "https://www.lausanne-tourisme.ch/en/",
  },
  olympic: {
    name: "Olympic Museum", cat: "museum", lat: 46.50868, lng: 6.63406,
    desc: "Lausanne is the Olympic Capital, home to the International Olympic Committee. The museum sits in a lakeside park and covers the history of the Games with interactive screens and real equipment used by Olympians.",
    tip: "Allow 2–3 hours. The park outside, with its sculptures and lake view, is free, and so is the terrace.",
    price: "≈ CHF 20+", url: "https://olympics.com/museum/",
  },
  vidy: {
    name: "Vidy Port & Roman Museum", cat: "sight", lat: 46.51505, lng: 6.60774,
    desc: "The western end of the lakeside promenade: a marina, a beach, parkland, and the Lausanne-Vidy Roman Museum built over the ruins of Roman Lousonna.",
    tip: "The flat lakeside walk from Ouchy takes about 40 minutes. Take the m1 line back to the city.",
    price: "Museum cheap · park free", url: "https://www.lausanne.ch/roman-museum",
  },
  artbrut: {
    name: "Collection de l'Art Brut", cat: "museum", lat: 46.52731, lng: 6.62469,
    desc: "A world-famous museum of 'outsider art' — works by self-taught creators with no art background. Surprising, intense and unlike anything else.",
    tip: "A great rainy-day swap. Closed Mondays.",
    price: "≈ CHF 12", url: "https://www.artbrut.ch/en",
  },
  hermitage: {
    name: "Fondation de l'Hermitage", cat: "museum", lat: 46.52815, lng: 6.63719,
    desc: "An art museum in a 19th-century villa, set in a hillside park with a wonderful lake view. Known for big impressionist and modern exhibitions.",
    tip: "Come for the view of the lake from the garden even if you skip the exhibition.",
    price: "≈ CHF 20", url: "https://www.fondation-hermitage.ch/en/",
  },
  sauvabelin: {
    name: "Sauvabelin Tower & Lake", cat: "view", lat: 46.53525, lng: 6.63853,
    desc: "A 35 m wooden tower in the forest above the city, with a spiral staircase and a view across Lausanne, the lake and the Alps. A peaceful lake and a small animal park are right beside it.",
    tip: "Come at sunset. Take the bus to Sauvabelin.",
    price: "Free", url: "https://www.lausanne-tourisme.ch/en/",
  },
  aquatis: {
    name: "Aquatis Aquarium-Vivarium", cat: "sight", lat: 46.54086, lng: 6.65723,
    desc: "One of Europe's largest freshwater aquariums, following water from Switzerland to the Amazon. Great with kids.",
    tip: "Take the m2 metro to Croisettes, then a short walk.",
    price: "≈ CHF 30+", url: "https://www.aquatis.ch/en/",
  },
  cully: {
    name: "Cully & Lavaux vineyards", cat: "trip", lat: 46.48832, lng: 6.72968,
    desc: "The Lavaux terraced vineyards stretch for some 830 hectares east of Lausanne and have been a UNESCO World Heritage Site since 2007. Cully is the charming wine village where the walk begins.",
    tip: "Train from Lausanne takes about 15 minutes. Wear walking shoes and carry water.",
    price: "Train ticket only", url: "https://www.lavaux-unesco.ch/en/",
  },
  epesses: {
    name: "Epesses (wine village)", cat: "trip", lat: 46.49132, lng: 6.74759,
    desc: "A tiny winegrowers' village in the heart of Lavaux. Many cellars (caveaux) open their doors for tasting — try the local Chasselas, the signature white grape of the region.",
    tip: "Many caveaux only open at certain hours — check ahead or look for the 'Cave ouverte' sign.",
    price: "Tastings ≈ CHF 5–15", url: "https://www.lavaux-unesco.ch/en/",
  },
  chillon: {
    name: "Château de Chillon", cat: "trip", lat: 46.41423, lng: 6.92760,
    desc: "A fairy-tale medieval castle on a rock at the edge of Lake Geneva, Switzerland's most visited historic monument. Wander the vaults, the great halls and the ramparts.",
    tip: "Allow 1.5–2 hours. The lakeside promenade from Montreux to the castle is a lovely walk if the weather is good.",
    price: "≈ CHF 14–15", url: "https://www.chillon.ch/en",
  },
  gare: {
    name: "Lausanne train station", cat: "hub", lat: 46.51698, lng: 6.62916,
    desc: "The city's hub: fast trains to Geneva (≈ 35–40 min), Zurich, Bern and Paris. The m2 metro starts underneath, heading down to Ouchy in minutes.",
    tip: "Luggage lockers are inside the station.",
    price: "—", url: "https://www.sbb.ch/en",
  },
  ouchy_m2: {
    name: "Ouchy-Olympique (m2 metro)", cat: "hub", lat: 46.50745, lng: 6.62660,
    desc: "The lakeside terminus of the m2 metro. In just a few minutes it takes you up the steep hill to the station and the city centre.",
    tip: "Get a transport pass from your hotel — overnight guests usually get one free.",
    price: "—", url: "https://www.t-l.ch/en",
  },
};

// The 3-day plan. `place` refers to PLACES; the rest is the story for that stop.
const DAYS = [
  {
    id: 1, color: "#e8590c", title: "Old Town & Art", emoji: "🏰",
    summary: "Climb to the cathedral, wander the medieval Old Town, then dive into Plateforme 10, Lausanne's art quarter.",
    weather: "outdoor-morning",
    rain: "Spend the whole morning at Plateforme 10, then the Collection de l'Art Brut in the afternoon.",
    stops: [
      { place: "palud",        time: "09:00", dur: "45 min", text: "Start in the heart of the Old Town. Watch the town hall and the fountain, then take the covered wooden Escaliers du Marché up the hill.", travel: "Walk from the station: ≈ 15 min, or take the m2 to Flon + walk." },
      { place: "cathedral",    time: "10:00", dur: "1.5 h",  text: "Step inside the Gothic cathedral, then climb the tower for the best view of the day.", travel: "2 min walk (up the stairs)" },
      { place: "chateau",      time: "11:45", dur: "30 min", text: "Walk past the Château Saint-Maire for a view of the courtyard.", travel: "3 min walk" },
      { place: "grutli",       time: "12:45", dur: "1.25 h", text: "Time for lunch: a traditional fondue (or a lighter Vaud dish) back on Place de la Palud.", travel: "5 min walk" },
      { place: "montbenon",    time: "14:30", dur: "45 min", text: "Cross the old bridges and walk up to Montbenon for a view over the rooftops to the lake.", travel: "10 min walk" },
      { place: "plateforme10", time: "15:30", dur: "2.5 h",  text: "Three museums, one ticket: fine arts, design and photography. Pick the one that appeals to you, or sample all three.", travel: "10 min walk, or 3 stops on any train line" },
      { place: "besson",       time: "19:30", dur: "1.5 h",  text: "End the day at Lausanne's oldest restaurant with a proper fondue and a glass of Vaud wine.", travel: "m2 to Flon, then ≈ 5 min walk" },
    ],
  },
  {
    id: 2, color: "#1971c2", title: "Lake, Olympics & Waterfront", emoji: "⛵",
    summary: "Ride the m2 down to Ouchy, visit the Olympic Museum, and spend the afternoon beside Lake Geneva.",
    weather: "outdoor-afternoon",
    rain: "Spend extra time in the Olympic Museum, then see the Hermitage Foundation or Aquatis.",
    stops: [
      { place: "ouchy_m2", time: "09:30", dur: "10 min", text: "Hop on the m2 from the station — it runs down the steep hill to the lake in about 6 minutes.", travel: "m2 metro, ≈ 6 min" },
      { place: "ouchy",    time: "09:45", dur: "1 h",    text: "Walk along the lakeside promenade, past the old port and the Château d'Ouchy. Look at Evian on the opposite shore.", travel: "Short walk along the lake" },
      { place: "olympic",  time: "11:00", dur: "2.5 h",  text: "Learn the history of the Games, then relax in the sculpture park and on the terrace with the lake view.", travel: "10 min walk east along the quay" },
      { place: "ouchy_cafe", time: "13:45", dur: "1.25 h", text: "Lunch with a view: try the classic Lake Geneva perch fillets.", travel: "10 min walk" },
      { place: "vidy",     time: "15:30", dur: "2 h",    text: "A flat 40-minute lakeside walk (or short bus ride) to Vidy: marina, beach, park, and the Roman museum.", travel: "40 min walk, or bus" },
      { place: "degrees57", time: "19:30", dur: "1.5 h", text: "Finish with a dinner on the water at the Château d'Ouchy, or splurge at Beau-Rivage Palace.", travel: "m1 metro / bus back toward Ouchy" },
    ],
  },
  {
    id: 3, color: "#862e9c", title: "Lavaux Vineyards & Chillon", emoji: "🍇",
    summary: "Ride a short train out to the UNESCO vineyards, walk between wine villages, then finish at a castle on the lake.",
    weather: "outdoor-all",
    rain: "Skip the vineyard walk. Do Chillon plus a Cully caveau tasting, or swap to Sauvabelin and the Hermitage in town.",
    stops: [
      { place: "cully",   time: "09:30", dur: "1 h",    text: "Train from Lausanne to Cully (≈ 15 min). Wander the village, grab a coffee, and look at the vine terraces.", travel: "Train, ≈ 15 min" },
      { place: "epesses", time: "10:45", dur: "2.5 h",  text: "Walk the terraces between Cully and Epesses (about 45 min each way on the path through the vines). Stop for a tasting of Chasselas wine.", travel: "≈ 45 min on foot" },
      { place: "chillon", time: "14:30", dur: "2 h",    text: "Train to Montreux, then bus 201 (or the lakeside promenade) to Château de Chillon. Explore the halls, vaults and ramparts.", travel: "Train + bus, ≈ 40 min" },
      { place: "romand",  time: "19:00", dur: "1.25 h", text: "Back in Lausanne: an easy, hearty dinner at Café Romand — try the malakoff and papet vaudois.", travel: "Train to Lausanne, ≈ 25 min from Montreux" },
    ],
  },
];

// Extras that aren't in the day plans.
const EXTRA_IDS = ["artbrut", "hermitage", "sauvabelin", "aquatis", "forbici", "beaurivage", "gare"];

const DISHES = [
  { name: "Fondue moitié-moitié", en: "Half Gruyère, half Vacherin cheese fondue", note: "The national dish. Best from October to April." },
  { name: "Filets de perche", en: "Lake perch fillets", note: "Pan-fried, with fries or rice. Classic lakeside lunch." },
  { name: "Papet vaudois", en: "Leeks & potatoes with sausage", note: "Slow-cooked Vaud comfort food, served with a saucisson vaudois." },
  { name: "Malakoff", en: "Fried cheese fritters", note: "A Vaud speciality — deep-fried balls of local cheese." },
  { name: "Tarte à la raisinée", en: "Pear-juice tart", note: "A traditional Vaud dessert." },
  { name: "Chasselas", en: "Local white wine", note: "The signature grape of Lavaux. Light, dry and easy to drink." },
];

const PHRASES = [
  { fr: "Bonjour", en: "Hello" },
  { fr: "Merci beaucoup", en: "Thank you very much" },
  { fr: "S'il vous plaît", en: "Please" },
  { fr: "Une table pour deux, s'il vous plaît", en: "A table for two, please" },
  { fr: "L'addition, s'il vous plaît", en: "The bill, please" },
  { fr: "Parlez-vous anglais ?", en: "Do you speak English?" },
  { fr: "Où est la gare ?", en: "Where is the station?" },
  { fr: "Un billet pour Ouchy, s'il vous plaît", en: "One ticket to Ouchy, please" },
  { fr: "Je voudrais une fondue", en: "I would like a fondue" },
  { fr: "Santé !", en: "Cheers!" },
];

// Rough per-person daily costs in CHF for the budget calculator.
const BUDGET = {
  food:  { budget: 45, mid: 85, splurge: 160 },
  sights: { budget: 15, mid: 30, splurge: 50 },
  move:  { budget: 0, mid: 12, splurge: 25 },
};
