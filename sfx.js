// Obscura pack sounds: everything is synthesised live (no audio files), run through a little room reverb.
'use strict';
(function () {
  let ac = null, master = null, wet = null, dry = null, amb = null;
  // the game's sound switch (Settings or the corner button) applies here too
  let muted = (() => { try { return localStorage.getItem('tr_mute') === '1'; } catch (e) { return false; } })();
  function ctx() {
    if (ac) { if (ac.state === 'suspended') ac.resume(); return ac; }
    ac = new (window.AudioContext || window.webkitAudioContext)();
    master = ac.createGain(); master.gain.value = muted ? 0 : 0.9; master.connect(ac.destination);
    // a short, warm room: generated impulse of decaying noise
    const len = ac.sampleRate * 2.2, ir = ac.createBuffer(2, len, ac.sampleRate);
    for (let ch = 0; ch < 2; ch++) { const d = ir.getChannelData(ch); for (let i = 0; i < len; i++) d[i] = (Math.random() * 2 - 1) * Math.pow(1 - i / len, 2.6); }
    const conv = ac.createConvolver(); conv.buffer = ir;
    wet = ac.createGain(); wet.gain.value = 0.28; dry = ac.createGain(); dry.gain.value = 1;
    wet.connect(conv).connect(master); dry.connect(master);
    return ac;
  }
  const out = (node, rv = 1) => { node.connect(dry); if (rv) { const g = ac.createGain(); g.gain.value = rv; node.connect(g).connect(wet); } };
  // one oscillator with an envelope
  function tone(f0, dur, o = {}) {
    const a = ctx(), t = a.currentTime + (o.delay || 0), osc = a.createOscillator(), g = a.createGain();
    osc.type = o.type || 'sine'; osc.frequency.setValueAtTime(f0, t); if (o.f1) osc.frequency.exponentialRampToValueAtTime(o.f1, t + (o.glide || dur));
    if (o.detune) osc.detune.value = o.detune;
    const v = o.vol ?? 0.15, at = o.attack ?? 0.005;
    g.gain.setValueAtTime(0.0001, t); g.gain.exponentialRampToValueAtTime(v, t + at); g.gain.exponentialRampToValueAtTime(0.0001, t + dur);
    let node = osc.connect(g);
    if (o.lp) { const f = a.createBiquadFilter(); f.type = 'lowpass'; f.frequency.setValueAtTime(o.lp, t); if (o.lp1) f.frequency.exponentialRampToValueAtTime(o.lp1, t + dur); f.Q.value = o.q || 0.8; node = node.connect(f); }
    if (o.pan) { const p = a.createStereoPanner(); p.pan.value = o.pan; node = node.connect(p); }
    out(node, o.rv ?? 1); osc.start(t); osc.stop(t + dur + 0.05);
  }
  let nbuf = null;
  const noiseBuf = () => { const a = ctx(); if (nbuf) return nbuf; nbuf = a.createBuffer(1, a.sampleRate * 3, a.sampleRate); const d = nbuf.getChannelData(0); for (let i = 0; i < d.length; i++) d[i] = Math.random() * 2 - 1; return nbuf; };
  // filtered noise with a frequency sweep and envelope
  function noise(dur, o = {}) {
    const a = ctx(), t = a.currentTime + (o.delay || 0), s = a.createBufferSource(), f = a.createBiquadFilter(), g = a.createGain();
    s.buffer = noiseBuf(); s.loop = true; f.type = o.ft || 'bandpass'; f.frequency.setValueAtTime(o.f || 2000, t); if (o.f1) f.frequency.exponentialRampToValueAtTime(o.f1, t + dur); f.Q.value = o.q ?? 1;
    const v = o.vol ?? 0.2, at = o.attack ?? 0.005;
    g.gain.setValueAtTime(0.0001, t); g.gain.exponentialRampToValueAtTime(v, t + at); g.gain.exponentialRampToValueAtTime(0.0001, t + dur);
    let node = s.connect(f).connect(g); if (o.pan) { const p = a.createStereoPanner(); p.pan.value = o.pan; node = node.connect(p); }
    out(node, o.rv ?? 0.6); s.start(t, Math.random() * 2); s.stop(t + dur + 0.05);
  }
  // a struck bell: inharmonic partials that die away at different rates
  function bell(f, o = {}) { [[1, 1], [2.76, 0.5], [5.4, 0.25], [8.93, 0.12]].forEach(([m, v], i) => tone(f * m, (o.dur || 1.6) / (1 + i * 0.6), { vol: (o.vol || 0.08) * v, delay: o.delay, attack: 0.002, rv: 1.2, pan: o.pan })); }
  const chord = (root, steps, o = {}) => steps.forEach((s, i) => bell(root * Math.pow(2, s / 12), { ...o, delay: (o.delay || 0) + i * (o.spread ?? 0.06), pan: (i % 2 ? 0.3 : -0.3) }));


  const S = {
    toggle() { ctx(); muted = !muted; try { muted ? localStorage.setItem('tr_mute', '1') : localStorage.removeItem('tr_mute'); } catch (e) { /* blocked */ } master.gain.setTargetAtTime(muted ? 0 : 0.9, ac.currentTime, 0.05); return !muted; },
    muted: () => muted,
    // coming back after stop(): sound up again, following the game's switch in case it changed meanwhile
    wake() { try { muted = localStorage.getItem('tr_mute') === '1'; } catch (e) { /* blocked */ } if (!ac) return; if (ac.state === 'suspended') ac.resume(); master.gain.setTargetAtTime(muted ? 0 : 0.9, ac.currentTime, 0.05); },
    // closing the machine: let everything ring out, then stop
    stop() { if (ac && ac.state === 'running') { master.gain.setTargetAtTime(0, ac.currentTime, 0.15); setTimeout(() => { try { ac.suspend(); } catch (e) { /* gone */ } }, 600); } },
    // a soft arcade hum under everything: two slow detuned pads and the odd distant bleep
    ambient() { const a = ctx(); if (amb) return; amb = a.createGain(); amb.gain.value = 0; amb.gain.setTargetAtTime(0.05, a.currentTime, 2);
      const lp = a.createBiquadFilter(); lp.type = 'lowpass'; lp.frequency.value = 700; const lfo = a.createOscillator(), lg = a.createGain(); lfo.frequency.value = 0.07; lg.gain.value = 300; lfo.connect(lg).connect(lp.frequency); lfo.start();
      [[110, -4], [164.8, 5], [220, 0]].forEach(([f, d]) => { const o = a.createOscillator(); o.type = 'triangle'; o.frequency.value = f; o.detune.value = d; o.connect(lp); o.start(); });
      lp.connect(amb); out(amb, 1.4);
      setInterval(() => { if (!muted && Math.random() < 0.4) tone([1318, 1568, 1760, 2093][Math.floor(Math.random() * 4)], 0.12, { type: 'square', vol: 0.008, lp: 2500, rv: 2, pan: Math.random() - 0.5 }); }, 2500); },
    unlock: () => ctx(),
    click: () => { tone(1800, 0.04, { type: 'square', vol: 0.04, lp: 3000, rv: 0.2 }); },
    hover: () => tone(900, 0.06, { type: 'triangle', vol: 0.025, rv: 0.3 }),
    // the machine
    coin: () => { bell(1568, { vol: 0.07, dur: 0.8 }); bell(2093, { vol: 0.07, dur: 1.2, delay: 0.09 }); noise(0.05, { f: 6000, vol: 0.08 }); },
    ratchet: () => { noise(0.025, { f: 3500, q: 6, vol: 0.18, rv: 0.2 }); tone(240, 0.03, { type: 'square', vol: 0.03, lp: 1200, rv: 0.1 }); },
    clunk: () => { tone(110, 0.35, { f1: 55, vol: 0.4, lp: 600, rv: 0.6 }); noise(0.18, { ft: 'lowpass', f: 900, vol: 0.35 }); tone(700, 0.08, { type: 'square', vol: 0.05, lp: 1800, rv: 0.3 }); },
    whir: (dur = 1.6) => { tone(55, dur, { type: 'sawtooth', f1: 140, glide: dur * 0.5, vol: 0.09, lp: 500, lp1: 1400, attack: 0.15 }); tone(57, dur, { type: 'sawtooth', f1: 146, glide: dur * 0.5, vol: 0.06, lp: 400, attack: 0.2 }); },
    rattle: (dur = 1.4) => { for (let i = 0; i < dur * 22; i++) { const d = Math.random() * dur; noise(0.03, { f: 1500 + Math.random() * 2500, q: 4, vol: 0.06 + Math.random() * 0.07, delay: d, pan: Math.random() - 0.5, rv: 0.3 }); } },
    ding: () => chord(1318.5, [0, 7, 12], { vol: 0.09, spread: 0.08 }),
    drop: () => { noise(0.25, { f: 2500, f1: 500, q: 2, vol: 0.12 }); },
    steam: () => { noise(1.1, { ft: 'highpass', f: 2500, f1: 1200, vol: 0.12, attack: 0.05 }); noise(0.9, { f: 600, q: 0.6, vol: 0.05, attack: 0.1 }); },
    tick: f => tone(f == null ? 2400 : 900 + f * 2600, 0.03, { type: 'square', vol: 0.015, lp: 4000, rv: 0.1 }), // rises as an odds counter climbs
    reel: n => { tone(900 + (n % 3) * 120, 0.03, { type: 'square', vol: 0.03, lp: 3000, rv: 0.2 }); },
    streak: n => chord(392 * Math.pow(2, (n - 1) * 2 / 12), [0, 4, 7, 12].slice(0, Math.min(4, n + 1)), { vol: 0.06, spread: 0.05 }),
    fanfare: () => { [[0, 0], [4, 0.12], [7, 0.24], [12, 0.36], [7, 0.5], [12, 0.62]].forEach(([s, d]) => { tone(523.3 * Math.pow(2, s / 12), 0.25, { type: 'square', vol: 0.05, lp: 3000, delay: d }); tone(523.3 * Math.pow(2, s / 12) / 2, 0.25, { type: 'sawtooth', vol: 0.03, lp: 1500, delay: d }); }); setTimeout(() => S.sparkle(14, 1400), 700); },
    combo: i => bell(659.3 * Math.pow(2, [0, 2, 4, 7, 9, 12][Math.min(5, i)] / 12), { vol: 0.05, dur: 0.7 }),
    coinhit: i => { bell(1568 * Math.pow(2, (i % 5) / 12), { vol: 0.035, dur: 0.4 }); },
    nearmiss: () => { tone(392, 0.25, { type: 'triangle', vol: 0.06 }); tone(370, 0.25, { type: 'triangle', vol: 0.06, delay: 0.25 }); tone(349, 0.5, { type: 'triangle', vol: 0.06, delay: 0.5 }); },
    thump: () => { tone(80, 0.3, { f1: 40, vol: 0.45, lp: 300, rv: 0.4 }); noise(0.12, { ft: 'lowpass', f: 700, vol: 0.3 }); },
    // the pack
    crinkle: (n = 6) => { for (let i = 0; i < n; i++) noise(0.04 + Math.random() * 0.05, { ft: 'highpass', f: 3000 + Math.random() * 4000, vol: 0.05 + Math.random() * 0.08, delay: Math.random() * 0.35, pan: Math.random() - 0.5, rv: 0.2 }); },
    tearTick: () => noise(0.04, { f: 2500 + Math.random() * 3000, q: 3, vol: 0.12, rv: 0.15 }),
    tear: () => { noise(0.5, { f: 900, f1: 5500, q: 0.7, vol: 0.4, attack: 0.02 }); S.crinkle(10); },
    charge: (dur = 1) => { tone(90, dur, { type: 'sawtooth', f1: 420, vol: 0.06, lp: 300, lp1: 2400, attack: dur * 0.6 }); noise(dur, { f: 400, f1: 3000, q: 2, vol: 0.07, attack: dur * 0.8 }); },
    beams: () => { tone(220, 2.2, { type: 'sawtooth', vol: 0.03, lp: 900, attack: 0.4 }); tone(330, 2.2, { type: 'sawtooth', vol: 0.025, lp: 900, attack: 0.4, detune: 7 }); chord(880, [0, 4, 7, 11, 14], { vol: 0.03, spread: 0.1 }); },
    rise: () => noise(0.6, { f: 600, f1: 2400, q: 1, vol: 0.12, attack: 0.1 }),
    fall: () => { noise(0.5, { f: 1800, f1: 300, q: 1, vol: 0.12 }); },
    // the cards
    whoosh: (dir = 1) => noise(0.28, { f: 700, f1: 3200, q: 1.2, vol: 0.2, attack: 0.04, pan: dir * 0.5, rv: 0.3 }),
    flip: () => { noise(0.09, { f: 2400, f1: 5000, q: 1, vol: 0.14, rv: 0.2 }); tone(620, 0.06, { type: 'triangle', f1: 1100, vol: 0.05 }); },
    jitter: () => noise(0.06, { f: 900 + Math.random() * 400, q: 5, vol: 0.06, rv: 0.1 }),
    heartbeat: (delay = 0) => { tone(58, 0.22, { f1: 40, vol: 0.55, lp: 200, delay, rv: 0.5 }); tone(52, 0.25, { f1: 38, vol: 0.4, lp: 200, delay: delay + 0.2, rv: 0.5 }); },
    riser: (dur = 1.2) => { tone(110, dur, { type: 'sawtooth', f1: 880, vol: 0.07, lp: 400, lp1: 6000, attack: dur * 0.7 }); tone(113, dur, { type: 'sawtooth', f1: 900, vol: 0.05, lp: 400, lp1: 6000, attack: dur * 0.7 }); noise(dur, { f: 300, f1: 8000, q: 0.6, vol: 0.08, attack: dur * 0.9 }); },
    crackle: (dur = 0.5) => { for (let i = 0; i < dur * 30; i++) noise(0.015, { ft: 'highpass', f: 4000, vol: 0.06 + Math.random() * 0.1, delay: Math.random() * dur, pan: Math.random() - 0.5, rv: 0.2 }); },
    zap: () => { tone(1400 + Math.random() * 800, 0.12, { type: 'sawtooth', f1: 200, vol: 0.06, lp: 4000, rv: 0.6 }); noise(0.1, { ft: 'highpass', f: 3000, vol: 0.12 }); },
    shock: () => { tone(160, 0.6, { f1: 45, vol: 0.5, lp: 900, rv: 0.8 }); noise(0.5, { ft: 'lowpass', f: 2000, f1: 200, vol: 0.35 }); },
    boom: () => { tone(70, 1.4, { f1: 28, vol: 0.7, lp: 400, rv: 1 }); noise(1.1, { ft: 'lowpass', f: 3000, f1: 120, vol: 0.5 }); tone(140, 0.4, { type: 'square', f1: 50, vol: 0.08, lp: 600 }); },
    choir: (dur = 3.2) => { // an "aah" chord: detuned saws through vowel-like filters
      const a = ctx(); [261.6, 329.6, 392, 523.3, 659.3].forEach((f, i) => [-6, 6].forEach(dt => { const t = a.currentTime + i * 0.05, o = a.createOscillator(), g = a.createGain(), f1 = a.createBiquadFilter(), f2 = a.createBiquadFilter(); o.type = 'sawtooth'; o.frequency.value = f; o.detune.value = dt; f1.type = 'bandpass'; f1.frequency.value = 800; f1.Q.value = 4; f2.type = 'bandpass'; f2.frequency.value = 1150; f2.Q.value = 5; g.gain.setValueAtTime(0.0001, t); g.gain.exponentialRampToValueAtTime(0.05, t + 0.5); g.gain.exponentialRampToValueAtTime(0.0001, t + dur); const m = a.createGain(); o.connect(f1).connect(m); o.connect(f2).connect(m); out(m.connect(g), 1.6); o.start(t); o.stop(t + dur + 0.1); })); },
    sparkle: (n = 10, base = 1400) => { for (let i = 0; i < n; i++) bell(base * Math.pow(2, [0, 4, 7, 12, 16, 19, 24][i % 7] / 12), { vol: 0.03, dur: 0.7, delay: i * 0.055, pan: Math.random() - 0.5 }); },
    // rarity chimes: bigger and brighter as the tier goes up
    reveal: t => {
      if (t === 0) { S.flip(); tone(523, 0.3, { type: 'triangle', vol: 0.05 }); }
      else if (t === 1) { chord(659.3, [0, 4, 7], { vol: 0.06 }); }
      else if (t === 2) { chord(523.3, [0, 4, 7, 12], { vol: 0.08, spread: 0.07 }); S.shock(); }
      else if (t === 3) { chord(392, [0, 3, 7, 10, 14], { vol: 0.08, spread: 0.08 }); S.shock(); S.sparkle(8, 1200); }
      else { S.boom(); S.choir(); chord(523.3, [0, 4, 7, 11, 14, 19], { vol: 0.09, spread: 0.09, delay: 0.15 }); setTimeout(() => S.sparkle(14, 1600), 500); }
    },
    stamp: () => { tone(90, 0.18, { f1: 50, vol: 0.4, lp: 400, rv: 0.3 }); noise(0.08, { ft: 'lowpass', f: 1500, vol: 0.25 }); },
    glitch: () => { for (let i = 0; i < 9; i++) tone(200 + Math.random() * 1800, 0.05, { type: 'square', vol: 0.05, delay: i * 0.045, lp: 5000, rv: 0.1 }); noise(0.4, { ft: 'highpass', f: 5000, vol: 0.08 }); },
    // each enchantment has its own signature
    ench: k => ({
      ember: () => { S.crackle(0.9); tone(180, 0.9, { type: 'sawtooth', f1: 90, vol: 0.06, lp: 700 }); noise(0.8, { ft: 'lowpass', f: 900, vol: 0.15, attack: 0.2 }); },
      frost: () => { for (let i = 0; i < 9; i++) bell(2600 + Math.random() * 2000, { vol: 0.03, dur: 0.6, delay: i * 0.07, pan: Math.random() - 0.5 }); noise(1.2, { ft: 'highpass', f: 6000, vol: 0.05, attack: 0.3 }); },
      bloom: () => chord(587.3, [0, 4, 7, 9, 12, 16], { vol: 0.05, spread: 0.11 }),
      starfall: () => { for (let i = 0; i < 6; i++) tone(2400 - i * 250, 0.4, { f1: 1200 - i * 120, vol: 0.04, delay: i * 0.12, pan: 0.6 - i * 0.2 }); },
      spectral: () => { tone(440, 1.6, { f1: 415, vol: 0.06, attack: 0.3 }); tone(446, 1.6, { f1: 400, vol: 0.05, attack: 0.4 }); tone(880, 1.4, { vol: 0.02, attack: 0.5 }); },
      echo: () => [0, 0.22, 0.44, 0.66].forEach((d, i) => bell(987.8, { vol: 0.07 * Math.pow(0.6, i), delay: d })),
      void: () => { tone(40, 2, { f1: 30, vol: 0.5, lp: 200, attack: 1.2 }); noise(2, { f: 200, f1: 60, q: 2, vol: 0.2, attack: 1.4 }); tone(1200, 1.5, { type: 'sawtooth', f1: 80, vol: 0.03, lp: 2000, delay: 0.5 }); },
      aurora: () => { [261.6, 392, 523.3, 784].forEach((f, i) => tone(f, 2.6, { type: 'triangle', vol: 0.04, attack: 0.8, delay: i * 0.12, detune: 5 })); S.sparkle(8, 2000); },
      tide: () => { for (let i = 0; i < 10; i++) tone(300 + Math.random() * 500, 0.12, { f1: 900 + Math.random() * 600, vol: 0.04, delay: i * 0.08, pan: Math.random() - 0.5 }); noise(1, { f: 600, q: 0.5, vol: 0.08, attack: 0.3 }); },
      static: () => { for (let i = 0; i < 5; i++) S.zap(); S.crackle(0.6); },
      moss: () => { chord(392, [0, 2, 7, 9, 14], { vol: 0.04, spread: 0.12 }); noise(0.8, { f: 2500, q: 0.6, vol: 0.05, attack: 0.3 }); },
      eclipse: () => { tone(80, 1.8, { f1: 50, vol: 0.4, lp: 300, attack: 0.6 }); chord(311, [0, 3, 7], { vol: 0.05, spread: 0.2, delay: 0.6 }); },
      gilded: () => { for (let i = 0; i < 8; i++) bell(2093 * Math.pow(2, i % 3 / 12), { vol: 0.05, dur: 0.5, delay: i * 0.06 }); },
      chrome: () => { noise(0.6, { f: 3000, f1: 9000, q: 4, vol: 0.12 }); bell(3136, { vol: 0.06, delay: 0.3 }); },
      prism: () => { S.sparkle(16, 1200); chord(523.3, [0, 4, 7, 11, 14, 18, 21], { vol: 0.04, spread: 0.07 }); },
      apex: () => { S.choir(2.4); S.riser(0.8); },
      omega: () => { S.boom(); S.choir(3.6); setTimeout(() => S.sparkle(20, 1000), 600); },
    }[k] || (() => {}))(),
  };
  window.SFX = S;
})();
