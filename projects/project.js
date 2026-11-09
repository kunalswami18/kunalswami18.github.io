(function () {
  'use strict';
  var root = document.documentElement;
  function $(s) { return document.querySelector(s); }

  // Theme toggle (shared with the main site)
  var btn = $('#themeBtn');
  if (btn) btn.addEventListener('click', function () {
    var next = root.dataset.theme === 'light' ? 'dark' : 'light';
    root.dataset.theme = next;
    try { localStorage.setItem('theme', next); } catch (e) {}
  });

  // Nav shadow, spotlight, reveal
  var nav = $('#nav');
  window.addEventListener('scroll', function () { nav.classList.toggle('scrolled', window.scrollY > 8); }, { passive: true });
  root.classList.add('js');
  if ('IntersectionObserver' in window) {
    var io = new IntersectionObserver(function (es) {
      es.forEach(function (e) { if (e.isIntersecting) { e.target.classList.add('in'); io.unobserve(e.target); } });
    }, { rootMargin: '0px 0px -8% 0px', threshold: 0.04 });
    document.querySelectorAll('.reveal').forEach(function (el) { io.observe(el); });
  } else {
    document.querySelectorAll('.reveal').forEach(function (el) { el.classList.add('in'); });
  }

  // Click-to-zoom figures
  var lb = document.createElement('div'); lb.className = 'lightbox'; lb.innerHTML = '<img alt="">';
  document.body.appendChild(lb);
  document.querySelectorAll('.pp figure img').forEach(function (img) {
    img.addEventListener('click', function () { lb.firstChild.src = img.src; lb.firstChild.alt = img.alt; lb.classList.add('on'); });
  });
  lb.addEventListener('click', function () { lb.classList.remove('on'); });
  document.addEventListener('keydown', function (e) { if (e.key === 'Escape') lb.classList.remove('on'); });

  // Copy BibTeX
  var cp = $('#copyBib');
  if (cp) cp.addEventListener('click', function () {
    var t = $('#bibtex').textContent;
    (navigator.clipboard ? navigator.clipboard.writeText(t) : Promise.reject()).then(function () { cp.textContent = 'Copied'; }, function () {
      var r = document.createRange(); r.selectNodeContents($('#bibtex')); var s = getSelection(); s.removeAllRanges(); s.addRange(r); cp.textContent = 'Press Cmd/Ctrl+C';
    });
    setTimeout(function () { cp.textContent = 'Copy'; }, 2200);
  });
})();
