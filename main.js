(function () {
  var root = document.documentElement;
  root.classList.add('js');
  var reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  var $ = function (s) { return Array.prototype.slice.call(document.querySelectorAll(s)); };

  function countUp(el) {
    var target = parseFloat(el.getAttribute('data-count')) || 0;
    if (reduce) { el.textContent = target; return; }
    var start = null, dur = 1500;
    function tick(t) {
      if (start === null) start = t;
      var p = Math.min((t - start) / dur, 1);
      var eased = 1 - Math.pow(1 - p, 3);
      el.textContent = Math.round(target * eased);
      if (p < 1) requestAnimationFrame(tick);
    }
    el.textContent = 0;
    requestAnimationFrame(tick);
  }

  // one-time reveals: diagrams drawing, notes, stat, timeline, footer mark
  var targets = $('[data-reveal]');
  var counters = $('[data-count]');
  if (reduce || !('IntersectionObserver' in window)) {
    targets.forEach(function (el) { el.classList.add('in'); });
    counters.forEach(countUp);
  } else {
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (e) {
        if (!e.isIntersecting) return;
        e.target.classList.add('in');
        e.target.querySelectorAll('[data-count]').forEach(countUp);
        io.unobserve(e.target);
      });
    }, { threshold: 0.3, rootMargin: '0px 0px -6% 0px' });
    targets.forEach(function (el) { io.observe(el); });
    // the .steps diagram is not marked data-reveal separately from .diagram; observe it too
    $('.diagram:not([data-reveal])').forEach(function (el) { io.observe(el); });
  }

  // page load sequence
  function start() { root.classList.add('loaded'); }
  if (reduce) { start(); } else { requestAnimationFrame(function () { setTimeout(start, 80); }); }

  // hero mark: the three pieces drift apart as the hero scrolls away
  var hero = document.querySelector('.hero');
  var ticking = false;
  function onScroll() {
    if (ticking) return;
    ticking = true;
    requestAnimationFrame(function () {
      if (hero && !reduce) {
        var h = hero.offsetHeight || 1;
        var p = Math.max(0, Math.min(window.scrollY / h, 1));
        hero.style.setProperty('--hp', p.toFixed(3));
      }
      ticking = false;
    });
  }
  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();

  // nav: mark the section you are in
  var links = $('.navlinks a');
  var map = {};
  links.forEach(function (a) { map[a.getAttribute('href').slice(1)] = a; });
  if ('IntersectionObserver' in window) {
    var nav = new IntersectionObserver(function (entries) {
      entries.forEach(function (e) {
        var a = map[e.target.id];
        if (!a) return;
        if (e.isIntersecting) {
          links.forEach(function (l) { l.classList.remove('on'); });
          a.classList.add('on');
        }
      });
    }, { rootMargin: '-45% 0px -50% 0px' });
    Object.keys(map).forEach(function (id) {
      var el = document.getElementById(id);
      if (el) nav.observe(el);
    });
  }

  // grid glow follows a fine pointer
  var glow = document.querySelector('.gridglow');
  if (glow && !reduce && window.matchMedia('(pointer: fine)').matches) {
    window.addEventListener('pointermove', function (e) {
      var r = glow.getBoundingClientRect();
      glow.style.setProperty('--mx', (e.clientX - r.left) + 'px');
      glow.style.setProperty('--my', e.clientY + 'px');
    }, { passive: true });
  }
})();
