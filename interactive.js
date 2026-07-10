/* ============================================
   Technovate — Interactive Layer
   Sector overlays, card tilt, hero orbs, counters
   ============================================ */
(function () {
  'use strict';

  var reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  var finePointer = window.matchMedia('(pointer: fine)').matches;

  var SECTOR_COLORS = {
    health: '#34d399',
    finance: '#fbbf24',
    education: '#a78bfa',
    enterprise: '#38bdf8',
    community: '#f472b6'
  };

  var SECTOR_ICONS = {
    health: '<svg viewBox="0 0 24 24"><path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"/></svg>',
    finance: '<svg viewBox="0 0 24 24"><path d="M11.8 10.9c-2.27-.59-3-1.2-3-2.15 0-1.09 1.01-1.85 2.7-1.85 1.78 0 2.44.85 2.5 2.1h2.21c-.07-1.72-1.12-3.3-3.21-3.81V3h-3v2.16c-1.94.42-3.5 1.68-3.5 3.61 0 2.31 1.91 3.46 4.7 4.13 2.5.6 3 1.48 3 2.41 0 .69-.49 1.79-2.7 1.79-2.06 0-2.87-.92-2.98-2.1h-2.2c.12 2.19 1.76 3.42 3.68 3.83V21h3v-2.15c1.95-.37 3.5-1.5 3.5-3.55 0-2.84-2.43-3.81-4.7-4.4z"/></svg>',
    education: '<svg viewBox="0 0 24 24"><path d="M5 13.18v4L12 21l7-3.82v-4L12 17l-7-3.82zM12 3L1 9l11 6 9-4.91V17h2V9L12 3z"/></svg>',
    enterprise: '<svg viewBox="0 0 24 24"><path d="M19 3H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm-5 14H7v-2h7v2zm3-4H7v-2h10v2zm0-4H7V7h10v2z"/></svg>',
    community: '<svg viewBox="0 0 24 24"><path d="M16 11c1.66 0 2.99-1.34 2.99-3S17.66 5 16 5c-1.66 0-3 1.34-3 3s1.34 3 3 3zm-8 0c1.66 0 2.99-1.34 2.99-3S9.66 5 8 5C6.34 5 5 6.34 5 8s1.34 3 3 3zm0 2c-2.33 0-7 1.17-7 3.5V19h14v-2.5c0-2.33-4.67-3.5-7-3.5zm8 0c-.29 0-.62.02-.97.05 1.16.84 1.97 1.97 1.97 3.45V19h6v-2.5c0-2.33-4.67-3.5-7-3.5z"/></svg>'
  };

  /* ---- Sector overlay ---- */
  function initSectorOverlay() {
    var cards = document.querySelectorAll('.sector-card[data-sector]');
    if (!cards.length) return;

    var overlay = document.createElement('div');
    overlay.className = 'sector-overlay';
    overlay.innerHTML =
      '<div class="sector-overlay__backdrop"></div>' +
      '<div class="sector-overlay__panel">' +
        '<button class="sector-overlay__close" aria-label="Close">&times;</button>' +
        '<div class="sector-overlay__header">' +
          '<div class="sector-overlay__icon"></div>' +
          '<div><h2 class="sector-overlay__title"></h2>' +
          '<p class="sector-overlay__subtitle">Technovate Sector</p></div>' +
        '</div>' +
        '<div class="sector-overlay__body">' +
          '<p class="sector-overlay__desc"></p>' +
          '<div class="sector-overlay__stats"></div>' +
          '<div class="sector-overlay__features">' +
            '<h3>Key Capabilities</h3>' +
            '<ul class="sector-overlay__list"></ul>' +
          '</div>' +
          '<a href="solutions.html" class="btn btn--fill sector-overlay__btn">View all solutions</a>' +
        '</div>' +
      '</div>';
    document.body.appendChild(overlay);

    var backdrop = overlay.querySelector('.sector-overlay__backdrop');
    var closeBtn = overlay.querySelector('.sector-overlay__close');

    function openSector(card) {
      var sector = card.getAttribute('data-sector');
      var color = SECTOR_COLORS[sector] || '#3b82f6';
      var title = card.querySelector('h3').textContent;
      var detail = card.getAttribute('data-detail');
      var features = (card.getAttribute('data-features') || '').split('|');

      overlay.querySelector('.sector-overlay__title').textContent = title;
      overlay.querySelector('.sector-overlay__desc').textContent = detail;
      overlay.querySelector('.sector-overlay__icon').innerHTML = SECTOR_ICONS[sector] || '';
      overlay.querySelector('.sector-overlay__icon').style.background = color;

      var statsHtml = '';
      for (var i = 1; i <= 3; i++) {
        var val = card.getAttribute('data-stat-' + i);
        var label = card.getAttribute('data-stat-' + i + '-label');
        if (val && label) {
          statsHtml += '<div class="sector-overlay__stat">' +
            '<div class="sector-overlay__stat-val" style="color:' + color + '">' + val + '</div>' +
            '<div class="sector-overlay__stat-label">' + label + '</div>' +
          '</div>';
        }
      }
      overlay.querySelector('.sector-overlay__stats').innerHTML = statsHtml;

      var list = overlay.querySelector('.sector-overlay__list');
      list.innerHTML = '';
      features.forEach(function (f) {
        if (f.trim()) {
          var li = document.createElement('li');
          li.textContent = f.trim();
          li.style.setProperty('--accent', color);
          list.appendChild(li);
        }
      });

      overlay.querySelector('.sector-overlay__btn').style.background = color;
      overlay.style.setProperty('--sector-color', color);
      overlay.classList.add('sector-overlay--open');
      document.body.style.overflow = 'hidden';
    }

    function closeSector() {
      overlay.classList.remove('sector-overlay--open');
      document.body.style.overflow = '';
    }

    cards.forEach(function (card) {
      card.style.cursor = 'pointer';
      card.addEventListener('click', function () { openSector(card); });
    });

    closeBtn.addEventListener('click', closeSector);
    backdrop.addEventListener('click', closeSector);
    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape') closeSector();
    });
  }

  /* ---- 3D holo float boxes ---- */
  function initHoloBoxes() {
    var boxes = document.querySelectorAll('.card, .value-item, .stat-item, .project-card, .sector-card');
    boxes.forEach(function (box, i) {
      box.classList.add('holo-box');
      var rx = 5 + (i % 4) * 1.5;
      var ry = -5 + (i % 5) * 2.2;
      box.style.setProperty('--holo-delay', ((i % 5) * 0.65).toFixed(2) + 's');
      box.style.setProperty('--holo-drift', (4 + (i % 4) * 2) + 'px');
      box.style.setProperty('--holo-rx', rx.toFixed(1) + 'deg');
      box.style.setProperty('--holo-ry', ry.toFixed(1) + 'deg');
      box.style.setProperty('--holo-depth', (12 + (i % 3) * 4) + 'px');

      if (!box.querySelector('.holo-box__shell')) {
        var shell = document.createElement('div');
        shell.className = 'holo-box__shell';
        shell.setAttribute('aria-hidden', 'true');
        shell.innerHTML =
          '<span class="holo-box__plate holo-box__plate--slab"></span>' +
          '<span class="holo-box__plate holo-box__plate--slab2"></span>' +
          '<span class="holo-box__plate holo-box__plate--edge-r"></span>' +
          '<span class="holo-box__plate holo-box__plate--edge-b"></span>';
        box.insertBefore(shell, box.firstChild);
      }
    });
  }

  function getHoloTilt(card) {
    var rx = parseFloat(card.style.getPropertyValue('--holo-rx')) || 5;
    var ry = parseFloat(card.style.getPropertyValue('--holo-ry')) || -4;
    var depth = parseFloat(card.style.getPropertyValue('--holo-depth')) || 14;
    return { rx: rx, ry: ry, depth: depth };
  }

  /* ---- Click-to-open detail overlay (mission, values, projects) ---- */
  function initHoloDetailOverlay() {
    var targets = document.querySelectorAll('.card, .value-item, .project-card');
    if (!targets.length) return;

    var overlay = document.createElement('div');
    overlay.className = 'holo-detail-overlay';
    overlay.innerHTML =
      '<div class="holo-detail-overlay__backdrop"></div>' +
      '<div class="holo-detail-overlay__panel">' +
        '<button class="holo-detail-overlay__close" type="button" aria-label="Close">&times;</button>' +
        '<span class="holo-detail-overlay__label"></span>' +
        '<h2 class="holo-detail-overlay__title"></h2>' +
        '<div class="holo-detail-overlay__body"></div>' +
      '</div>';
    document.body.appendChild(overlay);

    var backdrop = overlay.querySelector('.holo-detail-overlay__backdrop');
    var closeBtn = overlay.querySelector('.holo-detail-overlay__close');
    var labelEl = overlay.querySelector('.holo-detail-overlay__label');
    var titleEl = overlay.querySelector('.holo-detail-overlay__title');
    var bodyEl = overlay.querySelector('.holo-detail-overlay__body');

    function buildBody(el) {
      bodyEl.innerHTML = '';
      var desc = el.querySelector('.project-card__desc');
      if (desc) {
        var p = document.createElement('p');
        p.textContent = desc.textContent;
        bodyEl.appendChild(p);
      } else {
        el.querySelectorAll('p').forEach(function (para) {
          if (para.closest('.sector-overlay')) return;
          var copy = document.createElement('p');
          copy.textContent = para.textContent;
          bodyEl.appendChild(copy);
        });
      }
      var list = el.querySelector('.project-highlights');
      if (list) bodyEl.appendChild(list.cloneNode(true));
    }

    function openDetail(el) {
      var label = el.querySelector('.card-label, .project-tag, .project-card__tag');
      var title = el.querySelector('h3');
      labelEl.textContent = label ? label.textContent : '';
      labelEl.style.display = label ? '' : 'none';
      titleEl.textContent = title ? title.textContent : '';
      buildBody(el);
      overlay.classList.add('holo-detail-overlay--open');
      document.body.style.overflow = 'hidden';
    }

    function closeDetail() {
      overlay.classList.remove('holo-detail-overlay--open');
      document.body.style.overflow = '';
    }

    targets.forEach(function (el) {
      el.classList.add('holo-box--detail');
      el.setAttribute('tabindex', '0');
      el.setAttribute('role', 'button');

      if (!el.querySelector('.holo-box__hint') && !el.querySelector('.sector-cta')) {
        var hint = document.createElement('span');
        hint.className = 'holo-box__hint';
        hint.textContent = 'Click to open';
        el.appendChild(hint);
      }

      el.addEventListener('click', function () { openDetail(el); });
      el.addEventListener('keydown', function (e) {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          openDetail(el);
        }
      });
    });

    closeBtn.addEventListener('click', closeDetail);
    backdrop.addEventListener('click', closeDetail);
    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape') closeDetail();
    });
  }

  /* ---- 3D card tilt ---- */
  function initCardTilt() {
    if (!finePointer || reduced) return;

    var cards = document.querySelectorAll('.card, .sector-card, .project-card, .stat-item, .value-item');
    cards.forEach(function (card) {
      card.addEventListener('mousemove', function (e) {
        card.style.animationPlayState = 'paused';
        var base = getHoloTilt(card);
        var r = card.getBoundingClientRect();
        var x = (e.clientX - r.left) / r.width;
        var y = (e.clientY - r.top) / r.height;
        var rotY = (x - 0.5) * 14;
        var rotX = (0.5 - y) * 14;
        card.style.transform =
          'rotateX(' + (base.rx + rotX) + 'deg) ' +
          'rotateY(' + (base.ry + rotY) + 'deg) ' +
          'translateZ(' + (base.depth + 8) + 'px) ' +
          'translateY(-8px) scale(1.02)';
      });
      card.addEventListener('mouseleave', function () {
        card.style.animationPlayState = '';
        card.style.transform = '';
      });
    });
  }

  /* ---- Hero floating orbs (mouse reactive) ---- */
  function initHeroOrbs() {
    if (reduced) return;
    var orbs = document.querySelectorAll('.orb');
    if (!orbs.length) return;

    var hero = document.querySelector('.hero-immersive, .page-header-immersive');
    if (!hero) return;

    var mx = 0.5, my = 0.5;

    if (finePointer) {
      hero.addEventListener('mousemove', function (e) {
        var r = hero.getBoundingClientRect();
        mx = (e.clientX - r.left) / r.width;
        my = (e.clientY - r.top) / r.height;
      });
    }

    function animate() {
      orbs.forEach(function (orb, i) {
        var speed = [0.12, 0.08, 0.05][i] || 0.1;
        var baseX = [15, 70, 45][i] || 50;
        var baseY = [75, 25, 55][i] || 50;
        var offsetX = (mx - 0.5) * (30 + i * 15) * speed * 10;
        var offsetY = (my - 0.5) * (25 + i * 10) * speed * 10;
        orb.style.transform = 'translate(' + offsetX + 'px, ' + offsetY + 'px)';
      });
      requestAnimationFrame(animate);
    }
    animate();
  }

  /* ---- Animated counters ---- */
  function initCounters() {
    var counters = document.querySelectorAll('[data-count]');
    if (!counters.length) return;

    function animate(el) {
      var target = parseInt(el.getAttribute('data-count'), 10);
      var suffix = el.getAttribute('data-suffix') || '';
      var duration = reduced ? 0 : 1400;
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

  /* ---- Button glow + nav shimmer ---- */
  function initButtonLife() {
    if (reduced) return;

    document.querySelectorAll('.btn').forEach(function (btn) {
      btn.addEventListener('mouseenter', function () {
        btn.classList.add('btn--alive');
      });
      btn.addEventListener('mouseleave', function () {
        btn.classList.remove('btn--alive');
      });
    });

    document.querySelectorAll('.nav a:not(.nav-cta)').forEach(function (link) {
      link.addEventListener('mouseenter', function () {
        link.classList.add('nav-link--glow');
      });
      link.addEventListener('mouseleave', function () {
        link.classList.remove('nav-link--glow');
      });
    });
  }

  /* ---- Init ---- */
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }

  function init() {
    initHoloBoxes();
    initSectorOverlay();
    initHoloDetailOverlay();
    initCardTilt();
    initHeroOrbs();
    initCounters();
    initButtonLife();
  }
})();
