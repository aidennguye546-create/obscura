// Connects the game to your own Firebase project so rooms and the daily ranking work for anyone with the link.
// The game asks for window.claude.use('db'); here that hands back Firestore, which speaks the same calls.
(function () {
  var cfg = window.OBSCURA_FIREBASE || {};
  if (!cfg.projectId || !cfg.apiKey) return;            // not set up: solo, daily and packs only
  var V = 'https://www.gstatic.com/firebasejs/10.12.2/';
  function load(src) { return new Promise(function (ok, no) { var s = document.createElement('script'); s.src = src; s.onload = ok; s.onerror = no; document.head.appendChild(s); }); }
  var ready = load(V + 'firebase-app-compat.js').then(function () { return load(V + 'firebase-firestore-compat.js'); }).then(function () {
    firebase.initializeApp(cfg);
    return firebase.firestore();
  });
  window.claude = { use: function (what) { return what === 'db' ? ready : Promise.resolve(null); } };
})();
