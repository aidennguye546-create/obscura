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
    // animals and foods are named by their last word ("Elephant seal" is a seal, "Brown rice" is rice)
    if (/animal|bird|fish|insect|mammal|reptile|creature|food|fruit|vegetable|dish|snack|dessert|cheese|bread|nut|berr/.test(String(prompt).toLowerCase())) { const w = a.split(' ').pop(); if (w.length > 2 && w !== a) { const we = (window.EMOJI || {})[w] || (window.EMOJI || {})[sing(w)]; if (we) return we; } }
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
  // Fine pixel sprites from emoji: drawn big, shrunk to sprite size, then cleaned up the way a pixel artist would:
  // a small shared palette (k-means), light from the top left, shade towards the bottom right, and a coloured outline.
  function pixelEmoji(e, size = 48) {
    const key = e + size; if (pixCache[key]) return pixCache[key];
    const big = document.createElement('canvas'); big.width = big.height = 256; const bg = big.getContext('2d');
    bg.textAlign = 'center'; bg.textBaseline = 'middle'; bg.font = '200px "Apple Color Emoji","Segoe UI Emoji","Noto Color Emoji",sans-serif'; bg.fillText(e, 128, 140);
    const n = size - 2, sm = document.createElement('canvas'); sm.width = sm.height = size; const sg = sm.getContext('2d');
    sg.imageSmoothingEnabled = true; sg.imageSmoothingQuality = 'high'; sg.drawImage(big, 1, 1, n, n);
    const d = sg.getImageData(0, 0, size, size).data, N = size * size, on = new Uint8Array(N), pts = [];
    for (let i = 0; i < N; i++) if (d[i * 4 + 3] >= 128) { on[i] = 1; pts.push(i); }
    if (!pts.length) return (pixCache[key] = sm.toDataURL());
    // a small palette shared by the whole sprite
    const K = Math.min(size >= 40 ? 14 : 9, pts.length), lab = new Int16Array(N);
    let C = []; for (let k = 0; k < K; k++) { const i = pts[Math.floor((k + 0.5) * pts.length / K)] * 4; C.push([d[i], d[i + 1], d[i + 2]]); }
    for (let it = 0; it < 6; it++) {
      const S = C.map(() => [0, 0, 0, 0]);
      for (const p of pts) { const i = p * 4; let b = 0, bd = 1e12; for (let k = 0; k < K; k++) { const c = C[k], dd = (d[i] - c[0]) ** 2 * 0.3 + (d[i + 1] - c[1]) ** 2 * 0.59 + (d[i + 2] - c[2]) ** 2 * 0.11; if (dd < bd) { bd = dd; b = k; } } lab[p] = b; const s = S[b]; s[0] += d[i]; s[1] += d[i + 1]; s[2] += d[i + 2]; s[3]++; }
      C = C.map((c, k) => S[k][3] ? [S[k][0] / S[k][3], S[k][1] / S[k][3], S[k][2] / S[k][3]] : c);
    }
    const out = new Uint8ClampedArray(N * 4), at = (x, y) => x >= 0 && y >= 0 && x < size && y < size && on[y * size + x];
    const tone = (c, f) => f > 0 ? c.map(v => v + (255 - v) * f) : c.map(v => v * (1 + f));
    for (let y = 0; y < size; y++) for (let x = 0; x < size; x++) {
      const i = y * size + x, o = i * 4;
      if (on[i]) {
        let c = C[lab[i]];
        if (!at(x, y - 1) || !at(x - 1, y)) c = tone(c, 0.24);           // rim light, top left
        else if (!at(x, y + 1) || !at(x + 1, y)) c = tone(c, -0.32);     // shade, bottom right
        out[o] = c[0]; out[o + 1] = c[1]; out[o + 2] = c[2]; out[o + 3] = 255;
      } else if (at(x - 1, y) || at(x + 1, y) || at(x, y - 1) || at(x, y + 1)) {
        const j = at(x, y + 1) ? i + size : at(x - 1, y) ? i - 1 : at(x + 1, y) ? i + 1 : i - size, c = C[lab[j]];
        out[o] = c[0] * 0.2; out[o + 1] = c[1] * 0.2; out[o + 2] = c[2] * 0.2 + 8; out[o + 3] = 255; // outline: a very dark shade of what it borders
      }
    }
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
  // each category is a card type, like the energy types on trading cards: a name, a colour and a symbol
  const TYPES = {
    sport: { name: 'Sport', col: '#ff8a3a', sym: '✪' }, geo: { name: 'Places', col: '#e0b060', sym: '⌖' }, wild: { name: 'Nature', col: '#5fcf4a', sym: '❦' },
    food: { name: 'Food', col: '#ff5a4a', sym: '♨' }, space: { name: 'Science', col: '#a07aff', sym: '✦' }, stage: { name: 'Showbiz', col: '#ff6ab0', sym: '♪' },
    arcade: { name: 'Games', col: '#ffd23a', sym: '▶' }, hall: { name: 'Legends', col: '#b8c4d8', sym: '♛' }, room: { name: 'Everyday', col: '#e8dcc0', sym: '⌂' },
  };
  const catOf = prompt => { const p = String(prompt).toLowerCase(); for (const [k, re] of CATS) if (re.test(p)) return k; return 'room'; };
  // Each category gets a small pixel painting, 128 by 80, built pixel by pixel: dithered skies and light,
  // lit edges on every ridge and shape, and the subject's spot left clear in the middle.
  const W = 128, H = 80, B4 = [0, 8, 2, 10, 12, 4, 14, 6, 3, 11, 1, 9, 15, 7, 13, 5];
  const hex = c => { const n = parseInt(c.slice(1), 16); return [n >> 16, (n >> 8) & 255, n & 255]; };
  const tone = (c, f) => f > 0 ? c.map(v => Math.round(v + (255 - v) * f)) : c.map(v => Math.round(v * (1 + f)));
  const blend = (a, b, f) => a.map((v, i) => Math.round(v + (b[i] - v) * f));
  const hsl = (h, s, l) => { h = ((h % 360) + 360) % 360; s /= 100; l /= 100; const k = n => (n + h / 30) % 12, a = s * Math.min(l, 1 - l), f = n => l - a * Math.max(-1, Math.min(k(n) - 3, Math.min(9 - k(n), 1))); return [Math.round(f(0) * 255), Math.round(f(8) * 255), Math.round(f(4) * 255)]; };
  function painter(seed) {
    const r = rng('scene:' + seed), img = new ImageData(W, H), d = img.data;
    const P = {
      r, img,
      set(x, y, c) { x = Math.round(x); y = Math.round(y); if (x < 0 || y < 0 || x >= W || y >= H) return; const o = (y * W + x) * 4; d[o] = c[0]; d[o + 1] = c[1]; d[o + 2] = c[2]; d[o + 3] = 255; },
      get(x, y) { const o = (y * W + x) * 4; return [d[o], d[o + 1], d[o + 2]]; },
      dith: (x, y, f) => f * 16 > B4[(y & 3) * 4 + (x & 3)] + 0.5,
      rect(x, y, w, h, c) { for (let j = Math.round(y); j < y + h; j++) for (let i = Math.round(x); i < x + w; i++) P.set(i, j, c); },
      vgrad(cols, y0 = 0, y1 = H, x0 = 0, x1 = W) { const n = cols.length - 1; for (let y = y0; y < y1; y++) { const t = (y - y0) / Math.max(1, y1 - y0 - 1) * n, k = Math.min(n - 1, Math.floor(t)), f = t - k; for (let x = x0; x < x1; x++) P.set(x, y, P.dith(x, y, f) ? cols[k + 1] : cols[k]); } },
      disc(cx, cy, rx, c, ry) { ry = ry || rx; for (let y = Math.floor(cy - ry); y <= cy + ry; y++) for (let x = Math.floor(cx - rx); x <= cx + rx; x++) if (((x - cx) / rx) ** 2 + ((y - cy) / ry) ** 2 <= 1) P.set(x, y, c); },
      // light poured over what is already there, dithered so it fades in steps
      glow(cx, cy, rad, c, k = 0.7, ry) { ry = ry || rad; for (let y = Math.floor(cy - ry); y <= cy + ry; y++) for (let x = Math.floor(cx - rad); x <= cx + rad; x++) { if (x < 0 || y < 0 || x >= W || y >= H) continue; const t = 1 - Math.hypot((x - cx) / rad, (y - cy) / ry); if (t > 0 && P.dith(x, y, t * k)) P.set(x, y, blend(P.get(x, y), c, 0.5)); } },
      line(x0, y0, x1, y1, c) { const n = Math.max(1, Math.round(Math.max(Math.abs(x1 - x0), Math.abs(y1 - y0)))); for (let i = 0; i <= n; i++) P.set(x0 + (x1 - x0) * i / n, y0 + (y1 - y0) * i / n, c); },
      // a skyline of hills: filled below, a lit rim along the top
      ridge(base, amp, fr, ph, c, rim) { for (let x = 0; x < W; x++) { const y = Math.round(base + Math.sin(x * fr + ph) * amp + Math.sin(x * fr * 2.7 + ph * 1.7) * amp * 0.35); for (let j = y; j < H; j++) P.set(x, j, c); if (rim) P.set(x, y, rim); } },
      noise(x, y, s) { return Math.sin(x * 0.11 * s + s * 3.1) + Math.sin(y * 0.17 * s - s) + Math.sin((x + y) * 0.07 * s + s * 7.3) + Math.sin((x - y) * 0.05 * s); },
    };
    return P;
  }
  const C = c => hex(c);
  const PAINT = {
    wild(P, r, hue) {
      const dusk = r() < 0.3;
      P.vgrad(dusk ? [C('#1d1446'), C('#6a2c70'), C('#e0607e'), C('#ffb46a')] : [C('#2f6fd0'), C('#5d9ae6'), C('#a8d2f6'), C('#f4f1d0')], 0, 50);
      const sx = 14 + r() * 100, sy = 12 + r() * 10, sun = dusk ? C('#ffd27a') : C('#fff6c8');
      P.glow(sx, sy, 26, sun, 0.8); P.disc(sx, sy, 5, sun); P.disc(sx - 1, sy - 1, 3, C('#ffffff'));
      for (let i = 0; i < 3; i++) { const cx = r() * W, cy = 8 + r() * 16, n = 3 + Math.floor(r() * 3);
        for (let k = 0; k < n; k++) P.disc(cx + k * 6 - n * 3, cy + 1, 5, dusk ? C('#b86a8a') : C('#d6e6f5'), 3);
        for (let k = 0; k < n; k++) P.disc(cx + k * 6 - n * 3, cy - (k % 2), 5, dusk ? C('#ffc6a8') : C('#ffffff'), 3); }
      P.ridge(36, 6, 0.05, hue, dusk ? C('#4a3a7a') : C('#7c9cc8'), dusk ? C('#8a6aa8') : C('#c8dcf0'));
      for (let y = 36; y < 50; y++) for (let x = 0; x < W; x++) if (P.dith(x, y, (50 - y) / 30)) P.set(x, y, blend(P.get(x, y), dusk ? C('#e0607e') : C('#e8f2fa'), 0.35));
      P.ridge(46, 4, 0.08, hue * 2, C('#4f8f42'), C('#8fd06a'));
      const pine = (x, base, h, dark, lite) => { for (let j = 0; j < h; j++) { const w = Math.floor(1 + (j % 5) * 0.6 + j * 0.25); for (let i = -w; i <= w; i++) P.set(x + i, base - h + j, i < 0 ? lite : dark); } P.rect(x - 1, base, 2, 3, C('#5a3a22')); };
      for (let i = 0; i < 9; i++) { const x = Math.floor(r() * W); if (Math.abs(x - 64) < 22) continue; pine(x, 50 + Math.floor(r() * 4), 10 + Math.floor(r() * 10), C('#1f5a2e'), C('#3f8a44')); }
      P.ridge(58, 2, 0.13, hue, C('#3f7f36'), C('#7cc456'));
      for (let y = 59; y < H; y++) for (let x = 0; x < W; x++) { const n = Math.sin(x * 1.7 + y * 3.1 + hue) ; if (n > 0.92) P.set(x, y, C('#2f6a2a')); else if (n < -0.95) P.set(x, y, C('#9adf6a')); }
      for (let i = 0; i < 14; i++) { const x = Math.floor(r() * W), y = 62 + Math.floor(r() * 16); if (Math.abs(x - 64) < 14 && y < 70) continue; const fc = [C('#ff6a8a'), C('#ffe36a'), C('#ffffff'), C('#b07aff')][i % 4]; P.set(x, y - 1, fc); P.set(x - 1, y, fc); P.set(x + 1, y, fc); P.set(x, y + 1, fc); P.set(x, y, C('#ffd23a')); }
    },
    space(P, r, hue) {
      P.vgrad([C('#04021a'), C('#0d0830'), C('#170b40')]);
      const neb = hsl(hue, 70, 45), neb2 = hsl(hue + 60, 70, 60), s = 0.6 + r() * 0.8;
      for (let y = 0; y < H; y++) for (let x = 0; x < W; x++) { const n = P.noise(x, y, s); if (n > 1.1 && P.dith(x, y, Math.min(1, (n - 1.1) / 1.6))) P.set(x, y, n > 2.2 && P.dith(x + 1, y, 0.5) ? neb2 : neb); }
      for (let i = 0; i < 110; i++) { const v = 120 + Math.floor(r() * 135); P.set(r() * W, r() * H, r() < 0.15 ? [255, 224, 138] : [v, v, Math.min(255, v + 20)]); }
      for (let i = 0; i < 6; i++) { const x = Math.round(r() * W), y = Math.round(r() * H), c = C('#ffffff'), dim = C('#8aa0ff'); P.set(x, y, c); for (const [dx, dy] of [[1, 0], [-1, 0], [0, 1], [0, -1]]) P.set(x + dx, y + dy, dim); if (r() < 0.5) for (const [dx, dy] of [[2, 0], [-2, 0], [0, 2], [0, -2]]) P.set(x + dx, y + dy, C('#3a4a9a')); }
      const left = r() < 0.5, px = left ? 18 + r() * 10 : 104 - r() * 10, py = 58 + r() * 14, pr = 20 + r() * 8, base = hsl(hue + 150, 55, 52), band = hsl(hue + 170, 50, 40);
      const ring = (front) => { for (let a = 0; a < 6.283; a += 0.01) { const x = px + Math.cos(a) * pr * 1.7, y = py + Math.sin(a) * pr * 0.32 - Math.cos(a) * pr * 0.25; if ((Math.sin(a) > 0) === front) P.set(x, y, Math.sin(a * 3) > 0 ? C('#e8d8b0') : C('#a89870')); } };
      ring(false);
      for (let y = Math.floor(py - pr); y <= py + pr; y++) for (let x = Math.floor(px - pr); x <= px + pr; x++) { const dx = (x - px) / pr, dy = (y - py) / pr; if (dx * dx + dy * dy > 1) continue;
        let c = Math.floor((y - py + pr) / 4) % 2 ? base : band; const lit = -dx * 0.6 - dy * 0.55 + 0.35;
        if (lit > 0.55 && P.dith(x, y, (lit - 0.55) * 2.5)) c = tone(c, 0.3); else if (lit < 0 && P.dith(x, y, Math.min(1, -lit * 1.8))) c = tone(c, -0.65); P.set(x, y, c); }
      ring(true);
      const mx = left ? 108 : 20, my = 14 + r() * 10; P.disc(mx, my, 5, C('#b8b8c8')); P.disc(mx - 1, my - 1, 4, C('#d8d8e8')); P.set(mx + 1, my, C('#9898a8')); P.set(mx - 2, my + 1, C('#a8a8b8')); P.set(mx, my - 2, C('#a8a8b8'));
    },
    sport(P, r, hue) {
      P.vgrad([C('#0e1a4a'), C('#28449a'), C('#5f8ad8')], 0, 22);
      P.rect(0, 19, W, 3, C('#2a2f3a')); P.rect(0, 19, W, 1, C('#7a8496'));
      for (let y = 22; y < 40; y++) for (let x = 0; x < W; x++) { const row = (y - 22) % 4 === 0; if (row) { P.set(x, y, C('#1a1f2a')); continue; }
        const team = [C('#e84a4a'), C('#ffd23a'), C('#ffffff'), C('#3a8aff'), C('#ff8a3a'), C('#6ad06a')][Math.floor(r() * 6)]; P.set(x, y, P.dith(x, y, 0.55) ? team : C('#2a3242')); }
      P.rect(0, 40, W, 2, C('#c8ccd4')); P.rect(0, 41, W, 1, C('#7a808c'));
      for (const lx of [12, 116]) { P.line(lx, 2, lx, 22, C('#9aa4b4')); P.line(lx + 1, 2, lx + 1, 22, C('#5a6474')); P.rect(lx - 4, 0, 10, 4, C('#3a4250')); for (let k = 0; k < 4; k++) P.rect(lx - 3 + k * 2, 1, 1, 2, C('#fffbe0')); P.glow(lx + 1, 3, 22, C('#fff6d0'), 0.9, 16); }
      for (let y = 42; y < H; y++) { const band = Math.floor(Math.pow(y - 42, 1.25) / 5) % 2; for (let x = 0; x < W; x++) P.set(x, y, band ? C('#3a9a46') : C('#2f8a3c')); }
      P.rect(0, 43, W, 1, C('#e8f2e8')); P.line(64, 43, 64, H, C('#e8f2e8'));
      for (let a = 0; a < 6.283; a += 0.02) P.set(64 + Math.cos(a) * 20, 62 + Math.sin(a) * 7, C('#e8f2e8'));
      for (let y = 42; y < H; y++) for (let x = 0; x < W; x++) if (P.dith(x, y, Math.max(0, 0.25 - Math.abs(x - 64) / 260))) P.set(x, y, tone(P.get(x, y), 0.18));
    },
    geo(P, r, hue) {
      P.vgrad([C('#f2e3bc'), C('#e4cf9c')]);
      const s = 0.7 + r() * 0.6, sea = [C('#3f7fb8'), C('#5a9ad0')], cut = 0.4 + r() * 0.6;
      const land = (x, y) => P.noise(x + hue, y - hue, s) > cut;
      for (let y = 0; y < H; y++) for (let x = 0; x < W; x++) {
        if (!land(x, y)) { P.set(x, y, P.dith(x, y, 0.35 + 0.25 * Math.sin(y * 0.6 + x * 0.1)) ? sea[1] : sea[0]); if ((x + y * 3) % 23 === 0) { P.set(x, y, C('#a8d0ee')); P.set(x + 1, y, C('#a8d0ee')); } continue; }
        const coast = !land(x - 1, y) || !land(x + 1, y) || !land(x, y - 1) || !land(x, y + 1);
        const n = P.noise(x * 2, y * 2, s * 1.7); P.set(x, y, coast ? C('#4a3a22') : n > 1.4 ? C('#8ab05a') : n < -1.2 ? C('#d8b878') : C('#b8c87a'));
        if (!coast && !land(x, y + 2)) P.set(x, y, C('#f0e6c0'));
      }
      for (let i = 0; i < 10; i++) { const x = Math.floor(r() * W), y = Math.floor(r() * H); if (!land(x, y) || !land(x - 3, y + 2) || !land(x + 3, y + 2)) continue; P.line(x - 3, y + 2, x, y - 1, C('#6a5232')); P.line(x, y - 1, x + 3, y + 2, C('#3a2a14')); P.set(x, y - 1, C('#ffffff')); }
      for (let x = 0; x < W; x += 16) for (let y = 0; y < H; y += 2) P.set(x, y, blend(P.get(x, y), C('#5a4020'), 0.35));
      for (let y = 0; y < H; y += 16) for (let x = 0; x < W; x += 2) P.set(x, y, blend(P.get(x, y), C('#5a4020'), 0.35));
      const cx = r() < 0.5 ? 12 : 116, cy = 12; P.disc(cx, cy, 8, C('#f6ecd0')); for (let a = 0; a < 6.283; a += 0.05) P.set(cx + Math.cos(a) * 8, cy + Math.sin(a) * 8, C('#5a4020'));
      P.line(cx, cy - 7, cx, cy + 7, C('#5a4020')); P.line(cx - 7, cy, cx + 7, cy, C('#5a4020')); P.line(cx, cy - 7, cx - 1, cy, C('#c0392b')); P.line(cx, cy - 7, cx + 1, cy, C('#c0392b'));
      let x0 = 8 + r() * 30, y0 = 50 + r() * 20, x1 = 90 + r() * 30, y1 = 10 + r() * 30; for (let i = 0; i <= 60; i++) { if (i % 4 > 1) continue; const t = i / 60, x = x0 + (x1 - x0) * t, y = y0 + (y1 - y0) * t - Math.sin(t * Math.PI) * 14; P.set(x, y, C('#c0392b')); }
      P.line(x1 - 2, y1 - 2, x1 + 2, y1 + 2, C('#c0392b')); P.line(x1 - 2, y1 + 2, x1 + 2, y1 - 2, C('#c0392b'));
    },
    food(P, r, hue) {
      const tile = hsl(hue, 35, 82), grout = hsl(hue, 20, 66);
      for (let y = 0; y < 36; y++) for (let x = 0; x < W; x++) P.set(x, y, (x % 9 === 0 || y % 9 === 0) ? grout : (x % 9 === 1 || y % 9 === 1) ? tone(tile, 0.35) : tile);
      P.glow(64, 6, 46, C('#fff4d0'), 0.6, 30);
      P.rect(0, 34, W, 3, C('#8a5a32')); P.rect(0, 34, W, 1, C('#c88a52'));
      const red = hsl(355, 70, 50);
      for (let y = 37; y < H; y++) { const cell = 3 + (y - 37) / 5; for (let x = 0; x < W; x++) { const u = Math.floor((x - 64) / cell + 100), v = Math.floor((y - 37) / (cell * 0.6)); const on = (u + v) % 2; P.set(x, y, on ? red : C('#f6efe4')); } }
      for (let y = 37; y < H; y++) for (let x = 0; x < W; x++) if (P.dith(x, y, (y - 37) / 120)) P.set(x, y, tone(P.get(x, y), -0.25));
      P.disc(66, 64, 34, C('#5a4a40'), 11);
      P.disc(64, 61, 34, C('#c8ccd4'), 11); P.disc(64, 60, 33, C('#ffffff'), 10); P.disc(64, 61, 24, C('#e6e9ef'), 7); P.disc(64, 61, 22, C('#f4f6f9'), 6);
      for (let a = 3.6; a < 5.2; a += 0.03) P.set(64 + Math.cos(a) * 30, 60 + Math.sin(a) * 8.5, C('#ffffff'));
      for (let k = 0; k < 3; k++) for (let y = 14; y < 40; y++) { const x = 46 + k * 18 + Math.sin(y * 0.35 + k * 2) * 3; if (P.dith(x | 0, y, 0.55 - (40 - y) / 60)) P.set(x, y, C('#ffffff')); }
    },
    stage(P, r, hue) {
      P.vgrad([C('#12030a'), C('#2a0812'), C('#1a0508')]);
      for (const sx of [30, 64, 98]) for (let y = 8; y < 64; y++) { const half = 3 + (y - 8) * 0.32; for (let x = Math.floor(sx - half); x <= sx + half; x++) { const edge = 1 - Math.abs(x - sx) / half; if (P.dith(x, y, edge * 0.55 + 0.1)) P.set(x, y, blend(P.get(x, y), C('#ffe8b0'), 0.4)); } }
      const curtain = (x0, x1) => { for (let x = x0; x < x1; x++) { const f = 0.5 + 0.5 * Math.sin(x * 0.75); for (let y = 0; y < H; y++) { const c = f > 0.8 ? C('#d8283c') : f > 0.45 ? C('#a8162a') : f > 0.15 ? C('#7a0e1e') : C('#4a0812'); P.set(x, y, P.dith(x, y, (y / H) * 0.4) ? tone(c, -0.3) : c); } } };
      curtain(0, 22); curtain(106, W);
      for (let x = 0; x < W; x++) { const yb = 7 + Math.round(2.5 * Math.abs(Math.sin(x * 0.19))); for (let y = 0; y < yb; y++) P.set(x, y, y > yb - 3 ? C('#7a0e1e') : C('#b8182c')); P.set(x, yb, C('#ffd24a')); P.set(x, yb + 1, C('#a8741a')); }
      for (const tx of [21, 106]) for (let y = 30; y < 40; y++) P.set(tx, y, C('#ffd24a'));
      for (let y = 62; y < H; y++) for (let x = 0; x < W; x++) { const plank = (x + (Math.floor((y - 62) / 4) % 2) * 9) % 18 === 0 || (y - 62) % 4 === 0; P.set(x, y, plank ? C('#3a2210') : C('#6a4220')); }
      for (const sx of [30, 64, 98]) P.glow(sx, 66, 20, C('#ffe8b0'), 0.7, 5);
      P.rect(0, 62, W, 1, C('#c88a52'));
    },
    arcade(P, r, hue) {
      P.vgrad([C('#0e0024'), C('#2e0a52'), C('#7a1a7a'), C('#ff5a8a')], 0, 48);
      for (let i = 0; i < 40; i++) P.set(r() * W, r() * 30, C('#ffffff'));
      const sunCol = y => y < 26 ? C('#ffe86a') : y < 34 ? C('#ffb03a') : y < 42 ? C('#ff7a4a') : C('#ff3a7a');
      for (let y = 14; y < 48; y++) { if (y > 28 && (y % 4 === 0 || (y > 38 && y % 3 === 0))) continue; const half = Math.sqrt(Math.max(0, 20 * 20 - (y - 34) ** 2)); for (let x = Math.floor(64 - half); x <= 64 + half; x++) P.set(x, y, P.dith(x, y, ((y - 14) % 8) / 8) ? sunCol(y + 4) : sunCol(y)); }
      P.ridge(44, 3, 0.11, hue, C('#1a0636'), C('#ff3aa8'));
      P.rect(0, 48, W, H - 48, C('#0a0018'));
      for (let k = 0; k < 12; k++) { const y = Math.round(48 + k * k * 0.42); if (y < H) for (let x = 0; x < W; x++) P.set(x, y, k % 2 ? C('#c02a90') : C('#ff3aa8')); }
      for (let x0 = -320; x0 <= 448; x0 += 20) P.line(64 + (x0 - 64) * 0.06, 48, x0, H, C('#ff3aa8'));
      P.rect(0, 48, W, 1, C('#ffe0f0')); P.glow(64, 48, 60, C('#ff6ab8'), 0.55, 8);
    },
    hall(P, r, hue) {
      P.vgrad([C('#e6ddca'), C('#cfc2a6'), C('#b8aa8a')], 0, 62);
      for (let i = 0; i < 6; i++) { let x = r() * W, y = r() * 60; for (let k = 0; k < 40; k++) { x += 1; y += Math.sin(k * 0.4 + i) * 0.8; if (P.dith(x | 0, y | 0, 0.6)) P.set(x, y, C('#a89a7a')); } }
      const col = (cx) => { for (let x = cx - 6; x <= cx + 6; x++) { const u = (x - cx + 6) / 12, b = Math.sin(u * Math.PI), c = b > 0.85 ? C('#fbf6ea') : b > 0.6 ? C('#e6dcc6') : b > 0.3 ? C('#c8b896') : C('#9a8a6a'); for (let y = 8; y < 58; y++) P.set(x, y, (x - cx) % 3 === 0 && y > 10 && y < 56 ? tone(c, -0.12) : c); }
        P.rect(cx - 8, 4, 17, 4, C('#efe6d0')); P.rect(cx - 8, 7, 17, 1, C('#9a8a6a')); P.rect(cx - 8, 58, 17, 4, C('#efe6d0')); P.rect(cx - 8, 61, 17, 1, C('#7a6a4a')); };
      for (const cx of [10, 30, 98, 118]) col(cx);
      P.rect(0, 0, W, 4, C('#8a7a5a')); P.rect(0, 3, W, 1, C('#5a4a32'));
      for (let y = 62; y < H; y++) { const cell = 4 + (y - 62) / 3; for (let x = 0; x < W; x++) { const u = Math.floor((x - 64) / cell + 100), v = Math.floor((y - 62) / (cell * 0.5)); P.set(x, y, (u + v) % 2 ? C('#2a2420') : C('#e8e0d0')); } }
      for (let y = 62; y < H; y++) { const half = 10 + (y - 62) * 0.9; for (let x = Math.floor(64 - half); x <= 64 + half; x++) P.set(x, y, Math.abs(x - 64) > half - 1.5 ? C('#e0b13a') : C('#8a1a22')); }
      for (const px of [44, 84]) { P.rect(px - 1, 54, 3, 12, C('#e0b13a')); P.set(px - 1, 54, C('#fff3c4')); P.disc(px, 53, 2, C('#ffd24a')); }
      for (let x = 44; x <= 84; x++) P.set(x, 56 + Math.sin((x - 44) / 40 * Math.PI) * 4, C('#b8182c'));
    },
    room(P, r, hue) {
      const wall = hsl(hue, 30, 36), pat = hsl(hue, 30, 44);
      for (let y = 0; y < 60; y++) for (let x = 0; x < W; x++) { const u = (x + (Math.floor(y / 8) % 2) * 4) % 8, v = y % 8; P.set(x, y, (Math.abs(u - 4) + Math.abs(v - 4) === 2) ? pat : wall); }
      const wx = r() < 0.5 ? 84 : 14, ww = 30;
      P.rect(wx - 2, 6, ww + 4, 30, C('#5a3a22')); P.vgrad([C('#5a9ae6'), C('#a8d4f8'), C('#e8f4ff')], 8, 34, wx, wx + ww);
      P.disc(wx + 8, 18, 4, C('#ffffff'), 2); P.disc(wx + 12, 17, 4, C('#ffffff'), 2);
      P.rect(wx + ww / 2 - 1, 8, 2, 26, C('#7a5232')); P.rect(wx, 20, ww, 2, C('#7a5232')); P.rect(wx - 2, 6, ww + 4, 1, C('#9a7252'));
      for (const side of [0, 1]) for (let x = 0; x < 6; x++) for (let y = 4; y < 44; y++) { const cx = side ? wx + ww + x : wx - 6 + x; P.set(cx, y, (x % 3 === 0) ? hsl(hue + 180, 45, 34) : hsl(hue + 180, 45, 46)); }
      const lx = wx < 64 ? 112 : 16; P.line(lx, 0, lx, 10, C('#2a2a2a')); for (let y = 10; y < 18; y++) { const half = 3 + (y - 10) * 0.6; for (let x = Math.floor(lx - half); x <= lx + half; x++) P.set(x, y, y === 17 ? C('#c8a040') : C('#ffe08a')); } P.glow(lx, 22, 24, C('#fff0b8'), 0.7, 18);
      P.rect(0, 58, W, 2, C('#2a1a10'));
      for (let y = 60; y < H; y++) for (let x = 0; x < W; x++) { const seam = (y - 60) % 5 === 0 || (x + (Math.floor((y - 60) / 5) % 3) * 13) % 31 === 0; P.set(x, y, seam ? C('#4a2a14') : (Math.sin(x * 0.9 + y * 7) > 0.9 ? C('#7a4a26') : C('#8a5a30'))); }
      P.disc(64, 70, 44, hsl(hue + 180, 40, 30), 8); P.disc(64, 70, 41, hsl(hue + 180, 45, 42), 7); for (let a = 0; a < 6.283; a += 0.05) P.set(64 + Math.cos(a) * 36, 70 + Math.sin(a) * 5.5, hsl(hue + 40, 60, 60));
    },
  };
  const sceneCache = {};
  function scene(cat, seed) {
    const key = cat + '|' + seed; if (sceneCache[key]) return sceneCache[key];
    const P = painter(seed); (PAINT[cat] || PAINT.room)(P, P.r, Math.floor(P.r() * 360));
    if (cat === 'wild' || cat === 'sport') { const m = rng('mood:' + seed)(), sky = cat === 'wild' ? 50 : 22;
      if (m < 0.2) { for (let y = 0; y < H; y++) for (let x = 0; x < W; x++) P.set(x, y, blend(P.get(x, y), [14, 18, 52], P.dith(x, y, 0.5) ? 0.62 : 0.5)); for (let i = 0; i < 40; i++) P.set(P.r() * W, P.r() * sky * 0.8, [255, 255, 230]); P.disc(100, 10, 4, [250, 246, 220]); P.disc(102, 9, 3, [14, 18, 52]); }
      else if (m < 0.38) { for (let y = 0; y < H; y++) for (let x = 0; x < W; x++) if (P.dith(x, y, 0.45)) P.set(x, y, blend(P.get(x, y), [255, 140, 80], 0.32)); }
      else if (m < 0.5) { for (let i = 0; i < 160; i++) { const x = P.r() * W, y = P.r() * H; P.set(x, y, [255, 255, 255]); } for (let x = 0; x < W; x++) for (let y = H - 6; y < H; y++) if (P.dith(x, y, (y - H + 6) / 6 + 0.3)) P.set(x, y, [240, 246, 255]); } }
    const cv = document.createElement('canvas'); cv.width = W; cv.height = H; cv.getContext('2d').putImageData(P.img, 0, 0);
    return (sceneCache[key] = cv.toDataURL());
  }
  /* ---------- one-of-a-kind art: a portrait for every person, a paint swatch for every colour ---------- */
  // Finish flat pixel art like the sprites: a coloured outline, light on the top left, shade on the bottom right.
  function stylize(g, S) {
    const id = g.getImageData(0, 0, S, S), d = id.data, on = (x, y) => x >= 0 && y >= 0 && x < S && y < S && d[(y * S + x) * 4 + 3] > 0;
    const out = new Uint8ClampedArray(d);
    for (let y = 0; y < S; y++) for (let x = 0; x < S; x++) {
      const o = (y * S + x) * 4;
      if (on(x, y)) {
        const f = !on(x, y - 1) || !on(x - 1, y) ? 0.22 : (!on(x, y + 1) || !on(x + 1, y)) ? -0.3 : 0;
        if (f) for (let k = 0; k < 3; k++) out[o + k] = f > 0 ? d[o + k] + (255 - d[o + k]) * f : d[o + k] * (1 + f);
      } else if (on(x - 1, y) || on(x + 1, y) || on(x, y - 1) || on(x, y + 1)) {
        const j = on(x, y + 1) ? o + S * 4 : on(x - 1, y) ? o - 4 : on(x + 1, y) ? o + 4 : o - S * 4;
        out[o] = d[j] * 0.2; out[o + 1] = d[j + 1] * 0.2; out[o + 2] = d[j + 2] * 0.2 + 8; out[o + 3] = 255;
      }
    }
    g.putImageData(new ImageData(out, S, S), 0, 0);
  }
  const PERSON = /\b(person|people|president|prime minister|king|queen|monarch|emperor|pharaoh|pope|author|novelist|poet|playwright|writer|artist|painter|sculptor|singer|rapper|musician|composer|guitarist|drummer|dj|actor|actress|comedian|host|presenter|player|athlete|footballer|quarterback|pitcher|boxer|wrestler|golfer|tennis player|driver|coach|manager|scientist|inventor|explorer|astronaut|philosopher|leader|politician|chef|model|youtuber|streamer|influencer|director|celebrity|billionaire|founder|dancer|character|villain|hero|princess|prince|wizard|witch|detective|spy|member|surname|first name|famous)\b/;
  const NOT_PERSON = /\b(team|band|group|club|film|movie|show|series|book|novel|song|album|city|country|place|brand|company|game|franchise|award|instrument)s?\b/;
  // judged on the prompt's head: the few words right after "Name a", so "a leader of a country" is a person and "a team from the NFL" is not
  const isPerson = (answer, prompt) => { const p = String(prompt).toLowerCase().replace(/[^a-z' ]/g, ' '), m = p.match(/name (?:a |an |the |any |one )?(.*)/), head = (m ? m[1] : p).split(/\s+/).slice(0, 5).join(' ');
    return PERSON.test(head) && !NOT_PERSON.test(head) && /^[A-Z0-9]/.test(String(answer).trim()); };
  const isColour = prompt => /\b(colou?r|shade|hue)s?\b/i.test(prompt);
  const SKIN = ['#ffdbb8', '#f2c49b', '#e0a77a', '#c68a5a', '#9a6640', '#6e4428', '#4a2e1a'];
  const HAIR = ['#1a1410', '#3a2416', '#6a4020', '#a8682a', '#e0c070', '#f4e2a8', '#b8401a', '#9a9a9a', '#ececec', '#6a2a8a', '#2a6ad0', '#e0408a'];
  const SHIRT = ['#c0392b', '#2b6bd0', '#2b8a3e', '#e0b13a', '#6a2c91', '#e8e8e8', '#1a1a1a', '#e07a2b', '#2aa1a1', '#8a1a3a', '#3a4a6a'];
  const DIG = { 0: '111101101101111', 1: '010110010010111', 2: '111001111100111', 3: '111001111001111', 4: '101101111001001', 5: '111100111001111', 6: '111100111101111', 7: '111001010010010', 8: '111101111101111', 9: '111101111001111' };
  const artCache = {};
  function portrait(name, prompt) {
    const key = 'p:' + name + '|' + prompt; if (artCache[key]) return artCache[key];
    const S = 48, r = rng('face:' + name), cv = document.createElement('canvas'); cv.width = cv.height = S; const g = cv.getContext('2d');
    const P = String(prompt).toLowerCase(), pick = a => a[Math.floor(r() * a.length)];
    // a woman when the prompt says so, or when the first name reads that way (and the prompt does not say otherwise)
    const first = String(name).trim().split(/\s+/)[0].toLowerCase().replace(/[^a-z]/g, '');
    const fem = /female|wom[ae]n|queen|princess|actress|girl|lady|witch|goddess|mother|sister|wife|daughter|diva|ballerina|heroine/.test(P)
      || (!/\b(male|men|man|king|prince|actor|boy|father|brother|husband|son|emperor|pharaoh|pope)\b/.test(P) && /(a|ah|ie|elle|ette|ine|een|lyn|lynn|ia|na|ra|is|ey)$/.test(first) && first.length > 2
        && !/^(luca|joshua|nikola|sasha|jonah|noah|elijah|isaiah|jeremiah|micah|ezra|dana|andrea|kenny|dennis|lewis|louis|travis|chris|willis|otis|harvey|bailey|stanley|mickey|corey|joey|davis|morris|francis|curtis|elvis|julius|marquis|ellis)$/.test(first));
    const px = (x, y, c, w = 1, h = 1) => { g.fillStyle = c; g.fillRect(x, y, w, h); };
    const oval = (cx, cy, rx, ry, c) => { for (let y = Math.floor(cy - ry); y <= cy + ry; y++) for (let x = Math.floor(cx - rx); x <= cx + rx; x++) if (((x - cx + 0.5) / rx) ** 2 + ((y - cy + 0.5) / ry) ** 2 <= 1) px(x, y, c); };
    const skin = pick(SKIN), dark = (c, f) => { const n = parseInt(c.slice(1), 16), k = 1 - f; return 'rgb(' + [(n >> 16) * k | 0, ((n >> 8) & 255) * k | 0, (n & 255) * k | 0] + ')'; };
    const old = r() < 0.18, hair = old ? pick(['#9a9a9a', '#ececec', '#c8c8c8']) : r() < 0.08 ? pick(HAIR.slice(9)) : pick(HAIR.slice(0, 7)), style = fem ? pick([1, 1, 1, 2, 3, 6]) : pick([0, 0, 2, 3, 4, 5, 6]);
    const sporty = /player|athlete|footballer|quarterback|pitcher|golfer|tennis|driver|coach|boxer|wrestler/.test(P), royal = /king|queen|monarch|emperor|pharaoh|prince|princess/.test(P);
    const shirt = pick(SHIRT), shirt2 = pick(SHIRT.filter(c => c !== shirt));
    // shoulders and body
    oval(24, 47, 17, 10, shirt); px(14, 44, shirt, 20, 4);
    if (sporty) { px(20, 38, shirt2, 8, 2); const n = String(1 + Math.floor(r() * 98)); [...n].forEach((ch, k) => { const m = DIG[ch]; for (let i = 0; i < 15; i++) if (m[i] === '1') px(24 - n.length * 2 + k * 4 + (i % 3), 41 + Math.floor(i / 3), shirt2); }); }
    else if (r() < 0.5) { px(19, 37, '#f4f4f4', 10, 3); px(22, 37, skin, 4, 2); px(23, 39, shirt2, 2, 6); } // collar and tie
    else { for (let k = 0; k < 4; k++) px(22 + k * 0.5 | 0, 37 + k, skin, 4 - k, 1); } // open neck
    // neck and head
    px(21, 31, dark(skin, 0.12), 6, 6);
    oval(24, 21, 9.5, 11.5, skin);
    px(14, 21, skin, 2, 4); px(33, 21, skin, 2, 4); px(14, 22, dark(skin, 0.2)); px(34, 22, dark(skin, 0.2)); // ears
    // hair
    const top = () => { oval(24, 13, 10.5, 6.5, hair); px(14, 12, hair, 21, 4); };
    if (style === 0) top();                                                        // short
    else if (style === 1) { top(); px(13, 14, hair, 3, 22); px(32, 14, hair, 3, 22); px(14, 33, hair, 4, 4); px(30, 33, hair, 4, 4); } // long
    else if (style === 2) { for (let k = 0; k < 7; k++) oval(15 + k * 3, 11 + (k % 2), 3, 3, hair); px(14, 12, hair, 21, 3); } // curly
    else if (style === 3) { oval(24, 13, 10.5, 5, hair); oval(24, 6, 4, 3.5, hair); }  // bun
    else if (style === 4) { px(14, 15, hair, 2, 6); px(33, 15, hair, 2, 6); }          // balding
    else if (style === 5) { top(); for (let x = 16; x < 33; x += 3) px(x, 7 + (x % 2), hair, 2, 4); } // spiky
    else { top(); px(15, 13, hair, 9, 5); }                                         // side parting
    // face: brows, eyes, nose, mouth
    const eyeY = 21; px(18, eyeY - 3, dark(hair, 0.1), 4, 1); px(27, eyeY - 3, dark(hair, 0.1), 4, 1);
    px(19, eyeY, '#ffffff', 3, 2); px(27, eyeY, '#ffffff', 3, 2); px(20, eyeY, '#1a1a2a', 2, 2); px(28, eyeY, '#1a1a2a', 2, 2);
    px(24, eyeY + 2, dark(skin, 0.18), 1, 3); px(23, eyeY + 5, dark(skin, 0.15), 3, 1);
    const smile = r() < 0.6, lip = fem ? pick(['#c0304a', '#a02a3a', '#d0506a']) : '#8a2a2a'; px(21, eyeY + 8, lip, 7, fem ? 2 : 1); if (smile) { px(20, eyeY + 7, lip); px(28, eyeY + 7, lip); }
    if (fem) { px(18, eyeY - 1, '#1a1a2a', 1, 1); px(30, eyeY - 1, '#1a1a2a', 1, 1); px(17, eyeY + 4, '#f0a0a0', 2, 1); px(30, eyeY + 4, '#f0a0a0', 2, 1); if (r() < 0.4) { px(14, eyeY + 4, '#ffd24a'); px(34, eyeY + 4, '#ffd24a'); } }
    // extras, seeded: glasses, a beard, a hat or a crown
    if (r() < 0.22) { const gc = pick(['#1a1a1a', '#c8a040', '#8a2a2a']); px(18, eyeY - 1, gc, 5, 1); px(18, eyeY + 2, gc, 5, 1); px(18, eyeY - 1, gc, 1, 4); px(22, eyeY - 1, gc, 1, 4); px(26, eyeY - 1, gc, 5, 1); px(26, eyeY + 2, gc, 5, 1); px(26, eyeY - 1, gc, 1, 4); px(30, eyeY - 1, gc, 1, 4); px(23, eyeY, gc, 3, 1); }
    if (!fem && r() < 0.25) { oval(24, eyeY + 10, 8, 4.5, hair); px(21, eyeY + 8, '#8a2a2a', 7, 1); px(17, eyeY + 4, hair, 2, 5); px(30, eyeY + 4, hair, 2, 5); }
    if (royal) { px(15, 4, '#e0b13a', 19, 4); for (const x of [15, 21, 27, 33]) px(x, 1, '#e0b13a', 1, 3); px(23, 2, '#e0b13a', 3, 2); px(18, 5, '#c0392b', 2, 2); px(24, 5, '#2b6bd0', 2, 2); px(30, 5, '#2b8a3e', 2, 2); }
    else if (sporty && r() < 0.4) { px(14, 8, shirt, 21, 5); px(30, 12, shirt, 9, 2); }
    else if (/wizard|witch/.test(P)) { for (let k = 0; k < 12; k++) px(24 - k, 11 - k * 0.8 | 0, '#4a2a8a', k * 2 + 1, 1); px(10, 11, '#4a2a8a', 29, 2); }
    stylize(g, S);
    return (artCache[key] = cv.toDataURL());
  }
  // the colour itself, poured from a pot
  function swatch(name) {
    const key = 's:' + name; if (artCache[key]) return artCache[key];
    const ctx = parse.cv || (parse.cv = document.createElement('canvas').getContext('2d')); ctx.fillStyle = '#010203';
    ctx.fillStyle = String(name).toLowerCase().replace(/[^a-z]/g, ''); let col = ctx.fillStyle;
    if (col === '#010203') { const h = hash('colour:' + name) % 360; col = 'hsl(' + h + ',65%,52%)'; }
    const S = 48, cv = document.createElement('canvas'); cv.width = cv.height = S; const g = cv.getContext('2d'), px = (x, y, c, w = 1, h = 1) => { g.fillStyle = c; g.fillRect(x, y, w, h); };
    // a tin of paint, tipped, with the colour pooling and dripping out
    px(6, 18, '#b8bcc6', 22, 22); px(6, 18, '#e6e9ef', 22, 3); px(6, 37, '#8a8f99', 22, 3); px(8, 24, '#ffffff', 18, 10); px(10, 26, col, 14, 6);
    px(4, 16, '#d8dce4', 26, 3); px(27, 20, '#8a8f99', 1, 18);
    for (let y = 12; y < 20; y++) px(8 + (y - 12), y, col, 18, 1);
    g.fillStyle = col; g.beginPath(); g.ellipse(32, 42, 14, 5, 0, 0, 7); g.fill(); px(30, 20, col, 4, 22); px(28, 30, col, 3, 6);
    for (const [x, l] of [[12, 6], [19, 9], [25, 4]]) { px(x, 40, col, 2, l); px(x, 40 + l, col, 3, 2); }
    g.globalAlpha = 0.5; px(31, 21, '#ffffff', 1, 14); px(24, 40, '#ffffff', 6, 1); g.globalAlpha = 1;
    stylize(g, S);
    return (artCache[key] = cv.toDataURL());
  }
  // the picture on a card: a face for a person, the colour for a colour, otherwise the best-fitting emoji as a sprite
  function cardArt(answer, prompt) {
    if (isColour(prompt)) return { src: swatch(answer), kind: 'swatch' };
    if (isPerson(answer, prompt)) return { src: portrait(answer, prompt), kind: 'portrait' };
    return { src: pixelEmoji(pickEmoji(answer, prompt), 48), kind: 'sprite' };
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

  window.CardArt = { TYPES, cardArt, portrait, swatch, topicOf, pickEmoji, pixelEmoji, scene, catOf, crest, ENCH, rollEnchant, particles, hash, rng };
})();
