// Connects the game to your own Firebase project so rooms and the daily ranking work for anyone with the link.
// The game asks for window.claude.use('db'); here that hands back Firestore behind a thin wrapper.
// The wrapper exists because Firestore refuses lists inside lists, and a player's answers are stored as
// [[name, tier], ...]. Any document that contains one is saved as a single JSON string and unpacked on read.
(function () {
  var cfg = window.OBSCURA_FIREBASE || {};
  if (!cfg.projectId || !cfg.apiKey) return;            // not set up: solo, daily and packs only
  var V = 'https://www.gstatic.com/firebasejs/10.12.2/';
  function load(src) { return new Promise(function (ok, no) { var s = document.createElement('script'); s.src = src; s.onload = ok; s.onerror = no; document.head.appendChild(s); }); }

  function nested(v, inArr) {
    if (Array.isArray(v)) { if (inArr) return true; for (var i = 0; i < v.length; i++) if (nested(v[i], true)) return true; return false; }
    if (v && typeof v === 'object') { for (var k in v) if (nested(v[k], false)) return true; }
    return false;
  }
  function enc(d) { return nested(d, false) ? { j: JSON.stringify(d) } : d; }
  function dec(d) { if (d && typeof d.j === 'string' && Object.keys(d).length === 1) { try { return JSON.parse(d.j); } catch (e) { return d; } } return d; }
  function snap(s) { return { id: s.id, exists: s.exists, data: function () { return dec(s.data()); } }; }
  function query(q) { return { docs: q.docs.map(snap), fromCache: !!(q.metadata && q.metadata.fromCache) }; }
  function doc(ref) {
    return {
      id: ref.id,
      get: function () { return ref.get().then(snap); },
      set: function (d) { return ref.set(enc(d)); },
      update: function (d) { return ref.update(d); },
      delete: function () { return ref.delete(); },
      onSnapshot: function (cb, err) { return ref.onSnapshot(function (s) { cb(snap(s)); }, err); },
      collection: function (n) { return col(ref.collection(n)); }
    };
  }
  function col(c) {
    return {
      doc: function (id) { return doc(c.doc(id)); },
      get: function () { return c.get().then(query); },
      limit: function (n) { return col(c.limit(n)); },
      onSnapshot: function (cb, err) { return c.onSnapshot(function (q) { cb(query(q)); }, err); }
    };
  }

  var ready = load(V + 'firebase-app-compat.js').then(function () { return load(V + 'firebase-firestore-compat.js'); }).then(function () {
    firebase.initializeApp(cfg);
    var fs = firebase.firestore();
    // school and office networks often block the live streaming connection; detect that and fall back to one that works
    try { fs.settings({ experimentalAutoDetectLongPolling: true, merge: true }); } catch (e) { /* settings already fixed */ }
    return { doc: function (p) { return doc(fs.doc(p)); }, collection: function (p) { return col(fs.collection(p)); } };
  });
  window.claude = { use: function (what) { return what === 'db' ? ready : Promise.resolve(null); } };
})();
