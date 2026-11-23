// One full-screen particle layer shared by everything: bursts, sparks, rings, lightning, converging energy.
'use strict';
(function () {
  const cv = document.createElement('canvas'); cv.id = 'fxc'; document.body.append(cv);
  const g = cv.getContext('2d'); let W = 0, H = 0, dpr = 1;
  const size = () => { dpr = Math.min(2, devicePixelRatio || 1); W = innerWidth; H = innerHeight; cv.width = W * dpr; cv.height = H * dpr; cv.style.width = W + 'px'; cv.style.height = H + 'px'; g.setTransform(dpr, 0, 0, dpr, 0, 0); };
  size(); addEventListener('resize', size);
  const P = [], bolts = [];
  const rnd = (a, b) => a + Math.random() * (b - a);
  // p: { x, y, vx, vy, g (gravity), drag, life (s), size, color, kind: dot|spark|ring|star|glow, to: {x,y} (homing), grow }
  const add = p => { p.t = 0; p.life = p.life || 1; p.drag = p.drag ?? 0.985; P.push(p); };
  let last = performance.now();
  let blank = false;
  (function loop(now) {
    const dt = Math.min(0.05, (now - last) / 1000); last = now;
    // nothing to draw: leave the empty layer alone instead of wiping the whole screen every frame
    if (!P.length && !bolts.length) { if (!blank) { g.clearRect(0, 0, W, H); blank = true; } requestAnimationFrame(loop); return; }
    blank = false; g.clearRect(0, 0, W, H);
    for (let i = P.length - 1; i >= 0; i--) {
      const p = P[i]; p.t += dt; const k = 1 - p.t / p.life; if (k <= 0) { P.splice(i, 1); continue; }
      if (p.to) { const dx = p.to.x - p.x, dy = p.to.y - p.y, d = Math.hypot(dx, dy) || 1; p.vx += dx / d * (p.pull || 900) * dt; p.vy += dy / d * (p.pull || 900) * dt; if (d < 10) { P.splice(i, 1); continue; } }
      p.vx *= p.drag; p.vy *= p.drag; p.vy += (p.g || 0) * dt; p.x += p.vx * dt; p.y += p.vy * dt;
      g.globalAlpha = Math.max(0, Math.min(1, p.fade === false ? 1 : k * 1.4));
      if (p.kind === 'spark') { g.strokeStyle = p.color; g.lineWidth = p.size || 2; g.beginPath(); g.moveTo(p.x, p.y); g.lineTo(p.x - p.vx * 0.04, p.y - p.vy * 0.04); g.stroke(); }
      else if (p.kind === 'ring') { const r = (p.r0 || 10) + (p.grow || 600) * p.t; g.strokeStyle = p.color; g.lineWidth = Math.max(1, (p.size || 6) * k); g.beginPath(); g.arc(p.x, p.y, r, 0, 7); g.stroke(); }
      else if (p.kind === 'glow') { const r = (p.size || 40) * (p.grow ? 1 + p.t * p.grow : 1); const gr = g.createRadialGradient(p.x, p.y, 0, p.x, p.y, r); gr.addColorStop(0, p.color); gr.addColorStop(1, 'transparent'); g.fillStyle = gr; g.fillRect(p.x - r, p.y - r, r * 2, r * 2); }
      else if (p.kind === 'star') { const s = (p.size || 6) * (0.6 + 0.4 * Math.sin(p.t * 20)); g.fillStyle = p.color; g.fillRect(p.x - s / 2, p.y - 1, s, 2); g.fillRect(p.x - 1, p.y - s / 2, 2, s); }
      else { const s = p.size || 3; g.fillStyle = p.flick && Math.random() < 0.2 ? '#fff' : p.color; g.fillRect(p.x | 0, p.y | 0, s, s); }
    }
    g.globalAlpha = 1;
    // lightning: jagged lines that flicker for a moment
    for (let i = bolts.length - 1; i >= 0; i--) { const b = bolts[i]; b.t += dt; if (b.t > b.life) { bolts.splice(i, 1); continue; }
      g.globalAlpha = 1 - b.t / b.life; g.strokeStyle = b.color; g.shadowColor = b.color; g.shadowBlur = 14; g.lineWidth = 2; g.beginPath(); b.pts.forEach((q, j) => j ? g.lineTo(q[0], q[1]) : g.moveTo(q[0], q[1])); g.stroke();
      g.strokeStyle = '#fff'; g.lineWidth = 1; g.stroke(); g.shadowBlur = 0; }
    g.globalAlpha = 1;
    requestAnimationFrame(loop);
  })(last);
  const FX = {
    add,
    burst(x, y, color, n = 40, o = {}) { for (let i = 0; i < n; i++) { const a = Math.random() * Math.PI * 2, s = rnd(120, 520) * (o.power || 1); add({ x, y, vx: Math.cos(a) * s, vy: Math.sin(a) * s - (o.up || 80), g: o.g ?? 500, life: rnd(0.6, 1.3) * (o.life || 1), size: rnd(2, 5), color: Array.isArray(color) ? color[i % color.length] : color, flick: true, kind: o.kind }); } },
    sparks(x, y, color, n = 8, dir = 0, spread = Math.PI) { for (let i = 0; i < n; i++) { const a = dir + (Math.random() - 0.5) * spread, s = rnd(200, 600); add({ x, y, vx: Math.cos(a) * s, vy: Math.sin(a) * s, g: 900, life: rnd(0.2, 0.5), size: 2, color, kind: 'spark', drag: 0.96 }); } },
    ring(x, y, color, o = {}) { add({ x, y, vx: 0, vy: 0, kind: 'ring', color, life: o.life || 0.7, grow: o.grow || 700, size: o.size || 8, r0: o.r0 || 20, drag: 1 }); },
    glow(x, y, color, size = 200, life = 0.8, grow = 1) { add({ x, y, vx: 0, vy: 0, kind: 'glow', color, size, life, grow, drag: 1 }); },
    converge(x, y, color, n = 50, spread = 400) { for (let i = 0; i < n; i++) { const a = Math.random() * Math.PI * 2, d = rnd(spread * 0.6, spread); add({ x: x + Math.cos(a) * d, y: y + Math.sin(a) * d, vx: -Math.sin(a) * 120, vy: Math.cos(a) * 120, to: { x, y }, pull: rnd(700, 1300), life: 2, size: rnd(2, 4), color, drag: 0.93, fade: false }); } },
    rain(color, n = 120, life = 3) { for (let i = 0; i < n; i++) add({ x: Math.random() * W, y: -Math.random() * H * 0.6, vx: rnd(-30, 30), vy: rnd(80, 260), g: 60, life: life + Math.random(), size: rnd(2, 4), color: Array.isArray(color) ? color[i % color.length] : color, flick: true, drag: 1 }); },
    stars(rect, color, n = 20) { for (let i = 0; i < n; i++) add({ x: rect.left + Math.random() * rect.width, y: rect.top + Math.random() * rect.height, vx: 0, vy: -20, life: rnd(0.4, 1), size: rnd(5, 10), color, kind: 'star', drag: 1 }); },
    lightning(rect, color, n = 1) { for (let k = 0; k < n; k++) { const side = Math.floor(Math.random() * 4), pts = []; let x, y, tx, ty; const cx = rect.left + rect.width / 2, cy = rect.top + rect.height / 2;
      if (side === 0) { x = rect.left + Math.random() * rect.width; y = rect.top; } else if (side === 1) { x = rect.right; y = rect.top + Math.random() * rect.height; } else if (side === 2) { x = rect.left + Math.random() * rect.width; y = rect.bottom; } else { x = rect.left; y = rect.top + Math.random() * rect.height; }
      tx = x + (x - cx) * rnd(0.5, 1.4); ty = y + (y - cy) * rnd(0.5, 1.4);
      const steps = 8; for (let i = 0; i <= steps; i++) { const f = i / steps; pts.push([x + (tx - x) * f + (i && i < steps ? rnd(-14, 14) : 0), y + (ty - y) * f + (i && i < steps ? rnd(-14, 14) : 0)]); }
      bolts.push({ pts, color, life: rnd(0.12, 0.25), t: 0 }); } },
    clear() { P.length = 0; bolts.length = 0; },
  };
  window.FX = FX;
})();
