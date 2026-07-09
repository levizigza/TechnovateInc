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
    '<svg class="tv-logo-mark" viewBox="0 0 320 120" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="Technovate">' +
      '<defs>' +
        '<linearGradient id="tvMarkText" x1="0%" y1="0%" x2="100%" y2="0%">' +
          '<stop offset="0%" stop-color="#00d4ff"/>' +
          '<stop offset="50%" stop-color="#7ee8ff"/>' +
          '<stop offset="100%" stop-color="#00d4ff"/>' +
        '</linearGradient>' +
      '</defs>' +
      '<g transform="translate(60 60)">' +
        '<circle r="52" fill="rgba(0,212,255,0.08)"/>' +
        '<circle r="44" fill="#071018" stroke="#163a55" stroke-width="2"/>' +
        '<circle r="40" fill="none" stroke="#00d4ff" stroke-width="1" opacity="0.4"/>' +
        '<line x1="0" y1="-44" x2="0" y2="-34" stroke="#00d4ff" stroke-width="1.5" opacity="0.75"/>' +
        '<line x1="0" y1="34" x2="0" y2="44" stroke="#00d4ff" stroke-width="1.5" opacity="0.75"/>' +
        '<line x1="-44" y1="0" x2="-34" y2="0" stroke="#00d4ff" stroke-width="1.5" opacity="0.75"/>' +
        '<line x1="34" y1="0" x2="44" y2="0" stroke="#00d4ff" stroke-width="1.5" opacity="0.75"/>' +
        '<circle r="26" fill="none" stroke="#00d4ff" stroke-width="1.2" opacity="0.45" stroke-dasharray="4 6"/>' +
        '<circle r="17" fill="none" stroke="#00d4ff" stroke-width="1.8" opacity="0.65"/>' +
        '<circle r="11" fill="#00d4ff" opacity="0.95"/>' +
        '<circle r="4.5" fill="#ffffff"/>' +
        '<circle cx="3.5" cy="-3" r="1.6" fill="#ffffff" opacity="0.9"/>' +
      '</g>' +
      '<text x="132" y="72" fill="none" stroke="url(#tvMarkText)" stroke-width="1.4" ' +
        'font-family="Syne, Inter, sans-serif" font-size="34" font-weight="800" letter-spacing="6">' +
        'TECHNOVATE' +
      '</text>' +
      '<line x1="132" y1="88" x2="308" y2="88" stroke="#00d4ff" stroke-width="1" opacity="0.5"/>' +
      '<circle cx="220" cy="88" r="2.5" fill="#00d4ff" opacity="0.8"/>' +
    '</svg>';

  var CHARACTER_HTML =
    '<div class="tv-eye-floater" id="intro-eye-floater" aria-hidden="true">' +
      '<div class="tv-eye-character" id="intro-eye-unit">' +
        '<div class="tv-eye-character__aura"></div>' +
        '<div class="tv-eye-character__beam" aria-hidden="true"></div>' +
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
              '<div class="tv-eye-character__gaze" id="intro-eye-gaze">' +
                '<div class="tv-eye-character__iris">' +
                  '<div class="tv-eye-character__pupil"></div>' +
                  '<div class="tv-eye-character__shine"></div>' +
                '</div>' +
              '</div>' +
            '</div>' +
            '<div class="tv-eye-character__lid tv-eye-character__lid--top"></div>' +
            '<div class="tv-eye-character__lid tv-eye-character__lid--bottom"></div>' +
          '</div>' +
        '</div>' +
      '</div>' +
    '</div>';

  function mountHeaders() {
    var icons = document.querySelectorAll('.logo-icon');
    for (var i = 0; i < icons.length; i++) {
      if (!icons[i].querySelector('.tv-logo-eye')) {
        icons[i].innerHTML = EYE_ICON_SVG;
        icons[i].classList.add('logo-icon--eye');
      }
    }
  }

  function mountFooters() {
    var footers = document.querySelectorAll('.footer-logo');
    for (var i = 0; i < footers.length; i++) {
      var img = footers[i].querySelector('img');
      if (img) img.remove();
      if (!footers[i].querySelector('.tv-logo-mark')) {
        footers[i].innerHTML = EYE_MARK_SVG;
        footers[i].setAttribute('aria-label', 'Technovate home');
      }
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
    characterHtml: function () { return CHARACTER_HTML; },
    mount: mount,
    createEyeAnimator: createEyeAnimator
  };

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', mount);
  } else {
    mount();
  }
})();
