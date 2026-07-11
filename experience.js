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

  /* ---- Holographic ambient background ---- */
  function initHoloAmbient() {
    document.body.classList.add('holo-site');

    if (reduced || document.querySelector('.holo-ambient')) return;

    var layer = document.createElement('div');
    layer.className = 'holo-ambient';
    layer.setAttribute('aria-hidden', 'true');
    layer.innerHTML =
      '<div class="holo-ambient__grid"></div>' +
      '<div class="holo-ambient__sacred" aria-hidden="true">' +
        '<div class="holo-ambient__ring holo-ambient__ring--outer"></div>' +
        '<div class="holo-ambient__ring holo-ambient__ring--mid"></div>' +
        '<div class="holo-ambient__ring holo-ambient__ring--inner"></div>' +
        '<div class="holo-ambient__flower"></div>' +
      '</div>' +
      '<div class="holo-ambient__orb holo-ambient__orb--cyan"></div>' +
      '<div class="holo-ambient__orb holo-ambient__orb--magenta"></div>' +
      '<div class="holo-ambient__orb holo-ambient__orb--amber"></div>';
    document.body.prepend(layer);
  }

  /* ---- Header: shrink on scroll + dark/light swap ---- */
  function initHeader() {
    var header = document.querySelector('.header');
    if (!header) return;

    header.classList.add('header--dark');

    function onScroll() {
      header.classList.toggle('header--scrolled', window.scrollY > 40);
    }

    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll();
  }

  /* ---- Logo: flash + hologram menu ---- */
  function playHoloFlash(sourceEl, callback) {
    if (reduced) {
      callback();
      return;
    }

    if (sourceEl) {
      sourceEl.classList.add(sourceEl.classList.contains('logo') ? 'logo--flash' : 'holo-trigger--flash');
      setTimeout(function () {
        sourceEl.classList.remove('logo--flash', 'holo-trigger--flash');
      }, 380);
    }

    var rect = sourceEl ? sourceEl.getBoundingClientRect() : null;
    var flash = document.createElement('div');
    flash.className = 'holo-trigger-flash';
    if (rect) {
      flash.style.setProperty('--flash-x', ((rect.left + rect.width / 2) / window.innerWidth * 100) + '%');
      flash.style.setProperty('--flash-y', ((rect.top + rect.height / 2) / window.innerHeight * 100) + '%');
    }
    document.body.appendChild(flash);

    requestAnimationFrame(function () {
      flash.classList.add('holo-trigger-flash--active');
    });

    setTimeout(function () {
      flash.classList.add('holo-trigger-flash--fade');
      setTimeout(function () {
        if (flash.parentNode) flash.remove();
        callback();
      }, 320);
    }, 180);
  }

  function initLogoHolo() {
    var logos = document.querySelectorAll('.logo');

    function openHolo() {
      if (window.TechnovateVoice && window.TechnovateVoice.openHoloMenu) {
        window.TechnovateVoice.openHoloMenu({ fromLogo: true });
        return;
      }
      window.location.href = 'index.html?holo=1';
    }

    for (var i = 0; i < logos.length; i++) {
      logos[i].setAttribute('aria-label', 'Open Technovate hologram');
      logos[i].addEventListener('click', function (e) {
        e.preventDefault();
        playHoloFlash(e.currentTarget, openHolo);
      });
    }
  }

  /* ---- Nav page hologram projection ---- */
  function initNavPageHologram() {
    if (reduced) return;

    var NAV_KEY = 'tv_nav_holo';
    var main = document.querySelector('main');
    var nav = document.getElementById('nav');
    if (!main || !nav) return;

    var pageName = window.location.pathname.split('/').pop() || 'index.html';
    var isHome = pageName === 'index.html' || pageName === '' || pageName.indexOf('.html') === -1;

    function readStoredNav() {
      try {
        var raw = sessionStorage.getItem(NAV_KEY);
        if (!raw) return null;
        return JSON.parse(raw);
      } catch (e) {
        return null;
      }
    }

    function clearStoredNav() {
      try {
        sessionStorage.removeItem(NAV_KEY);
      } catch (e) {}
    }

    function linkTarget(href) {
      if (!href) return '';
      return href.split('/').pop() || 'index.html';
    }

    function isCurrentPage(href) {
      var target = linkTarget(href);
      if (target === pageName) return true;
      if (target === 'index.html' && (pageName === '' || pageName.indexOf('.html') === -1)) return true;
      return false;
    }

    function getLinkOrigin(link) {
      var rect = link.getBoundingClientRect();
      return {
        x: rect.left + rect.width / 2,
        y: rect.bottom - 2
      };
    }

    function createProjector(origin) {
      var layer = document.createElement('div');
      layer.className = 'page-holo-projector holo-scanlines';
      layer.setAttribute('aria-hidden', 'true');
      layer.innerHTML =
        '<div class="page-holo-projector__source"></div>' +
        '<div class="page-holo-projector__cone"></div>' +
        '<div class="page-holo-projector__beam"></div>' +
        '<div class="page-holo-projector__wash"></div>' +
        '<div class="page-holo-projector__scanlines"></div>';
      layer.style.setProperty('--proj-x', origin.x + 'px');
      layer.style.setProperty('--proj-y', origin.y + 'px');
      document.body.appendChild(layer);
      return layer;
    }

    function playPageReveal(origin) {
      if (document.body.classList.contains('intro-active') || document.getElementById('cinematic-intro')) {
        return;
      }

      main.classList.add('page-holo-stage', 'page-holo-stage--hidden');
      document.body.classList.add('page-holo-entering');

      var layer = createProjector(origin);
      requestAnimationFrame(function () {
        requestAnimationFrame(function () {
          layer.classList.add('page-holo-projector--active');
          main.classList.remove('page-holo-stage--hidden');
          main.classList.add('page-holo-stage--revealed');
          document.body.classList.add('is-loaded');
        });
      });

      setTimeout(function () {
        layer.classList.add('page-holo-projector--fade');
        document.body.classList.remove('page-holo-entering');
        setTimeout(function () {
          if (layer.parentNode) layer.remove();
          main.classList.remove('page-holo-stage', 'page-holo-stage--revealed');
        }, 750);
      }, 1100);
    }

    function playPageRevealFromLink(link) {
      playPageReveal(getLinkOrigin(link));
    }

    var stored = readStoredNav();
    clearStoredNav();

    function currentPageKey() {
      return isHome ? 'index.html' : pageName;
    }

    if (stored && stored.x != null && stored.href && linkTarget(stored.href) === currentPageKey()) {
      setTimeout(function () {
        playPageReveal({ x: stored.x, y: stored.y });
      }, 60);
    } else if (!isHome) {
      var active = nav.querySelector('a.active');
      if (active) {
        setTimeout(function () {
          playPageRevealFromLink(active);
        }, 80);
      }
    }

    var navLinks = nav.querySelectorAll('a[href]');
    for (var i = 0; i < navLinks.length; i++) {
      navLinks[i].addEventListener('click', function (e) {
        var link = e.currentTarget;
        var href = link.getAttribute('href');
        if (!href || href.charAt(0) === '#') return;
        if (isCurrentPage(href)) return;

        e.preventDefault();

        var origin = getLinkOrigin(link);
        try {
          sessionStorage.setItem(NAV_KEY, JSON.stringify({
            x: origin.x,
            y: origin.y,
            href: href
          }));
          if (linkTarget(href) === 'index.html') {
            sessionStorage.setItem('tv_skip_intro', '1');
          }
        } catch (err) {}

        document.body.classList.add('page-holo-leaving');
        var leavingLayer = createProjector(origin);
        leavingLayer.classList.add('page-holo-projector--active', 'page-holo-projector--leaving');

        setTimeout(function () {
          window.location.href = href;
        }, 320);
      });
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
      window.__tvLenis = lenis;

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

  /* ---- Sacred geometry on heroes + chrome ---- */
  function initSacredChrome() {
    document.querySelectorAll('.hero-immersive, .page-header-immersive').forEach(function (el) {
      el.classList.add('sacred-geo-hero');
    });
    var header = document.querySelector('.header');
    var footer = document.querySelector('.footer');
    if (header) header.classList.add('sacred-geo-header');
    if (footer) footer.classList.add('sacred-geo-footer');
  }

  /* ---- Sacred sections pulse when in view ---- */
  function initSacredPulse() {
    if (reduced || !('IntersectionObserver' in window)) return;

    var sections = document.querySelectorAll('.sacred-geo-bg, .sacred-geo-dark, .sacred-geo-hex');
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (e) {
        e.target.classList.toggle('sacred-geo--alive', e.isIntersecting);
      });
    }, { threshold: 0.12, rootMargin: '0px 0px -40px 0px' });

    sections.forEach(function (s) { io.observe(s); });
  }

  /* ---- Ambient parallax (subtle, site-wide) ---- */
  function initAmbientParallax() {
    if (reduced) return;

    var sacred = document.querySelector('.holo-ambient__sacred');
    var orbs = document.querySelectorAll('.holo-ambient__orb');
    if (!sacred && !orbs.length) return;

    var mx = 0.5;
    var my = 0.5;
    var fine = window.matchMedia('(pointer: fine)').matches;

    if (fine) {
      document.addEventListener('mousemove', function (e) {
        mx = e.clientX / window.innerWidth;
        my = e.clientY / window.innerHeight;
      }, { passive: true });
    }

    function tick() {
      var dx = (mx - 0.5) * 22;
      var dy = (my - 0.5) * 16;
      if (sacred) {
        sacred.style.transform = 'translate(' + dx + 'px,' + dy + 'px)';
      }
      orbs.forEach(function (orb, i) {
        var f = 0.55 + i * 0.18;
        orb.style.transform = 'translate(' + (dx * f) + 'px,' + (dy * f) + 'px)';
      });
      requestAnimationFrame(tick);
    }
    requestAnimationFrame(tick);
  }

  /* ---- Init ---- */
  var isHomepage = !window.location.pathname.split('/').pop() ||
    window.location.pathname.split('/').pop() === 'index.html' ||
    window.location.pathname.split('/').pop().indexOf('.html') === -1;

  if (!isHomepage && reduced) {
    initLoader();
  } else {
    document.body.classList.add('is-loaded');
  }
  initHoloAmbient();
  initSacredChrome();
  initSacredPulse();
  initAmbientParallax();
  initScrollProgress();
  initGrain();
  initHeader();
  initLogoHolo();
  initNavPageHologram();
  initReveals();
  initHeroEntrance();
  initMobileNav();
  initYear();
  initContactForm();

  window.addEventListener('load', function () {
    initSmoothScroll();
  });
})();
