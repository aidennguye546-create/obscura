// Pack wrappers: one design per theme (264 of them), each in six editions. Everything is drawn from the theme's
// emoji and a seed: its colours, a background pattern, a layout and a title banner.
'use strict';
(function () {
  const A = window.CardArt, W = 150, H = 243;
  const EDITIONS = [
    { id: 'std', name: 'Standard', odds: 1, perk: '' },
    { id: 'foil', name: 'Foil edition', odds: 10, perk: 'one card is guaranteed foil' },
    { id: 'gold', name: 'Gold edition', odds: 40, perk: 'the last card is Rare or better' },
    { id: 'shadow', name: 'Shadow edition', odds: 60, perk: 'one card is guaranteed enchanted' },
    { id: 'prism', name: 'Prism edition', odds: 150, perk: 'every card is foil' },
    { id: 'obscura', name: 'Obscura edition', odds: 500, perk: 'an Obscura is guaranteed' },
  ];
  function rollEdition(r = Math.random) { for (let i = EDITIONS.length - 1; i > 0; i--) if (r() < 1 / EDITIONS[i].odds) return EDITIONS[i].id; return 'std'; }
  const _c = document.createElement('canvas').getContext('2d');
  const alpha = (c, a) => { _c.fillStyle = c; const v = _c.fillStyle; if (v[0] === '#') { const n = parseInt(v.slice(1), 16); return 'rgba(' + (n >> 16) + ',' + ((n >> 8) & 255) + ',' + (n & 255) + ',' + a + ')'; } return v.replace('rgb(', 'rgba(').replace(')', ',' + a + ')'); };
  const hsl = (h, s, l) => 'hsl(' + ((h % 360) + 360) % 360 + ',' + s + '%,' + l + '%)';
  // the emoji's own colour: average hue of its saturated pixels
  const hueCache = {};
  function emojiHue(e) {
    if (hueCache[e] != null) return hueCache[e];
    const img = new Image(); const cv = document.createElement('canvas'); cv.width = cv.height = 20; const g = cv.getContext('2d');
    g.font = '18px "Apple Color Emoji","Segoe UI Emoji","Noto Color Emoji",sans-serif'; g.textAlign = 'center'; g.textBaseline = 'middle'; g.fillText(e, 10, 11);
    const d = g.getImageData(0, 0, 20, 20).data; let x = 0, y = 0, n = 0;
    for (let i = 0; i < d.length; i += 4) { if (d[i + 3] < 120) continue; const r = d[i] / 255, gg = d[i + 1] / 255, b = d[i + 2] / 255, mx = Math.max(r, gg, b), mn = Math.min(r, gg, b); if (mx - mn < 0.2) continue;
      let hh = mx === r ? (gg - b) / (mx - mn) : mx === gg ? 2 + (b - r) / (mx - mn) : 4 + (r - gg) / (mx - mn); hh *= 60; x += Math.cos(hh * Math.PI / 180); y += Math.sin(hh * Math.PI / 180); n++; }
    return (hueCache[e] = n ? Math.atan2(y, x) * 180 / Math.PI : null);
  }
  function palette(theme, ed) {
    const r = A.rng('pal:' + theme.id); let hue = emojiHue(theme.emoji); if (hue == null) hue = r() * 360;
    const scheme = Math.floor(r() * 4), off = [30, 180, 120, 0][scheme] * (r() < 0.5 ? 1 : -1);
    const P = { bg1: hsl(hue + off * 0.2, 55, 30), bg2: hsl(hue + off * 0.4, 60, 12), pat: hsl(hue + off, 70, 55), acc: hsl(hue + off, 85, 65), ink: '#050d08', light: hsl(hue, 90, 88), title: '#ffffff' };
    if (ed === 'gold') Object.assign(P, { bg1: '#c08420', bg2: '#4a2a06', pat: '#fff3c4', acc: '#ffe08a', light: '#fff8d8', title: '#fff8d8' });
    if (ed === 'shadow') Object.assign(P, { bg1: '#140a20', bg2: '#020104', pat: hsl(hue + 180, 90, 40), acc: hsl(hue + 180, 100, 62), light: hsl(hue + 180, 100, 80), title: hsl(hue + 180, 100, 80) });
    if (ed === 'obscura') Object.assign(P, { bg1: '#2a0a4a', bg2: '#05010c', pat: '#ffd24a', acc: '#ffe08a', light: '#fff3c4', title: '#ffe08a' });
    return P;
  }
  const SERIES = ['BOOSTER', 'EXPEDITION', 'COLLECTION', 'ARCHIVE', 'FIELD GUIDE', 'VAULT', 'ASSORTMENT', 'ALMANAC', 'SAFARI', 'CHRONICLE', 'DISPATCH', 'TREASURY'];
  const cache = {};
  function drawPack(theme, ed = 'std') {
    const key = theme.id + ':' + ed; if (cache[key]) return cache[key];
    const r = A.rng('pack:' + theme.id), P = palette(theme, ed), cv = document.createElement('canvas'); cv.width = W; cv.height = H; const g = cv.getContext('2d');
    g.imageSmoothingEnabled = false;
    // background
    const bg = g.createLinearGradient(0, 0, W * 0.4, H); bg.addColorStop(0, P.bg1); bg.addColorStop(1, P.bg2); g.fillStyle = bg; g.fillRect(0, 0, W, H);
    if (ed === 'prism') { for (let y = 0; y < H; y += 3) { g.fillStyle = hsl(y * 2.4, 70, 30); g.fillRect(0, y, W, 3); } }
    // pattern
    const pat = Math.floor(r() * 14); g.save(); g.globalAlpha = 0.22; g.fillStyle = P.pat; g.strokeStyle = P.pat; g.lineWidth = 2;
    if (pat === 0) { for (let i = -H; i < W + H; i += 14) { g.beginPath(); g.moveTo(i, 0); g.lineTo(i + H, H); g.lineTo(i + H + 6, H); g.lineTo(i + 6, 0); g.fill(); } }
    else if (pat === 1) { for (let y = -10; y < H; y += 16) { g.beginPath(); for (let x = 0; x <= W; x += 15) g.lineTo(x, y + (x / 15 % 2 ? 8 : 0)); g.stroke(); } }
    else if (pat === 2) { for (let y = 6; y < H; y += 14) for (let x = (y / 14 % 2) * 7 + 4; x < W; x += 14) { g.beginPath(); g.arc(x, y, 3, 0, 7); g.fill(); } }
    else if (pat === 3) { for (let y = 0; y < H; y += 12) for (let x = (y / 12 % 2) * 12; x < W; x += 24) g.fillRect(x, y, 12, 12); }
    else if (pat === 4) { g.translate(W / 2, H * 0.45); for (let a = 0; a < 24; a++) { if (a % 2) continue; g.beginPath(); g.moveTo(0, 0); g.arc(0, 0, H, a * Math.PI / 12, (a + 1) * Math.PI / 12); g.fill(); } }
    else if (pat === 5) { for (let y = 0; y < H; y += 12) { g.beginPath(); for (let x = 0; x <= W; x += 3) g.lineTo(x, y + Math.sin(x / 9 + y) * 4); g.stroke(); } }
    else if (pat === 6) { for (let y = 0; y < H + 10; y += 9) for (let x = (y / 9 % 2) * 8; x < W + 10; x += 16) { g.beginPath(); g.arc(x, y, 8, 0, Math.PI); g.stroke(); } }
    else if (pat === 7) { for (let i = 0; i < 26; i++) { let x = Math.floor(r() * 10) * 15, y = Math.floor(r() * 16) * 15; g.beginPath(); g.moveTo(x, y); for (let k = 0; k < 4; k++) { r() < 0.5 ? x += 15 : y += 15; g.lineTo(x, y); } g.stroke(); g.fillRect(x - 2, y - 2, 4, 4); } }
    else if (pat === 8) { g.globalAlpha = 0.7; for (let i = 0; i < 70; i++) g.fillRect(r() * W | 0, r() * H | 0, 1 + (r() < 0.2), 1 + (r() < 0.2)); }
    else if (pat === 9) { for (let rr = 8; rr < H; rr += 10) { g.beginPath(); g.arc(W / 2, H * 0.45, rr, 0, 7); g.stroke(); } }
    else if (pat === 10) { for (let y = 0; y < H; y += 22) { g.beginPath(); g.moveTo(0, y); for (let x = 0; x <= W; x += 10) g.lineTo(x, y + (x / 10 % 2 ? 9 : 0)); g.lineTo(W, y + 18); g.lineTo(0, y + 18); g.fill(); y += 4; } }
    else if (pat === 11) { for (let y = 4; y < H; y += 8) for (let x = 4; x < W; x += 8) { const s = 3 * (1 - y / H); if (s > 0.3) { g.beginPath(); g.arc(x, y, s, 0, 7); g.fill(); } } }
    else if (pat === 12) { for (let x = 0; x < W; x += 20) g.fillRect(x, 0, 6, H); for (let y = 0; y < H; y += 20) g.fillRect(0, y, W, 6); }
    else { for (let y = 0; y < H + 20; y += 20) for (let x = (y / 20 % 2) * 10; x < W + 20; x += 20) { g.beginPath(); g.moveTo(x, y - 10); g.lineTo(x + 10, y); g.lineTo(x, y + 10); g.lineTo(x - 10, y); g.closePath(); g.stroke(); } }
    g.restore();
    // the art
    const img = theme._img;
    const lay = Math.floor(r() * 6); const ready = !!(img && img.complete && img.naturalWidth); const drawE = (x, y, s, rot = 0) => { if (!ready) return; g.save(); g.translate(x, y); g.rotate(rot); g.drawImage(img, -s / 2, -s / 2, s, s); g.restore(); };
    const glow = (x, y, rad) => { const gr = g.createRadialGradient(x, y, 0, x, y, rad); gr.addColorStop(0, P.acc); gr.addColorStop(0.4, alpha(P.acc, 0.33)); gr.addColorStop(1, 'transparent'); g.fillStyle = gr; g.fillRect(x - rad, y - rad, rad * 2, rad * 2); };
    if (lay === 0) { glow(W / 2, 100, 70); drawE(W / 2, 100, 96); }
    else if (lay === 1) { g.globalAlpha = 0.35; for (let y = 30; y < H; y += 28) for (let x = (y / 28 % 2) * 14; x < W + 14; x += 28) drawE(x, y, 18, 0.2); g.globalAlpha = 1; g.fillStyle = P.bg2; g.beginPath(); g.arc(W / 2, 100, 44, 0, 7); g.fill(); g.strokeStyle = P.acc; g.lineWidth = 3; g.stroke(); drawE(W / 2, 100, 66); }
    else if (lay === 2) { glow(W / 2, 170, 90); drawE(W / 2, 175, 150); }
    else if (lay === 3) { glow(W / 2, 104, 60); drawE(34, 112, 44, -0.2); drawE(W - 34, 112, 44, 0.2); drawE(W / 2, 100, 74); }
    else if (lay === 4) { const sc = theme._scene; g.fillStyle = P.ink; g.fillRect(17, 46, W - 34, 108); if (sc && sc.complete) { g.imageSmoothingEnabled = false; g.drawImage(sc, 20, 49, W - 40, 102); } g.strokeStyle = P.acc; g.lineWidth = 2; g.strokeRect(18, 47, W - 36, 106); drawE(W / 2, 104, 70); }
    else { g.fillStyle = P.ink; g.beginPath(); g.moveTo(W / 2, 40); g.lineTo(W - 24, 62); g.lineTo(W - 28, 128); g.lineTo(W / 2, 160); g.lineTo(28, 128); g.lineTo(24, 62); g.closePath(); g.fill(); g.strokeStyle = P.acc; g.lineWidth = 3; g.stroke(); glow(W / 2, 98, 50); drawE(W / 2, 98, 64); }
    // header: OBSCURA
    g.font = '15px VT323'; g.textAlign = 'center'; g.textBaseline = 'middle'; g.fillStyle = P.ink; g.fillText('O B S C U R A', W / 2 + 1, 31); g.fillStyle = P.light; g.fillText('O B S C U R A', W / 2, 30);
    // title banner
    const title = theme.name.toUpperCase(), bs = Math.floor(r() * 3), ty = lay === 2 ? 66 : 186;
    let fs = 30; g.font = fs + 'px VT323'; while (g.measureText(title).width > W - 24 && fs > 14) { fs--; g.font = fs + 'px VT323'; }
    if (bs === 0) { g.fillStyle = P.acc; g.fillRect(6, ty - 15, W - 12, 28); g.beginPath(); g.moveTo(6, ty - 15); g.lineTo(0, ty - 1); g.lineTo(6, ty + 13); g.moveTo(W - 6, ty - 15); g.lineTo(W, ty - 1); g.lineTo(W - 6, ty + 13); g.fill(); g.fillStyle = P.ink; g.fillText(title, W / 2, ty); }
    else if (bs === 1) { g.fillStyle = 'rgba(0,0,0,0.6)'; g.fillRect(10, ty - 15, W - 20, 28); g.strokeStyle = P.acc; g.lineWidth = 1; g.strokeRect(12, ty - 13, W - 24, 24); g.fillStyle = P.title; g.fillText(title, W / 2, ty); }
    else { g.lineWidth = 4; g.strokeStyle = P.ink; g.strokeText(title, W / 2, ty); g.fillStyle = P.acc; g.fillText(title, W / 2, ty); g.fillStyle = P.light; g.fillRect(30, ty + 13, W - 60, 1); }
    g.font = '11px VT323'; g.fillStyle = P.light; const series = SERIES[Math.floor(r() * SERIES.length)]; g.fillText(series + ' · ' + theme.n + ' PROMPTS', W / 2, ty + (lay === 2 ? 22 : 24));
    // edition mark
    if (ed !== 'std') { const E = EDITIONS.find(x => x.id === ed); g.font = '11px VT323'; g.textAlign = 'left'; g.fillStyle = ed === 'shadow' ? P.acc : '#fff3c4'; g.fillText('✦ ' + E.name.toUpperCase(), 8, H - 20); }
    g.textAlign = 'right'; g.font = '11px VT323'; g.fillStyle = '#fff'; g.fillText('5 CARDS', W - 8, H - 20);
    const out = { url: cv.toDataURL(), pal: P, ready };
    if (ready) cache[key] = out;
    return out;
  }
  // load every theme's art (and the pixel font) before drawing, so a pack is never drawn half-finished
  const loadImg = src => new Promise(res => { const i = new Image(); i.onload = () => res(i); i.onerror = () => res(i); i.src = src; });
  async function preload(themes) {
    await document.fonts.load('30px VT323');
    await Promise.all(themes.map(async t => { t._img = await loadImg(A.pixelEmoji(t.emoji, 24)); t._scene = await loadImg(A.scene(A.catOf(t.word), t.id)); }));
  }
  window.PackArt = { drawPack, palette, EDITIONS, rollEdition, preload };
})();
