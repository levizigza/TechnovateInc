/* ============================================
   Technovate — Eye logo & friendly AI character
   ============================================ */
(function () {
  'use strict';

  var EYE_ICON_SVG =
    '<svg class="tv-logo-eye" viewBox="0 0 64 64" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">' +
      '<defs>' +
        '<radialGradient id="tvEyeCore" cx="50%" cy="50%" r="50%">' +
          '<stop offset="0%" stop-color="#ffffff"/>' +
          '<stop offset="35%" stop-color="#b8f4ff"/>' +
          '<stop offset="70%" stop-color="#00d4ff"/>' +
          '<stop offset="100%" stop-color="#0077aa"/>' +
        '</radialGradient>' +
        '<radialGradient id="tvEyeHalo" cx="50%" cy="50%" r="50%">' +
          '<stop offset="55%" stop-color="rgba(0,212,255,0)"/>' +
          '<stop offset="100%" stop-color="rgba(0,212,255,0.35)"/>' +
        '</radialGradient>' +
      '</defs>' +
      '<circle cx="32" cy="32" r="31" fill="url(#tvEyeHalo)"/>' +
      '<circle cx="32" cy="32" r="28" fill="#071018" stroke="#163a55" stroke-width="1.5"/>' +
      '<circle cx="32" cy="32" r="26" fill="none" stroke="#00d4ff" stroke-width="0.6" opacity="0.45"/>' +
      '<line x1="32" y1="4" x2="32" y2="10" stroke="#00d4ff" stroke-width="1" opacity="0.7"/>' +
      '<line x1="32" y1="54" x2="32" y2="60" stroke="#00d4ff" stroke-width="1" opacity="0.7"/>' +
      '<line x1="4" y1="32" x2="10" y2="32" stroke="#00d4ff" stroke-width="1" opacity="0.7"/>' +
      '<line x1="54" y1="32" x2="60" y2="32" stroke="#00d4ff" stroke-width="1" opacity="0.7"/>' +
      '<circle cx="32" cy="32" r="18" fill="none" stroke="#00d4ff" stroke-width="0.8" opacity="0.35" stroke-dasharray="3 5"/>' +
      '<circle cx="32" cy="32" r="13" fill="none" stroke="#00d4ff" stroke-width="1.2" opacity="0.55"/>' +
      '<circle cx="32" cy="32" r="8.5" fill="url(#tvEyeCore)"/>' +
      '<circle cx="32" cy="32" r="3.2" fill="#ffffff"/>' +
      '<circle cx="34.5" cy="29.5" r="1.2" fill="#ffffff" opacity="0.85"/>' +
    '</svg>';

  var EYE_MARK_SVG =
    '<svg class="tv-logo-mark" viewBox="0 0 480 110" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="Technovate">' +
      '<defs>' +
        '<linearGradient id="tvMarkText" x1="0%" y1="0%" x2="100%" y2="0%">' +
          '<stop offset="0%" stop-color="#00d4ff"/>' +
          '<stop offset="50%" stop-color="#7ee8ff"/>' +
          '<stop offset="100%" stop-color="#00d4ff"/>' +
        '</linearGradient>' +
      '</defs>' +
      '<g transform="translate(55 55)">' +
        '<circle r="48" fill="rgba(0,212,255,0.08)"/>' +
        '<circle r="40" fill="#071018" stroke="#163a55" stroke-width="2"/>' +
        '<circle r="36" fill="none" stroke="#00d4ff" stroke-width="1" opacity="0.4"/>' +
        '<line x1="0" y1="-40" x2="0" y2="-30" stroke="#00d4ff" stroke-width="1.5" opacity="0.75"/>' +
        '<line x1="0" y1="30" x2="0" y2="40" stroke="#00d4ff" stroke-width="1.5" opacity="0.75"/>' +
        '<line x1="-40" y1="0" x2="-30" y2="0" stroke="#00d4ff" stroke-width="1.5" opacity="0.75"/>' +
        '<line x1="30" y1="0" x2="40" y2="0" stroke="#00d4ff" stroke-width="1.5" opacity="0.75"/>' +
        '<circle r="24" fill="none" stroke="#00d4ff" stroke-width="1.2" opacity="0.45" stroke-dasharray="4 6"/>' +
        '<circle r="15" fill="none" stroke="#00d4ff" stroke-width="1.8" opacity="0.65"/>' +
        '<circle r="10" fill="#00d4ff" opacity="0.95"/>' +
        '<circle r="4" fill="#ffffff"/>' +
        '<circle cx="3" cy="-2.5" r="1.4" fill="#ffffff" opacity="0.9"/>' +
      '</g>' +
      '<text x="112" y="66" fill="none" stroke="url(#tvMarkText)" stroke-width="1.3" ' +
        'font-family="Syne, Inter, sans-serif" font-size="26" font-weight="800" letter-spacing="5">' +
        'TECHNOVATE' +
      '</text>' +
      '<line x1="112" y1="78" x2="468" y2="78" stroke="#00d4ff" stroke-width="1" opacity="0.5"/>' +
      '<circle cx="290" cy="78" r="2.5" fill="#00d4ff" opacity="0.8"/>' +
    '</svg>';

  var EYE_BODY_INNER =
        '<div class="tv-eye-character__aura"></div>' +
        '<div class="tv-eye-character__body">' +
          '<div class="tv-eye-character__frame">' +
            '<span class="tv-eye-character__tick tv-eye-character__tick--n"></span>' +
            '<span class="tv-eye-character__tick tv-eye-character__tick--s"></span>' +
            '<span class="tv-eye-character__tick tv-eye-character__tick--e"></span>' +
            '<span class="tv-eye-character__tick tv-eye-character__tick--w"></span>' +
            '<div class="tv-eye-character__ring tv-eye-character__ring--outer"></div>' +
            '<div class="tv-eye-character__ring tv-eye-character__ring--mid"></div>' +
            '<div class="tv-eye-character__ring tv-eye-character__ring--inner"></div>' +
            '<div class="tv-eye-character__socket">' +
              '<div class="tv-eye-character__gaze">' +
                '<div class="tv-eye-character__iris">' +
                  '<div class="tv-eye-character__pupil"></div>' +
                  '<div class="tv-eye-character__shine"></div>' +
                '</div>' +
              '</div>' +
            '</div>' +
            '<div class="tv-eye-character__lid tv-eye-character__lid--top"></div>' +
            '<div class="tv-eye-character__lid tv-eye-character__lid--bottom"></div>' +
          '</div>' +
        '</div>';

  var CHARACTER_HTML =
    '<div class="tv-eye-floater" id="intro-eye-floater" aria-hidden="true">' +
      '<div class="tv-eye-character" id="intro-eye-unit">' +
        EYE_BODY_INNER +
      '</div>' +
    '</div>';

  function holoPortalHtml() {
    return (
      '<div class="intro-holo-portal" id="intro-holo-portal" aria-hidden="true">' +
        '<div class="intro-holo-source" aria-hidden="true"></div>' +
        '<div class="intro-holo-portal__ring"></div>' +
        '<div class="intro-holo-portal__ring intro-holo-portal__ring--inner"></div>' +
        '<div class="tv-eye-character tv-eye-character--holo" id="intro-holo-eye-unit">' +
          EYE_BODY_INNER +
        '</div>' +
      '</div>'
    );
  }

  function holoEyeHtml() {
    return holoPortalHtml();
  }

  function createHoloEyeLife(unitEl) {
    if (!unitEl) return { stop: function () {}, setSpeaking: function () {} };

    var gazeEl = unitEl.querySelector('.tv-eye-character__gaze');
    var pupilEl = unitEl.querySelector('.tv-eye-character__pupil');
    var running = true;
    var speaking = false;
    var blinkTimer = null;
    var lookTimer = null;
    var glowRaf = 0;
    var gaze = { x: 0, y: 0 };
    var gazeTarget = { x: 0, y: 0 };

    function pickGaze() {
      var reach = speaking ? 8 : 13;
      gazeTarget.x = rand(-reach, reach);
      gazeTarget.y = rand(-reach, reach);
    }

    function blink() {
      if (!running) return;
      unitEl.classList.remove('tv-eye-character--blink');
      void unitEl.offsetWidth;
      unitEl.classList.add('tv-eye-character--blink');
      setTimeout(function () {
        unitEl.classList.remove('tv-eye-character--blink');
      }, 190);
    }

    function scheduleBlink() {
      if (!running) return;
      clearTimeout(blinkTimer);
      blinkTimer = setTimeout(function () {
        if (!running) return;
        if (Math.random() < 0.15) {
          blink();
          setTimeout(blink, 220);
        } else {
          blink();
        }
        scheduleBlink();
      }, rand(2200, 4800));
    }

    function scheduleLook() {
      if (!running) return;
      clearTimeout(lookTimer);
      lookTimer = setTimeout(function () {
        if (!running) return;
        pickGaze();
        scheduleLook();
      }, rand(800, 2000));
    }

    function glowTick(time) {
      if (!running) return;
      var t = time * 0.001;
      if (gazeEl) {
        gaze.x += (gazeTarget.x - gaze.x) * 0.1;
        gaze.y += (gazeTarget.y - gaze.y) * 0.1;
        gazeEl.style.transform = 'translate(' + gaze.x + 'px,' + gaze.y + 'px)';
      }
      if (pupilEl) {
        var pulse = speaking ? 1.06 + Math.sin(t * 4.5) * 0.04 : 1 + Math.sin(t * 1.8) * 0.02;
        pupilEl.style.transform = 'scale(' + pulse + ')';
      }
      unitEl.style.filter = 'brightness(' + (1 + Math.sin(t * 2.2) * 0.08) + ')';
      glowRaf = requestAnimationFrame(glowTick);
    }

    pickGaze();
    scheduleBlink();
    scheduleLook();
    glowRaf = requestAnimationFrame(glowTick);

    return {
      stop: function () {
        running = false;
        cancelAnimationFrame(glowRaf);
        clearTimeout(blinkTimer);
        clearTimeout(lookTimer);
      },
      setSpeaking: function (on) {
        speaking = !!on;
        unitEl.classList.toggle('tv-eye-character--speaking', speaking);
        if (speaking) {
          gazeTarget.x = 0;
          gazeTarget.y = -2;
        } else {
          pickGaze();
        }
      }
    };
  }

  function buildLogoEyeHtml() {
    return '<div class="tv-eye-character tv-eye-character--logo">' + EYE_BODY_INNER + '</div>';
  }

  function footerMarkHtml() {
    return (
      '<span class="tv-footer-mark">' +
        '<span class="tv-footer-mark__eye" aria-hidden="true">' + buildLogoEyeHtml() + '</span>' +
        '<span class="tv-footer-mark__text">Technovate</span>' +
      '</span>'
    );
  }

  var siteLogoAnimators = [];

  function startLogoLife(root) {
    if (!root || root.dataset.tvEyeLife === '1') return;
    var unit = root.querySelector('.tv-eye-character--logo');
    if (!unit) return;
    root.dataset.tvEyeLife = '1';
    siteLogoAnimators.push(createHoloEyeLife(unit));
  }

  function mountHeaders() {
    var icons = document.querySelectorAll('.logo-icon');
    var reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    for (var i = 0; i < icons.length; i++) {
      if (icons[i].dataset.tvEyeMounted === '1') continue;

      if (reducedMotion) {
        icons[i].innerHTML = EYE_ICON_SVG;
        icons[i].classList.add('logo-icon--eye');
      } else {
        icons[i].innerHTML = buildLogoEyeHtml();
        icons[i].classList.add('logo-icon--living');
        startLogoLife(icons[i]);
      }

      icons[i].dataset.tvEyeMounted = '1';
    }
  }

  function mountFooters() {
    var footers = document.querySelectorAll('.footer-logo');
    var reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    for (var i = 0; i < footers.length; i++) {
      if (footers[i].dataset.tvEyeMounted === '1') continue;

      var img = footers[i].querySelector('img');
      if (img) img.remove();

      if (reducedMotion) {
        footers[i].innerHTML = EYE_MARK_SVG;
      } else {
        footers[i].innerHTML = footerMarkHtml();
        startLogoLife(footers[i]);
      }

      footers[i].setAttribute('aria-label', 'Technovate home');
      footers[i].dataset.tvEyeMounted = '1';
    }
  }

  function mount() {
    mountHeaders();
    mountFooters();
  }

  function rand(min, max) {
    return min + Math.random() * (max - min);
  }

  function createEyeAnimator(floaterEl, options) {
    options = options || {};
    var unitEl = floaterEl.querySelector('.tv-eye-character');
    var gazeEl = floaterEl.querySelector('.tv-eye-character__gaze');
    var pupilEl = floaterEl.querySelector('.tv-eye-character__pupil');
    if (!unitEl || !gazeEl) return { stop: function () {}, setProjecting: function () {}, setSpeaking: function () {} };

    var unitSize = options.size || 112;
    var margin = options.margin || 72;
    var reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    if (reducedMotion) {
      floaterEl.style.transform =
        'translate(calc(50vw - ' + (unitSize * 0.5) + 'px), calc(34vh - ' + (unitSize * 0.5) + 'px))';
      return {
        stop: function () {},
        setProjecting: function () {},
        setSpeaking: function () {}
      };
    }

    var running = true;
    var projecting = false;
    var speaking = false;
    var rafId = 0;
    var blinkTimer = null;
    var lookTimer = null;
    var happyTimer = null;

    var pos = { x: window.innerWidth * 0.5, y: window.innerHeight * 0.34 };
    var vel = { x: 0, y: 0 };
    var target = { x: pos.x, y: pos.y };
    var gaze = { x: 0, y: 0 };
    var gazeTarget = { x: 0, y: 0 };
    var tilt = 0;
    var floatPhase = Math.random() * Math.PI * 2;
    var mood = 'curious';

    function bounds() {
      return {
        minX: margin + unitSize * 0.5,
        maxX: window.innerWidth - margin - unitSize * 0.5,
        minY: margin + unitSize * 0.5,
        maxY: window.innerHeight - margin - unitSize * 0.5
      };
    }

    function pickTarget() {
      if (projecting) {
        target.x = window.innerWidth * 0.5 + rand(-28, 28);
        target.y = window.innerHeight * 0.7 + rand(-22, 22);
        gazeTarget.x = rand(-2, 2);
        gazeTarget.y = rand(-4, -1);
        return;
      }
      var b = bounds();
      var attempts = 0;
      var minDist = Math.min(window.innerWidth, window.innerHeight) * 0.26;
      do {
        target.x = rand(b.minX, b.maxX);
        target.y = rand(b.minY, b.maxY);
        attempts += 1;
      } while (attempts < 12 && Math.hypot(target.x - pos.x, target.y - pos.y) < minDist);
      pickGaze();
    }

    function pickGaze() {
      var reach = speaking ? 9 : 14;
      gazeTarget.x = rand(-reach, reach);
      gazeTarget.y = rand(-reach, reach);
    }

    function clampPos() {
      var b = bounds();
      if (pos.x < b.minX) { pos.x = b.minX; vel.x *= -0.35; }
      if (pos.x > b.maxX) { pos.x = b.maxX; vel.x *= -0.35; }
      if (pos.y < b.minY) { pos.y = b.minY; vel.y *= -0.35; }
      if (pos.y > b.maxY) { pos.y = b.maxY; vel.y *= -0.35; }
    }

    function blink(kind) {
      if (!running) return;
      unitEl.classList.remove('tv-eye-character--blink', 'tv-eye-character--happy-blink');
      void unitEl.offsetWidth;
      unitEl.classList.add('tv-eye-character--blink');
      if (kind === 'happy') unitEl.classList.add('tv-eye-character--happy-blink');
      setTimeout(function () {
        unitEl.classList.remove('tv-eye-character--blink', 'tv-eye-character--happy-blink');
      }, kind === 'happy' ? 260 : 180);
    }

    function scheduleBlink() {
      if (!running) return;
      clearTimeout(blinkTimer);
      var delay = speaking ? rand(1800, 3200) : rand(2400, 5200);
      blinkTimer = setTimeout(function () {
        if (!running) return;
        if (Math.random() < 0.18) {
          blink('normal');
          setTimeout(function () { blink('normal'); }, 220);
        } else {
          blink(Math.random() < 0.12 ? 'happy' : 'normal');
        }
        scheduleBlink();
      }, delay);
    }

    function scheduleLook() {
      if (!running) return;
      clearTimeout(lookTimer);
      lookTimer = setTimeout(function () {
        if (!running) return;
        pickGaze();
        scheduleLook();
      }, rand(900, 2200));
    }

    function scheduleHappy() {
      if (!running) return;
      clearTimeout(happyTimer);
      happyTimer = setTimeout(function () {
        if (!running || !speaking) {
          scheduleHappy();
          return;
        }
        mood = 'happy';
        unitEl.classList.add('tv-eye-character--delighted');
        blink('happy');
        setTimeout(function () {
          unitEl.classList.remove('tv-eye-character--delighted');
          mood = 'curious';
        }, 900);
        scheduleHappy();
      }, rand(4200, 7800));
    }

    function tick(time) {
      if (!running) return;

      var t = time * 0.001;
      var dx = target.x - pos.x;
      var dy = target.y - pos.y;
      var dist = Math.hypot(dx, dy);

      if (dist > 1) {
        var thrust = projecting
          ? 0.04 + Math.min(dist, 110) * 0.00014
          : 0.02 + Math.min(dist, 190) * 0.00009;
        vel.x += (dx / dist) * thrust;
        vel.y += (dy / dist) * thrust;
      }

      vel.x += Math.sin(t * 0.7 + floatPhase) * (projecting ? 0.003 : 0.011);
      vel.y += Math.cos(t * 0.55 + floatPhase * 1.2) * (projecting ? 0.004 : 0.013);
      vel.y -= projecting ? 0.0012 : 0.003;

      vel.x *= projecting ? 0.974 : 0.988;
      vel.y *= projecting ? 0.974 : 0.988;

      pos.x += vel.x;
      pos.y += vel.y;
      clampPos();

      var speed = Math.hypot(vel.x, vel.y);
      if (dist < 50 || speed < 0.1) pickTarget();

      gaze.x += (gazeTarget.x - gaze.x) * (speaking ? 0.14 : 0.09);
      gaze.y += (gazeTarget.y - gaze.y) * (speaking ? 0.14 : 0.09);
      gazeEl.style.transform = 'translate(' + gaze.x + 'px,' + gaze.y + 'px)';

      var depth = 0.88 + (pos.y / Math.max(window.innerHeight, 1)) * 0.18;
      var bob = Math.sin(t * 2.2 + floatPhase) * 0.035;
      var scale = depth + bob;
      var bank = Math.atan2(vel.y, vel.x + 0.001) * 0.22;
      tilt += (bank - tilt) * 0.05;
      var lift = Math.sin(t * 1.5) * 2.5;

      floaterEl.style.transform =
        'translate3d(' + (pos.x - unitSize * 0.5) + 'px,' + (pos.y - unitSize * 0.5 + lift) + 'px,0) ' +
        'rotate(' + tilt + 'rad) scale(' + scale + ')';

      if (pupilEl) {
        var pupilScale = speaking ? 1.08 + Math.sin(t * 5) * 0.04 : 1;
        pupilEl.style.transform = 'scale(' + pupilScale + ')';
      }

      rafId = requestAnimationFrame(tick);
    }

    pickTarget();
    scheduleBlink();
    scheduleLook();
    scheduleHappy();
    rafId = requestAnimationFrame(tick);

    return {
      stop: function () {
        running = false;
        cancelAnimationFrame(rafId);
        clearTimeout(blinkTimer);
        clearTimeout(lookTimer);
        clearTimeout(happyTimer);
      },
      setProjecting: function (on) {
        projecting = !!on;
        unitEl.classList.toggle('tv-eye-character--projecting', projecting);
        pickTarget();
        if (projecting) blink('happy');
      },
      setSpeaking: function (on) {
        speaking = !!on;
        unitEl.classList.toggle('tv-eye-character--speaking', speaking);
        if (speaking) {
          gazeTarget.x = 0;
          gazeTarget.y = -2;
        } else {
          pickGaze();
        }
      }
    };
  }

  window.TechnovateLogo = {
    eyeIconSvg: function () { return EYE_ICON_SVG; },
    eyeMarkSvg: function () { return EYE_MARK_SVG; },
    logoEyeHtml: buildLogoEyeHtml,
    footerMarkHtml: footerMarkHtml,
    characterHtml: function () { return CHARACTER_HTML; },
    holoEyeHtml: holoEyeHtml,
    holoPortalHtml: holoPortalHtml,
    holoMarkHtml: holoPortalHtml,
    createHoloEyeLife: createHoloEyeLife,
    mount: mount,
    createEyeAnimator: createEyeAnimator
  };

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', mount);
  } else {
    mount();
  }
})();
