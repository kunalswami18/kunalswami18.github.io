/* Cursor-reactive background: spotlight, neural-net particles and portrait tilt.
   Shared by the homepage and the project pages. Off for reduced-motion users. */
(function () {
  'use strict';
  var root = document.documentElement;
  function $(id) { return document.getElementById(id); }
  // ---- Cursor-reactive effects: spotlight, neural-net particles, portrait tilt ----
  (function () {
    if (matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    var cv = $('net'); if (!cv) return; var ctx = cv.getContext('2d');
    var W, H, dpr, pts = [], mouse = { x: -1e4, y: -1e4 }, ca, cb, raf = 0;
    var R = 170; // cursor influence radius, px

    function colors() {
      var cs = getComputedStyle(root);
      ca = cs.getPropertyValue('--accent').trim(); cb = cs.getPropertyValue('--accent-2').trim();
    }
    function resize() {
      dpr = Math.min(window.devicePixelRatio || 1, 2); W = innerWidth; H = innerHeight;
      cv.width = W * dpr; cv.height = H * dpr; ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      var n = Math.min(95, Math.round(W * H / 15000)); pts = [];
      for (var i = 0; i < n; i++) {
        var a = Math.random() * 6.283, sp = .12 + Math.random() * .22;
        pts.push({ x: Math.random() * W, y: Math.random() * H, bx: Math.cos(a) * sp, by: Math.sin(a) * sp, vx: 0, vy: 0, r: 1 + Math.random() * 1.5 });
      }
    }
    function frame() {
      ctx.clearRect(0, 0, W, H);
      var i, j, p, q, dx, dy, d, f, link = 120;
      for (i = 0; i < pts.length; i++) {
        p = pts[i];
        dx = mouse.x - p.x; dy = mouse.y - p.y; d = Math.sqrt(dx * dx + dy * dy);
        if (d < R && d > 1) { f = (1 - d / R) * .06; p.vx += dx / d * f; p.vy += dy / d * f; }
        p.vx += (p.bx - p.vx) * .02; p.vy += (p.by - p.vy) * .02;
        p.x += p.vx; p.y += p.vy;
        if (p.x < -10) p.x = W + 10; else if (p.x > W + 10) p.x = -10;
        if (p.y < -10) p.y = H + 10; else if (p.y > H + 10) p.y = -10;
      }
      ctx.lineWidth = 1;
      for (i = 0; i < pts.length; i++) {
        p = pts[i];
        for (j = i + 1; j < pts.length; j++) {
          q = pts[j]; dx = p.x - q.x; dy = p.y - q.y; d = dx * dx + dy * dy;
          if (d < link * link) { ctx.globalAlpha = (1 - Math.sqrt(d) / link) * .28; ctx.strokeStyle = ca; ctx.beginPath(); ctx.moveTo(p.x, p.y); ctx.lineTo(q.x, q.y); ctx.stroke(); }
        }
        dx = p.x - mouse.x; dy = p.y - mouse.y; d = Math.sqrt(dx * dx + dy * dy);
        if (d < R) { ctx.globalAlpha = (1 - d / R) * .75; ctx.strokeStyle = cb; ctx.beginPath(); ctx.moveTo(p.x, p.y); ctx.lineTo(mouse.x, mouse.y); ctx.stroke(); }
        ctx.globalAlpha = .65; ctx.fillStyle = d < R ? cb : ca; ctx.beginPath(); ctx.arc(p.x, p.y, p.r, 0, 6.283); ctx.fill();
      }
      raf = requestAnimationFrame(frame);
    }

    var tilt = document.querySelector('.portrait .tilt'), portrait = document.querySelector('.portrait'), tick = false, mx = 0, my = 0;
    function onMove(e) {
      mouse.x = e.clientX; mouse.y = e.clientY; mx = e.clientX; my = e.clientY;
      if (tick) return; tick = true;
      requestAnimationFrame(function () {
        tick = false;
        root.style.setProperty('--mx', mx + 'px'); root.style.setProperty('--my', my + 'px');
        var r = portrait && portrait.getBoundingClientRect();
        if (r && r.bottom > 0 && r.top < innerHeight) {
          var nx = Math.max(-1, Math.min(1, (mx - (r.left + r.width / 2)) / (innerWidth / 2)));
          var ny = Math.max(-1, Math.min(1, (my - (r.top + r.height / 2)) / (innerHeight / 2)));
          tilt.style.transform = 'rotateY(' + (nx * 12).toFixed(2) + 'deg) rotateX(' + (-ny * 10).toFixed(2) + 'deg)';
        }
      });
    }
    function onLeave() { mouse.x = mouse.y = -1e4; if (tilt) tilt.style.transform = ''; }

    colors(); resize(); frame();
    window.addEventListener('pointermove', onMove, { passive: true });
    document.addEventListener('pointerleave', onLeave);
    window.addEventListener('blur', onLeave);
    window.addEventListener('resize', resize);
    new MutationObserver(colors).observe(root, { attributes: true, attributeFilter: ['data-theme'] });
    document.addEventListener('visibilitychange', function () {
      if (document.hidden) cancelAnimationFrame(raf); else { cancelAnimationFrame(raf); frame(); }
    });
  })();
})();
