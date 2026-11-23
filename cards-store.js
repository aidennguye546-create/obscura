// Spores and cards: one small saved state shared by the game and the pack machine (cards.html).
// It lives in this browser (localStorage) and, once an account is signed in, is copied to that account (account.js).
'use strict';
(function () {
  const KEY = 'tr_cards', GIFT = 'tr_cardgift', PULL = 10, WELCOME = 50;
  const blank = () => ({ v: 1, rev: 0, uid: null, spores: 0, pity: 0, pulls: 0, owned: {}, designs: {}, sc: null, earned: [], log: [] });
  function read() { try { const s = JSON.parse(localStorage.getItem(KEY) || 'null'); if (s && s.v === 1) return Object.assign(blank(), s); } catch (e) { /* unreadable: start over */ } return blank(); }
  let st = read();
  // a first visit gets enough for a few packs, once per browser
  try { if (!localStorage.getItem(GIFT)) { localStorage.setItem(GIFT, '1'); if (!st.pulls && st.spores < WELCOME) { st.spores = WELCOME; st.gift = WELCOME; save(true); } } } catch (e) { /* storage blocked */ }

  const subs = new Set();
  function emit(why) { subs.forEach(f => { try { f(st, why); } catch (e) { /* a listener failed */ } }); }
  function save(quiet, why) {
    st.rev = (st.rev || 0) + 1; st.at = Date.now();
    try { localStorage.setItem(KEY, JSON.stringify(st)); } catch (e) { /* full or blocked */ }
    if (!quiet) emit(why || 'change');
  }
  // another tab or the pack machine changed it
  addEventListener('storage', e => { if (e.key === KEY) { st = read(); emit('sync'); } });

  // a card's identity in the binder: the same answer with a different finish or enchantment is a different card
  const cardKey = c => [c.name, c.prompt, c.finish || '', c.ench || '', c.full ? 1 : '', c.misprint ? 1 : '', c.first ? 1 : ''].join('|');
  const pack = c => ({ n: c.name, p: c.prompt, t: c.tier, f: c.finish || 0, e: c.ench || 0, fa: c.full ? 1 : 0, mp: c.misprint ? 1 : 0, fs: c.first ? 1 : 0, s: c.set, no: c.no, te: c.themeEmoji, tn: c.themeName, x: 1, at: Date.now() });
  const unpack = o => ({ name: o.n, prompt: o.p, tier: o.t, finish: o.f || null, foil: !!o.f, ench: o.e || null, full: !!o.fa, misprint: !!o.mp, first: !!o.fs, set: o.s, no: o.no, themeEmoji: o.te, themeName: o.tn, count: o.x || 1, at: o.at });

  // spores for a finished game: a little for showing up, more for points, a bonus per Obscura and for the day's first descent
  function reward(pts, obscuras, daily) { return Math.min(90, 3 + Math.round((pts || 0) / 15)) + 5 * (obscuras || 0) + (daily ? 10 : 0); }

  const Store = {
    PULL, KEY,
    get: () => st,
    spores: () => st.spores,
    packsReady: () => Math.floor(st.spores / PULL),
    on(f) { subs.add(f); return () => subs.delete(f); },
    // a game finished: pay out once per game key
    earn(key, pts, obscuras, daily, label) {
      if (!key || st.earned.includes(key)) return 0;
      const n = reward(pts, obscuras, daily);
      st.earned.push(key); if (st.earned.length > 60) st.earned = st.earned.slice(-60);
      st.spores += n; st.log.unshift({ at: Date.now(), n, why: label || 'game' }); st.log = st.log.slice(0, 20);
      save(false, 'earn');
      return n;
    },
    spend(n) { if (st.spores < n) return false; st.spores -= n; st.pulls++; save(false, 'spend'); return true; },
    add(n, why) { st.spores += n; if (why) { st.log.unshift({ at: Date.now(), n, why }); st.log = st.log.slice(0, 20); } save(false, 'add'); },
    setPity(n) { st.pity = n; save(true); },
    // returns true when it was already owned (a duplicate)
    own(c) { const k = cardKey(c), o = st.owned[k]; if (o) { o.x = (o.x || 1) + 1; save(true); return true; } st.owned[k] = pack(c); save(true); return false; },
    has: c => !!st.owned[cardKey(c)],
    cards: () => Object.values(st.owned).map(unpack),
    design(key) { if (st.designs[key]) return false; st.designs[key] = 1; save(true); return true; },
    designs: () => Object.keys(st.designs).length,
    // the card you show off in party rooms; its enchantment dresses up your game
    showcase: () => st.sc,
    // a: the card's art, c: its type, o: its odds, so the game can draw your equipped card without the pack machine's files
    setShowcase(c) { st.sc = c ? { n: c.name, p: c.prompt, t: c.tier, f: c.finish || 0, e: c.ench || 0, fa: c.full ? 1 : 0, em: c.emoji || '', a: c.art || '', c: c.cat || '', o: c.odds || 0, tn: c.themeName || '', s: c.set || '', no: c.no || 0 } : null; save(false, 'showcase'); },
    flush: () => emit('change'),
    // account.js: swap in or merge the copy saved with an account
    replace(next) { st = Object.assign(blank(), next || {}); try { localStorage.setItem(KEY, JSON.stringify(st)); } catch (e) { /* blocked */ } emit('sync'); },
    merge(a, b) {
      const m = Object.assign(blank(), a || {}); b = b || blank();
      m.spores = (a ? a.spores || 0 : 0) + (b.spores || 0); m.pulls = (m.pulls || 0) + (b.pulls || 0); m.pity = Math.max(m.pity || 0, b.pity || 0);
      m.owned = Object.assign({}, m.owned); for (const k in b.owned || {}) { if (m.owned[k]) m.owned[k].x = (m.owned[k].x || 1) + (b.owned[k].x || 1); else m.owned[k] = b.owned[k]; }
      m.designs = Object.assign({}, b.designs, m.designs); m.sc = m.sc || b.sc;
      m.earned = [...new Set([...(m.earned || []), ...(b.earned || [])])].slice(-60); m.log = [...(m.log || []), ...(b.log || [])].sort((x, y) => y.at - x.at).slice(0, 20);
      m.rev = Math.max(m.rev || 0, b.rev || 0) + 1; return m;
    },
    cardKey, unpack,
  };
  window.CardStore = Store;
})();
