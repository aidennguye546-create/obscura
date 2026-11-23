// Accounts: everyone is signed in automatically as a guest, so their spores and cards are kept with them.
// Picking a username and password turns that guest into a real account they can log in to on another device.
// Usernames become a made-up email address behind the scenes, because Firebase signs people in by email.
'use strict';
(function () {
  const DOMAIN = '@players.playobscura.app';
  const A = { state: 'wait', name: null, uid: null, why: '' };
  const subs = new Set();
  const emit = () => subs.forEach(f => { try { f(A); } catch (e) { /* listener failed */ } });
  const set = (state, extra) => { Object.assign(A, { state }, extra || {}); emit(); };
  let fb = null, auth = null, fs = null, ref = null, joining = false, pushT = 0, lastPushed = -1, offline = false;

  const clean = s => String(s || '').trim().toLowerCase();
  const okName = s => /^[a-z0-9_]{3,16}$/.test(s);
  const MSG = {
    'auth/email-already-in-use': 'That username is taken.',
    'auth/credential-already-in-use': 'That username is taken.',
    'auth/invalid-credential': 'Wrong username or password.',
    'auth/wrong-password': 'Wrong username or password.',
    'auth/user-not-found': 'Wrong username or password.',
    'auth/invalid-login-credentials': 'Wrong username or password.',
    'auth/weak-password': 'Passwords need at least 6 characters.',
    'auth/too-many-requests': 'Too many tries. Wait a minute and try again.',
    'auth/network-request-failed': 'No connection. Try again in a moment.',
    'auth/operation-not-allowed': 'Accounts are not switched on yet. Your cards are still saved in this browser.',
    'auth/configuration-not-found': 'Accounts are not switched on yet. Your cards are still saved in this browser.',
    'auth/admin-restricted-operation': 'Accounts are not switched on yet. Your cards are still saved in this browser.',
  };
  const say = e => MSG[e && e.code] || 'That did not work. Try again.';

  // the saved copy: one document per account, holding the whole state as text
  async function pull() {
    if (!ref) return null;
    try { const s = await ref.get(); offline = false; return s.exists && typeof s.data().d === 'string' ? JSON.parse(s.data().d) : null; }
    catch (e) { offline = true; return undefined; } // not allowed (rules not published) or no connection: carry on locally
  }
  function push(now) {
    clearTimeout(pushT);
    const go = () => { if (!ref || offline) return; const st = CardStore.get(); if (st.rev === lastPushed || st.uid !== A.uid) return; lastPushed = st.rev;
      ref.set({ d: JSON.stringify(st), at: Date.now(), name: A.name || '' }).catch(() => { lastPushed = -1; }); };
    if (now) go(); else pushT = setTimeout(go, 1500);
  }
  CardStore.on((st, why) => { if (why !== 'sync' && A.uid) push(); });
  addEventListener('pagehide', () => push(true));
  // coming back to the tab: another device may have played since
  document.addEventListener('visibilitychange', async () => {
    if (document.hidden) return push(true);
    if (!A.uid || joining) return; const r = await pull(), st = CardStore.get();
    if (r && r.rev > st.rev && st.uid === A.uid) CardStore.replace(r);
  });

  async function adopt(user, merge) {
    joining = true;
    A.uid = user.uid; A.name = user.isAnonymous ? null : (user.email || '').split('@')[0];
    ref = fs.doc('users/' + user.uid);
    const remote = await pull(), local = CardStore.get();
    if (remote === undefined) { /* cannot reach the saved copy: keep playing on what is here */ if (!local.uid) CardStore.replace(Object.assign({}, local, { uid: user.uid })); }
    else if (local.uid === user.uid) { if (remote && remote.rev > local.rev) CardStore.replace(remote); }
    else if (!local.uid || merge) CardStore.replace(Object.assign(CardStore.merge(remote, local), { uid: user.uid }));
    else CardStore.replace(Object.assign(remote || {}, { uid: user.uid })); // a different account was here before: show this one's
    joining = false; lastPushed = -1; push(true);
    set(user.isAnonymous ? 'guest' : 'user', { why: offline ? 'saved in this browser for now' : '' });
  }

  let merging = false;
  (window.fbReady || Promise.reject()).then(f => {
    fb = f; if (!fb.auth) throw new Error('no auth');
    auth = fb.auth(); fs = fb.firestore();
    auth.onAuthStateChanged(u => {
      if (!u) { auth.signInAnonymously().catch(e => { A.code = e && e.code; set('off', { why: say(e) }); }); return; }
      const m = merging; merging = false; adopt(u, m);
    });
  }).catch(() => set('off', { why: 'Saved in this browser.' }));

  Object.assign(A, {
    on(f) { subs.add(f); f(A); return () => subs.delete(f); },
    okName,
    // turn the guest into a named account, keeping everything
    async create(name, pw) {
      name = clean(name); if (!okName(name)) throw new Error('Usernames are 3 to 16 letters, numbers or _.');
      if (!auth) throw new Error(A.why || 'Accounts are not available right now.');
      const cred = fb.auth.EmailAuthProvider.credential(name + DOMAIN, pw);
      try {
        if (auth.currentUser && auth.currentUser.isAnonymous) { const r = await auth.currentUser.linkWithCredential(cred); await adopt(r.user, false); }
        else { merging = true; await auth.createUserWithEmailAndPassword(name + DOMAIN, pw); }
      } catch (e) { merging = false; throw new Error(say(e)); }
    },
    // log in elsewhere: what this browser earned as a guest is added to the account
    async login(name, pw) {
      name = clean(name); if (!okName(name)) throw new Error('Wrong username or password.');
      if (!auth) throw new Error(A.why || 'Accounts are not available right now.');
      push(true); merging = true;
      try { await auth.signInWithEmailAndPassword(name + DOMAIN, pw); } catch (e) { merging = false; throw new Error(say(e)); }
    },
    async logout() { if (!auth) return; push(true); await auth.signOut(); },
  });
  window.Account = A;
})();
