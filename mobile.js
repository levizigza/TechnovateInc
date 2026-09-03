/* ============================================
   Technovate — Mobile experience helpers
   Shared capability detection + reveal failsafes
   ============================================ */
(function () {
  'use strict';

  var MQ = '(max-width: 900px), (pointer: coarse)';

  function isMobileExperience() {
    try {
      return window.matchMedia(MQ).matches;
    } catch (e) {
      return window.innerWidth <= 900;
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

  function initNovaSummon() {
    try {
      if (!window.matchMedia) return;
      var isSmall = window.matchMedia('(max-width: 520px)').matches;
      if (!isSmall) return;

      // Button is injected so Nova doesn't block content by default.
      if (document.getElementById('tv-nova-toggle')) return;

      var btn = document.createElement('button');
      btn.id = 'tv-nova-toggle';
      btn.type = 'button';
      btn.setAttribute('aria-label', 'Summon Nova');
      btn.textContent = 'Nova';

      document.body.appendChild(btn);

      btn.addEventListener('click', function () {
        var summoned = document.body.classList.toggle('tv-nova-summoned');

        if (summoned) {
          // chatbot.js creates the head button; click it to activate Nova.
          window.setTimeout(function () {
            var headBtn = document.getElementById('tv-nova-head-btn');
            if (headBtn) headBtn.click();
          }, 50);
        }
      });
    } catch (e) {}
  }
})();
