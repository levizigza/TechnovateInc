/* ============================================
   Technovate — Experience Layer
   Progressive enhancement: everything works
   without JS; animations layer on top.
   ============================================ */
(function () {
  'use strict';

  var reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  /* ---- Page loader (non-blocking) ---- */
  function initLoader() {
    if (reduced) {
      document.body.classList.add('is-loaded');
      return;
    }

    var loader = document.createElement('div');
    loader.className = 'page-loader';
    loader.innerHTML =
      '<div class="page-loader__inner">' +
        '<div class="page-loader__logo">Technovate</div>' +
        '<div class="page-loader__bar"><span></span></div>' +
      '</div>';
    document.body.prepend(loader);

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
      setTimeout(function () {
        if (loader.parentNode) loader.remove();
      }, 700);
    }

    if (document.readyState === 'complete') {
      setTimeout(finish, 300);
    } else {
      window.addEventListener('load', function () { setTimeout(finish, 250); });
    }
    setTimeout(finish, 1800);
  }

  /* ---- Scroll progress ---- */
  function initScrollProgress() {
    var bar = document.createElement('div');
    bar.className = 'scroll-progress';
    bar.innerHTML = '<span class="scroll-progress__fill"></span>';
    document.body.prepend(bar);

    var fill = bar.querySelector('.scroll-progress__fill');

    function update() {
      var h = document.documentElement.scrollHeight - window.innerHeight;
      var p = h > 0 ? window.scrollY / h : 0;
      fill.style.transform = 'scaleX(' + p + ')';
    }

    window.addEventListener('scroll', update, { passive: true });
    update();
  }

  /* ---- Grain texture ---- */
  function initGrain() {
    if (reduced) return;
    var grain = document.createElement('div');
    grain.className = 'grain';
    grain.setAttribute('aria-hidden', 'true');
    document.body.appendChild(grain);
  }

  /* ---- Header: shrink on scroll + dark/light swap ---- */
  function initHeader() {
    var header = document.querySelector('.header');
    if (!header) return;

    function onScroll() {
      header.classList.toggle('header--scrolled', window.scrollY > 40);
    }

    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll();

    if (!('IntersectionObserver' in window)) return;

    var zones = document.querySelectorAll(
      '.hero-immersive, .page-header-immersive, .section--dark, .footer'
    );

    var lightZones = document.querySelectorAll(
      '.section:not(.section--dark), .section--alt'
    );

    function observeZones(elements, isDark) {
      var io = new IntersectionObserver(function (entries) {
        entries.forEach(function (e) {
          if (e.isIntersecting && e.intersectionRatio > 0.1) {
            header.classList.toggle('header--dark', isDark);
          }
        });
      }, { rootMargin: '-' + (parseInt(getComputedStyle(document.documentElement).getPropertyValue('--header-h')) || 80) + 'px 0px -70% 0px', threshold: [0, 0.1, 0.5] });

      elements.forEach(function (z) { io.observe(z); });
    }

    observeZones(zones, true);
    observeZones(lightZones, false);

    if (document.querySelector('.hero-immersive, .page-header-immersive')) {
      header.classList.add('header--dark');
    }
  }

  /* ---- Scroll reveals (progressive enhancement) ---- */
  function initReveals() {
    if (reduced || !('IntersectionObserver' in window)) return;

    document.documentElement.classList.add('reveal-ready');

    var targets = document.querySelectorAll(
      '.section-title, .section-lead, .section-head, .card, .sector-card, ' +
      '.project-card, .value-item, .solution-block, .cta-banner, .stat-item, ' +
      '.content-block, .contact-form-col, .contact-info-col, .marquee-wrap'
    );

    targets.forEach(function (el, i) {
      el.classList.add('reveal');
      el.style.setProperty('--reveal-delay', (i % 5) * 0.06 + 's');
    });

    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (e) {
        if (e.isIntersecting) {
          e.target.classList.add('is-visible');
          io.unobserve(e.target);
        }
      });
    }, { threshold: 0.08, rootMargin: '0px 0px -30px 0px' });

    targets.forEach(function (el) { io.observe(el); });
  }

  /* ---- Hero entrance ---- */
  function initHeroEntrance() {
    var hero = document.querySelector('.hero-overlay .container, .page-header-overlay .container');
    if (!hero || reduced) return;

    document.documentElement.classList.add('reveal-ready');
    hero.classList.add('hero-enter');
    requestAnimationFrame(function () {
      requestAnimationFrame(function () {
        hero.classList.add('hero-enter--active');
      });
    });
  }


  /* ---- Smooth scroll (Lenis) ---- */
  function initSmoothScroll() {
    if (reduced || typeof Lenis === 'undefined') return;

    try {
      var lenis = new Lenis({
        duration: 1.1,
        easing: function (t) { return Math.min(1, 1.001 - Math.pow(2, -10 * t)); },
        smoothWheel: true,
        touchMultiplier: 1.4
      });

      function raf(time) {
        lenis.raf(time);
        requestAnimationFrame(raf);
      }
      requestAnimationFrame(raf);
    } catch (e) { /* Lenis failed, native scroll is fine */ }
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
      btn.textContent = 'Sending\u2026';
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
  var isHomepage = !window.location.pathname.split('/').pop() ||
    window.location.pathname.split('/').pop() === 'index.html' ||
    window.location.pathname.split('/').pop().indexOf('.html') === -1;

  if (!isHomepage || sessionStorage.getItem('technovate_intro_done') === '1') {
    initLoader();
  } else {
    document.body.classList.add('is-loaded');
  }
  initScrollProgress();
  initGrain();
  initHeader();
  initReveals();
  initHeroEntrance();
  initMobileNav();
  initYear();
  initContactForm();

  window.addEventListener('load', function () {
    initSmoothScroll();
  });
})();
