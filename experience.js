/* ============================================
   Technovate — Premium Experience Layer
   Awwwards-inspired: smooth scroll, reveals,
   custom cursor, loader, magnetic interactions
   ============================================ */
(function () {
  'use strict';

  var reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  var finePointer = window.matchMedia('(pointer: fine)').matches;

  /* ---- Inject global UI chrome ---- */
  function injectChrome() {
    if (!document.querySelector('.page-loader')) {
      var loader = document.createElement('div');
      loader.className = 'page-loader';
      loader.innerHTML =
        '<div class="page-loader__inner">' +
          '<div class="page-loader__logo">Technovate</div>' +
          '<div class="page-loader__bar"><span></span></div>' +
        '</div>';
      document.body.prepend(loader);
    }

    if (!document.querySelector('.scroll-progress')) {
      var bar = document.createElement('div');
      bar.className = 'scroll-progress';
      bar.innerHTML = '<span class="scroll-progress__fill"></span>';
      document.body.prepend(bar);
    }

    if (!document.querySelector('.grain')) {
      var grain = document.createElement('div');
      grain.className = 'grain';
      grain.setAttribute('aria-hidden', 'true');
      document.body.appendChild(grain);
    }

    if (finePointer && !reduced && !document.querySelector('.cursor-dot')) {
      var dot = document.createElement('div');
      dot.className = 'cursor-dot';
      var ring = document.createElement('div');
      ring.className = 'cursor-ring';
      document.body.appendChild(dot);
      document.body.appendChild(ring);
    }
  }

  /* ---- Page loader ---- */
  function initLoader() {
    var loader = document.querySelector('.page-loader');
    if (!loader) return;

    if (reduced) {
      loader.remove();
      document.body.classList.add('is-loaded');
      return;
    }

    var bar = loader.querySelector('.page-loader__bar span');
    var progress = 0;
    var tick = setInterval(function () {
      progress = Math.min(progress + 8 + Math.random() * 12, 92);
      if (bar) bar.style.width = progress + '%';
    }, 60);

    function finish() {
      clearInterval(tick);
      if (bar) bar.style.width = '100%';
      loader.classList.add('page-loader--done');
      document.body.classList.add('is-loaded');
      setTimeout(function () { loader.remove(); }, 700);
    }

    if (document.readyState === 'complete') {
      setTimeout(finish, 400);
    } else {
      window.addEventListener('load', function () { setTimeout(finish, 350); });
      setTimeout(finish, 2200);
    }
  }

  /* ---- Smooth scroll (Lenis) ---- */
  function initSmoothScroll() {
    if (reduced || typeof Lenis === 'undefined') return null;

    var lenis = new Lenis({
      duration: 1.15,
      easing: function (t) { return Math.min(1, 1.001 - Math.pow(2, -10 * t)); },
      smoothWheel: true,
      touchMultiplier: 1.4
    });

    function raf(time) {
      lenis.raf(time);
      requestAnimationFrame(raf);
    }
    requestAnimationFrame(raf);

    document.querySelectorAll('a[href^="#"]').forEach(function (a) {
      a.addEventListener('click', function (e) {
        var id = a.getAttribute('href');
        if (id.length < 2) return;
        var target = document.querySelector(id);
        if (target) {
          e.preventDefault();
          lenis.scrollTo(target, { offset: -80 });
        }
      });
    });

    return lenis;
  }

  /* ---- Scroll progress ---- */
  function initScrollProgress() {
    var fill = document.querySelector('.scroll-progress__fill');
    if (!fill) return;

    function update() {
      var h = document.documentElement.scrollHeight - window.innerHeight;
      var p = h > 0 ? window.scrollY / h : 0;
      fill.style.transform = 'scaleX(' + p + ')';
    }

    window.addEventListener('scroll', update, { passive: true });
    update();
  }

  /* ---- Header: shrink + dark mode ---- */
  function initHeader() {
    var header = document.querySelector('.header');
    if (!header) return;

    var darkZones = document.querySelectorAll(
      '.hero-immersive, .page-header-immersive, .section--dark, .footer'
    );

    function onScroll() {
      header.classList.toggle('header--scrolled', window.scrollY > 40);
    }

    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll();

    if ('IntersectionObserver' in window) {
      var io = new IntersectionObserver(function (entries) {
        entries.forEach(function (e) {
          if (e.isIntersecting && e.intersectionRatio > 0.15) {
            var isDark = e.target.matches('.hero-immersive, .page-header-immersive, .section--dark, .footer');
            header.classList.toggle('header--dark', isDark);
          }
        });
      }, { rootMargin: '-80px 0px -70% 0px', threshold: [0, 0.15, 0.5] });

      darkZones.forEach(function (z) { io.observe(z); });
    }

    if (document.querySelector('.hero-immersive, .page-header-immersive')) {
      header.classList.add('header--dark');
    }
  }

  /* ---- Scroll reveals ---- */
  function initReveals() {
    var targets = document.querySelectorAll(
      '.section-title, .section-lead, .section-head, .card, .sector-card, ' +
      '.project-card, .value-item, .solution-block, .cta-banner, .stat-item, ' +
      '.content-block, .contact-form-col, .contact-info-col, .marquee-wrap'
    );

    if (reduced || !('IntersectionObserver' in window)) {
      targets.forEach(function (el) { el.classList.add('is-visible'); });
      return;
    }

    targets.forEach(function (el, i) {
      el.classList.add('reveal');
      el.style.setProperty('--reveal-delay', (i % 6) * 0.07 + 's');
    });

    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (e) {
        if (e.isIntersecting) {
          e.target.classList.add('is-visible');
          io.unobserve(e.target);
        }
      });
    }, { threshold: 0.12, rootMargin: '0px 0px -40px 0px' });

    targets.forEach(function (el) { io.observe(el); });
  }

  /* ---- Hero entrance ---- */
  function initHeroEntrance() {
    var hero = document.querySelector('.hero-overlay .container, .page-header-overlay .container');
    if (!hero || reduced) return;

    hero.classList.add('hero-enter');
    requestAnimationFrame(function () {
      hero.classList.add('hero-enter--active');
    });
  }

  /* ---- Custom cursor ---- */
  function initCursor() {
    if (!finePointer || reduced) return;

    var dot = document.querySelector('.cursor-dot');
    var ring = document.querySelector('.cursor-ring');
    if (!dot || !ring) return;

    var mx = 0, my = 0, rx = 0, ry = 0;

    document.addEventListener('mousemove', function (e) {
      mx = e.clientX;
      my = e.clientY;
      dot.style.left = mx + 'px';
      dot.style.top = my + 'px';
    });

    function animate() {
      rx += (mx - rx) * 0.14;
      ry += (my - ry) * 0.14;
      ring.style.left = rx + 'px';
      ring.style.top = ry + 'px';
      requestAnimationFrame(animate);
    }
    animate();

    var hoverables = 'a, button, .btn, .card, .sector-card, .project-card, .burger, input, textarea, select';
    document.addEventListener('mouseover', function (e) {
      if (e.target.closest(hoverables)) {
        document.body.classList.add('cursor-hover');
      }
    });
    document.addEventListener('mouseout', function (e) {
      if (e.target.closest(hoverables)) {
        document.body.classList.remove('cursor-hover');
      }
    });
  }

  /* ---- Magnetic buttons ---- */
  function initMagnetic() {
    if (!finePointer || reduced) return;

    document.querySelectorAll('.btn, .nav-cta').forEach(function (btn) {
      btn.addEventListener('mousemove', function (e) {
        var r = btn.getBoundingClientRect();
        var x = e.clientX - r.left - r.width / 2;
        var y = e.clientY - r.top - r.height / 2;
        btn.style.transform = 'translate(' + (x * 0.18) + 'px,' + (y * 0.18) + 'px)';
      });
      btn.addEventListener('mouseleave', function () {
        btn.style.transform = '';
      });
    });
  }

  /* ---- Animated counters ---- */
  function initCounters() {
    var counters = document.querySelectorAll('[data-count]');
    if (!counters.length) return;

    function animate(el) {
      var target = parseInt(el.getAttribute('data-count'), 10);
      var suffix = el.getAttribute('data-suffix') || '';
      var duration = reduced ? 0 : 1600;
      var start = performance.now();

      function step(now) {
        var t = duration ? Math.min((now - start) / duration, 1) : 1;
        var eased = 1 - Math.pow(1 - t, 3);
        el.textContent = Math.round(target * eased) + suffix;
        if (t < 1) requestAnimationFrame(step);
      }
      requestAnimationFrame(step);
    }

    if (!('IntersectionObserver' in window) || reduced) {
      counters.forEach(animate);
      return;
    }

    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (e) {
        if (e.isIntersecting) {
          animate(e.target);
          io.unobserve(e.target);
        }
      });
    }, { threshold: 0.5 });

    counters.forEach(function (c) { io.observe(c); });
  }

  /* ---- Mobile nav ---- */
  function initMobileNav() {
    var burger = document.querySelector('.burger');
    var nav = document.getElementById('nav');
    if (!burger || !nav) return;

    burger.addEventListener('click', function () {
      var open = nav.classList.toggle('open');
      burger.classList.toggle('burger--open', open);
      document.body.classList.toggle('nav-open', open);
      burger.setAttribute('aria-expanded', open);
    });

    nav.querySelectorAll('a').forEach(function (link) {
      link.addEventListener('click', function () {
        nav.classList.remove('open');
        burger.classList.remove('burger--open');
        document.body.classList.remove('nav-open');
        burger.setAttribute('aria-expanded', 'false');
      });
    });
  }

  /* ---- Footer year ---- */
  function initYear() {
    var y = document.getElementById('year');
    if (y) y.textContent = new Date().getFullYear();
  }

  /* ---- Contact form ---- */
  function initContactForm() {
    var form = document.getElementById('contact-form');
    if (!form) return;

    form.addEventListener('submit', function (e) {
      e.preventDefault();
      var btn = form.querySelector('button[type="submit"]');
      var original = btn.textContent;
      btn.textContent = 'Sending…';
      btn.disabled = true;
      setTimeout(function () {
        btn.textContent = 'Message sent';
        btn.disabled = false;
        form.reset();
        setTimeout(function () { btn.textContent = original; }, 2000);
      }, 600);
    });
  }

  /* ---- Init ---- */
  injectChrome();
  initLoader();
  initScrollProgress();
  initHeader();
  initReveals();
  initHeroEntrance();
  initCursor();
  initMagnetic();
  initCounters();
  initMobileNav();
  initYear();
  initContactForm();

  window.addEventListener('load', function () {
    initSmoothScroll();
  });
})();
