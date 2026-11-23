// Card art for Obscura packs: every card gets its own picture without anyone drawing it by hand.
//  - a subject icon: the emoji that best names the answer (or failing that, the prompt), redrawn as pixel art
//  - a scene behind it, chosen by what the prompt is about (a stadium, a map, a kitchen table, space...)
//  - a crest: a small coat of arms made from the answer's name, so no two cards share one
//  - enchantments: rare lucky effects that animate on the card and follow you into the game
'use strict';
(function () {
  // a stable random number generator seeded by a string, so a card always looks the same
  const hash = s => { let h = 2166136261; for (const c of String(s)) { h ^= c.codePointAt(0); h = Math.imul(h, 16777619); } return h >>> 0; };
  const rng = seed => { let a = hash(seed) || 1; return () => { a ^= a << 13; a ^= a >>> 17; a ^= a << 5; return ((a >>> 0) % 100000) / 100000; }; };

  /* ---------- which emoji fits ---------- */
  const EXTRA = { 'super bowl': '🏈', dish: '🍲', water: '💧', festival: '🎪', store: '🏪', service: '🛎️', electronic: '🔌', face: '🙂', eye: '👁️', female: '👩', record: '📀', keyboard: '⌨️', pink: '🎨', green: '🎨', blue: '🎨', black: '🎨', white: '🎨', red: '🎨', yellow: '🎨', orange: '🎨', purple: '🎨', brown: '🎨', grey: '🎨', gray: '🎨', colour: '🎨', color: '🎨', dinosaur: '🦖', prehistoric: '🦖', tea: '🍵', phobia: '😱', currency: '💰', novel: '📖', novelist: '✒️', shakespeare: '🎭', play: '🎭', meme: '🐸', emperor: '🏛️', monarch: '👑', battle: '⚔️', war: '⚔️', bible: '📜', robot: '🤖', youtuber: '📹', streamer: '📹', primate: '🐒', marsupial: '🦘', rodent: '🐀', weasel: '🦡', biscuit: '🍪', cookie: '🍪', crayon: '🖍️', sneaker: '👟', trainer: '👟', gym: '🏋️', exercise: '🏋️', strait: '🌊', canal: '🌊', billionaire: '💸', boxing: '🥊', ufc: '🥊', curry: '🍛', sushi: '🍣', stew: '🍲', casserole: '🍲', burger: '🍔', taco: '🌮', burrito: '🌯', pie: '🥧', doughnut: '🍩', donut: '🍩', sugar: '🍬', sweetener: '🍬', nut: '🥜', squash: '🎃', pumpkin: '🎃', potato: '🥔', potatoes: '🥔', onion: '🧅', bean: '🫘', legume: '🫘', salad: '🥗', rice: '🍚', beef: '🥩', dip: '🥣', dressing: '🥗', bagel: '🥯', sausage: '🌭', pitch: '⚾', crisps: '🥔', chips: '🥔', flavour: '🍦', flavor: '🍦', underground: '🚇', station: '🚉', park: '🏞️', explorer: '🧭', astronaut: '🧑‍🚀', lego: '🧱', streaming: '📺', haribo: '🍬', hershey: '🍫', kellogg: '🥣', pasta: '🍝', noodle: '🍜', president: '🏛️', capital: '🏛️', country: '🌍', city: '🏙️', town: '🏘️', island: '🏝️', river: '🏞️', mountain: '⛰️', volcano: '🌋', language: '🗣️', word: '🔤', letter: '🔤', rhyme: '🎶', song: '🎵', band: '🎸', singer: '🎤', rapper: '🎤', album: '💿', instrument: '🎻', character: '🎭', villain: '😈', hero: '🦸', film: '🎬', movie: '🎬', show: '📺', series: '📺', cartoon: '📺', anime: '🌸', game: '🎮', pokémon: '⚡', pokemon: '⚡', player: '🏅', team: '🏆', athlete: '🏅', element: '⚗️', chemical: '⚗️', bone: '🦴', organ: '🫀', disease: '🦠', unit: '📏', shape: '🔷', invention: '💡', inventor: '💡', gem: '💎', mineral: '💎', rock: '🪨', planet: '🪐', moon: '🌙', star: '⭐', god: '⚡', goddess: '🌙', myth: '🐉', monster: '👹', brand: '🏷️', company: '🏢', app: '📱', website: '🌐', car: '🚗', airline: '✈️', shop: '🛍️', clothing: '👕', clothes: '👕', hat: '🎩', toy: '🧸', tool: '🔧', kitchen: '🍳', bathroom: '🛁', bedroom: '🛏️', garden: '🌻', classroom: '🏫', school: '🏫', hotel: '🏨', job: '💼', famous: '🌟', person: '🧑', author: '✒️', artist: '🎨', painter: '🎨', scientist: '🔬', philosopher: '🤔', insect: '🐞', bug: '🐞', fish: '🐟', bird: '🐦', reptile: '🦎', mammal: '🐾', animal: '🐾', plant: '🌿', flower: '🌸', tree: '🌳', fungus: '🍄', mushroom: '🍄', fruit: '🍎', vegetable: '🥕', food: '🍽️', drink: '🥤', cocktail: '🍸', snack: '🍿', dessert: '🍰', cake: '🍰', candy: '🍬', chocolate: '🍫', bread: '🍞', spice: '🌶️', herb: '🌿', breakfast: '🍳', sandwich: '🥪', soup: '🍲', sauce: '🥫', cereal: '🥣', sport: '🏆', football: '🏈', nfl: '🏈', soccer: '⚽', nba: '🏀', basketball: '🏀', mlb: '⚾', baseball: '⚾', nhl: '🏒', hockey: '🏒', tennis: '🎾', golf: '⛳', cricket: '🏏', rugby: '🏉', olympic: '🥇', wrestler: '🤼', racing: '🏎️', ski: '⛷️', skiing: '⛷️', swimming: '🏊', cycling: '🚴', something: '✨' };
  const STOP = new Set(('name a an the of or and type kind that is in from with who has have something thing things you your its it by to for one not can usually famous other any some way part member word called often used '
    + 'right left five first second third blow fast sit hot cold sweet stick small big large new old three seven two four six eight nine ten full back ends north south east west square set silent off on inside outside trend light dark grow hands sign department button woman man men women person people club life night day piece real most more less long short top bottom good bad high low').split(' '));
  const sing = w => w.replace(/(ies)$/, 'y').replace(/(ches|shes|xes|ses)$/, m => m.slice(0, -2)).replace(/([^s])s$/, '$1');
  const look = k => { if (!k) return null; k = k.toLowerCase(); return EXTRA[k] || (window.EMOJI || {})[k] || EXTRA[sing(k)] || (window.EMOJI || {})[sing(k)] || null; };
  function pickEmoji(answer, prompt) {
    // the answer itself, only when the whole thing names something ("Cheddar" no, "Pizza" yes, "Japan" yes)
    const a = String(answer).toLowerCase().replace(/[^a-z0-9 '-]/g, '').trim();
    const ae = (window.EMOJI || {})[a] || (window.EMOJI || {})[sing(a)]; if (ae) return ae;
    // else the first thing the prompt is about ("Name a type of baseball pitch" -> baseball)
    return topicOf(prompt).emoji;
  }
  // what a prompt is about: the first word (or pair of words) that names a thing with an emoji
  function topicOf(prompt) {
    const words = String(prompt).toLowerCase().replace(/[“”"'’]/g, '').split(/[^a-zé]+/).filter(w => w && !STOP.has(w));
    const raw = String(prompt).toLowerCase().replace(/[“”"'’]/g, '').split(/[^a-zé]+/).filter(Boolean);
    for (let i = 0; i < raw.length - 1; i++) { const k = raw[i] + ' ' + raw[i + 1]; if (EXTRA[k]) return { emoji: EXTRA[k].replace(/\uFE0F/g, ''), word: k }; }
    for (const w of words) { const e = look(w); if (e) return { emoji: e.replace(/\uFE0F/g, ''), word: ['pink', 'green', 'blue', 'black', 'white', 'red', 'yellow', 'orange', 'purple', 'brown', 'grey', 'gray', 'color'].includes(w) ? 'colour' : w }; }
    for (let i = 0; i < words.length - 1; i++) { const e = look(words[i] + ' ' + words[i + 1]); if (e) return { emoji: e.replace(/\uFE0F/g, ''), word: words[i] + ' ' + words[i + 1] }; }
    return { emoji: '✨', word: '' };
  }

  /* ---------- an emoji, redrawn as pixel art ---------- */
  const pixCache = {};
  function pixelEmoji(e, size = 28) {
    const key = e + size; if (pixCache[key]) return pixCache[key];
    const big = document.createElement('canvas'); big.width = big.height = 160; const bg = big.getContext('2d');
    bg.textAlign = 'center'; bg.textBaseline = 'middle'; bg.font = '128px "Apple Color Emoji","Segoe UI Emoji","Noto Color Emoji",sans-serif'; bg.fillText(e, 80, 88);
    const sm = document.createElement('canvas'); sm.width = sm.height = size; const sg = sm.getContext('2d'); sg.imageSmoothingEnabled = true; sg.imageSmoothingQuality = 'high'; sg.drawImage(big, 0, 0, size, size);
    const id = sg.getImageData(0, 0, size, size), d = id.data;
    // hard alpha, fewer colours: the pixel-art look
    for (let i = 0; i < d.length; i += 4) { if (d[i + 3] < 110) { d[i + 3] = 0; continue; } d[i + 3] = 255; for (let c = 0; c < 3; c++) d[i + c] = Math.min(255, Math.round(d[i + c] / 32) * 32); }
    // a dark outline around the shape, like the game's creatures
    const out = new Uint8ClampedArray(d); const at = (x, y) => (x < 0 || y < 0 || x >= size || y >= size) ? 0 : d[(y * size + x) * 4 + 3];
    for (let y = 0; y < size; y++) for (let x = 0; x < size; x++) { const i = (y * size + x) * 4; if (d[i + 3]) continue; if (at(x - 1, y) || at(x + 1, y) || at(x, y - 1) || at(x, y + 1)) { out[i] = 5; out[i + 1] = 13; out[i + 2] = 8; out[i + 3] = 255; } }
    sg.putImageData(new ImageData(out, size, size), 0, 0);
    return (pixCache[key] = sm.toDataURL());
  }

  /* ---------- the scene behind it ---------- */
  const CATS = [
    ['sport', /sport|football|soccer|baseball|basketball|nfl|nba|mlb|nhl|hockey|tennis|golf|cricket|rugby|olymp|athlete|team|player|wrestl|box|ufc|racing|ski|swim|cycl|goalkeeper|stanley|pitch/],
    ['geo', /country|countries|city|cities|capital|state|island|river|mountain|lake|town|europe|asia|africa|america|ocean|desert|volcano|strait|canal|park|station|place/],
    ['wild', /animal|bird|fish|insect|mammal|reptile|dog|horse|spider|shark|whale|dinosaur|bug|snake|frog|pet|creature|monkey|bear|primate|marsupial|rodent|weasel|plant|flower|tree|fung|mushroom|moss|fern|garden/],
    ['food', /food|fruit|vegetable|cheese|pasta|dish|dessert|cake|snack|drink|cocktail|soda|candy|chocolate|bread|sauce|spice|herb|breakfast|sandwich|soup|meat|cereal|pizza|ice cream|crisps|chips|curry|sushi|stew|burger|taco|pie|doughnut|bagel|sausage|salad|rice|beef|bean|potato|tea|biscuit|cookie/],
    ['space', /element|chemical|planet|star|moon|space|physic|biolog|bone|organ|body|disease|cell|unit|math|shape|invent|scien|gas|metal|mineral|gem|rock|astronaut/],
    ['stage', /film|movie|tv|show|series|character|cartoon|disney|pixar|anime|marvel|villain|hero|actor|song|band|singer|rapper|album|music|instrument|opera|dance|shakespeare|play|youtuber|streamer/],
    ['arcade', /game|pok|mario|zelda|minecraft|fortnite|roblox|nintendo|xbox|playstation|clash|genshin|smash|lego|meme|emoji|app|website/],
    ['hall', /famous|person|president|king|queen|monarch|emperor|author|artist|painter|writer|scientist|philosoph|leader|billionaire|explorer|novel|bible|war|battle|god|myth|legend/],
  ];
  const catOf = prompt => { const p = String(prompt).toLowerCase(); for (const [k, re] of CATS) if (re.test(p)) return k; return 'room'; };
  const W = 64, H = 40;
  function scene(cat, seed) {
    const r = rng(seed), cv = document.createElement('canvas'); cv.width = W; cv.height = H; const g = cv.getContext('2d');
    const px = (x, y, c, w = 1, hh = 1) => { g.fillStyle = c; g.fillRect(x | 0, y | 0, w, hh); };
    const grad = (top, bot, y0 = 0, y1 = H) => { for (let y = y0; y < y1; y++) { const f = (y - y0) / Math.max(1, y1 - y0 - 1); px(0, y, mix(top, bot, Math.round(f * 4) / 4), W, 1); } };
    const hue = Math.floor(r() * 360);
    if (cat === 'sport') {
      grad('#2a6fd1', '#9fd3ff', 0, 14);
      for (let y = 14; y < 22; y++) for (let x = 0; x < W; x++) px(x, y, ((x + y) % 2 && r() < 0.6) ? ['#ff5d5d', '#ffd166', '#ffffff', '#4d9bff'][Math.floor(r() * 4)] : '#1d2a3a');
      for (let y = 22; y < H; y++) px(0, y, (Math.floor(y / 3) % 2) ? '#3fa34d' : '#358f42', W, 1);
      px(0, 22, '#e9f5e9', W, 1); px(W / 2, 22, '#e9f5e9', 1, H - 22);
      for (const lx of [6, W - 7]) { px(lx, 3, '#fff7c0', 3, 2); px(lx + 1, 5, '#7a8899', 1, 9); }
    } else if (cat === 'geo') {
      grad('#e8d5a8', '#cdb27a');
      // a coastline: noisy land blobs on a sea
      for (let y = 0; y < H; y++) for (let x = 0; x < W; x++) { const n = Math.sin(x * 0.21 + hue) + Math.cos(y * 0.27 - hue * 0.3) + Math.sin((x + y) * 0.13 + seed.length); if (n > 0.9) px(x, y, '#8fb46a'); else if (n > 0.7) px(x, y, '#d8c58c'); else if (n < -0.4) px(x, y, '#7fb2c9'); }
      for (let x = 0; x < W; x += 8) px(x, 0, 'rgba(90,60,20,0.25)', 1, H); for (let y = 0; y < H; y += 8) px(0, y, 'rgba(90,60,20,0.25)', W, 1);
      px(W - 9, 3, '#5a3d22', 1, 7); px(W - 12, 6, '#5a3d22', 7, 1); px(W - 9, 3, '#c0392b', 1, 3);
    } else if (cat === 'food') {
      for (let y = 0; y < H; y++) for (let x = 0; x < W; x++) px(x, y, ((Math.floor(x / 4) + Math.floor(y / 4)) % 2) ? '#d94a4a' : '#f4ece0');
      g.fillStyle = 'rgba(0,0,0,0.18)'; g.beginPath(); g.ellipse(W / 2 + 1, H / 2 + 3, 20, 13, 0, 0, 7); g.fill();
      g.fillStyle = '#ffffff'; g.beginPath(); g.ellipse(W / 2, H / 2 + 2, 20, 13, 0, 0, 7); g.fill(); g.fillStyle = '#e6e9ef'; g.beginPath(); g.ellipse(W / 2, H / 2 + 2, 14, 9, 0, 0, 7); g.fill();
    } else if (cat === 'wild') {
      grad('#7ec8ff', '#d8f2ff', 0, 22);
      for (let x = 0; x < W; x++) { const hh = 12 + Math.round(Math.sin(x * 0.12 + hue) * 4 + Math.sin(x * 0.31) * 2); px(x, H - hh - 4, '#4f8f5a', 1, hh + 4); }
      for (let x = 0; x < W; x++) { const hh = 6 + Math.round(Math.sin(x * 0.2 + hue * 2) * 3); px(x, H - hh, '#2b6b3f', 1, hh); }
      for (let i = 0; i < 5; i++) { const tx = Math.floor(r() * W), th = 6 + Math.floor(r() * 6); px(tx, H - 8 - th, '#1d4a2a', 3, th); px(tx - 2, H - 10 - th, '#2f7a44', 7, 4); }
      px(W - 12, 4, '#fff3a0', 5, 5);
    } else if (cat === 'space') {
      grad('#05031a', '#1a0f3a');
      for (let i = 0; i < 60; i++) px(r() * W, r() * H, r() < 0.2 ? '#ffe08a' : '#ffffff');
      const pc = 'hsl(' + hue + ',60%,55%)'; g.fillStyle = pc; g.beginPath(); g.arc(W - 8, H + 6, 22, 0, 7); g.fill();
      g.strokeStyle = 'rgba(255,255,255,0.5)'; g.beginPath(); g.ellipse(W - 8, H + 6, 32, 6, -0.3, 0, 7); g.stroke();
    } else if (cat === 'stage') {
      grad('#1a0508', '#3a0a14');
      g.fillStyle = 'rgba(255,240,190,0.18)'; for (const sx of [14, W / 2, W - 14]) { g.beginPath(); g.moveTo(sx, 0); g.lineTo(sx - 12, H); g.lineTo(sx + 12, H); g.fill(); }
      for (let x = 0; x < 9; x++) { px(x, 0, x % 3 ? '#8a1020' : '#5a0812', 1, H); px(W - 1 - x, 0, x % 3 ? '#8a1020' : '#5a0812', 1, H); }
      px(0, 0, '#a8162a', W, 3); px(0, H - 5, '#3a2210', W, 5);
    } else if (cat === 'arcade') {
      grad('#12002a', '#4a0a5a', 0, 22);
      g.fillStyle = '#ff9a3a'; g.beginPath(); g.arc(W / 2, 22, 10, Math.PI, 0); g.fill(); for (let y = 14; y < 22; y += 3) px(W / 2 - 10, y, '#4a0a5a', 20, 1);
      px(0, 22, '#0a0018', W, H - 22); for (let y = 22, s = 1; y < H; y += s, s++) px(0, y, '#ff3aa8', W, 1); for (let x = -40; x < W + 40; x += 8) { g.strokeStyle = '#ff3aa8'; g.beginPath(); g.moveTo(W / 2 + (x - W / 2) * 0.3, 22); g.lineTo(x, H); g.stroke(); }
    } else if (cat === 'hall') {
      grad('#3a2a1a', '#1a120a');
      for (const cx of [6, 18, W - 22, W - 10]) { px(cx, 4, '#d8c9a8', 5, H - 8); px(cx - 1, 3, '#efe3c6', 7, 2); px(cx - 1, H - 5, '#efe3c6', 7, 2); px(cx + 1, 6, '#bfae8a', 1, H - 12); }
      px(0, H - 3, '#7a1a1a', W, 3);
    } else {
      grad('hsl(' + hue + ',35%,32%)', 'hsl(' + hue + ',35%,18%)');
      for (let y = 0; y < H; y += 6) px(0, y, 'rgba(255,255,255,0.05)', W, 1);
      px(W - 18, 6, '#9fd3ff', 12, 10); px(W - 12, 6, '#5a3d22', 1, 10); px(W - 18, 11, '#5a3d22', 12, 1); px(W - 19, 5, '#5a3d22', 14, 1); px(W - 19, 16, '#5a3d22', 14, 1);
      px(0, H - 6, 'hsl(' + hue + ',25%,12%)', W, 6);
    }
    return cv.toDataURL();
  }
  function mix(a, b, f) { const pa = parse(a), pb = parse(b); return 'rgb(' + pa.map((v, i) => Math.round(v + (pb[i] - v) * f)).join(',') + ')'; }
  function parse(c) { if (c[0] === '#') { const n = parseInt(c.slice(1), 16); return [n >> 16, (n >> 8) & 255, n & 255]; } const cv = parse.cv || (parse.cv = document.createElement('canvas').getContext('2d')); cv.fillStyle = c; const s = cv.fillStyle; if (s[0] === '#') return parse(s); return s.match(/\d+/g).slice(0, 3).map(Number); }

  /* ---------- a crest made from the answer's name ---------- */
  const TINCT = ['#c0392b', '#1f5fbf', '#2b8a3e', '#6a2c91', '#111111', '#e0b13a', '#e8e8e8', '#d9682b', '#2aa1a1'];
  function crest(name) {
    const r = rng('crest:' + name), S = 22, cv = document.createElement('canvas'); cv.width = S; cv.height = S + 2; const g = cv.getContext('2d');
    const a = TINCT[Math.floor(r() * TINCT.length)]; let b = TINCT[Math.floor(r() * TINCT.length)]; if (b === a) b = '#e0b13a';
    const shape = Math.floor(r() * 3), div = Math.floor(r() * 6);
    // the shield's outline as a mask
    const inside = (x, y) => { const cx = x - S / 2 + 0.5; if (shape === 0) return y >= 1 && (y < 13 ? Math.abs(cx) < 9 : Math.abs(cx) < 9 - (y - 13) * 0.95); if (shape === 1) return Math.hypot(cx, y - 11) < 10; return y >= 1 && Math.abs(cx) < 9 - Math.max(0, y - 6) * 0.55; };
    const part = (x, y) => [x < S / 2, y < 11, x - y > 0, (x < S / 2) !== (y < 11), Math.abs(x - S / 2) < 3, y > 8 && y < 14][div];
    for (let y = 0; y < S + 1; y++) for (let x = 0; x < S; x++) { if (!inside(x, y)) continue; const edge = !inside(x - 1, y) || !inside(x + 1, y) || !inside(x, y - 1) || !inside(x, y + 1); g.fillStyle = edge ? '#050d08' : (part(x, y) ? a : b); g.fillRect(x, y, 1, 1); }
    // the answer's initial in the middle, on a small plate
    g.fillStyle = 'rgba(255,255,255,0.85)'; g.fillRect(S / 2 - 4, 6, 8, 9); g.fillStyle = '#050d08'; g.font = 'bold 9px monospace'; g.textAlign = 'center'; g.textBaseline = 'middle';
    g.fillText((String(name).match(/[A-Za-z0-9]/) || ['?'])[0].toUpperCase(), S / 2, 11);
    return cv.toDataURL();
  }

  /* ---------- enchantments ---------- */
  // rolled per card: 1 in 20 is enchanted; a few are much rarer than others. On your showcase card they also
  // change how you look in the game: your answers, your name in party rooms, and your companion.
  // fx: which particle behaviour it uses; cols: its particle colours; tag: the suffix mark printed after the card's name
  const ENCH = {
    ember:    { name: 'Ember',    tag: 'BLZ',   grade: 'Minor',  odds: 14, fx: 'rise',   cols: ['#ffb347', '#ff5a1f'], color: '#ff7a2a', glow: '#ff4d00', game: 'your answers leave a trail of sparks as they fall' },
    frost:    { name: 'Frost',    tag: 'ICE',   grade: 'Minor',  odds: 14, fx: 'fall',   cols: ['#ffffff', '#c8f4ff'], color: '#9fe8ff', glow: '#5fd0ff', game: 'snow drifts around your name and companion' },
    bloom:    { name: 'Bloom',    tag: 'PETAL', grade: 'Minor',  odds: 13, fx: 'drift',  cols: ['#ff9ccf', '#ffd1e8'], color: '#ff9ccf', glow: '#ff5fa8', game: 'petals burst out when your answer lands' },
    tide:     { name: 'Tide',     tag: 'WAVE',  grade: 'Minor',  odds: 12, fx: 'bubble', cols: ['#8fe3ff', '#ffffff'], color: '#4fc3ff', glow: '#0a84ff', game: 'bubbles rise behind your dive' },
    static:   { name: 'Static',   tag: 'ZAP',   grade: 'Minor',  odds: 11, fx: 'zap',    cols: ['#fff36a', '#ffffff'], color: '#ffe43a', glow: '#ffb800', game: 'your answer box crackles with electricity' },
    moss:     { name: 'Moss',     tag: 'WILD',  grade: 'Minor',  odds: 11, fx: 'drift',  cols: ['#7fd35a', '#c8ff5a'], color: '#8fe35a', glow: '#3fae2a', game: 'leaves tumble across your name in party rooms' },
    starfall: { name: 'Starfall', tag: 'NOVA',  grade: 'Major',  odds: 6,  fx: 'streak', cols: ['#fff3c4', '#ffffff'], color: '#ffe08a', glow: '#ffd24a', game: 'shooting stars cross the sky behind your dive' },
    spectral: { name: 'Spectral', tag: 'GHOST', grade: 'Major',  odds: 5,  fx: 'ghost',  cols: ['#b6fff0'], color: '#b6fff0', glow: '#5fffd8', game: 'your companion turns ghostly and leaves afterimages' },
    echo:     { name: 'Echo',     tag: '×2',    grade: 'Major',  odds: 5,  fx: 'ring',   cols: ['#c7a6ff'], color: '#c7a6ff', glow: '#9a6bff', game: 'every answer you lock in echoes twice' },
    eclipse:  { name: 'Eclipse',  tag: 'ECL',   grade: 'Major',  odds: 4,  fx: 'corona', cols: ['#ffcf6a', '#ff7a2a'], color: '#ffb84a', glow: '#ff6a00', game: 'the sun goes dark behind you when you find a rare answer' },
    gilded:   { name: 'Gilded',   tag: 'AU',    grade: 'Major',  odds: 4,  fx: 'glint',  cols: ['#ffe08a', '#fff8d8'], color: '#ffd24a', glow: '#e2a93b', game: 'your points tick up in gold' },
    chrome:   { name: 'Chrome',   tag: 'CHR',   grade: 'Major',  odds: 4,  fx: 'glint',  cols: ['#ffffff', '#c8d2e0'], color: '#e6ecf5', glow: '#9aa8bf', game: 'your name gleams like polished metal' },
    void:     { name: 'Void',     tag: 'NULL',  grade: 'Mythic', odds: 1.6, fx: 'pull',  cols: ['#6a00ff', '#1a0030'], color: '#d9a6ff', glow: '#6a00ff', game: 'the screen dims and a rift opens when you find a rare answer' },
    aurora:   { name: 'Aurora',   tag: 'LUMEN', grade: 'Mythic', odds: 1.2, fx: 'aurora', cols: ['#00ffa0', '#8c5aff'], color: '#8affc8', glow: '#00ffa0', game: 'northern lights ripple across the top of the screen while you play' },
    prism:    { name: 'Prismatic', tag: '∞',    grade: 'Mythic', odds: 1,  fx: 'rainbow', cols: ['#ff7eb3', '#ffd86e', '#8ef5a8', '#73d8ff', '#c79bff'], color: '#ffffff', glow: '#ff7eb3', game: 'everything you type shimmers in rainbow' },
    apex:     { name: 'Apex',     tag: 'APEX',  grade: 'Mythic', odds: 0.8, fx: 'pillar', cols: ['#ffffff', '#fff3c4'], color: '#fff3c4', glow: '#ffffff', game: 'a pillar of light marks you at the top of the leaderboard' },
    omega:    { name: 'Omega',    tag: 'Ω',     grade: 'Ultra',  odds: 0.25, fx: 'orbit', cols: ['#ffd24a', '#ff4d4d', '#ffffff'], color: '#ffd24a', glow: '#ff3a00', game: 'golden runes orbit your companion, and your Obscuras shake the screen' },
  };
  function rollEnchant(r = Math.random) {
    if (r() >= 1 / 20) return null;
    const tot = Object.values(ENCH).reduce((t, e) => t + e.odds, 0); let x = r() * tot;
    for (const k in ENCH) { if ((x -= ENCH[k].odds) < 0) return k; } return 'ember';
  }
  // particles drawn over an enchanted card (and reused for the in-game preview)
  function particles(canvas, kind, density = 1) {
    const g = canvas.getContext('2d'), E = ENCH[kind]; if (!E) return () => {}; const fx = E.fx, C = E.cols; let alive = true, t = 0; const ps = [];
    const col = () => C[Math.floor(Math.random() * C.length)];
    const spawn = () => {
      const w = canvas.width, hh = canvas.height, R = Math.random;
      if (fx === 'rise') ps.push({ x: R() * w, y: hh + 4, vx: (R() - 0.5) * 0.4, vy: -0.6 - R() * 0.9, l: 1, c: col(), s: 2 + R() * 2 });
      else if (fx === 'fall') ps.push({ x: R() * w, y: -4, vx: (R() - 0.5) * 0.3, vy: 0.4 + R() * 0.5, l: 1, c: col(), s: 2 + R() * 2, wob: R() * 6 });
      else if (fx === 'drift') ps.push({ x: R() * w, y: -4, vx: 0.3 + R() * 0.4, vy: 0.5 + R() * 0.4, l: 1, c: col(), s: 3, wob: R() * 6, spin: 1 });
      else if (fx === 'bubble') ps.push({ x: R() * w, y: hh + 4, vx: 0, vy: -0.5 - R() * 0.6, l: 1, c: col(), s: 3 + R() * 4, wob: R() * 6, bub: 1 });
      else if (fx === 'zap') ps.push({ x: R() * w, y: R() * hh, l: 0.3, c: col(), zap: 1 });
      else if (fx === 'streak') ps.push({ x: R() * w * 1.2, y: -4, vx: -1.6, vy: 1.6, l: 1, c: col(), s: 2, tail: 1 });
      else if (fx === 'ghost') ps.push({ x: R() * w, y: R() * hh, vx: 0, vy: -0.25, l: 1, c: col(), s: 3 + R() * 4, ghost: 1 });
      else if (fx === 'ring') ps.push({ r0: 4, l: 1, c: col(), ring: 1 });
      else if (fx === 'corona') ps.push({ a: R() * 6.28, r0: 0.28 + R() * 0.05, l: 1, c: col(), cor: 1 });
      else if (fx === 'glint') ps.push({ x: R() * w, y: R() * hh, l: 1, c: col(), s: 4 + R() * 6, star: 1 });
      else if (fx === 'pull') ps.push({ x: w / 2 + (R() - 0.5) * w, y: hh / 2 + (R() - 0.5) * hh, l: 1, c: col(), s: 6 + R() * 8, pull: 1 });
      else if (fx === 'aurora') ps.push({ band: 1, l: 1 });
      else if (fx === 'rainbow') ps.push({ x: R() * w, y: R() * hh, l: 1, c: col(), s: 4 + R() * 5, star: 1 });
      else if (fx === 'pillar') ps.push({ x: R() * w, l: 1, c: col(), pil: 1, wd: 4 + R() * 10 });
      else if (fx === 'orbit') ps.push({ a: R() * 6.28, l: 1, c: col(), orb: 1, rr: 0.3 + R() * 0.12, ch: 'ΩΣΔΨΦΞ'[Math.floor(R() * 6)] });
    };
    const rate = { rise: 0.5, fall: 0.35, drift: 0.25, bubble: 0.3, zap: 0.08, streak: 0.06, ghost: 0.12, ring: 0.03, corona: 0.5, glint: 0.12, pull: 0.4, aurora: 0.04, rainbow: 0.2, pillar: 0.05, orbit: 0.05 }[fx] * density;
    (function step() {
      if (!alive || !canvas.isConnected) return; t++; const w = canvas.width, hh = canvas.height; g.clearRect(0, 0, w, hh);
      if (Math.random() < rate) spawn();
      if (fx === 'aurora') { for (let b = 0; b < 3; b++) { g.beginPath(); for (let x = 0; x <= w; x += 4) { const y = hh * (0.18 + b * 0.1) + Math.sin(x * 0.03 + t * 0.03 + b) * hh * 0.06; x ? g.lineTo(x, y) : g.moveTo(x, y); } g.strokeStyle = ['rgba(0,255,160,0.35)', 'rgba(140,90,255,0.3)', 'rgba(0,200,255,0.25)'][b]; g.lineWidth = 8 + b * 3; g.stroke(); } }
      if (fx === 'corona') { g.fillStyle = 'rgba(0,0,0,0.55)'; g.beginPath(); g.arc(w / 2, hh * 0.3, w * 0.22, 0, 7); g.fill(); g.strokeStyle = 'rgba(255,200,100,0.6)'; g.lineWidth = 2; g.stroke(); }
      for (let i = ps.length - 1; i >= 0; i--) { const p = ps[i];
        if (p.ring) { p.r0 += 1.2; p.l -= 0.012; g.strokeStyle = p.c; g.globalAlpha = Math.max(0, p.l); g.lineWidth = 2; g.strokeRect(w / 2 - p.r0 * 0.7, hh / 2 - p.r0, p.r0 * 1.4, p.r0 * 2); g.globalAlpha = 1; }
        else if (p.pull) { p.x += (w / 2 - p.x) * 0.02; p.y += (hh / 2 - p.y) * 0.02; p.l -= 0.01; g.globalAlpha = Math.max(0, p.l) * 0.6; g.fillStyle = p.c; g.fillRect(p.x, p.y, p.s, p.s); g.globalAlpha = 1; }
        else if (p.band) { p.l -= 0.01; }
        else if (p.zap) { p.l -= 0.04; g.strokeStyle = p.c; g.globalAlpha = Math.max(0, p.l * 3); g.lineWidth = 2; g.beginPath(); let x = p.x, y = p.y; g.moveTo(x, y); for (let k = 0; k < 5; k++) { x += (Math.random() - 0.5) * 30; y += 8 + Math.random() * 8; g.lineTo(x, y); } g.stroke(); g.globalAlpha = 1; }
        else if (p.cor) { p.a += 0.01; p.l -= 0.01; const r = w * (p.r0 + (1 - p.l) * 0.15); g.globalAlpha = Math.max(0, p.l); g.fillStyle = p.c; g.fillRect(w / 2 + Math.cos(p.a) * r, hh * 0.3 + Math.sin(p.a) * r, 3, 3); g.globalAlpha = 1; }
        else if (p.star) { p.l -= 0.02; const s = p.s * Math.sin(p.l * Math.PI); g.globalAlpha = Math.max(0, p.l); g.fillStyle = p.c; g.fillRect(p.x - s / 2, p.y - 1, s, 2); g.fillRect(p.x - 1, p.y - s / 2, 2, s); g.globalAlpha = 1; }
        else if (p.pil) { p.l -= 0.012; const a = Math.sin(p.l * Math.PI) * 0.35; const gr = g.createLinearGradient(0, hh, 0, 0); gr.addColorStop(0, 'rgba(255,255,255,' + a + ')'); gr.addColorStop(1, 'rgba(255,255,255,0)'); g.fillStyle = gr; g.fillRect(p.x - p.wd / 2, 0, p.wd, hh); }
        else if (p.orb) { p.a += 0.03; p.l -= 0.005; const r = w * p.rr; g.globalAlpha = Math.max(0, Math.min(1, p.l * 2)); g.fillStyle = p.c; g.font = 'bold ' + Math.round(w * 0.06) + 'px monospace'; g.fillText(p.ch, w / 2 + Math.cos(p.a) * r, hh * 0.45 + Math.sin(p.a) * r * 0.5); g.globalAlpha = 1; }
        else { p.x += (p.vx || 0) + (p.wob ? Math.sin((t + p.wob * 20) / 15) * 0.4 : 0); p.y += p.vy; p.l -= p.ghost ? 0.008 : 0.004;
          g.globalAlpha = Math.max(0, Math.min(1, p.l * (p.ghost ? 0.5 : 1)));
          if (p.bub) { g.strokeStyle = p.c; g.lineWidth = 1; g.beginPath(); g.arc(p.x, p.y, p.s, 0, 7); g.stroke(); }
          else { g.fillStyle = p.c; if (p.spin) { g.save(); g.translate(p.x, p.y); g.rotate(t / 20 + p.wob); g.fillRect(-p.s, -p.s / 2, p.s * 2, p.s); g.restore(); } else g.fillRect(p.x | 0, p.y | 0, p.s, p.s); }
          if (p.tail) { for (let k = 1; k < 8; k++) { g.globalAlpha = Math.max(0, 0.5 - k * 0.06); g.fillRect((p.x - p.vx * k * 2) | 0, (p.y - p.vy * k * 2) | 0, 2, 2); } }
          g.globalAlpha = 1; }
        if (p.l <= 0 || (p.y != null && (p.y < -10 || p.y > hh + 10)) || (p.x != null && (p.x < -20 || p.x > w + 20))) ps.splice(i, 1); }
      requestAnimationFrame(step);
    })();
    return () => { alive = false; };
  }

  window.CardArt = { topicOf, pickEmoji, pixelEmoji, scene, catOf, crest, ENCH, rollEnchant, particles, hash, rng };
})();
