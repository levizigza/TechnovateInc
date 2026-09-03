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
