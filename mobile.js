/* ============================================
   Technovate — Mobile / responsive helpers
   Shared capability detection + reveal failsafes
   + Nova summon control for phone/tablet
   ============================================ */
(function () {
  'use strict';

  var MQ_MOBILE = '(max-width: 1023px), (pointer: coarse)';
  var MQ_NOVA = '(max-width: 1023px)';

  function isMobileExperience() {
    try {
      return window.matchMedia(MQ_MOBILE).matches;
    } catch (e) {
      return window.innerWidth <= 1023;
    }
  }

  function needsNovaSummon() {
    try {
      return window.matchMedia(MQ_NOVA).matches;
    } catch (e) {
      return window.innerWidth <= 1023;
    }
  }

  function forceRevealContent() {
    var main = document.querySelector('main');
    if (main) {
      main.classList.remove('page-holo-stage--hidden');
      main.classList.add('page-holo-stage--revealed');
      main.style.opacity = '';
      main.style.filter = '';
      main.style.transform = '';
    }
    document.body.classList.add('is-loaded');
    document.body.classList.remove('page-holo-entering', 'intro-active');

    document.querySelectorAll('.reveal:not(.is-visible)').forEach(function (el) {
      el.classList.add('is-visible');
    });

    var hero = document.querySelector('.hero-enter');
    if (hero) hero.classList.add('hero-enter--active');
  }

  function initRevealFailsafe() {
    setTimeout(function () {
      var main = document.querySelector('main');
      if (!main) return;
      if (main.classList.contains('page-holo-stage--hidden')) {
        forceRevealContent();
      }
      document.querySelectorAll('.reveal-ready .reveal:not(.is-visible)').forEach(function (el) {
        var rect = el.getBoundingClientRect();
        if (rect.top < window.innerHeight * 1.2) {
          el.classList.add('is-visible');
        }
      });
    }, 800);

    setTimeout(function () {
      document.querySelectorAll('.reveal-ready .reveal:not(.is-visible)').forEach(function (el) {
        el.classList.add('is-visible');
      });
    }, 2200);
  }

  function initBodyFlags() {
    if (isMobileExperience()) {
      document.documentElement.classList.add('tv-mobile');
      document.body.classList.add('tv-mobile');
    } else {
      document.documentElement.classList.remove('tv-mobile');
      document.body.classList.remove('tv-mobile');
    }
  }

  function ensureNovaToggle() {
    if (!needsNovaSummon()) {
      var existing = document.getElementById('tv-nova-toggle');
      if (existing && existing.parentNode) existing.parentNode.removeChild(existing);
      document.body.classList.remove('tv-nova-summoned');
      return;
    }

    if (document.getElementById('tv-nova-toggle')) return;

    var btn = document.createElement('button');
    btn.id = 'tv-nova-toggle';
    btn.type = 'button';
    btn.setAttribute('aria-label', 'Summon Nova assistant');
    btn.setAttribute('aria-pressed', 'false');
    btn.textContent = 'Nova';
    document.body.appendChild(btn);

    btn.addEventListener('click', function () {
      var summoned = document.body.classList.toggle('tv-nova-summoned');
      btn.setAttribute('aria-pressed', summoned ? 'true' : 'false');
      btn.textContent = summoned ? 'Hide' : 'Nova';

      if (summoned) {
        window.setTimeout(function () {
          var headBtn = document.getElementById('tv-nova-head-btn');
          if (headBtn) headBtn.click();
        }, 60);
      }
    });
  }

  function initNovaSummon() {
    ensureNovaToggle();
    var resizeTimer;
    function onViewportChange() {
      clearTimeout(resizeTimer);
      resizeTimer = setTimeout(function () {
        initBodyFlags();
        ensureNovaToggle();
      }, 150);
    }
    window.addEventListener('resize', onViewportChange, { passive: true });
    window.addEventListener('orientationchange', onViewportChange, { passive: true });
    if (window.visualViewport) {
      window.visualViewport.addEventListener('resize', onViewportChange, { passive: true });
    }
  }

  function init() {
    initBodyFlags();
    initRevealFailsafe();
    initNovaSummon();
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }

  window.TechnovateMobile = {
    isMobileExperience: isMobileExperience,
    forceRevealContent: forceRevealContent
  };
})();
