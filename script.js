(function () {
  'use strict';
  var S = window.SITE, root = document.documentElement;
  root.classList.add('js');

  // ---- Analytics (GoatCounter: cookieless, no consent banner needed) ----
  // GoatCounter site code (dashboard: https://kunalswami18.goatcounter.com).
  var GOATCOUNTER_CODE = 'kunalswami18';
  if (GOATCOUNTER_CODE) {
    var g = document.createElement('script');
    g.async = true;
    g.src = 'https://gc.zgo.at/count.js';
    g.dataset.goatcounter = 'https://' + GOATCOUNTER_CODE + '.goatcounter.com/count';
    document.head.appendChild(g);
  }

  function esc(s) { return String(s).replace(/[&<>"]/g, function (c) { return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]; }); }
  function $(id) { return document.getElementById(id); }

  // ---- About ----
  $('skills').innerHTML = S.skills.map(function (s) { return '<div><dt>' + esc(s[0]) + '</dt><dd>' + esc(s[1]) + '</dd></div>'; }).join('');
  $('service').innerHTML = S.service.map(function (s) { return '<div><dt>' + esc(s[0]) + '</dt><dd>' + esc(s[1]) + '</dd></div>'; }).join('');
  $('education').innerHTML = S.education.map(function (e) {
    return '<li><strong>' + esc(e.school) + '</strong><span class="deg">' + esc(e.deg) + '</span>' +
      e.lines.map(function (l) { return '<p>' + esc(l) + '</p>'; }).join('') + '</li>';
  }).join('');

  // ---- Experience ----
  $('experienceList').innerHTML = S.experience.map(function (o) {
    return '<div class="org"><div class="org-head"><h4>' + esc(o.org) + '</h4><a href="' + esc(o.url) + '" rel="noopener">website ↗</a></div>' +
      o.roles.map(function (r) {
        return '<div class="role"><div class="role-meta"><strong>' + esc(r.title) + '</strong><span>' + esc(r.dates) + '</span></div><ul>' +
          r.points.map(function (p) { return '<li><b>' + esc(p[0]) + '.</b> ' + esc(p[1]) + '</li>'; }).join('') + '</ul></div>';
      }).join('') + '</div>';
  }).join('');

  // ---- Publications ----
  function authors(a) { return esc(a).replace(/Kunal Swami/g, '<b>Kunal Swami</b>'); }
  function venueYear(v) { var m = v.match(/(20\d\d)/); return m ? m[1] : 'Other'; }
  var ICON = {
    trophy: '<svg viewBox="0 0 24 24" width="13" height="13" fill="currentColor" aria-hidden="true"><path d="M7 3h10v2h3v3a4 4 0 0 1-4 4h-.3A5 5 0 0 1 13 14.9V17h3v2H8v-2h3v-2.1A5 5 0 0 1 8.3 12H8a4 4 0 0 1-4-4V5h3V3Zm-1 4v1a2 2 0 0 0 2 2V7H6Zm12 0h-2v3a2 2 0 0 0 2-2V7Z"/></svg>',
    star: '<svg viewBox="0 0 24 24" width="13" height="13" fill="currentColor" aria-hidden="true"><path d="m12 2 3 6.6 7.2.8-5.4 4.9 1.5 7.1L12 17.7 5.7 21.4l1.5-7.1L1.8 9.4 9 8.6 12 2Z"/></svg>'
  };
  function badge(x) {
    var star = /\boral\b/i.test(x);
    return '<span class="badge' + (star ? '' : ' gold') + '">' + (star ? ICON.star : ICON.trophy) + esc(x) + '</span>';
  }
  function renderPubs(list, byYear) {
    var out = '', last = null;
    list.forEach(function (p) {
      var y = /under review/i.test(p.venue) ? 'Under review' : venueYear(p.venue);
      if (byYear && y !== last) { out += '<div class="year">' + esc(y) + '</div>'; last = y; }
      var title = p.url ? '<a class="t" href="' + esc(p.url) + '" rel="noopener">' + esc(p.title) + '</a>' : '<span class="t">' + esc(p.title) + '</span>';
      out += '<article class="pub"><div class="id">' + esc(p.id) + '</div><div>' + title +
        '<div class="au">' + authors(p.authors) + '</div><div class="ve">' + esc(p.venue) + '</div>' +
        (p.extras.length ? '<div class="badges">' + p.extras.map(badge).join('') + '</div>' : '') + '</div></article>';
    });
    return out;
  }
  $('paperCount').textContent = S.pubs.length;
  $('patentCount').textContent = S.patents.length;
  $('scholarLink').href = S.links.scholar;
  $('pubList').innerHTML = renderPubs(S.pubs, true);
  $('patentList').innerHTML = renderPubs(S.patents, false);

  // ---- Honors & awards ----
  var HSHOW = 8, hOpen = false;
  function honorYear(h) { var m = h.date.match(/(\d{4})/); return m ? m[1] : ''; }
  function renderHonors() {
    var out = '', last = null;
    S.honors.forEach(function (h, i) {
      if (!hOpen && i >= HSHOW) return;
      var y = honorYear(h);
      if (y !== last) { out += '<div class="year">' + esc(y) + '</div>'; last = y; }
      out += '<article class="honor"><div class="hd">' + esc(h.date.replace(/\s*\d{4}/, '')) + '</div><div><div class="t">' + esc(h.title) + '</div>' +
        '<div class="ve">' + esc(h.org) + '</div>' +
        h.text.map(function (t) { return '<p>' + esc(t) + '</p>'; }).join('') + '</div></article>';
    });
    $('honorList').innerHTML = out;
    $('honorMore').textContent = hOpen ? 'Show fewer' : 'Show all ' + S.honors.length + ' honors & awards';
  }
  renderHonors();
  $('honorMore').addEventListener('click', function () {
    hOpen = !hOpen; renderHonors();
    if (!hOpen) $('honors').scrollIntoView();
  });

  // ---- News ----
  var NSHOW = 6, nOpen = false;
  function renderNews() {
    $('newsList').innerHTML = S.news.slice(0, nOpen ? S.news.length : NSHOW).map(function (n) { return '<li><time>' + esc(n[0]) + '</time><span>' + n[1] + '</span></li>'; }).join('');
    $('newsMore').textContent = nOpen ? 'Show fewer' : 'Show all ' + S.news.length + ' updates';
  }
  renderNews();
  $('newsMore').addEventListener('click', function () { nOpen = !nOpen; renderNews(); if (!nOpen) $('news').scrollIntoView(); });

  // ---- Contact ----
  var icons = {
    scholar: '<path d="M12 3 1 9l4 2.2V16c0 2.2 3.1 4 7 4s7-1.8 7-4v-4.8l2-1.1V16h2V9L12 3Zm0 5.2L17.6 9 12 11.8 6.4 9 12 8.2ZM7 13l5 2.7 5-2.7v2.9c0 .8-2 2-5 2s-5-1.2-5-2V13Z"/>',
    github: '<path d="M12 .5a11.5 11.5 0 0 0-3.6 22.4c.6.1.8-.3.8-.6v-2c-3.2.7-3.9-1.5-3.9-1.5-.5-1.3-1.3-1.7-1.3-1.7-1-.7.1-.7.1-.7 1.2.1 1.8 1.2 1.8 1.2 1 1.8 2.7 1.3 3.4 1 .1-.8.4-1.3.7-1.6-2.6-.3-5.3-1.3-5.3-5.7 0-1.3.5-2.3 1.2-3.1-.1-.3-.5-1.5.1-3.1 0 0 1-.3 3.2 1.2a11 11 0 0 1 5.8 0c2.2-1.5 3.2-1.2 3.2-1.2.6 1.6.2 2.8.1 3.1.8.8 1.2 1.8 1.2 3.1 0 4.4-2.7 5.4-5.3 5.7.4.4.8 1.1.8 2.2v3.3c0 .3.2.7.8.6A11.5 11.5 0 0 0 12 .5Z"/>',
    linkedin: '<path d="M20.4 20.5h-3.6v-5.6c0-1.3 0-3-1.8-3s-2.1 1.4-2.1 2.9v5.7H9.3V9h3.4v1.6c.5-.9 1.6-1.8 3.4-1.8 3.6 0 4.3 2.4 4.3 5.5v6.2ZM5.3 7.4a2.1 2.1 0 1 1 0-4.2 2.1 2.1 0 0 1 0 4.2Zm1.8 13.1H3.6V9h3.5v11.5Z"/>',
    orcid: '<path d="M12 0a12 12 0 1 0 0 24 12 12 0 0 0 0-24ZM7.4 18.4H5.6V8.2h1.8v10.2Zm-.9-11.5a1.1 1.1 0 1 1 0-2.2 1.1 1.1 0 0 1 0 2.2Zm11 7.2c0 2.6-1.9 4.3-4.9 4.3H9.4V8.2h3.4c3 0 4.7 1.7 4.7 4.2v1.7ZM12.9 9.8h-1.7v7h1.7c2 0 3-1.1 3-3.3 0-1.6-.9-3.7-3-3.7Z"/>',
    x: '<path d="M18.2 2.3h3.3l-7.2 8.3 8.5 11.2h-6.7l-5.2-6.8-6 6.8H1.6l7.7-8.8L1.2 2.3h6.8l4.7 6.2 5.5-6.2Zm-1.2 17.5h1.8L7.1 4.2H5.1L17 19.8Z"/>'
  };
  var names = { scholar: 'Google Scholar', github: 'GitHub', orcid: 'ORCID', linkedin: 'LinkedIn', x: 'X' };
  $('social').innerHTML = Object.keys(names).map(function (k) {
    return '<li><a href="' + esc(S.links[k]) + '" rel="noopener me"><svg viewBox="0 0 24 24" aria-hidden="true">' + icons[k] + '</svg>' + names[k] + '</a></li>';
  }).join('');
  $('emailBtn').addEventListener('click', function () {
    var addr = atob(S.emailB64);
    $('emailOut').innerHTML = '<a href="mailto:' + addr + '">' + addr + '</a>';
    this.hidden = true;
  });
  $('year').textContent = new Date().getFullYear();

  // ---- Theme toggle (dark default) ----
  $('themeBtn').addEventListener('click', function () {
    var next = root.dataset.theme === 'light' ? 'dark' : 'light';
    root.dataset.theme = next;
    try { localStorage.setItem('theme', next); } catch (e) {}
    document.querySelector('meta[name=theme-color]').content = next === 'light' ? '#f6f7fb' : '#0a0b10';
  });

  // ---- Nav: shadow on scroll + active section ----
  var nav = $('nav');
  window.addEventListener('scroll', function () { nav.classList.toggle('scrolled', window.scrollY > 8); }, { passive: true });
  var links = {};
  document.querySelectorAll('.nav nav a').forEach(function (a) { links[a.getAttribute('href').slice(1)] = a; });

  if ('IntersectionObserver' in window) {
    var spy = new IntersectionObserver(function (es) {
      es.forEach(function (e) {
        if (e.isIntersecting) {
          Object.keys(links).forEach(function (k) { links[k].classList.toggle('active', k === e.target.id); });
        }
      });
    }, { rootMargin: '-45% 0px -50% 0px' });
    document.querySelectorAll('main section[id]').forEach(function (s) { spy.observe(s); });

    var rev = new IntersectionObserver(function (es) {
      es.forEach(function (e) { if (e.isIntersecting) { e.target.classList.add('in'); rev.unobserve(e.target); } });
    }, { rootMargin: '0px 0px -8% 0px', threshold: 0.05 });
    document.querySelectorAll('.reveal').forEach(function (el) { rev.observe(el); });
  } else {
    document.querySelectorAll('.reveal').forEach(function (el) { el.classList.add('in'); });
  }

  // ---- Cursor-reactive effects: spotlight, neural-net particles, portrait tilt ----
  (function () {
    if (matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    var cv = $('net'), ctx = cv.getContext('2d');
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
        var r = portrait.getBoundingClientRect();
        if (r.bottom > 0 && r.top < innerHeight) {
          var nx = Math.max(-1, Math.min(1, (mx - (r.left + r.width / 2)) / (innerWidth / 2)));
          var ny = Math.max(-1, Math.min(1, (my - (r.top + r.height / 2)) / (innerHeight / 2)));
          tilt.style.transform = 'rotateY(' + (nx * 12).toFixed(2) + 'deg) rotateX(' + (-ny * 10).toFixed(2) + 'deg)';
        }
      });
    }
    function onLeave() { mouse.x = mouse.y = -1e4; tilt.style.transform = ''; }

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
