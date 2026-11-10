(() => {
'use strict';

/* ---------- rules ---------- */
const TIERS = [
  { key: 'krill', name: 'Macaw', pts: 10, color: '#d7e1f2', art: 'macaw', line: 'loud, bright, impossible to miss.' },
  { key: 'schooler', name: 'Toucan', pts: 30, color: '#7deaff', art: 'toucan', line: 'a good spot. plenty of people know it.' },
  { key: 'rare', name: 'Sloth', pts: 60, color: '#ff4d4d', art: 'sloth', line: 'easy to walk past. well found.' },
  { key: 'deepcut', name: 'Jaguar', pts: 85, color: '#bfa7ff', art: 'jaguar', line: 'almost nobody ever sees one.' },
  { key: 'krillion', name: 'Obscura', pts: 100, color: '#ffe08a', art: 'moth', line: 'the rarest thing in the forest.' },
];
// Hand-drawn 16x16 pixel sprites. '.' empty, 1 body, 2 shade, 3 highlight, 4 ink.
const ART = {
  krill: ['................', '..222....222....', '.23432..23432...', '.233322223332...', '.211111111112...', '21111111111112..', '21111411411112..', '21114444441112..', '.211111111112...', '..2211111122....', '.211221122112...', '2112..22..2112..', '313...33...313..', '................', '................', '................'],
  macaw: ['......2222......', '.....211112.....', '....21141112....', '...3321111112...', '...3.21111112...', '.....211111112..', '.....2111221112.', '.....21112211112', '......2112221112', '......2112222112', '.......212..2112', '.......4.4...212', '.............212', '..............22', '..............2.', '................'],
  toucan: ['................', '.......22222....', '......2111112...', '.333332114112...', '3333333111112...', '.3333321111112..', '...222.21111112.', '.......211111112', '.......211111112', '........21111122', '.........2111222', '.........4.4..22', '..............22', '................', '................', '................'],
  sloth: ['2222222222222222', '..2..........2..', '..2..........2..', '..22.222222.22..', '...2211111122...', '...2113333112...', '..211243342112..', '..211233332112..', '..211334433112..', '..211133331112..', '...2111111112...', '...2111111112...', '....21111112....', '.....222222.....', '................', '................'],
  jaguar: ['................', '..22........22..', '.2112......2112.', '.21112222221112.', '.21111111111112.', '.21411111111412.', '.21134111143112.', '.21111111111112.', '.21141133114112.', '..211134431112..', '..211333333112..', '...2113443112...', '....21111112....', '.....222222.....', '................', '................'],
  moth: ['................', '......4..4......', '.......44.......', '.222...11...222.', '21112..11..21112', '211312.11.213112', '2133112112113312', '2113311111133112', '.21111111111112.', '..221112211122..', '.21112.11.21112.', '.21312.11.21312.', '..2112.11.2112..', '...22..11..22...', '.......11.......', '................'],
};
const spriteCache = {};
function sprite(art, color) {
  const key = art + color;
  if (spriteCache[key]) return spriteCache[key];
  const n = parseInt(color.slice(1), 16), rgb = [n >> 16, (n >> 8) & 255, n & 255];
  const mix = (to, f) => 'rgb(' + rgb.map(c => Math.round(c + (to - c) * f)).join(',') + ')';
  const pal = { 1: color, 2: mix(0, 0.45), 3: mix(255, 0.6), 4: '#050d08' };
  const cv = document.createElement('canvas'); cv.width = cv.height = 16;
  const g = cv.getContext('2d');
  (ART[art] || ART.krill).forEach((row, y) => { for (let x = 0; x < 16; x++) if (pal[row[x]]) { g.fillStyle = pal[row[x]]; g.fillRect(x, y, 1, 1); } });
  return (spriteCache[key] = cv.toDataURL());
}
const icon = (art, color, size, cls) => h('img', { class: 'spr ' + (cls || ''), src: sprite(art, color), width: size, height: size, alt: '' });
const tierIcon = (tier, size, cls) => icon(TIERS[tier].art, TIERS[tier].color, size, cls);
const M_PER_PT = 10;
const MAX_DEPTH = 10935; // Challenger Deep, metres
const TICKS = [[0, 'Canopy', 'canopy'], [200, 'Understory', 'understory'], [1000, 'Deep shade', 'deep shade'], [4000, 'Forest floor', 'forest floor'], [6000, 'Root caves', 'root caves'], [MAX_DEPTH, 'Underground river', 'underground river']];
const COLORS = ['#ff7a45', '#7dffb0', '#ffe08a', '#ff8fd0', '#6fd6ff', '#c9f26a', '#ffb0a0', '#e6f0dc'];
const PICK_MS = 25000, COUNTDOWN_MS = 4000;

/* ---------- answer matching ---------- */
function norm(s) {
  s = String(s).toLowerCase().normalize('NFD').replace(/[̀-ͯ]/g, '');
  s = s.replace(/\+\+/g, 'plusplus').replace(/#/g, 'sharp').replace(/&/g, ' and ');
  s = s.replace(/^\s*the\s+/, '').replace(/\bst\.?\s/g, 'saint ');
  return s.replace(/[^a-z0-9]/g, '');
}
// Edit distance where a swapped pair of neighbouring letters counts as one slip.
function lev(a, b, max) {
  if (Math.abs(a.length - b.length) > max) return max + 1;
  let pp = null, prev = Array.from({ length: b.length + 1 }, (_, i) => i);
  for (let i = 1; i <= a.length; i++) {
    const cur = [i]; let best = i;
    for (let j = 1; j <= b.length; j++) {
      let v = Math.min(prev[j] + 1, cur[j - 1] + 1, prev[j - 1] + (a[i - 1] === b[j - 1] ? 0 : 1));
      if (pp && i > 1 && j > 1 && a[i - 1] === b[j - 2] && a[i - 2] === b[j - 1]) v = Math.min(v, pp[j - 2] + 1);
      cur[j] = v; if (v < best) best = v;
    }
    if (best > max) return max + 1;
    pp = prev; prev = cur;
  }
  return prev[b.length];
}
// A looser spelling key so near-misses still land: ph/f, ck/k, z/s, y/i, doubled letters.
const loose = k => k.replace(/ph/g, 'f').replace(/ck/g, 'k').replace(/z/g, 's').replace(/y/g, 'i').replace(/(.)\1+/g, '$1').replace(/e$/, '');
const FILLER = new Set(['the', 'of', 'and', 'a', 'an', 'in', 'de', 'la', 'le', 'st', 'saint', 'mr', 'mrs', 'dr']);
// Extra answers for existing prompts are merged in before anything is indexed.
for (const a of window.BANK_ADD || []) {
  const t = window.BANK.find(x => x && x.id === a.id);
  if (t && Array.isArray(a.t)) a.t.forEach((str, i) => { if (str && i < 5) t.t[i] = t.t[i] ? t.t[i] + ', ' + str : str; });
}
// Each prompt is indexed the first time it is needed, so loading stays quick however big the bank gets.
function buildTopic(t) {
  const map = new Map(), words = new Map(), lmap = new Map(), list = [];
  t.t.slice(0, 5).forEach((str, tier) => {
    for (const raw of String(str).split(',')) {
      const forms = raw.split('|').map(x => x.trim()).filter(Boolean);
      if (!forms.length) continue;
      // a name that already exists only contributes its extra spellings
      let e = map.get(norm(forms[0]));
      if (!e) { e = { name: forms[0], tier, toks: [] }; list.push(e); }
      for (const f of forms) {
        const k = norm(f); if (k && !map.has(k)) map.set(k, e);
        if (k && !lmap.has(loose(k))) lmap.set(loose(k), e);
        const tk = f.split(/[\s\-\/]+/).map(norm).filter(w => w && !FILLER.has(w));
        if (tk.length) e.toks.push(tk);
        for (const w of tk) if (w.length >= 4) { if (!words.has(w)) words.set(w, new Set()); words.get(w).add(e); }
      }
    }
  });
  // Shape the tiers the way Krillion does: a handful of Krill, a broad Schooler and Rare middle,
  // a long Deep Cut tail, and exactly one Krillion with a fact.
  const fix = (window.TIERFIX || {})[t.id] || (t.k ? { top: list.filter(e => e.tier === 0).map(e => e.name), k: t.k } : {});
  const top = new Set((fix.top || list.filter(e => e.tier === 0).slice(0, 5).map(e => e.name)).map(norm));
  for (const e of list) e.tier = e.tier === 0 ? (top.has(norm(e.name)) ? 0 : 1) : e.tier >= 3 ? 3 : e.tier;
  let star = fix.k && map.get(norm(fix.k[0]));
  if (!star && fix.k) { star = { name: fix.k[0], tier: 3, toks: [] }; list.push(star); map.set(norm(star.name), star); }
  if (!star) star = list.filter(e => e.tier === 3).pop() || list[list.length - 1] || { name: '', tier: 4, toks: [] };
  star.tier = 4; star.fact = fix.k ? fix.k[1] : '';
  return { id: t.id, name: t.name, blurb: t.blurb, map, words, lmap, list, star };
}
const RAW = {}, TOPICS = {};
for (const t of window.BANK) if (t && t.id && Array.isArray(t.t) && t.t.some(x => x && String(x).trim()) && !RAW[t.id]) RAW[t.id] = t;
for (const id in RAW) Object.defineProperty(TOPICS, id, { enumerable: true, configurable: true, get() { const v = buildTopic(RAW[id]); Object.defineProperty(TOPICS, id, { value: v, enumerable: true }); return v; } });
// Broad school-quiz categories make dull prompts. They stay in the bank as raw material
// for the oddly specific prompts below, but are never offered on their own.
const HIDDEN = new Set(['composers', 'philosophers', 'emperors', 'painters', 'authors', 'novels', 'battles', 'empires', 'monarchs', 'explorers', 'scientists', 'presidents', 'bible', 'phobias', 'greekmyth', 'constellations', 'bones', 'gems', 'grapes', 'dances', 'musicals', 'shakespeare', 'money', 'trees', 'languages', 'code', 'capitals', 'elements', 'tube', 'ukplaces', 'nationalparks', 'deserts', 'waters', 'mountains', 'rivers', 'islands', 'eurocities', 'asiacities', 'africacities', 'uscities', 'spaceobjects', 'illnesses', 'catbreeds', 'flowers', 'fish', 'reptiles', 'bestpicture', 'breads', 'beers', 'spices', 'instruments', 'cheese', 'genres', 'rockbands', 'popstars', 'rappers', 'birds', 'mammals', 'sea', 'insects', 'countries', 'states', 'cars', 'sports', 'dogs', 'vegetables', 'fruits', 'tools', 'clothing', 'desserts', 'dishes', 'cocktails', 'pasta', 'candy', 'gods', 'dinosaurs', 'bodyparts', 'sitcoms', 'cartoons', 'videogames']);
const COLOURS = /\b(red|blue|green|black|white|gold|golden|silver|grey|gray|yellow|orange|pink|purple|scarlet|crimson|violet|brown|ruby|emerald|amber|blond|blonde|rosy|rose|snowy|snow)\b/i;
const ANIMALS = ['mammals', 'birds', 'sea', 'reptiles', 'insects', 'fish'];
const CITIES = ['uscities', 'eurocities', 'asiacities', 'africacities', 'capitals'];
const one = n => !/[\s\-]/.test(n);
// Each takes answers from existing prompts and keeps the ones that pass its test.
const DERIVED = [
  { id: 'x_and', name: 'Name a country with “an” in its name', from: ['countries'], test: n => /an/i.test(n) },
  { id: 'x_land', name: 'Name a country ending in “land” or “stan”', from: ['countries'], test: n => /(land|stan)$/i.test(n) },
  { id: 'x_short', name: 'Name a country with four or five letters', from: ['countries'], test: n => one(n) && n.length >= 4 && n.length <= 5 },
  { id: 'x_island', name: 'Name a country that is an island or islands', from: ['countries'], test: n => /^(Japan|Iceland|Ireland|United Kingdom|Cuba|Jamaica|Haiti|Dominican Republic|Bahamas|Barbados|Trinidad and Tobago|Madagascar|Sri Lanka|Singapore|Indonesia|Philippines|New Zealand|Australia|Fiji|Malta|Cyprus|Maldives|Mauritius|Seychelles|Samoa|Tonga|Papua New Guinea|Bahrain|Brunei|East Timor|Vanuatu|Solomon Islands|Grenada|Saint Lucia|Dominica|Antigua and Barbuda|Comoros|Sao Tome and Principe|Cape Verde|Saint Kitts and Nevis|Saint Vincent and the Grenadines|Kiribati|Tuvalu|Nauru|Palau|Marshall Islands|Micronesia)$/.test(n) },
  { id: 'x_newstate', name: 'Name a US state with two words in its name', from: ['states'], test: n => /\s/.test(n) },
  { id: 'x_stateA', name: 'Name a US state that ends in the letter A', from: ['states'], test: n => /a$/i.test(n) },
  { id: 'x_double', name: 'Name an animal with a double letter in its name', blurb: 'One-word names only, like giraffe', from: ANIMALS, test: n => one(n) && /([a-z])\1/i.test(n) },
  { id: 'x_three', name: 'Name an animal with a three-letter name', from: ANIMALS, test: n => one(n) && n.length === 3 },
  { id: 'x_colouranimal', name: 'Name an animal with a colour in its name', blurb: 'Like blue whale', from: ANIMALS, test: n => COLOURS.test(n) },
  { id: 'x_fishname', name: 'Name a sea creature with “fish” in its name', from: ['sea', 'fish'], test: n => /fish/i.test(n) },
  { id: 'x_birdsea', name: 'Name an animal named after another animal', blurb: 'Like tiger shark or elephant seal', from: ANIMALS, test: n => /\b(tiger|elephant|leopard|zebra|lion|wolf|horse|cat|dog|bear|bull|cow|goat|pig|hog|fox|eagle|hawk|snake|spider|parrot|bat|rat|mouse|rabbit|monkey|frog|butterfly|bird|shark|whale|crocodile|alligator|turkey|chicken|duck|swan|deer|camel|kangaroo|mole|squirrel|buffalo|ox|sheep|ram|hound)\b/i.test(n) && /\s|-/.test(n) || /^(catfish|dogfish|lionfish|parrotfish|wolffish|ratfish|goatfish|hogfish|zebrafish|frogfish|rabbitfish|cowfish|batfish|boarfish|squirrelfish|hawkfish|lizardfish|toadfish|pigfish|horsefish|bullfrog|cowbird|catbird|antlion|bearcat|seahorse|sea lion)$/i.test(n) },
  { id: 'x_san', name: 'Name a city that starts with San, Santa, Saint or São', from: CITIES, test: n => /^(san|santa|santo|saint|st\.?|são|sao)\s/i.test(n) },
  { id: 'x_newcity', name: 'Name a city with “New” or “Port” in its name', from: CITIES.concat(['ukplaces']), test: n => /\b(new|port)/i.test(n) },
  { id: 'x_cityville', name: 'Name a city ending in “ville”, “burg” or “ton”', from: CITIES.concat(['ukplaces']), test: n => /(ville|burg|burgh|ton)$/i.test(n) },
  { id: 'x_stationanimal', name: 'Name a Tube station with a colour, animal or royal in its name', from: ['tube'], test: n => COLOURS.test(n) || /\b(king|queen|prince|regent|duke|earl|baron|knight|royal|swan|elephant|raven|stag|hound|bull|fox|hart|cock|lamb)/i.test(n) },
  { id: 'x_man', name: 'Name a Marvel or DC character with “man” or “woman” in their name', from: ['marvel', 'dccomics'], test: n => /(man|woman)\b/i.test(n) },
  { id: 'x_herocolour', name: 'Name a Marvel or DC character with a colour in their name', from: ['marvel', 'dccomics'], test: n => COLOURS.test(n) },
  { id: 'x_doctor', name: 'Name a Marvel or DC character with a title in their name', blurb: 'Doctor, Captain, Mister, Lady, King…', from: ['marvel', 'dccomics'], test: n => /^(doctor|dr\.?|captain|mister|mr\.?|miss|ms\.?|mrs\.?|lady|lord|king|queen|professor|general|baron|count|sir|madame|major|colonel|commander|agent|kid|black|the)\s/i.test(n) && !/^(black|the)\s/i.test(n) },
  { id: 'x_swhplotr', name: 'Name a character from Star Wars, Harry Potter or Lord of the Rings', from: ['starwars', 'harrypotter', 'middleearth'], test: () => true },
  { id: 'x_onename', name: 'Name a Star Wars, Harry Potter or Middle-earth character known by one name', blurb: 'Like Yoda, Hagrid or Gollum', from: ['starwars', 'harrypotter', 'middleearth'], test: n => one(n) },
  { id: 'x_notsimpson', name: 'Name a Simpsons character who is not a Simpson', from: ['simpsons'], test: n => !/simpson/i.test(n) },
  { id: 'x_pokeshort', name: 'Name a Pokémon with five letters or fewer', from: ['pokemon'], test: n => one(n) && n.length <= 5 },
  { id: 'x_disneyone', name: 'Name a Disney or Pixar film with a one-word title', from: ['disneyfilms'], test: n => one(n) },
  { id: 'x_disneyname', name: 'Name a Disney or Pixar film with “the” or “and” in the title', from: ['disneyfilms'], test: n => /\b(the|and)\b|&/i.test(n) },
  { id: 'x_swiftone', name: 'Name a Taylor Swift song with a one-word title', from: ['swift'], test: n => one(n) },
  { id: 'x_beatleslove', name: 'Name a Beatles song with “love”, “you” or “me” in the title', from: ['beatles'], test: n => /\b(love|you|me)\b/i.test(n) },
  { id: 'x_cartoonthe', name: 'Name a cartoon with a character\'s name in the title', blurb: 'Like SpongeBob SquarePants', from: ['cartoons'], test: n => /'s\b|\band\b|&/i.test(n) },
  { id: 'x_carshort', name: 'Name a car brand with four letters or fewer', from: ['cars'], test: n => one(n) && n.length <= 4 },
  { id: 'x_dogterrier', name: 'Name a dog breed with a place in its name', blurb: 'Like German Shepherd', from: ['dogs'], test: n => /\b(german|french|english|irish|scottish|welsh|australian|american|siberian|alaskan|belgian|italian|chinese|tibetan|afghan|norwegian|bernese|boston|yorkshire|labrador|newfoundland|rhodesian|staffordshire|shetland|chesapeake|pembroke|maltese|havanese|pekingese|pomeranian|dalmatian|akita|shiba|brittany|brussels|catahoula|cairn|airedale|bedlington|great pyrenees|west highland|pharaoh|saint bernard|lhasa|norfolk|norwich|manchester|skye|kerry|portuguese|spanish|swedish|finnish|dutch|japanese|korean|russian|hungarian|polish|czech|swiss|tibet|caucasian|anatolian|icelandic|greenland|canadian|mexican|peruvian|brazilian|argentin|cuban|egyptian)\b/i.test(n) },
  { id: 'x_berry', name: 'Name a fruit with “berry” in its name', from: ['fruits'], test: n => /berry/i.test(n) },
  { id: 'x_elemnotium', name: 'Name a chemical element that does not end in “ium”', from: ['elements'], test: n => !/ium$/i.test(n) },
  { id: 'x_godshort', name: 'Name a god or goddess with a name of four letters or fewer', from: ['gods'], test: n => one(n) && n.length <= 4 },
  { id: 'x_sportball', name: 'Name a sport with “ball” in its name', from: ['sports'], test: n => /ball/i.test(n) },
  { id: 'x_instrshort', name: 'Name a musical instrument with a name of five letters or fewer', from: ['instruments'], test: n => one(n) && n.length <= 5 },
  { id: 'x_bandthe', name: 'Name a band that starts with “The”', from: ['rockbands'], test: n => /^the\s/i.test(n) },
  { id: 'x_rapper', name: 'Name a rapper with “Lil”, “Young”, “Big” or “MC” in their name', from: ['rappers'], test: n => /\b(lil|young|yung|big|mc|dj|notorious|ice|kid)\b/i.test(n) },
  { id: 'x_onepop', name: 'Name a pop star known by one name', blurb: 'Like Adele', from: ['popstars', 'rappers'], test: n => one(n) },
  { id: 'x_bodyshort', name: 'Name a body part with four letters or fewer', from: ['bodyparts', 'bones'], test: n => one(n) && n.length <= 4 },
  { id: 'x_cocktailname', name: 'Name a cocktail with a place or person in its name', blurb: 'Like Moscow Mule or Bloody Mary', from: ['cocktails'], test: n => /\s/.test(n) && /^[A-Z].*\s[A-Z]/.test(n) },
  { id: 'x_spicehot', name: 'Name a herb or spice with a name of five letters or fewer', from: ['spices'], test: n => one(n) && n.length <= 5 },
];
function buildDerived(dv) {
  const t = ['', '', '', '', ''], seen = new Set();
  for (const id of dv.from) {
    const src = RAW[id] && TOPICS[id]; if (!src) continue;
    for (const str of RAW[id].t.slice(0, 5)) for (const raw of String(str).split(',')) {
      const first = raw.split('|')[0].trim(), key = norm(first), e = src.map.get(key);
      if (!first || !e || seen.has(key) || !dv.test(e.name)) continue;
      seen.add(key);
      const tier = Math.min(3, e.tier === 4 ? 3 : e.tier);
      t[tier] += (t[tier] ? ', ' : '') + raw.trim();
    }
  }
  const out = buildTopic({ id: dv.id, name: dv.name, blurb: dv.blurb || '', t });
  // carry a source prompt's hand-picked answer and fact over when it qualifies
  for (const id of dv.from) { const st = RAW[id] && TOPICS[id].star; if (st && st.fact && out.map.has(norm(st.name))) { out.star.tier = 3; out.star = out.map.get(norm(st.name)); out.star.tier = 4; out.star.fact = st.fact; break; } }
  return out;
}
for (const dv of DERIVED) {
  if (!dv.from.some(id => RAW[id])) continue;
  Object.defineProperty(TOPICS, dv.id, { enumerable: true, configurable: true, get() { const v = buildDerived(dv); Object.defineProperty(TOPICS, dv.id, { value: v, enumerable: true }); return v; } });
}
const usable = id => { try { return TOPICS[id].list.length >= 12; } catch (e) { return false; } };
const TOPIC_IDS = Object.keys(RAW).filter(id => !HIDDEN.has(id)).concat(DERIVED.filter(dv => dv.from.some(id => RAW[id])).map(dv => dv.id));
// Returns { e, fix } for a match (fix = the player must confirm the corrected spelling),
// { amb: true } when the text fits several answers and is not specific enough, or null.
// A correction has to be a slip of the fingers, not a guess: the typed text must point at one answer only.
const typoBudget = n => n >= 12 ? 3 : n >= 7 ? 2 : n >= 4 ? 1 : 0;
// A first name on its own points at nobody in particular, so it is never completed into a full answer.
const GIVEN = new Set('james john joe joseph robert michael mike william will bill david dave richard rick thomas tom charles charlie chris christopher daniel dan matthew matt anthony tony mark donald don steven steve stephen paul andrew andy joshua josh kenneth ken kevin brian george edward ed ronald ron timothy tim jason jeffrey jeff ryan jacob jake gary nicholas nick eric jonathan jon larry justin scott brandon ben benjamin samuel sam frank gregory greg raymond ray alexander alex patrick jack dennis jerry tyler aaron jose henry adam douglas doug nathan peter pete zachary zach kyle walter harry harold carl arthur roger keith jeremy terry sean shawn austin noah liam ethan mason logan lucas oliver elijah aiden max leo luke harry oscar mary patricia jennifer jen linda elizabeth liz barbara susan sue jessica jess sarah karen nancy lisa betty margaret sandra ashley kimberly kim emily donna michelle carol amanda melissa deborah debbie stephanie rebecca laura sharon cynthia kathleen kathy amy angela anna anne ann emma olivia ava sophia isabella mia charlotte amelia harper evelyn abigail ella grace chloe lily hannah zoe kate katie rachel megan julia julie maria marie rose ruby alice jane jean joan helen diana victoria taylor jordan morgan casey jamie lee kelly dr mr mrs ms sir lord lady king queen prince princess captain doctor saint'.split(' '));
function match(topicId, input) {
  const T = TOPICS[topicId], k = norm(input);
  if (!T || !k) return null;
  if (T.map.has(k)) return { e: T.map.get(k), fix: false };
  if (k.length >= 4) for (const x of [k + 's', k + 'es', k.replace(/s$/, ''), k.replace(/es$/, ''), k.replace(/ies$/, 'y')]) if (x && x !== k && T.map.has(x)) return { e: T.map.get(x), fix: false };
  if (k.length < 4) return null;
  const one = set => set.size === 1 ? { e: [...set][0], fix: true } : set.size ? { amb: true } : null;
  // A bare name or word shared by several answers is a lucky dip: it always resolves to the same
  // one for a given prompt, which may turn out common or very rare. The player still confirms it.
  const dip = set => { const arr = [...set].sort((a, b) => a.name < b.name ? -1 : 1); let hsum = 7; for (const ch of topicId + ':' + k) hsum = (hsum * 31 + ch.charCodeAt(0)) >>> 0; return { e: arr[hsum % arr.length], fix: true, dip: arr.length > 1 }; };
  if (GIVEN.has(k)) return T.words.has(k) ? dip(T.words.get(k)) : null;
  // spelt the way it sounds
  const lk = loose(k);
  if (T.lmap.has(lk)) return { e: T.lmap.get(lk), fix: true };
  // typos: same first letter, a small number of slips, and one clear closest answer
  const max = typoBudget(k.length);
  let best = max + 1, hits = new Set(), longer = new Set();
  for (const [key, e] of T.map) {
    if (key.length < 4 || (key[0] !== k[0] && loose(key)[0] !== lk[0])) continue;
    const d = Math.min(lev(k, key, max), lev(lk, loose(key), max));
    if (d < best) { best = d; hits = new Set([e]); longer = new Set(); } else if (d === best && d <= max) hits.add(e);
    if (d === best && d <= max && key.length > k.length) longer.add(e);
  }
  if (hits.size === 1) return { e: [...hits][0], fix: true };
  // on a tie, a dropped letter is the likelier slip than an extra one
  if (hits.size > 1 && longer.size === 1) return { e: [...longer][0], fix: true };
  // a distinctive word of the answer ("vader"): fine if only one answer has it
  // it has to be the word the answer is known by: its last word, not its first
  const byWord = T.words.get(k);
  if (byWord) { const last = new Set([...byWord].filter(e => e.toks.some(tk => tk[tk.length - 1] === k))); return last.size === 1 ? one(last) : dip(byWord); }
  // a clear start of the answer ("achilles" for Achilles tendon)
  if (k.length >= 5) {
    const pre = new Set();
    for (const [key, e] of T.map) if (key.length > k.length && k.length * 2 >= key.length && key.startsWith(k)) pre.add(e);
    if (pre.size) return one(pre);
  }
  // several words, each a near miss ("darth vadr", "grenadines saint vincent"): must cover most of the answer
  const typed = String(input).split(/[\s\-\/]+/).map(norm).filter(w => w && !FILLER.has(w));
  if (typed.length >= 2) {
    const found = new Set();
    for (const e of T.list) for (const tk of e.toks) {
      if (typed.length * 2 < tk.length) continue;
      if (typed.every(w => tk.some(a => a === w || (w.length >= 4 && a[0] === w[0] && lev(w, a, typoBudget(w.length)) <= typoBudget(w.length))))) { found.add(e); break; }
    }
    if (found.size) return one(found);
  }
  return hits.size > 1 ? { amb: true } : null;
}
window.__match = (t, x) => { const m = match(t, x); return !m ? null : m.amb ? 'ambiguous' : m.e.name + (m.dip ? ' (lucky dip)' : m.fix ? ' (confirm)' : ''); };
if (typeof document === 'undefined') { module.exports = { norm, match, TOPICS }; return; }

/* ---------- small helpers ---------- */
const $ = id => document.getElementById(id);
const app = $('app');
const clone = o => JSON.parse(JSON.stringify(o));
const fmt = n => Math.round(n).toLocaleString('en-US');
const ls = {
  get(k) { try { return localStorage.getItem('tr_' + k); } catch (e) { return null; } },
  set(k, v) { try { v == null ? localStorage.removeItem('tr_' + k) : localStorage.setItem('tr_' + k, v); } catch (e) { /* storage blocked */ } },
};
function h(tag, props, ...kids) {
  const e = document.createElement(tag);
  for (const k in (props || {})) {
    const v = props[k];
    if (k === 'class') e.className = v;
    else if (k === 'text') e.textContent = v;
    else if (k.startsWith('on')) e.addEventListener(k.slice(2), v);
    else if (v === true) e.setAttribute(k, '');
    else if (v !== false && v != null) e.setAttribute(k, v);
  }
  for (const c of kids.flat(3)) { if (c == null || c === false) continue; e.append(c.nodeType ? c : document.createTextNode(String(c))); }
  return e;
}
const withTimeout = (p, ms = 10000) => Promise.race([p, new Promise((_, rej) => setTimeout(() => rej({ code: 'timeout' }), ms))]);
function shuffle(a) { for (let i = a.length - 1; i > 0; i--) { const j = Math.floor(Math.random() * (i + 1)); [a[i], a[j]] = [a[j], a[i]]; } return a; }

/* ---------- sound: synthesized in the browser, no audio files ---------- */
// Everything pitched is in C major pentatonic so cues never clash, and the reward grows with the tier:
// a dull knock for the obvious answer, a chord for a good one, a full cascade for the rarest.
const Sound = (() => {
  let ac = null, out = null, wet = null, muted = ls.get('mute') === '1', riserNodes = null;
  function ctx() {
    if (!ac) {
      const A = window.AudioContext || window.webkitAudioContext; if (!A) return null;
      try {
        ac = new A();
        const comp = ac.createDynamicsCompressor(); comp.threshold.value = -16; comp.knee.value = 18; comp.ratio.value = 5; comp.attack.value = 0.004; comp.release.value = 0.2;
        out = ac.createGain(); out.gain.value = muted ? 0 : 0.8; out.connect(comp); comp.connect(ac.destination);
        // a short generated room, so notes ring instead of stopping dead
        const len = Math.floor(ac.sampleRate * 1.9), ir = ac.createBuffer(2, len, ac.sampleRate);
        for (let ch = 0; ch < 2; ch++) { const d = ir.getChannelData(ch); for (let i = 0; i < len; i++) d[i] = (Math.random() * 2 - 1) * Math.pow(1 - i / len, 2.6); }
        const conv = ac.createConvolver(); conv.buffer = ir; wet = ac.createGain(); wet.gain.value = 0.32; wet.connect(conv); conv.connect(out);
      } catch (e) { ac = null; return null; }
    }
    if (ac.state !== 'running') { try { const p = ac.resume(); if (p && p.catch) p.catch(() => {}); } catch (e) { /* stays silent */ } }
    return ac;
  }
  const env = (g, t, a, peak, d) => { g.gain.setValueAtTime(0.0001, t); g.gain.linearRampToValueAtTime(peak, t + a); g.gain.exponentialRampToValueAtTime(0.0001, t + a + d); };
  function route(node, pan, send) {
    let n = node; if (pan && ac.createStereoPanner) { const p = ac.createStereoPanner(); p.pan.value = pan; n.connect(p); n = p; }
    n.connect(out); if (send && wet) { const s = ac.createGain(); s.gain.value = send; n.connect(s); s.connect(wet); }
  }
  function tone(o) {
    const t = ac.currentTime + (o.delay || 0), dur = o.dur || 0.2, a = o.a || 0.005, osc = ac.createOscillator(), g = ac.createGain();
    osc.type = o.type || 'sine'; osc.frequency.setValueAtTime(o.f0, t); if (o.f1) osc.frequency.exponentialRampToValueAtTime(Math.max(1, o.f1), t + dur); if (o.detune) osc.detune.value = o.detune;
    env(g, t, a, o.peak || 0.2, dur);
    let node = osc; if (o.lp) { const f = ac.createBiquadFilter(); f.type = 'lowpass'; f.frequency.setValueAtTime(o.lp, t); if (o.lpTo) f.frequency.exponentialRampToValueAtTime(o.lpTo, t + dur); osc.connect(f); node = f; }
    node.connect(g); route(g, o.pan, o.send); osc.start(t); osc.stop(t + dur + a + 0.05);
  }
  function noise(o) {
    const t = ac.currentTime + (o.delay || 0), dur = o.dur || 0.3, n = Math.ceil(ac.sampleRate * (dur + 0.1)), buf = ac.createBuffer(1, n, ac.sampleRate), d = buf.getChannelData(0);
    for (let i = 0; i < n; i++) d[i] = Math.random() * 2 - 1;
    const src = ac.createBufferSource(), lp = ac.createBiquadFilter(), g = ac.createGain(); src.buffer = buf;
    lp.type = o.bp ? 'bandpass' : 'lowpass'; if (o.bp) lp.Q.value = o.q || 1.2; lp.frequency.setValueAtTime(o.lp || 1200, t); if (o.to) lp.frequency.exponentialRampToValueAtTime(o.to, t + dur);
    let node = lp; src.connect(lp); if (o.hp) { const hf = ac.createBiquadFilter(); hf.type = 'highpass'; hf.frequency.value = o.hp; lp.connect(hf); node = hf; }
    if (o.swell) { g.gain.setValueAtTime(0.0001, t); g.gain.exponentialRampToValueAtTime(o.peak || 0.2, t + dur * 0.96); g.gain.linearRampToValueAtTime(0.0001, t + dur); } else env(g, t, o.a || 0.003, o.peak || 0.2, dur);
    node.connect(g); route(g, o.pan, o.send); src.start(t); src.stop(t + dur + 0.1);
  }
  // a struck bell or mallet: a fundamental with a few quickly fading overtones
  function bell(f, o = {}) {
    const peak = o.peak || 0.16, dur = o.dur || 1.1;
    [[1, 1, 1], [2, 0.42, 0.6], [3.01, 0.2, 0.35], [4.2, 0.12, 0.22], [5.4, 0.06, 0.14]].forEach(([m, amp, len]) => { if (f * m < 9000) tone({ f0: f * m, dur: dur * len, a: 0.002, peak: peak * amp, delay: o.delay, pan: o.pan, send: o.send == null ? 0.5 : o.send }); });
  }
  // a warm chord: detuned saws under a closing filter
  function pad(freqs, o = {}) { freqs.forEach((f, i) => [-9, 8].forEach(dt => tone({ type: 'sawtooth', f0: f, detune: dt, dur: o.dur || 1.4, a: o.a || 0.08, peak: (o.peak || 0.05), lp: o.lp || 2400, lpTo: 500, delay: o.delay, pan: (i % 2 ? 0.35 : -0.35), send: 0.6 }))); }
  function stopRiser() { if (!riserNodes) return; const t = ac.currentTime; try { riserNodes.g.gain.cancelScheduledValues(t); riserNodes.g.gain.setTargetAtTime(0.0001, t, 0.02); riserNodes.osc.stop(t + 0.15); } catch (e) { /* already ended */ } riserNodes = null; }
  // anticipation: a tone that climbs for exactly as long as the fall lasts, higher and louder for rarer answers
  function riser(dur, tier) {
    stopRiser();
    const t = ac.currentTime, osc = ac.createOscillator(), g = ac.createGain(), lp = ac.createBiquadFilter(), trem = ac.createOscillator(), tg = ac.createGain();
    const f1 = [196, 262, 392, 523, 784][tier], peak = [0.03, 0.05, 0.07, 0.085, 0.1][tier];
    osc.type = 'triangle'; osc.frequency.setValueAtTime(98, t); osc.frequency.exponentialRampToValueAtTime(f1, t + dur);
    lp.type = 'lowpass'; lp.frequency.setValueAtTime(500, t); lp.frequency.exponentialRampToValueAtTime(1200 + tier * 900, t + dur);
    g.gain.setValueAtTime(0.0001, t); g.gain.exponentialRampToValueAtTime(peak, t + dur * 0.97); g.gain.linearRampToValueAtTime(0.0001, t + dur + 0.03);
    trem.frequency.setValueAtTime(5, t); trem.frequency.linearRampToValueAtTime(9 + tier * 4, t + dur); tg.gain.value = peak * 0.45; trem.connect(tg); tg.connect(g.gain);
    osc.connect(lp); lp.connect(g); route(g, 0, 0.4); osc.start(t); trem.start(t); osc.stop(t + dur + 0.1); trem.stop(t + dur + 0.1);
    riserNodes = { osc, g };
    if (tier >= 2) noise({ dur, bp: true, lp: 300, to: 2600 + tier * 900, q: 1.6, peak: 0.03 + tier * 0.012, swell: true, send: 0.3 });
  }
  const C = { C3: 130.81, G3: 196, C4: 261.63, E4: 329.63, G4: 392, A4: 440, C5: 523.25, D5: 587.33, E5: 659.25, G5: 783.99, A5: 880, B5: 987.77, C6: 1046.5, D6: 1174.66, E6: 1318.51, G6: 1567.98, C7: 2093 };
  const LINE = [C.G4, C.C5, C.E5, C.G5, C.C6];
  const CUES = {
    click() { tone({ type: 'triangle', f0: 620, dur: 0.05, peak: 0.06 }); },
    type() { tone({ type: 'triangle', f0: 1500 + Math.random() * 500, dur: 0.025, peak: 0.022 }); noise({ dur: 0.02, lp: 3000, hp: 1200, peak: 0.02 }); },
    pick() { bell(C.C5, { peak: 0.1, dur: 0.6 }); bell(C.G5, { peak: 0.09, dur: 0.7, delay: 0.07 }); },
    submit() { tone({ type: 'triangle', f0: 740, f1: 1110, dur: 0.09, peak: 0.13 }); noise({ dur: 0.05, lp: 5000, hp: 2000, peak: 0.05 }); bell(C.E6, { peak: 0.05, dur: 0.4, delay: 0.06 }); },
    reject() { tone({ f0: 170, f1: 70, dur: 0.32, peak: 0.2, lp: 600 }); noise({ dur: 0.18, lp: 380, peak: 0.14 }); },
    fix() { bell(C.A5, { peak: 0.08, dur: 0.4 }); bell(C.E5, { peak: 0.08, dur: 0.5, delay: 0.09 }); },
    begin() { noise({ dur: 1, lp: 2400, to: 300, peak: 0.1, send: 0.4 }); tone({ f0: 196, f1: 98, dur: 1, peak: 0.2 }); bell(C.D5, { peak: 0.1, dur: 0.9 }); bell(C.A5, { peak: 0.1, dur: 1.1, delay: 0.18 }); },
    count(go) { if (go) { bell(C.C6, { peak: 0.14, dur: 0.9 }); tone({ f0: 130, f1: 65, dur: 0.3, peak: 0.16 }); } else tone({ type: 'triangle', f0: 440, dur: 0.12, peak: 0.12, send: 0.3 }); },
    sink(o) { noise({ dur: 0.7, lp: 2600, to: 300, hp: 250, peak: 0.12, send: 0.3 }); tone({ f0: 330, f1: 90, dur: 0.6, peak: 0.08 }); riser(o.dur, o.tier); },
    // each line rings one step higher, a little louder and brighter, swinging left and right
    line(i) { bell(LINE[i] || C.C5, { peak: 0.1 + i * 0.022, dur: 0.7 + i * 0.12, pan: i % 2 ? 0.4 : -0.4 }); noise({ dur: 0.06, lp: 6000, hp: 3000, peak: 0.03 + i * 0.008 }); },
    // the instant of contact, before the reward
    impact(tier) { stopRiser(); noise({ dur: 0.035, lp: 7000, hp: 1500, peak: 0.16 + tier * 0.03 }); tone({ f0: 150 - tier * 14, f1: 44, dur: 0.28 + tier * 0.14, peak: 0.26 + tier * 0.03, lp: 700 }); },
    land(tier) {
      if (tier === 0) { tone({ type: 'triangle', f0: C.G3, dur: 0.28, peak: 0.13, lp: 900 }); return; }
      if (tier === 1) { bell(C.C5, { peak: 0.15 }); bell(C.E5, { peak: 0.13, delay: 0.06 }); return; }
      if (tier === 2) { [C.C5, C.E5, C.G5].forEach((f, i) => bell(f, { peak: 0.15, dur: 1.3, delay: i * 0.055, pan: (i - 1) * 0.3 })); bell(C.C7, { peak: 0.04, dur: 0.8, delay: 0.24 }); pad([C.C4, C.G4], { dur: 0.9, peak: 0.03 }); noise({ dur: 0.5, lp: 6000, hp: 3000, peak: 0.03, delay: 0.05, send: 0.5 }); return; }
      if (tier === 3) {
        tone({ f0: 70, f1: 38, dur: 0.9, peak: 0.3 });
        [C.C5, C.E5, C.G5, C.B5, C.D6].forEach((f, i) => bell(f, { peak: 0.15, dur: 1.6, delay: i * 0.06, pan: (i - 2) * 0.22 }));
        pad([C.C4, C.E4, C.G4, C.B5 / 2], { dur: 1.6, peak: 0.04 });
        bell(C.G6, { peak: 0.06, dur: 1, delay: 0.42 }); bell(C.C7, { peak: 0.05, dur: 1, delay: 0.52 });
        noise({ dur: 0.9, lp: 7000, hp: 3500, peak: 0.035, delay: 0.05, send: 0.6 }); return;
      }
      // the rarest answer: a low boom, a full chord, a run up two octaves, and a scatter of high bells
      tone({ f0: 62, f1: 34, dur: 1.5, peak: 0.34 }); noise({ dur: 0.5, lp: 500, peak: 0.16 });
      pad([C.C3, C.G3, C.C4, C.E4, C.G4, C.D5], { dur: 2.6, peak: 0.04, lp: 3000 });
      [C.C5, C.E5, C.G5, C.C6, C.E6, C.G6, C.C7].forEach((f, i) => bell(f, { peak: 0.15, dur: 1.9, delay: 0.05 + i * 0.085, pan: Math.sin(i * 1.3) * 0.5 }));
      [C.G6, C.E6, C.D6, C.C6, C.A5, C.G5].forEach((f, i) => bell(f, { peak: 0.07, dur: 1.4, delay: 0.85 + i * 0.07, pan: -Math.sin(i * 1.3) * 0.5 }));
      for (let i = 0; i < 10; i++) bell([C.C7, C.G6, C.E6, C.D6][i % 4] * (i % 3 ? 1 : 2), { peak: 0.03, dur: 0.7, delay: 1.3 + Math.random() * 1.4, pan: Math.random() * 1.6 - 0.8, send: 0.8 });
      noise({ dur: 2.2, lp: 9000, hp: 4000, peak: 0.035, delay: 0.1, send: 0.7 });
    },
    // the score counting up: a run of soft clicks that climbs with it
    tally(u) { tone({ type: 'triangle', f0: 700 + u * 900, dur: 0.035, peak: 0.05 }); },
    ding() { bell(C.E6, { peak: 0.1, dur: 0.8 }); },
    best() { [C.G5, C.C6, C.E6].forEach((f, i) => bell(f, { peak: 0.1, dur: 1, delay: i * 0.09 })); },
    zone() { bell(C.C3, { peak: 0.2, dur: 3, send: 0.9 }); bell(C.G3, { peak: 0.08, dur: 2.4, delay: 0.05, send: 0.9 }); noise({ dur: 1.6, bp: true, lp: 500, to: 1400, q: 2, peak: 0.03, send: 0.8 }); },
    miss() { stopRiser(); tone({ f0: 233, f1: 55, dur: 0.7, peak: 0.22 }); noise({ dur: 0.45, lp: 420, peak: 0.12, delay: 0.04 }); },
    tick() { tone({ f0: 932, dur: 0.06, peak: 0.11 }); },
    descend() { noise({ dur: 0.7, lp: 1600, to: 260, peak: 0.08, send: 0.3 }); tone({ f0: 130, f1: 60, dur: 0.7, peak: 0.16 }); },
    ribbit() { tone({ type: 'sawtooth', f0: 190, f1: 140, dur: 0.09, peak: 0.14, lp: 900 }); tone({ type: 'sawtooth', f0: 210, f1: 150, dur: 0.11, peak: 0.14, lp: 900, delay: 0.13 }); },
    surface() { noise({ dur: 1.8, lp: 300, to: 3200, peak: 0.13, send: 0.5 }); tone({ f0: 80, f1: 620, dur: 1.7, peak: 0.07, send: 0.4 }); },
    fanfare() { [C.C5, C.E5, C.G5, C.C6].forEach((f, i) => bell(f, { peak: 0.14, dur: 1.4, delay: i * 0.12 })); pad([C.C4, C.E4, C.G4], { dur: 1.8, peak: 0.035 }); tone({ f0: 98, dur: 1, peak: 0.16 }); },
  };
  return {
    unlock: ctx,
    play(name, arg) { if (muted || document.hidden || !ctx() || ac.state !== 'running' || !CUES[name]) return; try { CUES[name](arg); } catch (e) { /* audio is optional */ } },
    muted: () => muted,
    toggle() { muted = !muted; ls.set('mute', muted ? '1' : null); if (out) out.gain.value = muted ? 0 : 0.8; if (!muted) this.play('pick'); return muted; },
  };
})();
const snd = (n, a) => Sound.play(n, a);
// Settings, after Krillion's: low-power graphics, colour-blind tier colours, whether corrections
// are previewed, and whether a rejected answer is cleared from the box.
// Companions, unlocked by keeping a daily streak going (Krillion does the same with its mascots).
const PALS = [
  { id: 'frog', name: 'Frog', art: 'krill', color: '#ff7a45', need: 0 },
  { id: 'macaw', name: 'Macaw', art: 'macaw', color: '#ff5d5d', need: 3 },
  { id: 'toucan', name: 'Toucan', art: 'toucan', color: '#ffc04d', need: 5 },
  { id: 'sloth', name: 'Sloth', art: 'sloth', color: '#c9a27a', need: 14 },
  { id: 'jaguar', name: 'Jaguar', art: 'jaguar', color: '#f0b14a', need: 30 },
  { id: 'moth', name: 'Moth', art: 'moth', color: '#e8ff7a', need: 45 },
];
const streakNow = () => { const last = ls.get('lastDay'), d = new Date(), y = new Date(d.getFullYear(), d.getMonth(), d.getDate() - 1), yk = y.getFullYear() + '-' + String(y.getMonth() + 1).padStart(2, '0') + '-' + String(y.getDate()).padStart(2, '0'); return last === dayKey() || last === yk ? Number(ls.get('streak') || 0) : 0; };
const bestStreak = () => Math.max(Number(ls.get('beststreak') || 0), streakNow());
function setPal(id) { const p = PALS.find(x => x.id === id && bestStreak() >= x.need) || PALS[0]; ls.set('pal', p.id === 'frog' ? null : p.id); window.__pal = p; }
const SET = { low: ls.get('s_low') === '1', cb: ls.get('s_cb') === '1', corr: ls.get('s_corr') !== '0', clear: ls.get('s_clear') === '1' };
const TIER_COLOURS = { normal: ['#d7e1f2', '#7deaff', '#ff4d4d', '#bfa7ff', '#ffe08a'], cb: ['#ffffff', '#56b4e9', '#e69f00', '#cc79a7', '#f0e442'] };
function applySettings() {
  document.body.classList.toggle('low', SET.low); document.body.classList.toggle('cb', SET.cb);
  TIERS.forEach((t, i) => { t.color = TIER_COLOURS[SET.cb ? 'cb' : 'normal'][i]; });
  window.__low = SET.low; if (!window.__pal) setPal(ls.get('pal') || 'frog'); if (window.__rebuild) window.__rebuild();
}
function openSettings() {
  if ($('settings')) return;
  const row = (key, title, text, get, set) => {
    const b = h('button', { class: 'switch', type: 'button', role: 'switch', 'aria-checked': String(get()), 'aria-label': title }, h('i', { text: get() ? 'On' : 'Off' }));
    b.addEventListener('click', () => { set(!get()); b.setAttribute('aria-checked', String(get())); b.firstChild.textContent = get() ? 'On' : 'Off'; });
    return h('div', { class: 'setrow' }, h('div', null, h('strong', { text: title }), h('p', { class: 'note', text: text })), b);
  };
  const flag = (key, lsKey, onVal) => [() => SET[key], v => { SET[key] = v; ls.set(lsKey, v === onVal ? null : (v ? '1' : '0')); applySettings(); }];
  const close = () => { const m = $('settings'); if (m) m.remove(); };
  const modal = h('div', { id: 'settings', class: 'modal', role: 'dialog', 'aria-label': 'Settings', onclick: e => { if (e.target.id === 'settings') close(); } },
    h('div', { class: 'panel' },
      h('div', { class: 'ph' }, h('span', { text: 'Settings' }), h('button', { class: 'small', type: 'button', onclick: close, text: 'Close' })),
      row('sound', 'Sound', 'Chimes, thumps and the climb as an answer falls.', () => !Sound.muted(), () => { Sound.toggle(); const mb = $('mute'); if (mb) { mb.textContent = Sound.muted() ? 'Sound off' : 'Sound on'; mb.setAttribute('aria-pressed', String(Sound.muted())); } }),
      row('low', 'Low-power mode', 'Lighter graphics and fewer background animations.', ...flag('low', 's_low', false)),
      row('cb', 'Colourblind mode', 'Brighter text and more separated tier colours.', ...flag('cb', 's_cb', false)),
      row('corr', 'Answer corrections', 'Preview corrected answers before scoring. Off accepts them immediately.', ...flag('corr', 's_corr', true)),
      row('clear', 'Clear rejected entries', 'Empty the answer box after a failed attempt.', ...flag('clear', 's_clear', false)),
      h('div', { class: 'ph' }, h('span', { text: 'Companion' }), h('em', { text: 'best streak ' + bestStreak() })),
      h('div', { class: 'pals' }, PALS.map(p => { const open = bestStreak() >= p.need, b = h('button', { class: 'pal' + (window.__pal.id === p.id ? ' on' : ''), type: 'button', disabled: !open, 'aria-label': p.name }, icon(p.art, open ? p.color : '#3a4a3e', 32), h('span', { text: p.name }), h('small', { text: open ? (p.need ? p.need + '-day' : 'starter') : p.need + '-day streak' })); b.addEventListener('click', () => { setPal(p.id); b.parentElement.querySelectorAll('.pal').forEach(x => x.classList.toggle('on', x === b)); }); return b; }))));
  document.body.append(modal);
}
// The prompts are the game: nothing on the page can be selected, copied or dragged out. Typing still works.
for (const ev of ['copy', 'cut', 'contextmenu', 'dragstart', 'selectstart']) addEventListener(ev, e => { const t = e.target; if (!(t && t.closest && t.closest('input'))) e.preventDefault(); }, true);
addEventListener('pointerdown', e => { Sound.unlock(); if (e.target.closest && e.target.closest('button:not(#mute)')) snd('click'); }, true);
addEventListener('keydown', () => Sound.unlock(), true);
// Enter moves you on: from a result to the next prompt, and (for whoever can) from a round's results to the next round.
addEventListener('keydown', e => {
  if (e.key !== 'Enter' || e.repeat || e.isComposing || document.querySelector('.modal')) return;
  const t = e.target, tag = t && t.tagName;
  if (tag === 'INPUT' || tag === 'TEXTAREA' || tag === 'SELECT' || tag === 'BUTTON' || tag === 'A') return;
  const nx = document.getElementById('next'), go = document.querySelector('.landed .go') || (nx && !nx.hidden ? nx : null);
  if (go && !go.disabled) { e.preventDefault(); go.click(); }
});
// Phones only let sound start from a finished tap, not from the press, so wake the audio on those too
// and nudge it with a silent blip (Safari needs one before it will play anything).
['pointerup', 'touchend', 'click'].forEach(ev => addEventListener(ev, () => {
  const ac = Sound.unlock(); if (!ac || Sound._kicked) return;
  try { const b = ac.createBufferSource(); b.buffer = ac.createBuffer(1, 1, 22050); b.connect(ac.destination); b.start(0); if (ac.state === 'running') Sound._kicked = true; } catch (e) { /* audio is optional */ }
}, true));
addEventListener('visibilitychange', () => { if (!document.hidden) Sound.unlock(); });
{
  const b = h('button', { id: 'mute', class: 'small', type: 'button', 'aria-pressed': String(Sound.muted()), text: Sound.muted() ? 'Sound off' : 'Sound on' });
  b.addEventListener('click', () => { const m = Sound.toggle(); b.textContent = m ? 'Sound off' : 'Sound on'; b.setAttribute('aria-pressed', String(m)); });
  document.body.append(b);
  document.body.append(h('button', { id: 'burger', class: 'small', type: 'button', 'aria-label': 'Open menu', onclick: () => openMenu() }, h('i'), h('i'), h('i')));
  document.body.append(h('button', { id: 'gear', class: 'small', type: 'button', onclick: () => openSettings(), text: 'Settings' }));
  applySettings();
}

/* ---------- state ---------- */
const S = {
  mode: null,            // null (home) | 'solo' | 'online'
  db: null, dbState: 'wait', canWrite: null,
  me: { id: ls.get('pid'), name: ls.get('name') || '' },
  code: null, room: null, players: {}, mine: null,
  roomRef: null, meRef: null, unsub: [],
  screen: '', busy: false, msg: '', fb: null, done: '', jitter: Math.random() * 1500,
};
if (!S.me.id) { S.me.id = 'p_' + Math.random().toString(36).slice(2, 10); ls.set('pid', S.me.id); }

const ordered = () => Object.entries(S.players).map(([id, p]) => ({ id, ...p }))
  .sort((a, b) => (a.joinedAt || 0) - (b.joinedAt || 0) || (a.id < b.id ? -1 : 1));
const colorOf = id => COLORS[Math.max(0, ordered().findIndex(p => p.id === id)) % COLORS.length];
const roundOf = (p, r) => (p && p.g === S.room.g && p.rounds && p.rounds[r]) || { a: [], pts: 0 };
const total = p => (p && p.g === S.room.g && p.rounds) ? Object.values(p.rounds).reduce((s, r) => s + (r.pts || 0), 0) : 0;
const depthOf = p => Math.min(MAX_DEPTH, total(p) * M_PER_PT);
const zoneOf = d => { let z = 'Canopy'; for (const [m, name] of TICKS) if (m > 0 && d >= m) z = name; return z; };
const isHost = () => S.mode === 'solo' || (S.room && S.room.host === S.me.id);
const nameOf = p => (p && p.name) || 'Diver';

function say(msg) { S.msg = msg; const n = $('msg'); if (n) { n.textContent = msg; n.hidden = !msg; } }

/* ---------- writes ---------- */
let roomQ = Promise.resolve();
function patchRoom(p) {
  Object.assign(S.room, p);
  if (S.mode === 'online') {
    const ref = S.roomRef;
    roomQ = roomQ.then(() => ref.update(p)).catch(() => say('That did not save. Check your connection.'));
  }
  render();
}
let saving = false, dirty = false;
async function saveMe() {
  S.players[S.me.id] = S.mine;
  if (S.mode !== 'online') return;
  dirty = true;
  if (saving) return;
  saving = true;
  while (dirty) {
    dirty = false;
    try { await S.meRef.set(clone(S.mine)); } catch (e) { say('Your answers are not saving. Check your connection.'); break; }
  }
  saving = false;
}

/* ---------- joining and leaving ---------- */
function readName() {
  const el = $('nick');
  const v = (el ? el.value : S.me.name).trim().slice(0, 16);
  if (!v) { say('Type a name first.'); if (el) el.focus(); return null; }
  S.me.name = v; ls.set('name', v);
  return v;
}
function freshMine(g, joinedAt) { return { name: S.me.name, joinedAt: joinedAt || Date.now(), g, rounds: {} }; }

function startSolo() {
  if (!readName()) return;
  say('');
  S.mode = 'solo'; S.code = 'SOLO';
  S.room = { host: S.me.id, phase: 'lobby', g: 1, round: 0, rounds: 3, dives: 5, secs: 25, used: [] };
  S.mine = freshMine(1);
  S.players = { [S.me.id]: S.mine };
  startRound(1);
}

async function createRoom() {
  if (S.busy || !S.db || !readName()) return;
  S.busy = true; say('Opening a room…');
  try {
    let code = '', ref = null;
    for (let i = 0; i < 6; i++) {
      code = Array.from({ length: 4 }, () => 'BCDFGHJKLMNPQRSTVWXZ'[Math.floor(Math.random() * 20)]).join('');
      ref = S.db.doc('rooms/' + code);
      const snap = await withTimeout(ref.get());
      if (!snap.exists) break;
      ref = null;
    }
    if (!ref) throw { code: 'busy' };
    await withTimeout(ref.set({ host: S.me.id, phase: 'lobby', g: 1, round: 0, rounds: 3, dives: 5, secs: 25, used: [], createdAt: Date.now() }));
    S.busy = false;
    await joinRoom(code, false);
  } catch (e) {
    say(e && e.code === 'invalid_argument'
      ? 'You can open this page but cannot write to it. Ask the owner for edit access, or practise solo.'
      : 'Could not open a room. Check your connection and try again.');
  } finally { S.busy = false; }
}

async function joinRoom(code, silent) {
  if (S.busy || !S.db) return;
  if (!silent && !readName()) return;
  code = String(code || '').toUpperCase().replace(/[^A-Z]/g, '');
  if (code.length !== 4) { if (!silent) say('Room codes are four letters.'); return; }
  S.busy = true; if (!silent) say('Joining…');
  try {
    const ref = S.db.doc('rooms/' + code);
    const snap = await withTimeout(ref.get());
    if (!snap.exists) { ls.set('code', null); if (!silent) say('No room has the code ' + code + '.'); return; }
    const room = clone(snap.data());
    const meRef = ref.collection('players').doc(S.me.id);
    const old = await withTimeout(meRef.get());
    const prev = old.exists ? clone(old.data()) : null;
    const mine = prev && prev.g === room.g ? Object.assign(prev, { name: S.me.name, left: false }) : freshMine(room.g, prev && prev.joinedAt);
    await withTimeout(meRef.set(clone(mine)));
    if (S.mode) return; // started something else while this was loading
    S.mode = 'online'; S.code = code; S.room = room; S.mine = mine;
    S.players = { [S.me.id]: mine }; S.roomRef = ref; S.meRef = meRef;
    ls.set('code', code); say('');
    S.unsub.push(
      ref.onSnapshot(s => {
        if (!s.exists || S.roomRef !== ref) return;
        S.room = clone(s.data());
        if (S.room.g !== S.mine.g) { S.mine = freshMine(S.room.g, S.mine.joinedAt); saveMe(); }
        render();
      }, () => say('Lost contact with the room. Leave and join again.')),
      ref.collection('players').onSnapshot(q => {
        if (S.roomRef !== ref) return;
        const m = {};
        q.docs.forEach(d => { m[d.id] = d.data(); });
        m[S.me.id] = S.mine;
        S.players = m;
        render();
      }, () => {})
    );
    render();
  } catch (e) {
    if (!silent) say(e && e.code === 'invalid_argument'
      ? 'You can open this page but cannot play on it. Ask the owner for edit access, or practise solo.'
      : 'Could not reach that room. Check your connection and try again.');
  } finally { S.busy = false; }
}

function leave() {
  window.__gold = false;
  document.body.classList.remove('trek', 'quiet', 'run', 'spot');
  window.__lines = null; window.__sink = null; document.body.classList.remove('sinking');
  S.unsub.forEach(u => { try { u(); } catch (e) { /* already closed */ } });
  S.unsub = [];
  if (S.mode === 'online' && S.room.phase === 'lobby' && S.meRef) S.meRef.delete().catch(() => {});
  else if (S.mode === 'online' && S.meRef && S.mine) { S.mine.left = true; S.meRef.set(clone(S.mine)).catch(() => {}); } // gone mid-game: do not hold the others up
  S.mode = null; S.room = null; S.roomRef = null; S.meRef = null; S.code = null; S.players = {}; S.fb = null; S.dive = null; S.shown = null; S.allAt = 0;
  ls.set('code', null); S.msg = '';
  render();
}

/* ---------- solo runs: the daily descent and themed packs ---------- */
// Seven prompts, one answer each, 25 seconds a prompt, 700 points at most. The daily set is the
// same for everyone on a given date and can be played once; packs draw from one subject.
const PACKS = {
  sports: { label: 'Sports', ids: ['x_sportball', 'nicknames', 'worldcupwinners'] },
  geo: { label: 'Geography', ids: ['x_and', 'x_land', 'x_short', 'x_island', 'x_newstate', 'x_stateA', 'x_san', 'x_newcity', 'x_cityville', 'x_stationanimal', 'equator', 'monarchies', 'notlargest', 'redwhiteblue', 'spanishcountries'] },
};
const packPool = kind => TOPIC_IDS.filter(id => PACKS[kind].ids.includes(id) || (RAW[id] && RAW[id].pack === kind));
function dayKey() { const d = new Date(); return d.getFullYear() + '-' + String(d.getMonth() + 1).padStart(2, '0') + '-' + String(d.getDate()).padStart(2, '0'); }
const dayNo = () => { const d = new Date(); return Math.max(1, Math.floor((Date.UTC(d.getFullYear(), d.getMonth(), d.getDate()) - Date.UTC(2026, 10, 9)) / 864e5) + 1); };
function seeded(seed) { let v = 2166136261; for (const ch of seed) v = Math.imul(v ^ ch.charCodeAt(0), 16777619) >>> 0; return () => { v ^= v << 13; v >>>= 0; v ^= v >>> 17; v ^= v << 5; v >>>= 0; return v / 4294967296; }; }
function pickSeven(pool, rnd) {
  const ids = pool.slice().sort(); for (let i = ids.length - 1; i > 0; i--) { const j = Math.floor(rnd() * (i + 1)); [ids[i], ids[j]] = [ids[j], ids[i]]; }
  const out = []; for (const id of ids) { if (usable(id)) out.push(id); if (out.length === 7) break; } return out;
}
const dayNoOf = key => { const p = key.split('-').map(Number); return Math.max(1, Math.floor((Date.UTC(p[0], p[1] - 1, p[2]) - Date.UTC(2026, 10, 9)) / 864e5) + 1); };
// No repeats: the pool is shuffled once per cycle and dealt out seven a day until it runs out, then reshuffled.
function dealSeven(pool, tag, n) { const ids = pool.filter(usable).sort(), per = Math.floor(ids.length / 7); if (!per) return []; const cyc = Math.floor((n - 1) / per), rnd = seeded('obscura:' + tag + ':' + cyc); for (let i = ids.length - 1; i > 0; i--) { const j = Math.floor(rnd() * (i + 1)); [ids[i], ids[j]] = [ids[j], ids[i]]; } const k = ((n - 1) % per) * 7; return ids.slice(k, k + 7); }
window.__dbg = { S: () => S, topic: id => TOPICS[id] };
window.__deal = (tag, n) => dealSeven(tag === 'daily' ? TOPIC_IDS : packPool(tag), tag, n);
const dailySaved = () => { try { return JSON.parse(ls.get('daily_' + dayKey()) || 'null'); } catch (e) { return null; } };
const dailyKey = kind => 'daily_' + kind + '_' + dayKey();
const dailyDone = kind => { try { return JSON.parse(ls.get(dailyKey(kind)) || 'null'); } catch (e) { return null; } };
function startRun(kind, day, daily) {
  const el = $('nick'), nm = el ? el.value.trim().slice(0, 16) : ''; if (nm) { S.me.name = nm; ls.set('name', nm); } if (!S.me.name) S.me.name = 'Explorer';
  let saved = null;
  if (kind === 'daily') { try { saved = JSON.parse(ls.get('daily_' + (day || dayKey())) || 'null'); } catch (e) { saved = null; } }
  if (daily && kind !== 'daily') saved = dailyDone(kind);
  const ids = saved ? saved.ids : kind === 'daily' ? dealSeven(TOPIC_IDS, 'daily', dayNoOf(day || dayKey())) : (daily ? dealSeven(packPool(kind), kind, dayNo()) : pickSeven(packPool(kind), Math.random));
  if (ids.length < 7) return say('That pack is still being stocked. Try the daily descent or geography for now.');
  say('');
  S.mode = 'solo'; S.code = kind === 'daily' ? 'DAILY' : kind.toUpperCase();
  S.room = { host: S.me.id, phase: saved ? 'final' : 'lobby', g: 1, round: saved ? 7 : 0, rounds: 7, dives: 1, secs: 25, used: [], fixed: ids, kind, day: day || null, daily: !!daily && kind !== 'daily' };
  S.mine = freshMine(1); if (saved) S.mine.rounds = saved.rounds;
  S.players = { [S.me.id]: S.mine };
  if (saved) { window.__depth = total(S.mine) * M_PER_PT; render(); } else startRound(1);
}
// With the shared store available, today's descents are compared: where you rank, and how many chose each answer.
async function dailyStats() {
  const r = S.room; if (!S.db || !r || r.kind !== 'daily' || r.day) return;
  const mineA = r.fixed.map((id, i) => { const a = roundOf(S.mine, i + 1).a[0]; return a && a[1] >= 0 ? a[0] : ''; }), score = total(S.mine);
  try {
    const col = S.db.collection('daily/' + dayKey() + '/scores');
    if (S.canWrite !== false) await withTimeout(col.doc(S.me.id).set({ score, a: mineA }));
    const q = await withTimeout(col.limit(1000).get()), docs = q.docs.map(d => d.data()).filter(Boolean), n = docs.length;
    if (n < 2) return;
    const el = $('pct'); if (el) { el.textContent = 'deeper than ' + Math.round(docs.filter(d => (d.score || 0) < score).length / (n - 1) * 100) + '% of ' + fmt(n) + ' explorers today'; el.hidden = false; }
    mineA.forEach((nm, i) => { const e2 = $('oth-' + i); if (!e2 || !nm) return; const c = docs.filter(d => Array.isArray(d.a) && d.a[i] === nm).length - 1; e2.textContent = c > 0 ? fmt(c) + (c > 1 ? ' others' : ' other') + ' chose this' : 'nobody else chose this'; e2.hidden = false; });
  } catch (e) { /* stats are a bonus */ }
}
function finishRun() {
  const r = S.room;
  if (r.kind === 'daily' && r.day) { if (!ls.get('daily_' + r.day)) ls.set('daily_' + r.day, JSON.stringify({ ids: r.fixed, rounds: S.mine.rounds })); }
  else if (r.kind === 'daily' && !dailySaved()) {
    const t = total(S.mine), st = streakNow() + 1;
    ls.set('streak', String(st)); ls.set('lastDay', dayKey()); if (st > Number(ls.get('beststreak') || 0)) ls.set('beststreak', String(st));
    ls.set('daily_' + dayKey(), JSON.stringify({ ids: r.fixed, rounds: S.mine.rounds }));
    if (t > Number(ls.get('best') || 0)) ls.set('best', String(t));
    ls.set('played', String(Number(ls.get('played') || 0) + 1)); ls.set('sum', String(Number(ls.get('sum') || 0) + t));
  }
  else if (r.daily && !dailyDone(r.kind)) ls.set(dailyKey(r.kind), JSON.stringify({ ids: r.fixed, rounds: S.mine.rounds }));
  patchRoom({ phase: 'final' });
}
// Every accepted answer for a prompt, browsable by tier and searchable, shown once a prompt is over.
function answerBrowser(T, mine) {
  let tier = -1, q = '', shown = 100;
  const counts = [0, 0, 0, 0, 0]; T.list.forEach(e => counts[e.tier]++);
  const sorted = T.list.slice().sort((a, b) => b.tier - a.tier || (a.name < b.name ? -1 : 1));
  const tabs = h('div', { class: 'tabs', role: 'tablist' }), list = h('ul', { class: 'alist' });
  const search = h('input', { type: 'search', placeholder: 'Search all answers…', 'aria-label': 'Search answers', autocomplete: 'off', oninput: e => { q = e.target.value; shown = 100; draw(); } });
  const more = h('button', { class: 'small', type: 'button', onclick: () => { shown += 200; draw(); } });
  const tab = (i, label, n) => h('button', { class: 'small tab' + (i >= 0 ? ' t-' + TIERS[i].key : '') + (tier === i ? ' on' : ''), type: 'button', role: 'tab', 'aria-selected': String(tier === i), onclick: () => { tier = i; shown = 100; draw(); } }, label + ' ', h('b', { text: fmt(n) }));
  function draw() {
    tabs.replaceChildren(tab(-1, 'All', T.list.length), ...[4, 3, 2, 1, 0].map(i => tab(i, TIERS[i].name, counts[i])));
    const nq = norm(q), rows = sorted.filter(e => (tier < 0 || e.tier === tier) && (!nq || norm(e.name).includes(nq)));
    list.replaceChildren(...rows.slice(0, shown).map(e => h('li', { class: 't-' + TIERS[e.tier].key + (e.name === mine ? ' mine' : '') },
      tierIcon(e.tier, 16), h('span', { text: e.name }), e.name === mine && h('i', { text: 'you' }), h('b', { text: '+' + TIERS[e.tier].pts }), e.fact && h('em', { text: e.fact }))),
      ...(rows.length ? [] : [h('li', { class: 'none', text: 'nothing matches' })]));
    more.hidden = rows.length <= shown; more.textContent = fmt(Math.min(shown, rows.length)) + ' of ' + fmt(rows.length) + ' · show more';
  }
  draw();
  return h('div', { class: 'browser' }, tabs, search, list, more);
}
const BEARING = [[450, 'Pure Obscura. You were never coming back up.'], [351, 'Jaguar. Seriously deep.'], [251, 'Sloth. Well below the canopy.'], [151, 'Toucan. Holding your own.'], [0, 'Macaw. Plenty of forest left below.']];
function buildRunFinal() {
  const r = S.room, score = total(S.mine), daily = r.kind === 'daily', title = daily ? (r.day ? 'Archive descent · ' + r.day : 'Daily descent #' + dayNo()) : (r.daily ? 'Daily ' + PACKS[r.kind].label.toLowerCase() + ' #' + dayNo() : PACKS[r.kind].label + ' descent');
  const SQ = ['⬜', '🟦', '🟥', '🟪', '🟨'], rows = [], squares = [];
  r.fixed.forEach((id, i) => {
    const T = TOPICS[id], a = roundOf(S.mine, i + 1).a[0], hit = a && a[1] >= 0;
    squares.push(hit ? SQ[a[1]] : '⬛');
    const toggle = h('button', { class: 'small plus', type: 'button', 'aria-expanded': 'false', 'aria-label': 'Show every answer for prompt ' + (i + 1), text: '+' });
    toggle.addEventListener('click', () => { const body = toggle.closest('.logrow').querySelector('.logbody'), open = body.querySelector('.browser'); if (open) { open.remove(); toggle.textContent = '+'; toggle.setAttribute('aria-expanded', 'false'); } else { body.append(answerBrowser(T, hit ? a[0] : null)); toggle.textContent = '−'; toggle.setAttribute('aria-expanded', 'true'); } });
    rows.push(h('li', { class: 'logrow' },
      h('span', { class: 'num', text: String(i + 1) }),
      h('div', { class: 'logbody' },
        h('p', { class: 'q', text: T.name }),
        h('div', { class: 'a' }, hit ? h('ul', { class: 'chips' }, chip(a[0], a[1], '+' + TIERS[a[1]].pts)) : h('span', { class: 'note', text: 'nothing landed' }), h('span', { class: 'note oth', id: 'oth-' + i, hidden: true })),
        h('p', { class: 'gem' }, tierIcon(4, 16), h('span', { text: T.star.name }), T.star.fact && h('em', { text: T.star.fact }))),
      toggle));
  });
  const share = 'Obscura · ' + title.toLowerCase() + '\n' + score + ' pts · -' + fmt(score * M_PER_PT) + 'm\n' + squares.join('');
  let next = '';
  if (daily) { const n = new Date(), m = new Date(n.getFullYear(), n.getMonth(), n.getDate() + 1), mins = Math.ceil((m - n) / 60000); next = 'next descent in ' + Math.floor(mins / 60) + 'h ' + String(mins % 60).padStart(2, '0') + 'm'; }
  return h('section', { class: 'final run' }, topBar(),
    h('p', { class: 'eyebrow', text: title + ' complete' }),
    h('div', { class: 'bigscore' }, h('b', { text: String(score) }), h('span', { text: '-' + fmt(score * M_PER_PT) + 'm' })),
    h('p', { class: 'bearing', text: (BEARING.find(b => score >= b[0]) || BEARING[4])[1] }),
    h('p', { class: 'note', id: 'pct', style: 'text-align:center', hidden: true }),
    // how each prompt landed: longer bars went deeper
    h('div', { class: 'bars', role: 'img', 'aria-label': 'Depth reached on each prompt' }, r.fixed.map((id, i) => { const a = roundOf(S.mine, i + 1).a[0], hit = a && a[1] >= 0, pts = hit ? TIERS[a[1]].pts : 0; return h('div', { class: 'dbar' }, h('i', { style: 'height:' + Math.max(4, Math.round(pts * 0.9)) + 'px;background:' + (hit ? TIERS[a[1]].color : '#3a4a3e') + ';animation-delay:' + (0.3 + i * 0.08) + 's' }), h('b', { text: hit ? '+' + pts : '0', style: 'color:' + (hit ? TIERS[a[1]].color : '#8fae8f') + ';animation-delay:' + (0.6 + i * 0.08) + 's' }), h('span', { text: String(i + 1) })); })),
    h('div', { class: 'actions', style: 'justify-content:center' },
      h('button', { type: 'button', text: 'Copy result', onclick: e => { const b = e.currentTarget; (navigator.clipboard ? navigator.clipboard.writeText(share) : Promise.reject()).then(() => { b.textContent = 'Copied'; }, () => { b.textContent = 'Copy blocked'; }); } }),
      !daily && h('button', { class: 'go', type: 'button', style: 'align-self:center', text: '▼ Another seven ▼', onclick: () => { const k = r.kind; leave(); startRun(k); } }),
      h('button', { type: 'button', text: 'Home', onclick: leave })),
    daily && h('p', { class: 'note', style: 'text-align:center' }, 'streak ' + streakNow() + ' · played ' + (ls.get('played') || 1) + ' · avg ' + Math.round(Number(ls.get('sum') || score) / Number(ls.get('played') || 1)) + ' · best ' + (ls.get('best') || score)),
    daily && h('p', { class: 'note', id: 'nextin', style: 'text-align:center', text: next }),
    panel('The bearing', null, h('ul', { class: 'bearings' }, [['0–150', 0], ['151–250', 1], ['251–350', 2], ['351–449', 3], ['450+', 4]].map(([range, t], i) => h('li', { class: 't-' + TIERS[t].key + ((score >= [0, 151, 251, 351, 450][i] && (i === 4 || score < [151, 251, 351, 450][i])) ? ' here' : '') }, tierIcon(t, 16), h('b', { text: range }), h('span', { text: BEARING[4 - i][1] }))))),
    panel('The descent log', 'tap + for every answer', h('ol', { class: 'log' }, rows)));
}

/* ---------- game flow ---------- */
function startRound(n) {
  const r = S.room;
  if (r.fixed) { const now = Date.now(); return patchRoom({ phase: 'play', round: n, topic: r.fixed[n - 1], startsAt: now + 2600, endsAt: now + 2600 + (r.secs + 14) * 1000 }); }
  let used = r.used || [];
  let pool = TOPIC_IDS.filter(id => !used.includes(id));
  if (pool.length < 3) { used = []; pool = TOPIC_IDS.slice(); }
  const order = ordered().map(p => p.id), picks = [];
  for (const id of shuffle(pool)) { if (usable(id)) picks.push(id); if (picks.length === 3) break; }
  patchRoom({
    phase: 'pick', round: n, options: picks, used,
    picker: order[(n - 1) % order.length] || S.me.id, pickEndsAt: Date.now() + PICK_MS, topic: '',
  });
}
function choose(topicId) {
  const r = S.room;
  if (r.phase !== 'pick' || !TOPICS[topicId]) return;
  const now = Date.now();
  patchRoom({
    phase: 'play', topic: topicId, used: [...(r.used || []), topicId],
    startsAt: now + COUNTDOWN_MS, endsAt: now + COUNTDOWN_MS + (r.dives || 5) * (r.secs + 9) * 1000,
  });
}
function next() {
  const r = S.room;
  if (r.phase !== 'reveal') return;
  if (r.round < r.rounds) startRound(r.round + 1);
  else patchRoom({ phase: 'final' });
}
function again() {
  if (S.mode === 'solo') { S.room.g++; S.mine = freshMine(S.room.g, S.mine.joinedAt); S.players = { [S.me.id]: S.mine }; startRound(1); return; }
  patchRoom({ phase: 'lobby', g: S.room.g + 1, round: 0 });
}
function once(key, fn) { if (S.done === key) return; S.done = key; fn(); }

function diveState() {
  const r = S.room, key = S.code + ':' + r.g + ':' + r.round;
  if (!S.dive || S.dive.key !== key) S.dive = { key, stage: 'wait', i: roundOf(S.mine, r.round).a.length, until: 0, hit: null };
  return S.dive;
}
function setStage(stage, ms, extra) {
  Object.assign(diveState(), extra || {}, { stage, until: ms ? Date.now() + ms : 0 });
  document.body.classList.toggle('sinking', stage === 'sink');
  document.body.classList.toggle('quiet', stage === 'landed' || stage === 'done');
  // the spotlight: dark everywhere but around the answer while it falls, lifting a couple of seconds after it lands
  document.body.classList.toggle('spot', stage === 'sink' || stage === 'landed'); clearTimeout(setStage._spot);
  if (stage === 'landed') setStage._spot = setTimeout(() => document.body.classList.remove('spot'), 2300);
  if (stage !== 'sink') window.__lines = null;
  renderDive();
}
// Lock one answer in (or a timeout when hit is null) and play its descent.
function lockIn(hit) {
  const r = S.room, d = diveState();
  if (S.mine.g !== r.g) S.mine = freshMine(r.g, S.mine.joinedAt);
  const rd = S.mine.rounds[r.round] || (S.mine.rounds[r.round] = { a: [], pts: 0 });
  rd.a.push(hit ? [hit.name, hit.tier] : ['', -1]);
  if (hit) rd.pts += TIERS[hit.tier].pts;
  d.i = rd.a.length; S.fb = null;
  $('edge').classList.remove('hot');
  saveMe();
  if (hit) {
    const dur = [3.4, 3.0, 3.4, 4.3, 4.6][hit.tier], to = total(S.mine) * M_PER_PT, box = $('answer');
    if (window.__fx && box) window.__fx.submit(box.getBoundingClientRect());
    window.__depth = to;
    window.__sink = { to, dur, start: performance.now() };
    window.__lines = { id: Date.now() + Math.random(), base: to - TIERS[hit.tier].pts * M_PER_PT, tier: hit.tier, label: '“' + hit.name + '” ▼' };
    setStage('sink', dur * 1000 + 450, { hit });
  } else { if (window.__fx) window.__fx.miss(); setStage('landed', 5000, { hit: null }); }
  refresh();
}
function advance() {
  const r = S.room, d = diveState();
  if (d.stage !== 'landed') return;
  restart($('crt'), 'zap'); snd('descend');
  if (d.i >= (r.dives || 5)) { if (r.fixed) { if (r.round < r.rounds) startRound(r.round + 1); else finishRun(); return; } setStage('done'); } else setStage('ask', r.secs * 1000);
}
function submit(ev) {
  ev.preventDefault();
  const r = S.room, input = $('answer'), d = diveState();
  if (!input || r.phase !== 'play' || d.stage !== 'ask') return;
  const text = input.value.trim();
  if (!text) return;
  const m = match(r.topic, text), form = input.closest('form'), typed = '“' + text.slice(0, 30) + '”';
  const say2 = (fb) => { S.fb = fb; renderFb(); };
  if ((!m || m.amb) && SET.clear) input.value = '';
  if (m && m.amb) { restart(form, 'jolt'); return say2({ kind: 'miss', text: typed + ' fits more than one answer', sub: 'be more specific' }); }
  if (!m) { restart(form, 'jolt'); if (window.__fx) window.__fx.reject(); return say2({ kind: 'miss', text: typed + ': no trace of that. try again' }); }
  const hit = m.e;
  if (roundOf(S.mine, r.round).a.some(x => x[0] === hit.name)) { restart(form, 'jolt'); return say2({ kind: 'dup', text: '“' + hit.name + '” is already in your notebook' }); }
  const changed = norm(text) !== norm(hit.name);
  if ((m.fix && SET.corr) || (changed && S.shown !== hit.name)) {
    S.shown = hit.name;
    input.value = hit.name;
    snd('fix');
    say2({ kind: 'fix', text: typed + ' → “' + hit.name + '”', sub: m.dip ? 'lucky dip · press enter again to take it · or edit' : 'corrects to this · press enter again to confirm · or edit' });
    return restart($('fb'), 'pop');
  }
  S.shown = null;
  lockIn(hit);
}
function renderFb() {
  const fb = $('fb'); if (!fb) return;
  fb.replaceChildren(...(S.fb ? [h('p', { text: S.fb.text }), S.fb.sub && h('small', { text: S.fb.sub })].filter(Boolean) : []));
  fb.className = 'fb ' + (S.fb ? 'f-' + S.fb.kind : '');
}
function restart(el, cls) { if (!el) return; el.classList.remove(cls); void el.offsetWidth; el.classList.add(cls); }
const fxOn = name => S.fx && Date.now() < S.fx.until && (name == null || S.fx.name === name);

/* ---------- shared pieces ---------- */
const chip = (name, tier, extra, n) => h('li', { class: 'chip t-' + TIERS[tier].key, style: n != null ? '--n:' + n : null }, tierIcon(tier, 16), h('span', { text: name }), extra != null && h('b', { text: extra }));
function tierLegend() {
  return h('ul', { class: 'legend', 'aria-label': 'Answer tiers' }, TIERS.map((t, i) => chip(t.name, i, '+' + t.pts)));
}
const panel = (title, aside, ...kids) => h('div', { class: 'panel' },
  h('div', { class: 'ph' }, h('span', { text: title }), aside && h('em', { text: aside })), kids);
function logo() {
  let i = 0;
  return h('h1', { class: 'logo', 'aria-label': 'Obscura' }, ['OBSCURA'].map(w =>
    h('span', { class: 'word', 'aria-hidden': 'true' }, [...w].map(c => h('span', { style: '--i:' + (i++), text: c })))));
}
const yPct = d => Math.sqrt(Math.min(d, MAX_DEPTH) / MAX_DEPTH) * 100;
function gaugeEl() {
  return h('div', { class: 'gauge', id: 'gauge', role: 'img', 'aria-label': 'Depth of each diver' },
    TICKS.map(([m, , label]) => h('div', { class: m === MAX_DEPTH ? 'tick floor' : 'tick', style: 'top:' + yPct(m) + '%' },
      h('span', { text: label }), h('i', { text: fmt(m) + 'm' }))),
    h('div', { class: 'lanes', id: 'lanes' }));
}
function refreshGauge() {
  const lanes = $('lanes'); if (!lanes) return;
  const ps = ordered();
  const seen = new Set();
  ps.forEach((p, i) => {
    let m = lanes.querySelector('[data-id="' + p.id + '"]');
    if (!m) { m = h('div', { class: 'diver', 'data-id': p.id }, h('img', { class: 'spr', width: 28, height: 28, alt: '' }), h('span')); lanes.append(m); }
    const src = sprite('krill', COLORS[i % COLORS.length]);
    if (m.firstChild.getAttribute('src') !== src) m.firstChild.setAttribute('src', src);
    m.lastChild.textContent = p.id === S.me.id ? 'you' : nameOf(p).slice(0, 3);
    m.lastChild.style.color = COLORS[i % COLORS.length];
    m.style.top = yPct(depthOf(p)) + '%';
    m.style.left = ((i + 0.5) / ps.length * 100) + '%';
    m.classList.toggle('me', p.id === S.me.id);
    m.title = nameOf(p) + ', ' + fmt(depthOf(p)) + ' m';
    seen.add(p.id);
  });
  lanes.querySelectorAll('.diver').forEach(m => { if (!seen.has(m.dataset.id)) m.remove(); });
}
function boardRows(withRound) {
  const r = S.room;
  return ordered().sort((a, b) => total(b) - total(a)).map((p, i) => h('li', { class: p.id === S.me.id ? 'me' : '' },
    icon('krill', colorOf(p.id), 24),
    h('span', { class: 'who', text: nameOf(p) + (p.id === S.me.id ? ' (you)' : '') }),
    withRound && h('span', { class: 'count', text: roundOf(p, r.round).a.length + '/' + (r.dives || 5) }),
    h('span', { class: 'depth' + (p.id === S.me.id && fxOn() ? ' slam' : ''), text: fmt(depthOf(p)) + 'm' })));
}
function topBar() {
  return h('header', { class: 'bar' },
    h('span', { class: 'brand', text: 'Obscura' }),
    S.mode === 'online' ? h('span', { class: 'code', text: 'Room ' + S.code }) : h('span', { class: 'code', text: S.room && S.room.fixed ? (S.room.kind === 'daily' ? 'Daily descent' : PACKS[S.room.kind].label + ' pack') : 'Solo descent' }),
    h('button', { class: 'ghost small', type: 'button', onclick: leave, text: 'Leave' }));
}

/* ---------- screens ---------- */
const HOWTO = ['Seven prompts a day. The same for everyone.', '25 seconds to name one thing.', 'Rare answers score big. Obvious ones barely move you.', 'Every point drops you 10 metres. 700 is the forest floor of legend.', 'A bare name is a lucky dip: it lands on one answer that carries it.', 'One daily descent. Packs, rooms and free play are unlimited.'];
/* ---------- the menu, laid out like Krillion's: a grid of tiles for every place you can go ---------- */
function modal(id, label, title, ...kids) {
  const old = $(id); if (old) old.remove();
  const close = () => { const m = $(id); if (m) m.remove(); };
  const m = h('div', { id, class: 'modal', role: 'dialog', 'aria-label': title, onclick: e => { if (e.target.id === id) close(); } },
    h('div', { class: 'panel sheet' },
      h('div', { class: 'sheethead' }, h('div', null, h('small', { text: label }), h('h2', { text: title })), h('button', { class: 'small x', type: 'button', 'aria-label': 'Close', onclick: close, text: '×' })),
      kids));
  document.body.append(m); m.close = close; return m;
}
const goHome = () => { if (S.mode) leave(); document.querySelectorAll('.modal').forEach(m => m.remove()); };
function openMenu() {
  const here = !S.mode ? 'home' : S.room && S.room.fixed ? S.room.kind : S.mode;
  const tile = (key, glyph, label, fn, art) => h('button', { class: 'tile' + (here === key ? ' on' : ''), type: 'button', onclick: () => { document.querySelectorAll('.modal').forEach(m => m.remove()); fn(); } }, art ? icon(art[0], art[1], 24) : h('i', { text: glyph }), h('span', { text: label }));
  modal('menu', 'Obscura', 'Menu',
    h('div', { class: 'ph' }, h('span', { text: 'Drop in' })),
    h('div', { class: 'tiles' },
      tile('daily', '↓', 'Daily descent', () => { goHome(); startRun('daily'); }),
      tile('solo', '∞', 'Free play', () => { goHome(); startSolo(); }),
      tile('online', '', 'Party room', () => { goHome(); const n = $('nick'); if (n) n.focus(); }, ['krill', '#ff7a45']),
      tile('archive', '⟲', 'Archive', () => { goHome(); openArchive(); }),
      tile('packs', '▦', 'Themed packs', () => { goHome(); openPacks(); }),
      tile('me', '☻', 'My Obscura', openMe),
      tile('settings', '⚙', 'Settings', openSettings),
      tile('faq', '?', 'How to play', openHowto),
      S.mode && tile('home', '⌂', 'Home', goHome)),
    h('p', { class: 'fine', style: 'text-align:left', text: 'pure obscura.' }));
}
function openHowto() { modal('howto', 'Obscura', 'How to play', h('ul', { class: 'howlist' }, HOWTO.map(tx => h('li', { text: tx }))), h('div', { class: 'ph' }, h('span', { text: 'The finds' })), tierLegend()); }
function openPacks() {
  modal('packs', 'Seven prompts', 'Themed packs',
    h('div', { class: 'ph' }, h('span', { text: 'Today’s' })),
    h('div', { class: 'tiles' }, Object.keys(PACKS).map(k => h('button', { class: 'tile' + (dailyDone(k) ? ' on' : ''), type: 'button', disabled: packPool(k).length < 7, onclick: () => { goHome(); startRun(k, null, true); } }, h('i', { text: dailyDone(k) ? '✓' : '↓' }), h('span', { text: 'Daily ' + PACKS[k].label.toLowerCase() }), h('small', { text: dailyDone(k) ? 'see result' : 'same seven for everyone' })))),
    h('div', { class: 'ph' }, h('span', { text: 'Unlimited' })),
    h('div', { class: 'tiles' }, Object.keys(PACKS).map(k => { const n = packPool(k).length; return h('button', { class: 'tile', type: 'button', disabled: n < 7, onclick: () => { goHome(); startRun(k); } }, h('i', { text: k === 'geo' ? '◍' : '◆' }), h('span', { text: PACKS[k].label }), h('small', { text: n < 7 ? 'being stocked' : n + ' prompts' })); })),
    h('p', { class: 'note', text: 'One answer per prompt, 25 seconds each. Play as often as you like.' }));
}
// past daily descents: play any you missed (they do not count towards your streak)
function openArchive() {
  const rows = [];
  for (let back = 1; back <= 14; back++) {
    const d = new Date(); d.setDate(d.getDate() - back);
    const key = d.getFullYear() + '-' + String(d.getMonth() + 1).padStart(2, '0') + '-' + String(d.getDate()).padStart(2, '0'), no = dayNo() - back;
    if (no < 1) break;
    let saved = null; try { saved = JSON.parse(ls.get('daily_' + key) || 'null'); } catch (e) { /* unreadable */ }
    const score = saved ? Object.values(saved.rounds).reduce((t, r) => t + (r.pts || 0), 0) : null;
    rows.push(h('li', null, h('span', { text: '#' + no + ' · ' + d.toLocaleDateString(undefined, { weekday: 'short', day: 'numeric', month: 'short' }) }), h('b', { text: score == null ? '' : score + ' pts' }),
      h('button', { class: 'small', type: 'button', text: saved ? 'Result' : 'Play', onclick: () => { goHome(); startRun('daily', key); } })));
  }
  modal('archive', 'Past descents', 'Archive', rows.length ? h('ul', { class: 'archlist' }, rows) : h('p', { class: 'note', text: 'Nothing here yet. Today is descent #1; yesterday’s will appear here tomorrow.' }));
}
function openMe() {
  const played = Number(ls.get('played') || 0), stat = (k, v) => h('li', null, h('span', { text: k }), h('b', { text: String(v) }));
  modal('me', 'Logbook', 'My Obscura',
    h('ul', { class: 'stats' }, stat('Streak', streakNow()), stat('Best streak', bestStreak()), stat('Played', played), stat('Average', played ? Math.round(Number(ls.get('sum') || 0) / played) : 0), stat('Best', ls.get('best') || 0)),
    h('div', { class: 'ph' }, h('span', { text: 'Companion' })),
    h('div', { class: 'pals' }, PALS.map(p => { const open = bestStreak() >= p.need, b = h('button', { class: 'pal' + (window.__pal.id === p.id ? ' on' : ''), type: 'button', disabled: !open, 'aria-label': p.name }, icon(p.art, open ? p.color : '#3a4a3e', 32), h('span', { text: p.name }), h('small', { text: open ? (p.need ? p.need + '-day' : 'starter') : p.need + '-day streak' })); b.addEventListener('click', () => { setPal(p.id); b.parentElement.querySelectorAll('.pal').forEach(x => x.classList.toggle('on', x === b)); }); return b; })));
}
function buildHome() {
  return h('section', { class: 'home' },
    logo(),
    h('p', { class: 'tag', text: 'The daily descent' }),
    h('p', { class: 'lede', text: '7 prompts · 25 seconds each · rarer answers drop deeper' }),
    h('details', { class: 'howto' }, h('summary', { text: 'How to play' }), h('ul', null, HOWTO.map(tx => h('li', { text: tx })))),
    h('p', { id: 'msg', class: 'msg', role: 'status', hidden: true }),
    panel('Party room', 'play together',
      h('label', { for: 'nick', text: 'Your name' }),
      h('input', { id: 'nick', maxlength: '16', autocomplete: 'off', value: S.me.name, placeholder: 'what the crew calls you' }),
      h('div', { class: 'partyrow' },
        h('button', { id: 'create', type: 'button', onclick: createRoom, text: 'Host a room' }),
        h('form', { class: 'joinrow', onsubmit: e => { e.preventDefault(); joinRoom($('code').value, false); } },
          h('input', { id: 'code', maxlength: '4', autocomplete: 'off', autocapitalize: 'characters', placeholder: 'KRLP', 'aria-label': 'Room code' }),
          h('button', { id: 'join', class: 'pink', text: 'Join' }))),
      h('p', { id: 'net', class: 'note' })),
    h('button', { id: 'daily', class: 'go big', type: 'button', onclick: () => startRun('daily'), text: dailySaved() ? '▼ Today’s result ▼' : '▼ Begin descent ▼' }),
    h('div', { class: 'dailies' }, Object.keys(PACKS).map(k => h('button', { type: 'button', disabled: packPool(k).length < 7, onclick: () => startRun(k, null, true) }, h('small', { text: dailyDone(k) ? 'done · see result' : 'today’s seven' }), h('span', { text: (dailyDone(k) ? '✓ ' : '▼ ') + 'Daily ' + PACKS[k].label.toLowerCase() })))),
    h('div', { class: 'homerow' },
      h('span', { class: 'note', text: 'descent #' + dayNo() }),
      h('button', { class: 'small', type: 'button', onclick: openArchive, text: 'Archive ⟲' }),
      h('button', { class: 'small', type: 'button', onclick: openPacks, text: 'Themed packs' }),
      h('button', { class: 'small', type: 'button', onclick: startSolo, text: 'Free play ∞' })));
}
function refreshHome() {
  const net = $('net'); if (!net) return;
  const ready = S.dbState === 'ready' && S.canWrite !== false;
  $('create').disabled = !ready; $('join').disabled = !ready; $('code').disabled = !ready;
  const msgEl = $('msg'); if (msgEl && msgEl.parentElement !== $('daily').parentElement.parentElement) { /* keep messages near the top */ }
  net.textContent = S.dbState === 'wait' ? 'Connecting to online rooms…'
    : S.dbState === 'none' ? 'Party rooms are not switched on here yet. Everything else is playable.'
    : S.canWrite === false ? 'You have view-only access, so you cannot join a room here. You can still practise solo.'
    : '';
  net.hidden = !net.textContent;
  say(S.msg);
}

function buildLobby() {
  const host = isHost();
  const opt = (id, label, values, unit) => h('label', { class: 'opt', for: id }, label,
    h('select', { id, disabled: !host, onchange: e => patchRoom({ [id.slice(2)]: Number(e.target.value) }) },
      values.map(v => h('option', { value: v, text: v + unit }))));
  return h('section', { class: 'lobby' }, topBar(),
    panel('Room code', null,
      h('div', { class: 'bigcode' }, h('span', { id: 'codetext', text: S.code }),
        h('button', { class: 'small', type: 'button', text: 'Copy', onclick: e => {
          const b = e.currentTarget;
          (navigator.clipboard ? navigator.clipboard.writeText(S.code) : Promise.reject()).then(() => { b.textContent = 'Copied'; }, () => {
            const s = getSelection(), rg = document.createRange(); rg.selectNodeContents($('codetext')); s.removeAllRanges(); s.addRange(rg);
          });
        } })),
      ),
    panel('Explorers', null, h('ol', { id: 'board', class: 'board' })),
    panel('Expedition plan', null,
      h('div', { class: 'opts' }, opt('o-rounds', 'Prompts', [3, 5, 7], ''), opt('o-dives', 'Answers per prompt', [3, 5, 7], ''), opt('o-secs', 'Seconds per answer', [15, 25, 40], ' s'))),
    host ? h('button', { class: 'go', type: 'button', onclick: () => startRound(1), text: '▼ Begin descent ▼' })
         : h('p', { class: 'note', id: 'waithost', style: 'text-align:center', text: 'Waiting for the host to set off.' }),
    h('p', { id: 'msg', class: 'msg', role: 'status', hidden: true }));
}
function refreshLobby() {
  $('board').replaceChildren(...ordered().map(p => h('li', { class: p.id === S.me.id ? 'me' : '' },
    h('span', { class: 'dot', style: 'background:' + colorOf(p.id) }),
    h('span', { class: 'who', text: nameOf(p) + (p.id === S.me.id ? ' (you)' : '') }),
    p.id === S.room.host && h('span', { class: 'count', text: 'host' }))));
  $('o-rounds').value = S.room.rounds; $('o-dives').value = S.room.dives || 5; $('o-secs').value = S.room.secs;
}

function buildPick() {
  const r = S.room, mineToPick = r.picker === S.me.id;
  return h('section', { class: 'pick' }, topBar(),
    h('p', { class: 'eyebrow', text: 'Round ' + r.round + ' of ' + r.rounds }),
    h('h2', { text: mineToPick ? 'Choose the prompt' : nameOf(S.players[r.picker]) + ' is choosing' }),
    h('p', { class: 'note', id: 'clock' }),
    h('div', { class: 'cards' }, (r.options || []).map(id => {
      const T = TOPICS[id]; if (!T) return null;
      return h('button', { class: 'card', type: 'button', disabled: !mineToPick, onclick: () => choose(id) },
        h('strong', { text: T.name }), h('span', { text: T.blurb }));
    })),
    panel('Standings', null, h('ol', { id: 'board', class: 'board' })));
}

function buildPlay() {
  const r = S.room;
  return h('section', { class: 'play' }, topBar(),
    h('div', { class: 'hud' },
      h('div', { class: 'hudbox' }, h('span', { text: 'Depth' }), h('b', { id: 'hud-depth', text: '0m' })),
      h('div', { class: 'pipwrap' }, h('div', { class: 'pips', id: 'pips' }), h('span', { id: 'pipnote' })),
      h('div', { class: 'hudbox right' }, h('span', { text: 'Score' }), h('b', { id: 'hud-score', text: '0' }))),
    h('div', { class: 'split' },
      h('div', { class: 'main' }, h('div', { id: 'stage', class: 'stage' }), panel('Explorers', null, h('ol', { id: 'board', class: 'board' }))),
      h('aside', null, gaugeEl())));
}
function promptCard() {
  const r = S.room, d = diveState(), T = TOPICS[r.topic] || { name: '?' };
  return h('div', { class: 'panel topic' },
    h('p', { class: 'eyebrow pinkish', text: r.fixed ? 'Prompt ' + r.round + ' of ' + r.rounds : 'Answer ' + Math.min(d.i + 1, r.dives || 5) + ' of ' + (r.dives || 5) }),
    h('h2', { text: T.name }),
    h('p', { class: 'note', text: '▼ rarer answers drop deeper ▼' }));
}
function renderDive() {
  const st = $('stage'); if (!st) return;
  const r = S.room, d = diveState(), K = r.dives || 5;
  let kids;
  if (d.stage === 'wait') kids = [promptCard(), h('p', { id: 'clock', class: 'pill' })];
  else if (d.stage === 'ask') kids = [promptCard(),
    h('form', { class: 'ans', onsubmit: submit },
      h('div', { id: 'ring', class: 'ring', 'aria-hidden': 'true' }),
      h('div', { class: 'field' },
        h('input', { id: 'answer', autocomplete: 'off', autocapitalize: 'off', autocorrect: 'off', spellcheck: 'false', enterkeyhint: 'send', placeholder: 'type one answer…', 'aria-label': 'Your answer', oninput: e => window.__fx && window.__fx.type(e.target) }),
        h('div', { class: 'air', 'aria-hidden': 'true' }, h('div', { id: 'airbar' }))),
      h('button', { id: 'send', class: 'pink', text: 'Drop' })),
    h('div', { id: 'fb', class: 'fb', role: 'status' })];
  else if (d.stage === 'sink') return;
  else if (d.stage === 'landed') {
    const hit = d.hit, last = r.fixed ? r.round >= r.rounds : d.i >= K, btn = h('button', { class: 'go', type: 'button', onclick: advance, text: last ? '▲ Climb out ▲' : '▼ Descend ▼' });
    if (hit) {
      const T = TIERS[hit.tier];
      kids = [h('div', { class: 'landed t-' + T.key }, tierIcon(hit.tier, 72, 'bigicon'),
        h('h2', { class: 'tname', 'aria-label': hit.tier === 4 ? 'Pure Obscura' : T.name, style: '--n:' + (hit.tier === 4 ? 12 : T.name.length) }, [...(hit.tier === 4 ? 'Pure Obscura' : T.name)].map((ch, i) => h('span', { 'aria-hidden': 'true', style: 'animation-delay:' + (0.28 + i * 0.055).toFixed(3) + 's', text: ch === ' ' ? '\u00a0' : ch }))),
        h('p', { class: 'tans', text: '“' + hit.name + '”' }),
        h('p', { class: 'tpts' }, h('b', { class: 'ptsup', 'data-pts': String(T.pts), text: '+0 PTS' }), ' · drop ' + fmt(T.pts * M_PER_PT) + 'm'),
        h('p', { class: 'note', text: hit.fact || T.line }), btn)];
      // what has this player done so far this game?
      const all = Object.keys(S.mine.rounds).sort((a, b) => a - b).flatMap(k2 => S.mine.rounds[k2].a).filter(x => x[1] >= 0), before = all.slice(0, -1);
      let streak = 0; for (let q = all.length - 1; q >= 0 && all[q][1] >= 2; q--) streak++;
      const best = before.length > 0 && hit.tier >= 1 && before.every(x => x[1] < hit.tier);
      const tags = [best && 'your deepest find yet', streak >= 2 && streak + ' rare finds in a row'].filter(Boolean);
      if (tags.length) { kids[0].insertBefore(h('p', { class: 'badges' }, tags.map(tx => h('span', { text: tx }))), kids[0].children[1]); setTimeout(() => snd('best'), 650); }
      // the points leave the card and land in the score
      const sc = $('hud-score');
      const nL = hit.tier === 4 ? 12 : T.name.length, tUp = 150;
      // the points tick up on the card, then lift off and land in the score
      setTimeout(() => {
        const b = document.querySelector('.landed .ptsup'); if (!b) return;
        const t0 = performance.now(), ms = 380 + hit.tier * 90;
        const step = now => { if (!b.isConnected) return; const o = Math.min((now - t0) / ms, 1); b.textContent = '+' + Math.round(T.pts * (1 - Math.pow(1 - o, 3))) + ' PTS'; if (o < 1) requestAnimationFrame(step); else { b.classList.add('pop'); snd('ding'); } };
        requestAnimationFrame(step);
        setTimeout(() => { if (b.isConnected) b.textContent = '+' + T.pts + ' PTS'; }, ms + 400);
      }, tUp);
      setTimeout(() => {
        const b = document.querySelector('.landed .ptsup'); if (!sc || !sc.isConnected || !b) return;
        const rc = sc.getBoundingClientRect(), rb = b.getBoundingClientRect(), x0 = rb.left + rb.width / 2, y0 = rb.top + rb.height / 2;
        const fly = h('span', { class: 'fly t-' + T.key, 'aria-hidden': 'true', text: '+' + T.pts, style: 'left:' + Math.round(x0) + 'px;top:' + Math.round(y0) + 'px;--dx:' + Math.round(rc.left + rc.width / 2 - x0) + 'px;--dy:' + Math.round(rc.top + rc.height / 2 - y0) + 'px' });
        document.body.append(fly); setTimeout(() => { fly.remove(); if (sc.isConnected) restart(sc, 'slam'); }, 820);
      }, tUp + 750);
      
    } else kids = [h('div', { class: 'landed' }, h('h2', { class: 'tname miss', text: 'Lost your grip' }), h('p', { class: 'tans', text: '—' }),
      h('p', { class: 'tpts', text: '+0 PTS' }), h('p', { class: 'note', text: 'the clock beat you to it.' }), btn)];
  } else kids = [h('div', { class: 'landed' }, h('h2', { class: 'tname miss', text: 'Descent complete' }),
    h('ul', { class: 'chips', style: 'justify-content:center' }, roundOf(S.mine, r.round).a.filter(x => x[1] >= 0).map(([n, t]) => chip(n, t, '+' + TIERS[t].pts))),
    h('p', { class: 'note', text: 'waiting for the other explorers to climb out.' }))];
  st.replaceChildren(...kids);
  const f = st.querySelector('#answer, button.go'); if (f) f.focus();
}
function refreshPlay() {
  const r = S.room, d = diveState(), K = r.dives || 5, mine = roundOf(S.mine, r.round);
  if (!$('stage').firstChild) renderDive();
  const shown = d.stage === 'sink' ? mine.a.slice(0, -1) : mine.a;
  $('pips').replaceChildren(...Array.from({ length: K }, (_, i) => h('i', { class: i < shown.length ? 'done' : i === shown.length ? 'now' : '', style: i < shown.length && shown[i][1] >= 0 ? 'background:' + TIERS[shown[i][1]].color : null })));
  if (r.fixed) {
    // a run shows one pip per prompt, coloured by how each landed
    $('pips').replaceChildren(...Array.from({ length: r.rounds }, (_, i) => { const a = roundOf(S.mine, i + 1).a[0], done = a && (i + 1 < r.round || d.stage !== 'sink'); return h('i', { class: done ? 'done' : i + 1 === r.round ? 'now' : '', style: done ? 'background:' + (a[1] >= 0 ? TIERS[a[1]].color : '#3a4a3e') : null }); }));
  }
  $('pipnote').textContent = 'prompt ' + r.round + ' of ' + r.rounds;
  const held = d.stage === 'sink' && d.hit ? TIERS[d.hit.tier].pts : 0, pts = total(S.mine) - held;
  const sc = $('hud-score');
  if (sc._to !== pts) {
    const from = sc._to == null ? pts : Number(sc.textContent) || 0, t0 = performance.now() + (sc._to == null ? 0 : d.stage === 'landed' && d.hit ? 1150 : 520), big = d.hit && d.hit.tier === 4, ms = big ? 1300 : 600 + (d.hit ? d.hit.tier * 120 : 0);
    sc._to = pts;
    const step = now => { if (sc._to !== pts || !sc.isConnected) return; if (now < t0) return requestAnimationFrame(step); const o = Math.min((now - t0) / ms, 1), a = 1 - Math.pow(1 - o, 4); sc.textContent = String(Math.round(from + (pts - from) * (big && a < 0.9 ? 1.06 * a : a))); if (o < 1) { if (pts !== from && now - (sc._tk || 0) > 55) { sc._tk = now; snd('tally', o); } requestAnimationFrame(step); } else { sc.textContent = String(pts); if (pts !== from) { restart(sc, 'slam'); snd('ding'); } } };
    requestAnimationFrame(step);
    setTimeout(() => { if (sc.isConnected && sc._to === pts) sc.textContent = String(pts); }, Math.max(0, t0 - performance.now()) + ms + 400);
  }
  $('board').replaceChildren(...boardRows(true));
  window.__depth = total(S.mine) * M_PER_PT;
}
function buildReveal() {
  const r = S.room, T = TOPICS[r.topic] || { name: '?' };
  return h('section', { class: 'reveal' }, topBar(),
    h('p', { class: 'eyebrow', text: 'Round ' + r.round + ' of ' + r.rounds + ' · ' + T.name }),
    h('h2', { text: 'Back at camp' }),
    h('div', { class: 'split' },
      h('div', { class: 'main' },
        h('div', { id: 'results', class: 'results' }),
        h('div', { id: 'missed' }),
        h('div', { id: 'allans' }, h('button', { class: 'small', type: 'button', text: 'See every answer', onclick: e => { const box = $('allans'), open = box.querySelector('.browser'); if (open) { open.remove(); e.currentTarget.textContent = 'See every answer'; } else if (TOPICS[S.room.topic]) { const mineA = roundOf(S.mine, S.room.round).a.filter(x => x[1] >= 0).map(x => x[0]); box.append(answerBrowser(TOPICS[S.room.topic], mineA[0] || null)); e.currentTarget.textContent = 'Hide answers'; } } })),
        h('button', { id: 'next', class: 'go', type: 'button', onclick: next, hidden: !isHost(), text: r.round < r.rounds ? '▼ Next round ▼' : '▼ Final depths ▼' }),
        !isHost() && h('p', { class: 'note', id: 'waithost', style: 'text-align:center', text: 'Waiting for the host to continue.' })),
      h('aside', null, gaugeEl())));
}
function refreshReveal() {
  const r = S.room, T = TOPICS[r.topic];
  const ps = ordered().sort((a, b) => roundOf(b, r.round).pts - roundOf(a, r.round).pts);
  $('results').replaceChildren(...ps.map(p => {
    const rd = roundOf(p, r.round);
    return h('article', { class: 'panel haul' + (p.id === S.me.id ? ' me' : '') },
      h('header', null, h('span', { class: 'dot', style: 'background:' + colorOf(p.id) }),
        h('strong', { text: nameOf(p) }),
        h('span', { class: 'depth', text: '+' + fmt(rd.pts * M_PER_PT) + 'm · ' + rd.pts + ' pts' })),
      rd.a.some(x => x[1] >= 0) ? h('ul', { class: 'chips' }, rd.a.filter(x => x[1] >= 0).sort((a, b) => b[1] - a[1]).map(([n, t], i) => chip(n, t, '+' + TIERS[t].pts, i)))
                  : h('p', { class: 'note', text: 'Found nothing.' }));
  }));
  if (!T) return;
  const said = new Set(); ps.forEach(p => roundOf(p, r.round).a.forEach(x => said.add(x[0])));
  const star = T.star, found = said.has(star.name);
  $('missed').replaceChildren(h('div', { class: 'panel star' },
    h('div', { class: 'ph' }, h('span', { text: found ? 'The Obscura · found' : 'The Obscura · nobody found it' })),
    h('p', { class: 'starname' }, tierIcon(4, 32), h('span', { text: star.name }), h('b', { text: '+100' })),
    star.fact && h('p', { class: 'note', text: star.fact })));
}

function buildFinal() {
  if (S.room.fixed) return buildRunFinal();
  return h('section', { class: 'final' }, topBar(),
    h('p', { class: 'eyebrow', text: 'Expedition complete' }),
    h('h2', { id: 'winner' }),
    h('div', { class: 'split' },
      h('div', { class: 'main' },
        panel('Final depths', null, h('ol', { id: 'ranks', class: 'ranks' })),
        isHost() ? h('button', { class: 'go', type: 'button', onclick: again, text: S.mode === 'solo' ? '▼ Drop again ▼' : '▼ Back to the lobby ▼' })
                 : h('p', { class: 'note', style: 'text-align:center', text: 'The host can start another expedition.' })),
      h('aside', null, gaugeEl())));
}
function refreshFinal() {
  if (S.room.fixed) return;
  const ps = ordered().sort((a, b) => total(b) - total(a));
  const top = ps[0];
  $('winner').textContent = !top ? '' : ps.length === 1 ? 'You reached ' + fmt(depthOf(top)) + ' m'
    : (ps[1] && total(ps[1]) === total(top)) ? 'A tie at ' + fmt(depthOf(top)) + ' m' : nameOf(top) + ' went deepest';
  $('ranks').replaceChildren(...ps.map(p => {
    const n = (p.g === S.room.g && p.rounds) ? Object.values(p.rounds).reduce((s, r) => s + r.a.filter(x => x[1] >= 0).length, 0) : 0;
    return h('li', { class: p.id === S.me.id ? 'me' : '' },
      h('span', { class: 'dot', style: 'background:' + colorOf(p.id) }),
      h('span', { class: 'who', text: nameOf(p) + (p.id === S.me.id ? ' (you)' : '') }),
      h('span', { class: 'count', text: n + ' answers · reached the ' + zoneOf(depthOf(p)).toLowerCase() }),
      h('span', { class: 'depth', text: fmt(depthOf(p)) + ' m' }));
  }));
}

/* ---------- render loop ---------- */
const BUILD = { lobby: buildLobby, pick: buildPick, play: buildPlay, reveal: buildReveal, final: buildFinal };
const REFRESH = { lobby: refreshLobby, pick: () => $('board').replaceChildren(...boardRows(false)), play: refreshPlay, reveal: refreshReveal, final: refreshFinal };
function refresh() {
  if (!S.mode) return refreshHome();
  (REFRESH[S.room.phase] || (() => {}))();
  refreshGauge();
  say(S.msg);
  tick();
}
function render() {
  const r = S.room;
  const key = !S.mode ? 'home' : [r.phase, r.g, r.round, S.code, isHost(), r.picker].join(':');
  if (key !== S.screen) {
    S.screen = key;
    if (S.mode && r.phase !== 'play') S.fb = null;
    const dive = !!S.mode && r.phase !== 'lobby';
    if (document.body.classList.contains('dive') !== dive) { document.body.classList.toggle('dive', dive); if (window.__sea) window.__sea(); }
    document.body.classList.toggle('trek', !!S.mode && r.phase === 'play');
    document.body.classList.toggle('run', !!S.mode && !!r.fixed);
    const scr = !S.mode ? buildHome() : (BUILD[r.phase] || buildLobby)();
    scr.classList.add('enter');
    setTimeout(() => scr.classList.remove('enter'), 1800);
    app.replaceChildren(scr);
    if (S.mode) snd(r.phase === 'play' ? 'begin' : r.phase === 'final' ? 'surface' : r.phase === 'pick' ? 'pick' : 'click');
    if (S.mode && r.phase === 'final') { const dpt = window.__depth || 0; window.__lines = null; window.__depth = 0; if (dpt > 20) window.__sink = { rise: true, to: 0, dur: Math.min(6, Math.max(2.4, dpt / 700)), start: performance.now() }; setTimeout(() => snd('fanfare'), Math.min(6, Math.max(2.4, dpt / 700)) * 1000); if (r.fixed) setTimeout(dailyStats, 50); }
    window.scrollTo(0, 0);
  }
  refresh();
}
function tick() {
  { const ni = $('nextin'); if (ni) { const n = new Date(), m = new Date(n.getFullYear(), n.getMonth(), n.getDate() + 1), sec = Math.max(0, Math.floor((m - n) / 1000)), tx = 'next descent in ' + String(Math.floor(sec / 3600)).padStart(2, '0') + ':' + String(Math.floor(sec / 60) % 60).padStart(2, '0') + ':' + String(sec % 60).padStart(2, '0'); if (ni.textContent !== tx) ni.textContent = tx; } }
  const r = S.room; if (!S.mode || !r) return;
  const now = Date.now(), lag = isHost() ? 0 : 2500 + S.jitter, clock = $('clock');
  if (r.phase === 'pick') {
    const left = Math.max(0, Math.ceil((r.pickEndsAt - now) / 1000));
    if (clock) clock.textContent = left ? left + ' s to choose, or the first topic is picked.' : 'Picking the first topic…';
    if (now > r.pickEndsAt + lag) once('pick:' + r.g + ':' + r.round, () => choose(r.options[0]));
  } else if (r.phase === 'play') {
    const d = diveState(), K = r.dives || 5;
    if (d.stage === 'wait') {
      const c = $('clock'), txt = String(Math.max(1, Math.min(3, Math.ceil((r.startsAt - now) / 1000))));
      if (c && c.dataset.n !== txt) { c.dataset.n = txt; c.replaceChildren('dropping · the clock starts in ', h('b', { text: txt })); restart(c.lastChild, 'pop'); snd('count'); }
      if (now >= r.startsAt) { snd('count', true); if (d.i >= K) setStage('done'); else setStage('ask', r.secs * 1000); }
    } else if (d.stage === 'ask') {
      const ring = $('ring'), bar = $('airbar'), left = Math.max(0, d.until - now), f = Math.min(1, left / (r.secs * 1000)), low = left < 6000;
      if (ring) {
        const n = String(Math.ceil(left / 1000)); if (ring.textContent !== n) { ring.textContent = n; if (left < 5500 && left > 0) snd('tick'); }
        ring.style.setProperty('--f', (f * 360).toFixed(0) + 'deg');
        ring.closest('form').classList.toggle('low', low);
      }
      if (bar) { bar.style.clipPath = 'inset(0 ' + ((1 - f) * 100).toFixed(1) + '% 0 0)'; bar.classList.toggle('low', low); }
      $('edge').classList.toggle('hot', low);
      if (now > d.until) lockIn(null);
    } else if (d.stage === 'sink') {
      if (now > d.until) { setStage('landed', 7000); refresh(); }
    } else if (d.stage === 'landed') {
      if (now > d.until) advance();
    }
    const all = ordered().every(p => p.left || roundOf(p, r.round).a.length >= K);
    if (all && d.stage === 'done') { if (!S.allAt) S.allAt = now; } else S.allAt = 0;
    if (!r.fixed && ((S.allAt && now > S.allAt + 2500 + lag) || now > r.endsAt + lag)) once('play:' + r.g + ':' + r.round, () => patchRoom({ phase: 'reveal', revealAt: Date.now() }));
  } else if (r.phase === 'reveal') {
    $('edge').classList.remove('hot');
    const nextBtn = $('next'), wait = $('waithost');
    if (nextBtn && nextBtn.hidden && now > (r.revealAt || 0) + 20000) { nextBtn.hidden = false; if (wait) wait.textContent = 'Host gone quiet? Anyone can continue.'; }
  }
}
setInterval(tick, 250);

/* ---------- the descent: down through a rainforest, from the treetops to the caves under its roots ---------- */
// Drawn every animation frame. Branches, vines and ledges are generated from their depth,
// so the forest is endless and the same depth always looks the same.
(function scene() {
  const cv = $('sea'); if (!cv) return;
  const ctx = cv.getContext('2d');
  const reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;
  const ruler = $('ruler'), over = $('tierlines'), notes = $('notes'), vig = $('vig');
  const MPS = 230, AP = 3; // metres per screen height, CSS px per art pixel
  const R = Math.random, mod = (a, n) => ((a % n) + n) % n, D = (a, b) => a + R() * (b - a);
  const hsh = (i, k) => { const x = Math.sin(i * 127.1 + k * 311.7) * 43758.5453; return x - Math.floor(x); };
  const lerp3 = (a, b, f) => [a[0] + (b[0] - a[0]) * f, a[1] + (b[1] - a[1]) * f, a[2] + (b[2] - a[2]) * f];
  const css = (c, a) => a == null ? 'rgb(' + (c[0] | 0) + ',' + (c[1] | 0) + ',' + (c[2] | 0) + ')' : 'rgba(' + (c[0] | 0) + ',' + (c[1] | 0) + ',' + (c[2] | 0) + ',' + a + ')';
  // the colour of the air at each depth: leaf light, green shade, dusk, then stone
  const AIR = [[0, [122, 204, 132]], [120, [52, 128, 84]], [300, [22, 62, 44]], [600, [12, 34, 26]], [1200, [8, 24, 19]], [3000, [6, 18, 14]], [4000, [8, 15, 12]], [5200, [10, 12, 12]], [7500, [6, 7, 9]], [11000, [2, 3, 4]]];
  function air(m) {
    if (m <= 0) return AIR[0][1];
    for (let i = 1; i < AIR.length; i++) if (m <= AIR[i][0]) { const a = AIR[i - 1], b = AIR[i]; return lerp3(a[1], b[1], (m - a[0]) / (b[0] - a[0])); }
    return AIR[AIR.length - 1][1];
  }
  const FLOOR = 4000; // below this you are under the forest, among roots and rock
  const NOTES = [[60, 'the canopy closes overhead'], [200, 'THE UNDERSTORY', 1], [330, 'howler monkeys call from here'], [600, 'barely any sunlight gets this far'], [1000, 'THE DEEP SHADE', 1], [1500, 'jaguar country'], [2200, 'the air is thick and still'], [3000, 'nothing down here has seen the sky'], [4000, 'THE FOREST FLOOR', 1], [4400, 'roots drop away into the dark'], [6000, 'THE ROOT CAVES', 1], [8000, 'water is running somewhere below'], [10935, 'THE UNDERGROUND RIVER', 1]];
  let W = 0, H = 0, DPR = 1, mpp = 1, AY = 0, cam = 0, camS = 0, vel = 0, time = 0, last = 0, linesId = null;
  let leavesA = [], leavesB = [], roam = [], parts = [], clouds = [], puffs = [], flash = 0, flashC = '#fff', lastCrank = 0, lastTrail = 0;
  let orbit = null, burstT = 0, rings = [], sweeps = [], punch = 0, hold = 0, zoneAt = -1;
  const frog = { x: -80, y: 200, rot: 0, emit: 0, hop: 0 };
  // sparks are more saturated than the tier labels, so bursts read against the forest
  const SPARK = ['#8fa3c4', '#4de3ff', '#ff5252', '#9d7bff', '#ffd166'];
  const sn = v => Math.round(v * DPR) / DPR, toM = y => camS + (y - AY) * mpp, yOf = m => AY + (m - camS) / mpp;
  const near = (m, pad) => { const y = yOf(m); return y > -pad && y < H + pad; };
  // how the falling answer sways: common answers flutter down like a leaf, rarer ones shiver and steady
  const wobble = (p, tier) => tier === 0 ? 36 * Math.sin(7 * p) * (1 - 0.25 * p) : tier === 4 ? Math.sin(24 * p) * (1 - p) * 26 : Math.sin(16 * p) * (1 - p) * 14;
  const tinted = {};
  const img = (art, color) => { const k = art + color; if (!tinted[k]) { const im = new Image(); im.src = sprite(art, color); tinted[k] = im; } return tinted[k]; };
  // ---- pixel art made once and reused ----
  const BUCKETS = [0, 120, 300, 600, 1000, 1600, 2400, 3300, 4200], cache = {};
  const bucketOf = m => { let b = 0; for (let i = 0; i < BUCKETS.length; i++) if (m >= BUCKETS[i]) b = i; return b; };
  const rng = seed => { let v = (seed * 9301 + 49297) % 233280; return () => (v = (v * 9301 + 49297) % 233280) / 233280; };
  // a mass of leaves: lit from above, shaded below, ragged at the edge, with a few hanging tips
  function clump(v, b, dark) {
    const key = 'c' + v + '_' + b + '_' + dark; if (cache[key]) return cache[key];
    const S = dark > 0.6 ? 1.7 : 1, w = Math.round(46 * S), hh = Math.round(34 * S), c = document.createElement('canvas'); c.width = w; c.height = hh;
    const g = c.getContext('2d'), r = rng(v + 1 + (S > 1 ? 40 : 0)), depth = BUCKETS[b], light = Math.max(0, 1 - depth / 1500), base = lerp3(air(depth), [2, 8, 5], dark);
    const tones = [lerp3(base, [1, 6, 3], 0.5), lerp3(base, [30, 124, 58], 0.4 * light + 0.05), lerp3(base, [70, 180, 84], 0.55 * light + 0.07), lerp3(base, [176, 236, 132], 0.6 * light + 0.05)].map(t => css(t));
    const blobs = []; for (let i = 0; i < (S > 1 ? 13 : 7); i++) blobs.push([(8 + r() * 30) * S, (9 + r() * 11) * S, (5.5 + r() * 7) * (S > 1 ? 1.3 : 1)]);
    for (let y = 0; y < hh; y++) for (let x = 0; x < w; x++) {
      let inside = false, top = 1;
      for (const [bx, by, br] of blobs) { const dx = x - bx, dy = (y - by) * 1.15; if (dx * dx + dy * dy < br * br) { inside = true; top = Math.min(top, (dy + br) / (2 * br)); } }
      const n = r(); if (!inside) continue;
      let t = top < 0.26 ? 3 : top < 0.52 ? 2 : top < 0.8 ? 1 : 0;
      if (t === 3 && n < 0.5) t = 2; else if (t === 2 && n < 0.24) t = 1; else if (t === 1 && n < 0.2) t = 0; else if (t === 0 && n < 0.1) t = 1;
      g.fillStyle = tones[t]; g.fillRect(x, y, 1, 1);
    }
    g.fillStyle = tones[0];
    for (let i = 0; i < 10 * S; i++) { const x = Math.round((6 + r() * 34) * S), y0 = Math.round((17 + r() * 6) * S), L = 2 + (r() * 7 * S | 0); g.fillRect(x, y0, 1, L); if (L > 3) g.fillRect(x + (i % 2 ? 1 : -1), y0 + L - 2, 1, 2); }
    return cache[key] = c;
  }
  function drawClump(v, depth, dark, x, y, scale) {
    const b = bucketOf(depth), f = b < BUCKETS.length - 1 ? Math.min(1, Math.max(0, (depth - BUCKETS[b]) / (BUCKETS[b + 1] - BUCKETS[b]))) : 0;
    const a = clump(v, b, dark), w = a.width * scale, hh = a.height * scale, dx = sn(x - w / 2), dy = sn(y - hh * 0.6);
    ctx.drawImage(a, dx, dy, w, hh);
    if (f > 0.03) { ctx.globalAlpha = f; ctx.drawImage(clump(v, b + 1, dark), dx, dy, w, hh); ctx.globalAlpha = 1; }
  }
  // bark detail laid over whatever colour the trunk is at this depth
  let barkC = null, barkP = null;
  function barkTex() {
    if (barkC) return barkC;
    const c = document.createElement('canvas'); c.width = 32; c.height = 64; const g = c.getContext('2d'), r = rng(7);
    for (let i = 0; i < 52; i++) { const x = r() * 32 | 0, y = r() * 64 | 0, L = 4 + (r() * 22 | 0); g.fillStyle = r() < 0.6 ? 'rgba(0,0,0,' + (0.12 + r() * 0.22).toFixed(2) + ')' : 'rgba(255,255,255,' + (0.03 + r() * 0.05).toFixed(2) + ')'; g.fillRect(x, y, 1, L); if (y + L > 64) g.fillRect(x, 0, 1, y + L - 64); }
    for (let i = 0; i < 4; i++) { const x = 3 + (r() * 24 | 0), y = 2 + (r() * 56 | 0); g.fillStyle = 'rgba(0,0,0,0.32)'; g.fillRect(x, y, 4, 2); g.fillRect(x + 1, y - 1, 2, 4); }
    for (let i = 0; i < 30; i++) { g.fillStyle = 'rgba(96,176,92,' + (0.07 + r() * 0.13).toFixed(2) + ')'; g.fillRect(r() * 32 | 0, r() * 64 | 0, 1 + (r() * 3 | 0), 1); }
    return barkC = c;
  }
  function fillBark(x, y, w, hh, scroll, col, seed) {
    ctx.fillStyle = col; ctx.fillRect(x, y, w, hh);
    if (!barkP) barkP = ctx.createPattern(barkTex(), 'repeat');
    barkP.setTransform(new DOMMatrix([AP, 0, 0, AP, x + seed * 37, -scroll]));
    ctx.fillStyle = barkP; ctx.fillRect(x, y, w, hh);
    ctx.fillStyle = 'rgba(255,255,255,0.05)'; ctx.fillRect(x, y, Math.max(AP, Math.round(w * 0.16)), hh);
    ctx.fillStyle = 'rgba(0,0,0,0.26)'; ctx.fillRect(x + Math.round(w * 0.7), y, Math.ceil(w * 0.3), hh);
  }
  // a split, holed leaf for the foreground
  function bigLeaf(v) {
    const key = 'L' + v; if (cache[key]) return cache[key];
    const S = [1, 1.3, 1.6][v % 3], w = Math.round(64 * S), hh = Math.round(46 * S), c = document.createElement('canvas'); c.width = w; c.height = hh; const g = c.getContext('2d');
    for (let y = 0; y < hh; y++) for (let x = 0; x < w; x++) {
      const dx = (x / S - 34) / 30, dy = (y / S - 23) / 21, rr = dx * dx + dy * dy; if (rr > 1) continue;
      const a = Math.atan2(dy, dx), rad = Math.sqrt(rr), wave = Math.sin(a * (6 + v) + v * 1.7);
      if (rad > 0.42 && wave > 0.72) continue;
      if (x / S < 12 && Math.abs(y / S - 23) < 1 + (12 - x / S) * 0.35) continue;
      g.fillStyle = (Math.abs(y - hh / 2) < 1 && x / S > 10) || (rad > 0.25 && Math.abs(wave + 0.72) < 0.06) ? '#0c2e1a' : '#020a06'; g.fillRect(x, y, 1, 1);
    }
    g.fillStyle = '#020a06'; g.fillRect(0, Math.round(hh / 2) - 1, Math.round(14 * S), 2);
    return cache[key] = c;
  }
  // ---- the effects layer: everything that sparks, glows or bursts is plotted pixel by pixel ----
  // Effects are drawn into a small buffer at 2 screen pixels per dot, finer than the scenery,
  // with ordered dithering instead of smooth fades, then laid over the scene with hard edges.
  const FP = 2, BAYER = [0, 8, 2, 10, 12, 4, 14, 6, 3, 11, 1, 9, 15, 7, 13, 5].map(v => (v + 0.5) / 16);
  let fxc = null, fxg = null, fxi = null, fbuf = null, flev = null, fw = 0, fh = 0;
  function fxInit() { fw = Math.max(1, Math.ceil(W / FP) || 1); fh = Math.max(1, Math.ceil(H / FP) || 1); fxc = document.createElement('canvas'); fxc.width = fw; fxc.height = fh; fxg = fxc.getContext('2d'); fxi = fxg.createImageData(fw, fh); fbuf = new Uint32Array(fxi.data.buffer); flev = new Uint8Array(fw * fh); }
  const pack = (r, g, b) => ((255 << 24) | ((b & 255) << 16) | ((g & 255) << 8) | (r & 255)) >>> 0;
  const ramps = {};
  // five steps for any colour: dim, soft, pure, light, white
  function rampOf(c) {
    let r = ramps[c]; if (r) return r;
    let v; if (c[0] === '#') { const n = parseInt(c.slice(1, 7), 16); v = [n >> 16, (n >> 8) & 255, n & 255]; } else v = (c.match(/\d+/g) || [255, 255, 255]).slice(0, 3).map(Number);
    const m = (t, f) => pack(v[0] + (t - v[0]) * f, v[1] + (t - v[1]) * f, v[2] + (t - v[2]) * f);
    return ramps[c] = [m(0, 0.55), m(0, 0.25), m(0, 0), m(255, 0.5), pack(255, 255, 255)];
  }
  const DARK = [pack(18, 4, 12), pack(38, 8, 24), pack(64, 12, 36), pack(90, 20, 50), pack(120, 30, 70)];
  function pset(x, y, col, lv) { x |= 0; y |= 0; if (x < 0 || y < 0 || x >= fw || y >= fh) return; const i = y * fw + x; if (lv < flev[i]) return; flev[i] = lv; fbuf[i] = col; }
  function prect(x, y, w, hh, col, lv) { for (let j = 0; j < hh; j++) for (let i = 0; i < w; i++) pset(x + i, y + j, col, lv); }
  function pline(x0, y0, x1, y1, col, lv) {
    x0 |= 0; y0 |= 0; x1 |= 0; y1 |= 0;
    const dx = Math.abs(x1 - x0), dy = -Math.abs(y1 - y0), sx = x0 < x1 ? 1 : -1, sy = y0 < y1 ? 1 : -1; let e = dx + dy, n = 0;
    while (n++ < 1500) { pset(x0, y0, col, lv); if (x0 === x1 && y0 === y1) break; const e2 = 2 * e; if (e2 >= dy) { e += dy; x0 += sx; } if (e2 <= dx) { e += dx; y0 += sy; } }
  }
  // a dithered glow: bands from white at the heart to dim at the rim
  function pglow(cx, cy, r, a, ramp, top) {
    cx |= 0; cy |= 0; r = Math.max(1, r); top = top || 5;
    const x0 = Math.max(0, cx - r | 0), x1 = Math.min(fw - 1, cx + r | 0), y0 = Math.max(0, cy - r | 0), y1 = Math.min(fh - 1, cy + r | 0), ir = 1 / r;
    for (let y = y0; y <= y1; y++) for (let x = x0; x <= x1; x++) {
      const dx = x - cx, dy = y - cy, d = Math.sqrt(dx * dx + dy * dy) * ir; if (d >= 1) continue;
      const v = (1 - d) * (1 - d) * a * top; let b = v | 0; if (v - b > BAYER[(x & 3) + ((y & 3) << 2)]) b++;
      if (b <= 0) continue; if (b > top) b = top;
      const i = y * fw + x; if (b >= flev[i]) { flev[i] = b; fbuf[i] = ramp[b - 1]; }
    }
  }
  // a shockwave: a bright leading edge with a dithered wake, breaking into arcs as it fades
  function pring(cx, cy, r, th, a, ramp, spin) {
    const n = Math.max(24, Math.ceil(r * 6.4));
    for (let k = 0; k < n; k++) {
      const ang = k / n * 6.2832; if (a < 0.6 && Math.sin(ang * 7 + spin) > a * 1.6) continue;
      const c = Math.cos(ang), s2 = Math.sin(ang);
      for (let t = 0; t < th; t++) { const x = cx + c * (r - t) | 0, y = cy + s2 * (r - t) | 0, edge = t / th; if (t > 0 && BAYER[(x & 3) + ((y & 3) << 2)] < edge * (1.3 - a)) continue; pset(x, y, ramp[t === 0 ? 4 : edge < 0.4 ? 3 : 2], t === 0 ? 6 : 5); }
    }
  }
  function fxFlush() {
    fxg.putImageData(fxi, 0, 0); ctx.imageSmoothingEnabled = false;
    ctx.drawImage(fxc, 0, 0, fw * FP, fh * FP);
    if (!window.__low) { ctx.globalCompositeOperation = 'lighter'; ctx.globalAlpha = 0.4; ctx.drawImage(fxc, 0, 0, fw * FP, fh * FP); ctx.globalAlpha = 1; ctx.globalCompositeOperation = 'source-over'; }
    fbuf.fill(0); flev.fill(0);
  }
  const F = v => v / FP;
  function halo(x, y, r, color, alpha) { pglow(F(x), F(y), F(r), Math.min(1, alpha), rampOf(color), alpha > 0.6 ? 4 : 3); }
  function spr(art, color, x, y, size, flipX, rot) {
    const im = img(art, color); if (!im.complete) return;
    ctx.save(); ctx.translate(x, y); if (rot) ctx.rotate(rot); if (flipX) ctx.scale(-1, 1);
    ctx.drawImage(im, -size / 2, -size / 2, size, size); ctx.restore();
  }
  const fx = {
    // sparks: fly out, slow down, drift upward as you fall away from them
    burst(x, y, color, n, pow) { for (let i = 0; i < n && parts.length < 320; i++) { const a = R() * 6.283, sp = (30 + 130 * R()) * pow; parts.push({ x, m: toM(y), vx: Math.cos(a) * sp, vm: Math.sin(a) * sp * mpp * 0.5, r: 1.5 + 2.5 * R(), life: 0.6 + 0.8 * R(), t: 0, color }); } },
    // drifting motes: pollen and torn leaf, left behind above you
    bubble(x, y, r, color) { if (parts.length < 360) parts.push({ x, m: toM(y), vx: D(-8, 8), vm: -(14 + 18 * R()) * mpp, r, life: 2.2 + R() * 1.6, t: 0, mote: 1, ph: R() * 9, color: 'rgb(' + (color || '214,240,170') + ')' }); },
    // torn leaves: thrown outward, then they flutter and fall
    leaves(x, y, n, pow) { for (let i = 0; i < n && parts.length < 360; i++) { const a = R() * 6.283, sp = (60 + 220 * R()) * pow; parts.push({ x, m: toM(y), vx: Math.cos(a) * sp, vm: (Math.sin(a) * sp - 60) * mpp, r: 3 + R() * 4, life: 1.6 + R() * 1.4, t: 0, leaf: 1, rot: R() * 6.283, spin: D(4, 11) * (R() < 0.5 ? -1 : 1), ph: R() * 9, color: ['#6fbf58', '#9bd66a', '#d9c24a', '#3f8f45', '#c98a3a'][R() * 5 | 0] }); } },
    // a soft dark puff of spores
    puff(x, y, n) { for (let i = 0; i < n && puffs.length < 30; i++) { const a = R() * 6.283, sp = D(6, 60); puffs.push({ x, m: toM(y), vx: Math.cos(a) * sp, vm: Math.sin(a) * sp * mpp * 0.5, r: D(12, 44), life: D(1.2, 2.2), t: 0 }); } },
    flash(color, times, ms) { const el = $('flash'); if (!el || reduce) return; let i = 0; const go = () => { el.style.transition = 'none'; el.style.background = 'radial-gradient(circle at 50% ' + Math.round(AY) + 'px, ' + color + ' 0, ' + color + ' 12%, rgba(0,0,0,0) 78%)'; el.style.opacity = '.7'; requestAnimationFrame(() => requestAnimationFrame(() => { el.style.transition = 'opacity ' + ms + 'ms ease-out'; el.style.opacity = '0'; })); if (++i < times) setTimeout(go, ms * 2.1); }; go(); },
    shake() { restart(app, 'shake'); },
    zap() { restart($('crt'), 'zap'); },
    type(el) { snd('type'); const rc = el.getBoundingClientRect(), x = rc.left + Math.min(rc.width - 16, 16 + el.value.length * 13); fx.bubble(x + D(-3, 3), rc.top + D(4, 12), 1 + 2 * R()); if (R() < 0.3) fx.bubble(x + D(-8, 8), rc.top + D(2, 10), 1 + 1.6 * R()); },
    submit(rc) { fx.zap(); snd('submit'); for (let i = 0; i < 12; i++) fx.bubble(rc.left + D(0, rc.width), rc.top + D(0, rc.height), 2 + 3 * R()); fx.burst(W / 2, AY + 60, '#7dffb0', 12, 0.6); },
    reject() { fx.zap(); snd('reject'); fx.bubble(W / 2 + D(-40, 40), H - 120, 1.2 + 1.8 * R(), '150,170,150'); fx.bubble(W / 2 + D(-40, 40), H - 130, 1.2 + 1.8 * R(), '150,170,150'); },
    miss() { fx.shake(); fx.zap(); snd('miss'); fx.flash('rgba(60,80,62,.5)', 1, 200); },
  };
  window.__fx = fx;
  function build() {
    W = innerWidth; H = innerHeight; DPR = window.__low ? 1 : Math.min(2, devicePixelRatio || 1); if (W * H * DPR * DPR > 3.4e6) DPR = Math.max(1, Math.sqrt(3.4e6 / (W * H))); mpp = MPS / H; barkP = null; fxInit();
    cv.width = Math.round(W * DPR); cv.height = Math.round(H * DPR);
    const mk = (n, par) => Array.from({ length: n }, () => ({ x: R() * W, y: R() * H, par: par * (0.6 + R() * 0.8), a: 0.25 + R() * 0.5, r: 2 + R() * 3, ph: R() * 9, c: ['#6fbf58', '#9bd66a', '#d9c24a', '#3f8f45', '#c98a3a'][R() * 5 | 0] }));
    leavesA = mk(Math.round(W * H / 22000), 0.55); leavesB = mk(Math.round(W * H / 40000), 1.25);
    roam = Array.from({ length: 2 }, () => ({ x: R() * W, off: D(-180, 180), sp: D(14, 34) * (R() < 0.5 ? -1 : 1), ph: R() * 9, c: ['#ffb347', '#6fd6ff', '#ff8fd0', '#fff07a'][R() * 4 | 0] }));
    clouds = Array.from({ length: 7 }, () => ({ x: R() * (W + 200) - 100, f: 0.12 + R() * 0.5, w: 8 + Math.round(R() * 14), v: 4 + R() * 6 }));
  }
  function ensureOverlay() {
    if (!over || over.childElementCount) return;
    TIERS.forEach((t, i) => over.append(h('div', { class: 'tline t-' + t.key }, h('span', { class: 'lab' }, tierIcon(i, 16), h('span', { text: (i === 4 ? 'Pure Obscura' : t.name) + ' · ' + t.pts })))));
    over.append(h('div', { class: 'chip2' }, h('span')));
  }
  // one parallax layer of trunks: fixed columns with bark that slides past
  function trunks(z, n, w0, w1, k, dark) {
    for (let i = 0; i < n; i++) {
      const x = sn((i + 0.15 + hsh(i, k) * 0.7) / n * W), w = Math.round((w0 + hsh(i, k + 3) * w1) / AP) * AP;
      const top = Math.max(0, AY + (0 - camS * z) / mpp - 30 - hsh(i, k + 5) * 60), bot = Math.min(H, AY + (FLOOR - camS * z) / mpp + 40);
      if (bot < 0 || top > H) continue;
      const g = ctx.createLinearGradient(0, 0, 0, H);
      g.addColorStop(0, css(lerp3(air(camS - H * mpp * 0.3), [2, 8, 5], dark))); g.addColorStop(1, css(lerp3(air(camS + H * mpp * 0.7), [2, 8, 5], dark)));
      fillBark(x, top, w, bot - top, camS * z / mpp, g, i + k);
    }
  }
  // branches (or rock ledges, below the forest floor) reaching in from the sides
  function limbs(z, SP, k, dark, big) {
    const cz = camS * z, i0 = Math.floor((cz - AY * mpp - 120) / SP), i1 = Math.ceil((cz + (H - AY) * mpp + 120) / SP);
    for (let i = Math.max(0, i0); i <= i1; i++) {
      const r1 = hsh(i, k), r2 = hsh(i, k + 4), r3 = hsh(i, k + 8), dep = (i + r1 * 0.6) * SP, y = sn(AY + (dep - cz) / mpp);
      const real = dep / z, under = real > FLOOR, light = Math.max(0, 1 - real / 1500), left = r2 < 0.5;
      const base = lerp3(air(real), under ? [22, 20, 18] : [2, 8, 5], dark), col = css(base), len = (0.16 + r3 * 0.3) * W * big, th = Math.round((7 + r1 * 9) * big / AP) * AP;
      const x0 = left ? 0 : W - len, tip = left ? len : W - len;
      if (under) {
        // a ledge of rock with stalactites and hanging roots
        ctx.fillStyle = col; ctx.fillRect(x0, y, len, th * 2);
        for (let q = 0; q < 6; q++) { const sx = x0 + hsh(i * 9 + q, k) * (len - 12), sl = (8 + hsh(i * 9 + q, k + 2) * 34) * big; ctx.beginPath(); ctx.moveTo(sx, y + th * 2 - 1); ctx.lineTo(sx + 9 * big, y + th * 2 - 1); ctx.lineTo(sx + 4.5 * big, y + th * 2 + sl); ctx.closePath(); ctx.fill(); }
        const glow = 0.45 + 0.35 * Math.sin(time * 1.6 + i);
        for (let q = 0; q < 5; q++) { const gx = x0 + hsh(i * 5 + q, k + 6) * len, c = q % 2 ? '125,255,176' : '111,214,255'; halo(sn(gx) + 1, y - 5, 20, 'rgb(' + c + ')', glow * 0.55); ctx.fillStyle = 'rgba(' + c + ',' + glow.toFixed(3) + ')'; ctx.fillRect(sn(gx), y - AP * 2, AP, AP * 2); ctx.fillRect(sn(gx) - AP, y - AP * 3, AP * 3, AP); }
      } else {
        // the limb, drooping a little toward its tip
        ctx.fillStyle = col;
        for (let q = 0; q < 6; q++) { const sx = left ? len * q / 6 : W - len * (q + 1) / 6, dy = Math.round((left ? q : 5 - q) * (r3 - 0.4) * 5 / AP) * AP; ctx.fillRect(sn(sx), y + dy, len / 6 + 1, Math.max(AP, th - (left ? q : 5 - q) * AP * 0.5)); }
        // epiphyte
        ctx.fillStyle = css(lerp3(base, [220, 90, 60], 0.35 * light + 0.05));
        const ex = left ? len * 0.45 : W - len * 0.45; for (let f = -2; f <= 2; f++) ctx.fillRect(sn(ex + f * AP * 2), y - AP * (3 - Math.abs(f)), AP, AP * (3 - Math.abs(f)));
        // leaves along it
        const sway = Math.sin(time * 0.6 + i) * 3;
        for (let q = 0; q < 5; q++) { const lx = left ? len * (0.18 + q * 0.2) : W - len * (0.18 + q * 0.2); drawClump((i * 3 + q) % 6, real, dark, lx + sway * (0.6 + q * 0.15), y + (q % 2) * 6 - 2, big < 0.7 ? 1.5 : big < 1 ? 2 : AP); }
      }
      // vines (or roots) hanging from it
      ctx.fillStyle = css(lerp3(base, under ? [40, 30, 22] : [12, 46, 24], 0.5));
      for (let v = 0; v < 2; v++) {
        if (hsh(i * 2 + v, k + 12) < 0.35) continue;
        const vx0 = left ? len * (0.3 + v * 0.45) : W - len * (0.3 + v * 0.45), n = Math.round((30 + hsh(i * 2 + v, k + 14) * 150) * big / (AP * 2));
        for (let q = 0; q < n; q++) { const vx = sn(vx0 + Math.sin(time * 0.8 + i + v + q * 0.22) * q * 0.4); ctx.fillRect(vx, y + th + q * AP * 2, AP, AP * 2 + 1); if (!under && q % 4 === 2) ctx.fillRect(vx + (q % 8 === 2 ? -AP * 2 : AP), y + th + q * AP * 2, AP * 2, AP); }
      }
    }
  }
  // lianas sagging across the gap, with a leaf here and there
  function lianas(z, SP, k, dark) {
    const cz = camS * z, i0 = Math.floor((cz - AY * mpp - 160) / SP), i1 = Math.ceil((cz + (H - AY) * mpp + 60) / SP);
    for (let i = Math.max(0, i0); i <= i1; i++) {
      const dep = (i + hsh(i, k) * 0.7) * SP, real = dep / z; if (real > FLOOR - 60 || hsh(i, k + 1) < 0.25) continue;
      const y0 = AY + (dep - cz) / mpp, xa = hsh(i, k + 2) * W * 0.35, xb = W * (0.65 + hsh(i, k + 3) * 0.35), sag = (50 + hsh(i, k + 4) * 110) * z, tilt = (hsh(i, k + 5) - 0.5) * 120;
      const base = lerp3(air(real), [2, 8, 5], dark), leaf = css(lerp3(base, [40, 140, 64], 0.4 * Math.max(0, 1 - real / 1500) + 0.05));
      ctx.fillStyle = css(lerp3(base, [10, 40, 20], 0.5));
      const n = Math.ceil((xb - xa) / (AP * 2)), sw = Math.sin(time * 0.6 + i) * 4 * z;
      for (let q = 0; q <= n; q++) {
        const u = q / n, x = xa + (xb - xa) * u, y = y0 + tilt * u + sag * 4 * u * (1 - u) + sw * Math.sin(u * Math.PI);
        ctx.fillRect(sn(x), sn(y), AP * 2 + 1, z > 0.7 ? AP + 1 : AP);
        if (q % 9 === 4) { ctx.fillStyle = leaf; ctx.fillRect(sn(x), sn(y) + AP, AP * 2, AP * 2); ctx.fillRect(sn(x) + AP, sn(y) + AP * 3, AP, AP); ctx.fillStyle = css(lerp3(base, [10, 40, 20], 0.5)); }
      }
    }
  }
  function leafLayer(list, dt) {
    const push = (camS - (leafLayer.prev == null ? camS : leafLayer.prev)) / mpp;
    for (const p of list) {
      p.y -= push * p.par - 9 * dt; p.x += 12 * Math.sin(0.6 * time + p.ph) * dt;
      if (p.y > H + 12) p.y -= H + 24; if (p.y < -12) p.y += H + 24; if (p.x > W + 12) p.x = -12; if (p.x < -12) p.x = W + 12;
      const streak = Math.min(9, Math.abs(vel * p.par / mpp) * 0.035), deep = Math.min(1, Math.max(0, (camS - 700) / 900)), lit = deep > 0 && p.ph < 2.4;
      if (yOf(0) > p.y) continue;
      ctx.fillStyle = lit ? (p.ph < 1.2 ? '#e8ff7a' : '#7dffb0') : camS > FLOOR ? '#8a9a94' : p.c;
      ctx.globalAlpha = lit ? deep * Math.max(0.1, Math.sin(time * 2.2 + p.ph * 4)) + p.a * (1 - deep) * 0.6 : p.a * (camS > 1500 ? 0.45 : 1);
      if (lit && streak <= 5) halo(p.x + 1, p.y + 1, 10, ctx.fillStyle, ctx.globalAlpha * 0.6);
      if (streak > 5 || lit || camS > FLOOR) ctx.fillRect(sn(p.x), sn(p.y), lit ? 3 : 2, Math.max(lit ? 3 : p.r, streak));
      else { const lw = Math.max(2, Math.abs(Math.cos(time * 2.6 + p.ph)) * (p.r + 4)), x = sn(p.x - lw / 2), y = sn(p.y); ctx.fillRect(x, y, lw, 2); ctx.fillRect(x + lw * 0.25, y - 2, lw * 0.5, 2); ctx.fillRect(x + lw * 0.25, y + 2, lw * 0.5, 2); }
    }
    ctx.globalAlpha = 1;
  }
  // ---- the far background: things between the distant trunks, so the gaps are never an empty wash ----
  // masses of leaves hanging in the distance, hazed by the air and thinning out as the light goes
  function farFoliage(z, SP, k, dark, scale, haze) {
    const top = camS * z - AY * mpp, bot = top + H * mpp;
    ctx.globalAlpha = haze;
    for (let i = Math.floor((top - 90) / SP); i <= Math.ceil((bot + 90) / SP); i++) {
      if (i < 0) continue;
      const dep = (i + hsh(i, k) * 0.7) * SP, trueD = dep / z; if (trueD > FLOOR - 200) continue;
      if (hsh(i, k + 1) < Math.min(0.8, trueD / 3200)) continue;
      const x = hsh(i, k + 2) * (W + 120) - 60, y = AY + (dep - camS * z) / mpp, sway = Math.sin(time * 0.45 + i * 1.7) * 1.5;
      drawClump((i * 7 + k) % 6, trueD, dark, x + sway, y, scale);
      drawClump((i * 3 + k + 2) % 6, trueD, dark, x + sway + 22 * scale, y + 5 * scale, scale);
      ctx.globalAlpha = haze;
    }
    ctx.globalAlpha = 1;
  }
  // low cloud caught between the trees: lumpy bands of blocks that drift sideways
  function mist(z, SP, k, a) {
    if (a < 0.012) return;
    const top = camS * z - AY * mpp, bot = top + H * mpp, c = lerp3(air(camS), [206, 238, 212], 0.6), B = AP * 2;
    const cols = [1, 0.72, 0.45].map(f => css(c, (a * f).toFixed(3)));
    for (let i = Math.floor((top - 60) / SP); i <= Math.ceil((bot + 60) / SP); i++) {
      if (i < 1) continue;
      const dep = (i + hsh(i, k) * 0.6) * SP, y0 = AY + (dep - camS * z) / mpp, th = 3 + (hsh(i, k + 1) * 5 | 0), drift = time * (5 + hsh(i, k + 2) * 9) * (i % 2 ? 1 : -1), ph = hsh(i, k + 3) * 40;
      for (let x = 0, q = 0; x < W; x += B, q++) {
        const u = (x + drift) / 70 + ph, n = 0.5 + 0.5 * Math.sin(u) * Math.sin(u * 0.37 + i), hgt = Math.round(th * n * n * 1.7); if (hgt < 1) continue;
        ctx.fillStyle = cols[n > 0.75 ? 0 : n > 0.5 ? 1 : 2];
        ctx.fillRect(x, sn(y0 - hgt * B / 2), B, hgt * B);
        ctx.fillStyle = cols[2];
        if (q % 2) ctx.fillRect(x, sn(y0 - hgt * B / 2) - B, B, B); else ctx.fillRect(x, sn(y0 - hgt * B / 2) + hgt * B, B, B);
      }
    }
  }
  // a thin waterfall dropping through the far trees, with spray where it lands
  function waterfall() {
    const z = 0.3, x = sn(W * 0.63), w = AP * 6, yTop = AY + (130 - camS * z) / mpp, yBot = AY + (960 - camS * z) / mpp;
    if (yBot < -40 || yTop > H + 40) return;
    const lit = Math.max(0, 1 - camS / 1500), a = lerp3(air(camS), [222, 246, 240], 0.2 + 0.5 * lit), b = lerp3(air(camS), [150, 214, 214], 0.14 + 0.42 * lit), d = lerp3(air(camS), [2, 8, 5], 0.55), S2 = AP * 2;
    ctx.fillStyle = css(d); ctx.fillRect(x - AP * 14, sn(yTop) - AP * 3, AP * 34, AP * 4); ctx.fillRect(x - AP * 8, sn(yTop) + AP, AP * 22, AP * 2);
    const from = Math.max(yTop, -S2), to = Math.min(yBot, H + S2), scroll = time * 150;
    for (let y = from; y < to; y += S2) {
      const row = Math.floor((y - yTop - scroll) / S2), spread = Math.min(AP * 3, (y - yTop) / 60);
      for (let cI = 0; cI < 3; cI++) { const r = hsh(row, 60 + cI); ctx.fillStyle = css(r > 0.55 ? a : b, r > 0.2 ? 0.85 : 0.45); ctx.fillRect(sn(x + cI * AP * 2 + (cI - 1) * spread), sn(y), AP * 2, S2); }
    }
    if (yBot > -40 && yBot < H + 40) {
      ctx.fillStyle = css(d); ctx.fillRect(x - AP * 20, sn(yBot), AP * 46, AP * 3);
      for (let q = 0; q < 9; q++) { const u = mod(time * 0.9 + q / 9, 1), ang = -Math.PI * (0.15 + 0.7 * hsh(q, 71)), rr = 8 + u * 34; halo(x + w / 2 + Math.cos(ang) * rr, yBot + Math.sin(ang) * rr * 0.7, 5 + u * 5, 'rgb(220,246,240)', (0.15 + 0.4 * lit) * (1 - u)); }
    }
  }
  // glowing fungi on the far trunks, once it is dark enough for them to show
  function glowers(z, SP, k) {
    if (camS < 1700) return;
    const top = camS * z - AY * mpp, bot = top + H * mpp, on = Math.min(1, (camS - 1700) / 900);
    for (let i = Math.floor((top - 30) / SP); i <= Math.ceil((bot + 30) / SP); i++) {
      if (i < 0 || hsh(i, k) < 0.35) continue;
      const dep = (i + hsh(i, k + 1) * 0.8) * SP, x = sn(hsh(i, k + 2) * W), y = sn(AY + (dep - camS * z) / mpp), n = 2 + (hsh(i, k + 3) * 3 | 0);
      const col = dep / z > 6200 ? [190, 160, 255] : dep / z > 4000 ? [120, 230, 255] : [125, 255, 190], pulse = 0.55 + 0.45 * Math.sin(time * (1.1 + hsh(i, k + 4)) + i);
      for (let m = 0; m < n; m++) {
        const mx = x + (m - n / 2) * AP * 4, my = y + ((m * 7) % 3) * AP * 2;
        ctx.fillStyle = css(col, (on * (0.25 + 0.3 * pulse)).toFixed(3)); ctx.fillRect(mx + AP, my + AP, AP, AP * 2);
        ctx.fillStyle = css(col, (on * (0.55 + 0.45 * pulse)).toFixed(3)); ctx.fillRect(mx, my, AP * 3, AP); ctx.fillRect(mx + AP, my - AP, AP, AP);
      }
      halo(x, y, 16 + n * 3, css(col), on * 0.32 * pulse);
    }
  }
  function draw(dt) {
    const pz = 1 + punch * punch * 0.04;
    ctx.setTransform(DPR * pz, 0, 0, DPR * pz, -W * (pz - 1) / 2 * DPR, -AY * (pz - 1) * DPR);
    ctx.imageSmoothingEnabled = false; ctx.globalCompositeOperation = 'source-over';
    const bc = document.body.classList, dive = bc.contains('dive'), sy = yOf(0), light = Math.max(0, 1 - camS / 1100);
    // air
    const bg = ctx.createLinearGradient(0, 0, 0, H);
    bg.addColorStop(0, css(air(camS - H * mpp * 0.3))); bg.addColorStop(0.5, css(air(camS + H * mpp * 0.2))); bg.addColorStop(1, css(air(camS + H * mpp * 0.7)));
    ctx.fillStyle = bg; ctx.fillRect(0, 0, W, H);
    // sky above the treetops
    if (sy > -60) {
      const g = ctx.createLinearGradient(0, 0, 0, Math.max(1, sy));
      g.addColorStop(0, '#b6dcf0'); g.addColorStop(1, '#eaf6e2');
      ctx.fillStyle = g; ctx.fillRect(0, 0, W, sy + 4);
      const sun = ctx.createRadialGradient(W * 0.82, sy * 0.3, 0, W * 0.82, sy * 0.3, 130);
      sun.addColorStop(0, 'rgba(255,240,180,0.9)'); sun.addColorStop(0.35, 'rgba(255,232,150,0.35)'); sun.addColorStop(1, 'rgba(255,232,150,0)');
      ctx.fillStyle = sun; ctx.fillRect(0, 0, W, sy + 4);
      ctx.fillStyle = 'rgba(255,255,255,0.92)';
      for (const c of clouds) { const x = sn(mod(c.x + time * c.v, W + 200) - 100), y = sn(sy * c.f); ctx.fillRect(x, y, c.w * AP, AP * 2); ctx.fillRect(x + AP * 2, y - AP * 2, (c.w - 5) * AP, AP * 2); ctx.fillRect(x + AP * 4, y - AP * 3, (c.w - 10) * AP, AP); }
      // far hills of treetops
      ctx.fillStyle = '#6fb88a'; ctx.beginPath(); ctx.moveTo(0, sy + 4);
      for (let x = 0; x <= W + 40; x += 40) ctx.arc(x, sy - 6 + hsh(x, 2) * 10, 34 + hsh(x, 3) * 18, Math.PI, 0);
      ctx.lineTo(W, sy + 4); ctx.closePath(); ctx.fill();
    }
    const low = !!window.__low;
    const fog = Math.min(1, camS / 220) * Math.max(0.25, 1 - camS / 5200);
    if (!low) trunks(0.2, Math.max(5, Math.round(W / 110)), 8, 10, 31, 0.12);
    if (!low) { farFoliage(0.24, 70, 201, 0.18, AP * 0.67, 0.5); mist(0.27, 62, 211, 0.2 * fog); waterfall(); }
    trunks(0.35, Math.max(4, Math.round(W / 150)), 14, 22, 1, 0.3);
    if (!low) limbs(0.42, 120, 40, 0.3, 0.6);
    if (!low) { glowers(0.38, 46, 231); mist(0.46, 96, 221, 0.15 * fog); }
    // shafts of light
    const ra = 0.12 * Math.max(0, 1 - camS / 1400);
    if (ra > 0.004) for (let k = 0; k < 5; k++) {
      const a = ra * (0.6 + 0.4 * Math.sin(time * 0.6 + k * 2.1)), x0 = W * (0.1 + k * 0.2) + Math.sin(time * 0.2 + k * 1.7) * 18, top = Math.max(sy, -40), len = H * 1.15, w0 = 24 + k * 8, sl = len * 0.24;
      const g = ctx.createLinearGradient(0, top, 0, top + len);
      g.addColorStop(0, 'rgba(255,250,200,' + a.toFixed(3) + ')'); g.addColorStop(1, 'rgba(255,250,200,0)');
      ctx.fillStyle = g; ctx.globalCompositeOperation = 'lighter';
      for (const f of [1, 0.62, 0.3]) { const c0 = x0 + w0 / 2, c1 = x0 + w0 + sl; ctx.beginPath(); ctx.moveTo(c0 - w0 * f / 2, top); ctx.lineTo(c0 + w0 * f / 2, top); ctx.lineTo(c1 + w0 * 2 * f, top + len); ctx.lineTo(c1 - w0 * 2 * f, top + len); ctx.closePath(); ctx.fill(); }
      ctx.globalCompositeOperation = 'source-over';
      // dust catching the light
      for (let q = 0; q < 5; q++) { const u = mod(hsh(k * 9 + q, 55) + time * 0.02 * (1 + q * 0.3), 1), dx = x0 + w0 / 2 + (sl + w0) * u + Math.sin(time + q * 2) * w0 * 0.5, dy = top + len * u; halo(dx, dy, 5, 'rgb(255,250,210)', a * 5 * (0.5 + 0.5 * Math.sin(time * 2.4 + q * 1.9 + k)) * (1 - u)); }
    }
    if (!low) lianas(0.5, 210, 51, 0.4);
    limbs(0.6, 150, 20, 0.45, 0.8);
    // things that live at particular depths
    if (near(85, 90)) for (let r = 0; r < 9; r++) spr('macaw', ['#ff5d5d', '#4d9bff', '#ffd34d'][r % 3], mod(34 * time + 52 * r + r * r * 7, W + 360) - 180, yOf(85) + 12 * Math.sin(2 * time + r) + (r % 3) * 16, 30, true, 0.12 * Math.sin(6 * time + r));
    if (near(300, 120)) for (let r = 0; r < 10; r++) { const x = W * (0.1 + 0.085 * r) + 20 * Math.sin(time * 0.9 + r * 2), y = yOf(300) + 40 * Math.sin(time * 0.7 + r * 1.3), fl = Math.abs(Math.sin(time * 13 + r)), ww = 2 + fl * 6; ctx.fillStyle = ['#ffb347', '#6fd6ff', '#ff8fd0', '#fff07a'][r % 4]; ctx.fillRect(sn(x - ww), sn(y - 3), ww, 5); ctx.fillRect(sn(x + 1.5), sn(y - 3), ww, 5); }
    if (near(600, 120)) { const y = yOf(600), x = W * 0.22; ctx.fillStyle = css(lerp3(air(600), [2, 8, 5], 0.6)); ctx.fillRect(0, y - 40, x + 60, 9); spr('sloth', '#b9a184', x, y - 6 + Math.sin(time * 0.8) * 2, 64, false, Math.sin(time * 0.8) * 0.04); }
    if (near(800, 140)) for (let r = 0; r < 22; r++) { ctx.fillStyle = 'rgba(232,255,122,' + Math.max(0.06, 0.3 + 0.25 * Math.sin(3 * time + r)).toFixed(3) + ')'; ctx.beginPath(); ctx.arc(W * (0.12 + 0.034 * r), yOf(800) + 22 * Math.sin(0.7 * time + 0.55 * r), 2.2, 0, 7); ctx.fill(); }
    if (near(1000, 90)) for (let r = 0; r < 4; r++) spr('toucan', '#ffc04d', mod(-22 * time + 150 * r, W + 220) - 110, yOf(1000) + 18 * Math.sin(time + 2 * r) + 9 * r, 34, false, 0);
    if (near(1500, 120)) { const y = yOf(1500), x = W * 0.74, blink = Math.sin(time * 1.9) > 0.94 ? 0 : 1; ctx.fillStyle = css(lerp3(air(1500), [2, 8, 5], 0.7)); ctx.fillRect(x - 90, y + 8, W, 10); if (blink) { ctx.fillStyle = '#e4ff6a'; ctx.fillRect(x, y - 6, 6, 4); ctx.fillRect(x + 18, y - 6, 6, 4); ctx.fillStyle = '#0a1a08'; ctx.fillRect(x + 2, y - 6, 2, 4); ctx.fillRect(x + 20, y - 6, 2, 4); } }
    if (near(2500, 100)) for (let r = 0; r < 7; r++) { const x = mod(60 * time + 90 * r, W + 200) - 100, y = yOf(2500) + 26 * Math.sin(1.4 * time + r), f = Math.sin(time * 16 + r) * 6; ctx.fillStyle = 'rgba(3,8,5,0.9)'; ctx.beginPath(); ctx.moveTo(x, y); ctx.lineTo(x - 11, y - 4 - f); ctx.lineTo(x - 6, y + 2); ctx.lineTo(x, y + 4); ctx.lineTo(x + 6, y + 2); ctx.lineTo(x + 11, y - 4 - f); ctx.closePath(); ctx.fill(); }
    if (near(3800, 220)) {
      // an overgrown stone idol, long forgotten
      const y = yOf(3800), x = W * 0.5; ctx.fillStyle = css(lerp3(air(3800), [3, 9, 6], 0.72));
      ctx.fillRect(x - 54, y - 60, 108, 150); ctx.fillRect(x - 72, y + 90, 144, 20); ctx.fillRect(x - 66, y - 78, 132, 20);
      ctx.fillStyle = css(air(3800)); ctx.fillRect(x - 32, y - 30, 20, 12); ctx.fillRect(x + 12, y - 30, 20, 12); ctx.fillRect(x - 22, y + 20, 44, 10);
      ctx.fillStyle = 'rgba(125,255,176,' + (0.35 + 0.25 * Math.sin(time * 1.3)).toFixed(3) + ')'; ctx.fillRect(x - 26, y - 27, 8, 6); ctx.fillRect(x + 18, y - 27, 8, 6);
    }
    if (near(FLOOR, 160)) {
      const y = yOf(FLOOR); ctx.fillStyle = css(lerp3(air(FLOOR), [18, 14, 10], 0.75));
      ctx.beginPath(); ctx.moveTo(0, y); for (let x = 0; x <= W + 30; x += 30) ctx.lineTo(x, y + hsh(x, 9) * 10); ctx.lineTo(W, y + 70); ctx.lineTo(W * 0.62, y + 46); ctx.lineTo(W * 0.56, y + 90); ctx.lineTo(W * 0.44, y + 90); ctx.lineTo(W * 0.38, y + 46); ctx.lineTo(0, y + 70); ctx.closePath(); ctx.fill();
      ctx.fillStyle = css(lerp3(air(FLOOR), [34, 110, 52], 0.3));
      for (let i = 0; i < W / 70; i++) { const fx0 = i * 70 + hsh(i, 41) * 40; if (Math.abs(fx0 - W / 2) < W * 0.1) continue; for (let f = -3; f <= 3; f++) for (let q = 1; q < 8; q++) ctx.fillRect(sn(fx0 + f * q * AP * 0.9), y - q * AP * (2.2 - Math.abs(f) * 0.4), AP * 2, AP); }
    }
    if (near(4400, 100)) for (let r = 0; r < 8; r++) { ctx.fillStyle = 'rgba(125,255,176,' + (0.2 + 0.25 * Math.sin(4 * time + 3 * r)).toFixed(3) + ')'; ctx.fillRect(sn((0.13 * r + 0.05) * W + 14 * Math.sin(0.8 * time + 2 * r)), sn(yOf(4400) + 18 * Math.sin(1.3 * time + r) + (r % 3) * 10), 3, 3); }
    if (near(10935, 260)) { const y = yOf(10935); for (let b = 0; b < 4; b++) { ctx.fillStyle = 'rgba(' + (b % 2 ? '60,150,170' : '40,110,140') + ',' + (0.5 - b * 0.08) + ')'; ctx.beginPath(); ctx.moveTo(0, y + b * 16); for (let x = 0; x <= W + 8; x += 8) ctx.lineTo(x, y + b * 16 + 4 * Math.sin(0.02 * x + time * (1.4 + b * 0.3))); ctx.lineTo(W, H + 40); ctx.lineTo(0, H + 40); ctx.closePath(); ctx.fill(); } }
    // butterflies (moths, deeper) that keep you company
    for (const b of roam) {
      b.x += b.sp * dt; if (b.sp > 0 && b.x > W + 60) { b.x = -60; b.off = D(-200, 200); } if (b.sp < 0 && b.x < -60) { b.x = W + 60; b.off = D(-200, 200); }
      if (camS + b.off < 20) continue;
      const y = yOf(camS + b.off) + 12 * Math.sin(time * 2 + b.ph), fl = Math.abs(Math.sin(time * 13 + b.ph)), ww = 2 + fl * 6;
      ctx.globalAlpha = 0.45 + 0.5 * light; ctx.fillStyle = light > 0.15 ? b.c : '#cfd8c8';
      ctx.fillRect(sn(b.x - ww), sn(y - 3), ww, 5); ctx.fillRect(sn(b.x + 1.5), sn(y - 3), ww, 5); ctx.fillStyle = '#1a1208'; ctx.fillRect(sn(b.x), sn(y - 3), 1.5, 6);
    }
    ctx.globalAlpha = 1;
    leafLayer(leavesA, dt);
    // the canopy roof, and the walkway you set off from
    if (sy > -80) {
      for (let x = -40, q = 0; x <= W + 90; x += 78, q++) drawClump((q * 5 + 2) % 6, 0, 0.2, x + 39 + Math.sin(time * 0.6 + q) * 2, sy + 44 + (q % 2) * 8, AP);
      for (let x = -40, q = 0; x <= W + 90; x += 78, q++) drawClump(q % 6, 0, 0.2, x + Math.sin(time * 0.7 + q) * 2, sy + 16 + (q % 3) * 6, AP);
      const px = sn(W * 0.3), py = sy - 4 + Math.sin(time * 1.1) * 1.5;
      ctx.fillStyle = '#3b2a1a'; ctx.fillRect(px - 60, py, 120, 5); for (let q = 0; q < 8; q++) ctx.fillRect(px - 58 + q * 15, py + 5, 3, 5);
      ctx.fillRect(px - 58, py - 26, 3, 26); ctx.fillRect(px + 55, py - 26, 3, 26); ctx.fillStyle = 'rgba(59,42,26,0.8)'; ctx.fillRect(px - 58, py - 20, 116, 2);
      ctx.fillStyle = '#3b2a1a'; ctx.fillRect(px - 10, py - 52, 3, 52);
      ctx.fillStyle = '#ff7a45'; const fl = Math.round(Math.sin(time * 3) * 1.2); ctx.fillRect(px - 7, py - 52 + fl, 15, 9); ctx.fillRect(px + 8, py - 49 + fl, 6, 3);
    }
    if (!low) { lianas(0.85, 330, 57, 0.7); mist(0.9, 260, 241, 0.09 * fog); }
    limbs(1, 310, 60, 0.82, 1.35);
    // depth haze over everything behind the lens: the deep forest becomes quiet silhouettes, so the answer and the text stand out
    const haze = Math.min(0.62, Math.max(0, (camS - 80) / 900));
    if (haze > 0.01) { ctx.fillStyle = css(air(camS + H * mpp * 0.1), haze.toFixed(3)); ctx.fillRect(-W, -H, W * 3, H * 3); }
    // spores and dust hanging in the still air: tiny, sparse, drifting up past you as you fall
    if (!low) { const n = Math.round(W * H / 9000), drift = camS / mpp; for (let q = 0; q < n; q++) { const x = mod(hsh(q, 401) * W + Math.sin(time * 0.3 + q) * 6, W), y = mod(hsh(q, 402) * (H + 40) - drift * (0.6 + hsh(q, 403) * 0.5) - time * (3 + hsh(q, 404) * 5), H + 40) - 20, big = hsh(q, 405) > 0.85, warm = hsh(q, 406) > 0.9; ctx.fillStyle = (warm ? 'rgba(232,255,122,' : 'rgba(190,236,210,') + ((big ? 0.5 : 0.28) * (0.6 + 0.4 * Math.sin(time * 1.7 + q))).toFixed(2) + ')'; ctx.fillRect(sn(x), sn(y), big ? 2 : 1, big ? 2 : 1); } }
    // the trunks you are climbing down between
    for (const side of [0, 1]) {
      const w = Math.max(26, Math.min(70, W * 0.06)), x = side ? W - w : 0, top = Math.max(0, sy - 20), bot = Math.min(H, yOf(FLOOR) + 30);
      if (bot > 0 && top < H) {
        fillBark(x, top, w, bot - top, camS / mpp, css(lerp3(air(camS + H * mpp * 0.2), [2, 7, 4], 0.86)), 90 + side);
      }
      if (camS > FLOOR - 200) { ctx.fillStyle = css(lerp3(air(camS + H * mpp * 0.3), [20, 18, 16], 0.85)); const t2 = Math.max(0, yOf(FLOOR) + 20); ctx.beginPath(); ctx.moveTo(side ? W : 0, t2); for (let y = t2; y <= H + 30; y += 30) ctx.lineTo(side ? W - w * (0.7 + hsh((y + camS / mpp) / 30 | 0, 80 + side) * 0.9) : w * (0.7 + hsh((y + camS / mpp) / 30 | 0, 80 + side) * 0.9), y); ctx.lineTo(side ? W : 0, H + 30); ctx.closePath(); ctx.fill(); }
    }
    leafLayer(leavesB, dt); leafLayer.prev = camS;
    // big leaves right in front of the lens: they whip past as you fall
    if (camS < FLOOR + 100) {
      ctx.fillStyle = css(lerp3(air(camS), [1, 5, 3], 0.9));
      const cz = camS * 1.6;
      for (let i = Math.max(0, Math.floor((cz - AY * mpp - 200) / 1100)); i <= Math.ceil((cz + (H - AY) * mpp + 200) / 1100); i++) {
        const dep = (i + hsh(i, 91) * 0.6) * 1100; if (dep / 1.6 > FLOOR) continue;
        const y = AY + (dep - cz) / mpp, left = hsh(i, 92) < 0.5, im = bigLeaf(i % 3), sc = AP, w = im.width * sc, hh2 = im.height * sc;
        ctx.save(); ctx.translate(left ? -w * 0.22 : W + w * 0.22, sn(y)); ctx.rotate((left ? 1 : -1) * (0.22 + Math.sin(time * 0.7 + i) * 0.05 + (hsh(i, 94) - 0.5) * 0.5));
        if (!left) ctx.scale(-1, 1); ctx.drawImage(im, 0, -hh2 / 2, w, hh2); ctx.restore();
      }
    }
    // spore puffs, motes and sparks
    for (const q of puffs) { const i = q.t / q.life; pglow(F(q.x), F(yOf(q.m)), F(q.r * (0.5 + i)), 0.9 * (1 - i), DARK, 3); }
    // speed: thin dashed streaks up the edges of the frame while you plunge
    const sp = Math.abs(vel) / mpp;
    if (false) {
      const rp = rampOf('#d2ffdc');
      for (let q = 0; q < 30; q++) {
        const e = hsh(q, 201) * fw * 0.22, x = hsh(q, 200) < 0.5 ? e : fw - e, len = Math.min(110, sp * 0.06) * (0.5 + hsh(q, 204)), y = mod(hsh(q, 202) * (fh + 160) - time * 520 * (0.6 + hsh(q, 203)) * Math.sign(vel), fh + 160) - 80;
        for (let k = 0; k < len; k++) { const u = k / len, edge = Math.min(u, 1 - u) * 2; if (edge < 0.5 && (k & 1)) continue; pset(x, y + k, rp[edge > 0.7 ? 3 : 1], 2); }
      }
    }
    // light racing out along a tier line as you break through it
    for (const w of sweeps) {
      const u = w.t / 0.7, e = 1 - Math.pow(1 - u, 3), y = F(yOf(w.m)) | 0, half = e * fw * 0.55, a = 1 - u, rp = rampOf(w.color), xa = Math.max(0, fw / 2 - half | 0), xb = Math.min(fw - 1, fw / 2 + half | 0);
      for (let x = xa; x <= xb; x++) {
        pset(x, y, rp[4], 6);
        for (let k = 1; k <= 7; k++) if (BAYER[(x & 3) + ((k & 3) << 2)] < a * (1 - k / 8)) { const c = rp[k < 2 ? 3 : k < 4 ? 2 : 1]; pset(x, y - k, c, 5 - (k >> 1)); pset(x, y + k, c, 5 - (k >> 1)); }
      }
      for (const tx of [xa, xb]) { pglow(tx, y, 10, a, rp, 4); prect(tx - 1, y - 1, 3, 3, rp[4], 6); }
    }
    for (const q of parts) {
      const x = F(q.x), y = F(yOf(q.m)), a = 1 - q.t / q.life;
      if (q.mote) {
        // a mote: one bright dot that twinkles into a tiny cross
        const f = Math.min(1, q.t * 4) * Math.min(1, a * 2.5); if (f < 0.1) continue;
        const rp = rampOf(q.color), ph = ((time * 6 + q.ph * 3) | 0) & 3, mx = x + 2 * Math.sin(2.4 * time + q.ph);
        pglow(mx, y, 2 + q.r * 0.8, f * 0.7, rp, 3); pset(mx, y, rp[ph === 3 ? 2 : 4], 5);
        if (ph === 1 && f > 0.5) { pset(mx - 1, y, rp[3], 4); pset(mx + 1, y, rp[3], 4); pset(mx, y - 1, rp[3], 4); pset(mx, y + 1, rp[3], 4); }
      } else if (q.leaf) {
        // a leaf: four drawn frames as it turns, lit on one edge
        if (a < 0.08) continue;
        const rp = rampOf(q.color), fr = (((q.rot / 0.7854) | 0) % 4 + 4) % 4, c0 = rp[2], c1 = rp[3];
        if (fr === 0) { pset(x - 1, y, c0, 4); pset(x, y, c1, 4); pset(x + 1, y, c1, 4); pset(x + 2, y, c0, 4); pset(x, y - 1, c1, 4); pset(x + 1, y + 1, c0, 4); }
        else if (fr === 1) { pset(x - 1, y - 1, c0, 4); pset(x, y, c1, 4); pset(x + 1, y + 1, c1, 4); pset(x, y - 1, c0, 4); pset(x + 1, y, c0, 4); }
        else if (fr === 2) { pset(x, y - 1, c0, 4); pset(x, y, c1, 4); pset(x, y + 1, c1, 4); pset(x, y + 2, c0, 4); }
        else { pset(x + 1, y - 1, c0, 4); pset(x, y, c1, 4); pset(x - 1, y + 1, c1, 4); pset(x, y + 1, c0, 4); pset(x - 1, y, c0, 4); }
      } else {
        // a spark: white-hot head, a tail that cools from light to dim, and a small glow
        const rp = rampOf(q.color), hot = a > 0.7 ? 4 : a > 0.45 ? 3 : a > 0.2 ? 2 : 1;
        if (q.h) for (let k = 0; k < q.h.length - 1; k++) { const p0 = q.h[k], p1 = q.h[k + 1], age = (q.h.length - 1 - k) / q.h.length; pline(F(p0[0]), F(yOf(p0[1])), F(p1[0]), F(yOf(p1[1])), rp[Math.max(0, hot - 1 - ((age * 3) | 0))], 3); }
        pglow(x, y, 2 + q.r, a * 0.8, rp, 3);
        if (a > 0.5) prect(x, y, 2, 2, rp[4], 6); else pset(x, y, rp[hot], 6);
      }
    }
    const L = window.__lines, sinking = !!window.__sink, p = window.__sinkP == null ? 1 : window.__sinkP;
    const cx = W / 2 + (sinking && L ? wobble(p, L.tier) : 0);
    if (L && sinking) {
      // a soft glow around the falling answer
      const tc = TIERS[L.tier].color, rp = rampOf(SPARK[L.tier]), tl = Math.min(70, sp * 0.1), bx = F(cx), by = F(AY - 30), tk = (time * 30) | 0;
      // embers streaming up off the answer, thinning as they rise
      for (let k = 0; k < tl; k++) {
        const u = k / tl, half = 16 * (1 - u) * (1 - u) + 1, dens = (1 - u) * 0.22, wob = Math.sin((k + time * 40) * 0.2) * 2 * u, Y = (by - k) | 0;
        for (let x = -half | 0; x <= half; x++) { const X = (bx + x + wob) | 0; if (BAYER[(X & 3) + (((Y + tk) & 3) << 2)] < dens * (1 - Math.abs(x) / (half + 1))) pset(X, Y, rp[u < 0.15 ? 3 : u < 0.5 ? 2 : 1], 2); }
      }
      // toucan-tier answers come down with an escort
      if (L.tier === 1) [[-64, -26], [-88, 10], [64, -18], [88, 18], [-40, 34], [44, 38]].forEach((o, i) => spr('toucan', TIERS[1].color, cx + o[0] * 1.6, AY + o[1] + 6 * Math.sin(4 * time + i), 32, o[0] > 0, 0));
      if (L.tier === 3) { const sp = ctx.createRadialGradient(cx, AY, 66, cx, AY, 330); sp.addColorStop(0, 'rgba(2,8,4,0)'); sp.addColorStop(0.34, 'rgba(2,8,4,0.72)'); sp.addColorStop(1, 'rgba(2,8,4,0.96)'); ctx.fillStyle = sp; ctx.fillRect(0, 0, W, H); }
    }
    // moths circle an Obscura, then scatter when it lands
    if (orbit) {
      const hold = sinking ? 1 : 0.62;
      for (const n of orbit) {
        const rad = n.rad * hold * (1 + 7 * burstT), a = n.ang + time * n.w, ox = (sinking ? cx : W / 2) + Math.cos(a) * rad * 1.5, oy = AY + Math.sin(a) * rad * 0.62 + 4 * Math.sin(2.2 * time + n.ph);
        ctx.globalAlpha = Math.max(0, 0.92 - 1.15 * burstT); spr('moth', '#ffe08a', ox, oy, n.s, -Math.sin(a) * n.w > 0, 0);
      }
      ctx.globalAlpha = 1;
    }
    // (shockwave rings removed: the landing is carried by the burst, the flash and the card)
    if (flash > 0) {
      const rp = rampOf(flashC), cx0 = fw / 2, cy0 = F(AY);
      pglow(cx0, cy0, F(60 + (1 - flash) * 30), flash * 0.6, rp, 4);
      // a starburst: rays plotted as pixel lines, every fourth one long
      for (let q = 0; q < 0; q++) { const ang = q * 0.3927 + 0.2, r0 = F(30 + (1 - flash) * 120), r1 = r0 + F((q % 4 === 0 ? 150 : 70) * flash * (0.6 + hsh(q, 300) * 0.6)); pline(cx0 + Math.cos(ang) * r0, cy0 + Math.sin(ang) * r0, cx0 + Math.cos(ang) * r1, cy0 + Math.sin(ang) * r1, rp[flash > 0.5 ? 4 : 3], 6); }
      // and a thin horizontal flare through the middle
      const arm = F(W * 0.34 * flash);
      for (let x = -arm | 0; x <= arm; x++) { const edge = 1 - Math.abs(x) / (arm + 1); if (edge < 0.4 && (x & 1)) continue; pset(cx0 + x, cy0, rp[edge > 0.5 ? 4 : 3], 6); if (edge > 0.6) { pset(cx0 + x, cy0 - 1, rp[3], 5); pset(cx0 + x, cy0 + 1, rp[3], 5); } }
    }
    // the frog: sits by the dock, dives beside the answer, perches by the result
    const stage = bc.contains('sinking') ? 'sink' : bc.contains('quiet') ? 'landed' : bc.contains('trek') ? 'ask' : dive ? 'idle' : 'home';
    const tgt = stage === 'sink' ? { x: Math.min(cx + 150, W - 44), y: AY - 14, rot: 0.42 } : stage === 'landed' ? { x: W * 0.16, y: H * 0.28, rot: -0.14 } : stage === 'ask' ? { x: 48, y: H - 168, rot: 0 } : stage === 'home' ? { x: W * 0.72, y: sy + 70, rot: 0 } : { x: W * 0.72, y: H * 0.4, rot: 0.1 };
    const fk = 1 - Math.exp(-(stage === 'sink' ? 4.6 : 2.6) * dt);
    frog.x += (tgt.x - frog.x) * fk; frog.y += (tgt.y - frog.y) * fk; frog.rot += (tgt.rot - frog.rot) * fk;
    frog.hop = Math.max(0, frog.hop - dt * 2.2);
    const pal = window.__pal || { art: 'krill', color: '#ff7a45' }, gold = !!window.__gold;
    if (frog.moodT > 0) frog.moodT -= dt; else frog.mood = null;
    const sad = frog.mood === 'sad', loop = frog.mood === 'loop' ? 1 - Math.max(0, frog.moodT) / 1.25 : 0;
    const bob = (sad ? Math.sin(2.2 * time) * 3 + 8 : Math.sin(1.7 * time) * 6) - Math.sin(frog.hop * Math.PI) * 46 - Math.sin(loop * Math.PI) * 40;
    if (gold) halo(frog.x, frog.y + bob, 46, '#ffd166', 0.5 + 0.2 * Math.sin(time * 2.4));
    spr(pal.art, gold ? '#ffd166' : pal.color, frog.x, frog.y + bob, 48, false, frog.rot + (sad ? 0.5 : 0) + Math.sin(1.1 * time) * 0.07 + frog.hop * frog.hop * 6.283 - loop * 6.283);
    if (gold && !reduce && time - (frog.gs || 0) > 0.55) { frog.gs = time; fx.burst(frog.x + D(-10, 10), frog.y + bob + D(-6, 10), R() < 0.5 ? '#ffd166' : '#ffe9a8', 1, 0.15); }
    if (!reduce && time - frog.emit > 2.2 + R()) { frog.emit = time; fx.bubble(frog.x + 20, frog.y + bob - 8, 1.5 + 2 * R()); }
    // depth ruler, notes, vignette
    const trek = bc.contains('trek');
    if (vig) { const o = Math.min(0.4, 0.25 + Math.max(0, camS) / 8000).toFixed(2); if (vig.style.opacity !== o) vig.style.opacity = o; }
    if (ruler) ruler.hidden = !trek;
    if (notes) notes.hidden = !trek || bc.contains('quiet');
    if (trek) {
      const rx = W - 16;
      ctx.strokeStyle = 'rgba(190,214,184,.55)'; ctx.fillStyle = 'rgba(190,214,184,.55)'; ctx.lineWidth = 2;
      ctx.fillRect(rx, Math.max(0, sy), 2, H);
      let n = 0;
      for (let m = Math.max(0, Math.floor((camS - AY * mpp) / 10) * 10); ; m += 10) {
        const y = yOf(m); if (y > H + 4) break; if (y < -4) continue;
        const t = m % 100 === 0 ? 16 : m % 50 === 0 ? 10 : 5;
        ctx.fillRect(rx - t, sn(y), t, 2);
        if (m % 100 === 0 && ruler && n < ruler.children.length) { const el = ruler.children[n++]; el.textContent = m ? '-' + m.toLocaleString('en-US') + 'm' : '0m'; el.style.transform = 'translateY(' + sn(y - 9) + 'px)'; el.hidden = false; }
      }
      if (ruler) for (; n < ruler.children.length; n++) ruler.children[n].hidden = true;
      // where you are on it
      ctx.fillStyle = '#ff7a45'; ctx.beginPath(); ctx.moveTo(rx + 4, AY); ctx.lineTo(rx + 12, AY - 5); ctx.lineTo(rx + 12, AY + 5); ctx.closePath(); ctx.fill(); ctx.fillRect(rx - 20, AY - 1, 22, 2); ctx.font = '13px VT323, monospace'; ctx.textAlign = 'right'; ctx.fillText('YOU', rx - 24, AY + 4);
      if (notes) for (let i = 0; i < NOTES.length; i++) { const y = yOf(NOTES[i][0]), el = notes.children[i]; if (y < 90 || y > H - 150) { if (!el.hidden) el.hidden = true; } else { el.hidden = false; el.style.transform = 'translateY(' + sn(y - 10) + 'px)'; } }
      const hd = $('hud-depth'), txt = fmt(Math.round(Math.max(0, cam))) + 'm';
      if (hd && hd.textContent !== txt) { hd.textContent = txt; if (time - lastCrank > 0.11) { lastCrank = time; restart(hd, 'crank'); } }
    }
    // tier lines and the falling answer
    if (over) {
      over.classList.toggle('on', !!L);
      if (L) {
        ensureOverlay();
        const kids = over.children;
        if (linesId !== L.id) { linesId = L.id; for (let i = 0; i < 5; i++) kids[i].classList.remove('passed', 'flash'); kids[5].lastChild.textContent = L.label.replace(' ▼', ''); kids[5].style.setProperty('--cc', TIERS[L.tier].color); kids[5].classList.toggle('gold', L.tier === 4); }
        for (let i = 0; i < 5; i++) {
          const d = L.base + TIERS[i].pts * M_PER_PT, el = kids[i];
          el.style.transform = 'translateY(' + sn(yOf(d)) + 'px)';
          if (i <= L.tier && cam >= d - 4 && !el.classList.contains('passed')) { el.classList.add('passed', 'flash'); snd('line', i); if (i !== L.tier) for (let b = 0; b < 3; b++) fx.bubble(W / 2 + D(-50, 50), yOf(d) + D(-6, 6), 3); }
        }
        const wx = sinking ? wobble(p, L.tier) : 0;
        kids[5].style.transform = 'translate3d(calc(-50% + ' + wx.toFixed(1) + 'px), ' + sn(AY - 24) + 'px, 0) rotate(' + (wx * (L.tier === 0 ? 0.55 : L.tier === 4 ? 0.5 : 0.4)).toFixed(2) + 'deg)';
        kids[5].style.opacity = sinking ? '1' : '0';
      }
    }
    fxFlush();
  }
  const easeIO = p => p < 0.5 ? 4 * p * p * p : 1 - Math.pow(-2 * p + 2, 3) / 2, easeSine = p => -(Math.cos(Math.PI * p) - 1) / 2;
  function frame(now) {
    requestAnimationFrame(frame);
    const dt = Math.min(0.05, (now - (last || now)) / 1000); last = now;
    if (hold > 0) { hold -= dt; draw(0); return; }
    if (!reduce) time += dt;
    const dive = document.body.classList.contains('dive'), prevS = camS, sk = window.__sink;
    const at = H * (dive ? 0.3 : 0.36); AY = AY ? AY + (at - AY) * (1 - Math.exp(-dt * 5)) : at;
    if (sk && sk.rise) {
      // the climb back out: straight up to the canopy, no fanfare
      if (sk.from == null) sk.from = cam;
      const p = reduce ? 1 : Math.min(1, (now - sk.start) / (sk.dur * 1000));
      cam = sk.from + (sk.to - sk.from) * easeIO(p); window.__sinkP = 1;
      if (p >= 1) window.__sink = null;
    } else if (sk) {
      const tr = window.__lines ? window.__lines.tier : 1;
      if (sk.from == null) sk.from = cam;
      const p = reduce ? 1 : Math.min(1, (now - sk.start) / (sk.dur * 1000));
      cam = sk.from + (sk.to - sk.from) * (tr === 0 ? easeSine(p) : easeIO(p));
      window.__sinkP = p;
      const cx = W / 2 + wobble(p, tr);
      if (!sk.began) {
        sk.began = true; orbit = null; burstT = 0; snd('sink', { tier: tr, dur: sk.dur });
        if (tr === 2) { fx.flash('rgba(255,82,110,.4)', 1, 220); fx.puff(cx, AY, 10); }
        if (tr === 4) { fx.flash('rgba(255,209,102,.45)', 1, 180); orbit = null; }
      }
      if (!reduce && p < 1) {
        if (tr === 0) { if (R() < 0.25) fx.bubble(cx + D(-30, 30), AY, 1.2 + 1.8 * R(), '160,176,160'); }
        else if (tr === 2) { if (R() < 0.6) fx.bubble(cx + D(-34, 34), AY + D(-8, 4), 1.5 + 2.5 * R()); if (R() < 0.09) fx.puff(cx + D(-20, 20), AY - 10, 3); }
        else if (tr === 3) { if (R() < 0.3) fx.bubble(cx + D(-20, 20), AY, 1 + 2 * R()); }
        else if (tr === 4) { if (R() < 0.5) fx.bubble(cx + D(-30, 30), AY, 1.5 + 2 * R(), '255,224,138'); }
        else if (R() < 0.6) fx.bubble(cx + D(-34, 34), AY + D(-8, 4), 1.5 + 2.5 * R());
      }
      if (p >= 1) {
        window.__sink = null; window.__sinkP = 1;
        const c = TIERS[tr].color, at = cam;
        // contact: a white hit, a jolt, and a beat of stillness that is longer the rarer the answer
        flash = 0.18; flashC = '#ffffff'; punch = 0.25; hold = [0, 0.05, 0.09, 0.13, 0.2][tr]; snd('impact', tr);
        setTimeout(() => {
          flash = 0.3 + tr * 0.06; flashC = c; punch = 0.25 + tr * 0.08; snd('land', tr);
          if (tr === 0) { frog.mood = 'sad'; frog.moodT = 3.2; } else if (tr === 4) { frog.mood = 'loop'; frog.moodT = 1.25; window.__gold = true; }
          rings.push({ m: at, color: c, t: 0, life: 0.9, R: 300 + tr * 40 });
          if (tr >= 2) rings.push({ m: at, color: c, t: -0.12, life: 1.1, R: 460 + tr * 40 });
          if (tr >= 3) rings.push({ m: at, color: '#ffffff', t: -0.24, life: 1.3, R: 640 });
          fx.leaves(W / 2, AY, [2, 4, 6, 9, 16][tr], [0.5, 0.6, 0.7, 0.8, 1][tr]); for (let b = 0; b < 4 + tr * 3; b++) fx.bubble(W / 2 + D(-70, 70), AY + D(-20, 30), 3);
          fx.burst(W / 2, AY, SPARK[tr], [4, 8, 12, 16, 22][tr], [0.35, 0.5, 0.6, 0.7, 0.85][tr]);
          
          if (tr === 2) fx.flash('rgba(255,77,77,.26)', 1, 460);
          if (tr === 3) { fx.shake(); fx.flash('rgba(157,123,255,.34)', 1, 520); }
          if (tr === 4) {
            fx.shake(); fx.zap(); fx.flash('rgba(255,209,102,.42)', 2, 320);
            // gold keeps raining for a moment
            for (let w = 1; w <= 3; w++) setTimeout(() => { fx.burst(W / 2 + D(-120, 120), AY + D(-70, 40), ['#ffd166', '#ffe9a8'][w % 2], 6, 0.6); fx.leaves(W / 2 + D(-160, 160), AY - 60, 8, 0.9); rings.push({ m: toM(AY + D(-60, 60)), color: '#ffd166', t: 0, life: 0.8, R: 200 }); }, w * 230);
            setTimeout(() => { burstT = 0.0001; }, 900);
          }
        }, hold * 1000);
      }
    } else {
      const target = dive ? (window.__depth || 0) : 0;
      cam = reduce ? target : cam + (target - cam) * (1 - Math.exp(-dt * 2));
      if (Math.abs(target - cam) < 0.05) cam = target;
    }
    // the view trails the camera slightly and breathes when idle
    camS += (cam - camS) * (reduce ? 1 : 1 - Math.exp(-6 * dt)); if (Math.abs(cam - camS) < 0.02) camS = cam;
    camS += reduce ? 0 : 0.012 * Math.sin(0.45 * time);
    vel = dt ? (camS - prevS) / dt : 0;
    { let z = -1; for (let i = 0; i < NOTES.length; i++) if (NOTES[i][2] && cam >= NOTES[i][0]) z = i;
      if (zoneAt === -1 && !document.body.classList.contains('trek')) zoneAt = z;
      else if (z > zoneAt && document.body.classList.contains('trek')) { zoneAt = z; const el = $('zone'); if (el) { el.firstChild.textContent = ''; el.lastChild.textContent = '── ' + NOTES[z][1]; restart(el, 'show'); } snd('zone'); }
      else if (z < zoneAt) zoneAt = z; }
    for (const q of parts) {
      q.t += dt; q.px = q.x; q.pm = q.m; q.x += q.vx * dt; q.m += q.vm * dt;
      if (q.leaf) { q.rot += q.spin * dt; q.vx = q.vx * (1 - 2.2 * dt) + Math.sin(time * 3 + q.ph) * 40 * dt; q.vm = q.vm * (1 - 2.2 * dt) + 70 * mpp * dt; }
      else if (q.mote) { q.vx *= 1 - 1.2 * dt; }
      else { q.vx *= 1 - 2.4 * dt; q.vm = q.vm * (1 - 2.4 * dt) + 26 * mpp * dt; (q.h || (q.h = [])).push([q.x, q.m]); if (q.h.length > 6) q.h.shift(); }
    }
    for (const rg of rings) rg.t += dt; if (rings.length && rings[0].t >= rings[0].life) rings = rings.filter(rg => rg.t < rg.life);
    for (const w of sweeps) w.t += dt; if (sweeps.length && sweeps[0].t >= 0.7) sweeps = sweeps.filter(w => w.t < 0.7);
    punch = Math.max(0, punch - dt * 3.2);
    if (parts.length && parts.some(q => q.t >= q.life)) parts = parts.filter(q => q.t < q.life);
    for (const q of puffs) { q.t += dt; q.vx *= 1 - 1.6 * dt; q.vm *= 1 - 1.6 * dt; q.x += q.vx * dt; q.m += q.vm * dt; }
    if (puffs.length && puffs.some(q => q.t >= q.life)) puffs = puffs.filter(q => q.t < q.life);
    flash = Math.max(0, flash - dt * 1.5);
    if (burstT > 0) { burstT += dt / 1.5; if (burstT >= 1) { burstT = 0; orbit = null; } }
    if (orbit && !window.__sink && !window.__lines && burstT === 0) orbit = null;
    draw(dt);
  }
  addEventListener('pointerdown', e => { if (frog.hop > 0 || Math.hypot(e.clientX - frog.x, e.clientY - frog.y) > 36 || (e.target.closest && e.target.closest('button, input, select'))) return; frog.hop = 1; snd('ribbit'); { const pop = h('span', { class: 'ribbit', 'aria-hidden': 'true', text: (window.__pal && window.__pal.id !== 'frog') ? 'hey!' : 'ribbit!', style: 'left:' + Math.round(frog.x) + 'px;top:' + Math.round(frog.y - 34) + 'px' }); document.body.append(pop); setTimeout(() => pop.remove(), 1000); } for (let q = 0; q < 6; q++) fx.bubble(frog.x + D(-16, 26), frog.y - 16, 1 + 3 * R()); fx.burst(frog.x, frog.y, '#ff7a45', 10, 0.5); });
  // deep down, the pointer leaves a trail of sparks
  addEventListener('pointermove', e => { const now = performance.now(); if (reduce || camS < 550 || now - lastTrail < 50 || parts.length > 250) return; lastTrail = now; parts.push({ x: e.clientX + D(-6, 6), m: toM(e.clientY) + D(-4, 4) * mpp, vx: D(-14, 14), vm: D(-10, 10) * mpp * 0.5, r: 1.6, life: 0.9, t: 0, color: '#e8ff7a' }); });
  if (ruler) for (let i = 0; i < 10; i++) ruler.append(h('span'));
  if (notes) NOTES.forEach(([, label, major], i) => notes.append(h('span', { class: (major ? 'major' : '') + (i % 2 ? ' r' : ''), text: i % 2 ? label + ' ──' : '── ' + label })));
  let rz = 0;
  addEventListener('resize', () => { clearTimeout(rz); rz = setTimeout(build, 150); });
  build();
  window.__rebuild = () => { for (const k2 in tinted) delete tinted[k2]; build(); };
  window.__sea = () => {};
  requestAnimationFrame(frame);
})();

/* ---------- boot ---------- */
render();
(async () => {
  const c = window.claude;
  if (!c || !c.use) { S.dbState = 'none'; return render(); }
  try {
    const [db, user] = await Promise.all([c.use('db'), c.use('user')]);
    if (user) {
      const uid = await user.id();
      if (uid) S.me.id = uid;
      S.canWrite = await user.can('data.write');
    }
    S.db = db; S.dbState = db ? 'ready' : 'none';
  } catch (e) { S.dbState = 'none'; }
  render();
  const last = ls.get('code');
  if (S.db && last && !S.mode && S.me.name && S.canWrite !== false) joinRoom(last, true);
})();
})();
