/* ============================================
   Technovate — Homepage intro
   Holographic logo + neural British narration
   ============================================ */
(function () {
  'use strict';

  var INTRO_KEY = 'technovate_intro_done';
  var synth = window.speechSynthesis;
  var britishVoice = null;
  var narrationPlaying = false;
  var matrixRenderer = null;
  var halFloater = null;
  var vcrClockTimer = null;
  var introMusic = null;
  var introNarration = null;
  var musicEnabled = true;
  var useSpeechFallback = false;
  var narrationTimer = null;
  var loopTimer = null;
  var introClosed = false;
  var MUSIC_PRE_ROLL_MS = 3800;
  var LOOP_PAUSE_MS = 2800;

  var INTRO_SCRIPT = [
    { text: 'Here...', pause: 900 },
    { text: 'in the digital realm...', pause: 1100 },
    { text: 'something rather remarkable is taking shape.', pause: 1300 },
    { text: 'Technovate.', pause: 1500 },
    { text: 'A place where artificial intelligence...', pause: 800 },
    { text: 'is being crafted with purpose.', pause: 1100 },
    { text: 'Not merely for commerce or convenience.', pause: 900 },
    { text: 'But for health.', pause: 500 },
    { text: 'For learning.', pause: 500 },
    { text: 'For the bonds that hold communities together.', pause: 1200 },
    { text: 'Each line of code...', pause: 700 },
    { text: 'a small act of service to the human story.', pause: 1400 },
    { text: 'Do come in.', pause: 0 }
  ];

  var GLOBE_SVG = '';

  var HAL_EYE_HTML =
    '<div class="intro-hal-floater" id="intro-hal-floater" aria-hidden="true">' +
      '<div class="intro-hal-eye" id="intro-hal-eye">' +
        '<div class="intro-hal-eye__glow"></div>' +
        '<div class="intro-hal-eye__housing"></div>' +
        '<div class="intro-hal-eye__rim"></div>' +
        '<div class="intro-hal-eye__lens">' +
          '<div class="intro-hal-eye__pupil"></div>' +
          '<div class="intro-hal-eye__glint"></div>' +
        '</div>' +
      '</div>' +
    '</div>';

  function isHomepage() {
    var page = window.location.pathname.split('/').pop() || 'index.html';
    return page === 'index.html' || page === '' || page.indexOf('.html') === -1;
  }

  function findBritishVoice() {
    if (!synth) return null;
    var voices = synth.getVoices();
    var priority = ['Microsoft Ryan Online', 'Google UK English Male', 'Microsoft George', 'Daniel', 'en-GB'];
    for (var p = 0; p < priority.length; p++) {
      for (var v = 0; v < voices.length; v++) {
        if (voices[v].name.indexOf(priority[p]) !== -1 || voices[v].lang.indexOf(priority[p]) !== -1) {
          return voices[v];
        }
      }
    }
    for (var i = 0; i < voices.length; i++) {
      if (voices[i].lang.indexOf('en-GB') === 0 || voices[i].lang.indexOf('en_GB') === 0) {
        return voices[i];
      }
    }
    return voices[0] || null;
  }

  function speakFallback(text, onEnd) {
    if (!synth) {
      if (onEnd) onEnd();
      return;
    }
    var utter = new SpeechSynthesisUtterance(text);
    utter.voice = britishVoice;
    utter.rate = 0.76;
    utter.pitch = 0.9;
    utter.onend = onEnd;
    utter.onerror = onEnd;
    synth.speak(utter);
  }

  function setPrelude(active) {
    var wave = document.getElementById('intro-wave');
    if (wave) wave.classList.toggle('intro-wave--active', active);
  }

  function setSpeaking(active) {
    narrationPlaying = active;
    var wave = document.getElementById('intro-wave');
    if (wave) wave.classList.toggle('intro-wave--active', active);
    var halEye = document.getElementById('intro-hal-eye');
    if (halEye) halEye.classList.toggle('intro-hal-eye--speaking', active);
    if (introMusic) {
      if (active) introMusic.duck();
      else introMusic.unduck();
    }
  }

  function clearNarrationTimer() {
    if (narrationTimer) {
      clearTimeout(narrationTimer);
      narrationTimer = null;
    }
  }

  function clearLoopTimer() {
    if (loopTimer) {
      clearTimeout(loopTimer);
      loopTimer = null;
    }
  }

  function onIntroCycleComplete() {
    if (introClosed) return;
    narrationPlaying = false;
    if (introMusic) introMusic.unduck();
    setPrelude(true);
    updateSubtitle('in the digital realm...');
    clearLoopTimer();
    loopTimer = setTimeout(function () {
      if (!introClosed) restartIntroCycle();
    }, LOOP_PAUSE_MS);
  }

  function restartIntroCycle() {
    if (introClosed || narrationPlaying || narrationTimer) return;
    if (introMusic) {
      introMusic.stop();
      introMusic = null;
    }
    if (introNarration) {
      introNarration.stop();
    }
    if (synth) synth.cancel();
    startNarration();
  }

  function beginNarrationVoice() {
    narrationTimer = null;
    setSpeaking(true);
    ensureNarration();

    if (useSpeechFallback || !introNarration) {
      speakSequenceFallback(INTRO_SCRIPT, 0, function () {
        updateSubtitle('Do come in.');
        onIntroCycleComplete();
      });
      return;
    }

    introNarration.play(function () {
      updateSubtitle('Do come in.');
      setSpeaking(false);
      onIntroCycleComplete();
    });
  }

  function speakSequenceFallback(lines, index, callback) {
    if (index >= lines.length) {
      setSpeaking(false);
      if (callback) callback();
      return;
    }
    var line = lines[index];
    updateSubtitle(line.text);
    speakFallback(line.text, function () {
      setTimeout(function () {
        speakSequenceFallback(lines, index + 1, callback);
      }, line.pause);
    });
  }

  function updateSubtitle(text) {
    var el = document.getElementById('intro-subtitle');
    if (!el) return;
    el.textContent = text;
    el.classList.remove('intro-subtitle--fade');
    void el.offsetWidth;
    el.classList.add('intro-subtitle--fade');
  }

  function ensureMusic() {
    if (!musicEnabled || introMusic) return;
    if (window.TechnovateIntroMusic) {
      introMusic = window.TechnovateIntroMusic.create();
    }
  }

  function tryStartMusic() {
    ensureMusic();
    if (introMusic && musicEnabled) introMusic.tryStart();
  }

  function toggleMusic() {
    var btn = document.getElementById('intro-mute');
    musicEnabled = !musicEnabled;
    if (!musicEnabled && introMusic) {
      introMusic.stop();
      introMusic = null;
    }
    if (btn) {
      btn.textContent = musicEnabled ? 'Music on' : 'Music off';
      btn.setAttribute('aria-pressed', musicEnabled ? 'false' : 'true');
    }
    if (musicEnabled) tryStartMusic();
  }

  function ensureNarration() {
    if (introNarration || useSpeechFallback) return;
    if (!window.TechnovateIntroNarration) {
      useSpeechFallback = true;
      return;
    }
    introNarration = window.TechnovateIntroNarration.create({
      onLine: function (text) {
        updateSubtitle(text);
      },
      onBlocked: function () {
        useSpeechFallback = true;
        if (introNarration) {
          introNarration.stop();
          introNarration = null;
        }
        startNarration();
      }
    });
  }

  function createIntroScreen() {
    var intro = document.createElement('div');
    intro.id = 'cinematic-intro';
    intro.className = 'holo-scanlines intro-vcr';
    intro.innerHTML =
      '<div class="intro-backdrop"></div>' +
      '<canvas class="intro-matrix-bg" id="intro-matrix-bg" aria-hidden="true"></canvas>' +
      HAL_EYE_HTML +
      '<div class="intro-vcr-overlay" aria-hidden="true">' +
        '<div class="intro-vcr-vignette"></div>' +
        '<div class="intro-vcr-scanlines"></div>' +
        '<div class="intro-vcr-tracking"></div>' +
        '<div class="intro-vcr-noise"></div>' +
        '<div class="intro-vcr-hud">' +
          '<span class="intro-vcr-rec"><span class="intro-vcr-rec__dot"></span> REC</span>' +
          '<span class="intro-vcr-time" id="intro-vcr-time">--:--:--</span>' +
        '</div>' +
      '</div>' +
      '<div class="intro-content intro-content--holo">' +
        '<div class="intro-holo-stage">' +
          '<h1 class="intro-logo-text intro-logo-text--visible">Technovate</h1>' +
          '<p class="intro-subtitle" id="intro-subtitle">in the digital realm...</p>' +
          '<div class="intro-wave intro-wave--active" id="intro-wave">' +
            '<span></span><span></span><span></span><span></span><span></span>' +
          '</div>' +
          '<button class="intro-enter-btn" id="intro-enter-main" type="button" aria-label="Enter website">' +
            '<span class="intro-enter-btn__label">Enter</span>' +
            '<span class="intro-enter-btn__key" aria-hidden="true">↵</span>' +
          '</button>' +
        '</div>' +
      '</div>' +
      '<button class="intro-mute-fab" id="intro-mute" type="button" aria-pressed="false" title="Toggle intro music">Music on</button>';
    document.body.appendChild(intro);
    document.body.classList.add('intro-active');
    return intro;
  }

  function stopNarration() {
    clearNarrationTimer();
    clearLoopTimer();
    if (synth) synth.cancel();
    if (introNarration) introNarration.stop();
    setSpeaking(false);
    setPrelude(false);
    narrationPlaying = false;
  }

  function closeIntro() {
    introClosed = true;
    stopNarration();
    introNarration = null;
    if (introMusic) {
      introMusic.stop();
      introMusic = null;
    }
    if (matrixRenderer) {
      matrixRenderer.stop();
      matrixRenderer = null;
    }
    if (halFloater) {
      halFloater.stop();
      halFloater = null;
    }
    if (vcrClockTimer) {
      clearInterval(vcrClockTimer);
      vcrClockTimer = null;
    }

    var intro = document.getElementById('cinematic-intro');
    if (intro) {
      intro.classList.add('intro--closing');
      setTimeout(function () {
        intro.remove();
        document.body.classList.remove('intro-active');
      }, 500);
    } else {
      document.body.classList.remove('intro-active');
    }

    localStorage.setItem(INTRO_KEY, '1');
  }

  function startNarration() {
    if (introClosed) return;
    if (narrationPlaying || narrationTimer) return;

    narrationPlaying = true;
    tryStartMusic();
    updateSubtitle('Here...');
    setPrelude(true);

    narrationTimer = setTimeout(beginNarrationVoice, MUSIC_PRE_ROLL_MS);
  }

  function initIntroRenderers() {
    var matrixCanvas = document.getElementById('intro-matrix-bg');

    if (window.TechnovateBinaryFace && matrixCanvas) {
      matrixRenderer = window.TechnovateBinaryFace.createMatrixRain(matrixCanvas, {
        fontSize: 14,
        trailLen: 30,
        fadeAlpha: 0.04,
        speedMin: 1.2,
        speedMax: 3.8
      });
    }

    function refreshRenderers() {
      if (matrixRenderer && matrixRenderer.refresh) matrixRenderer.refresh();
    }

    refreshRenderers();
    requestAnimationFrame(refreshRenderers);
    setTimeout(refreshRenderers, 50);
    setTimeout(refreshRenderers, 200);
    setTimeout(refreshRenderers, 600);
    window.addEventListener('resize', refreshRenderers);
  }

  function initVcrClock() {
    var el = document.getElementById('intro-vcr-time');
    if (!el) return;

    function pad(n) {
      return n < 10 ? '0' + n : String(n);
    }

    function tick() {
      var d = new Date();
      el.textContent = pad(d.getHours()) + ':' + pad(d.getMinutes()) + ':' + pad(d.getSeconds());
    }

    tick();
    vcrClockTimer = setInterval(tick, 1000);
  }

  function initHalFloater() {
    var el = document.getElementById('intro-hal-floater');
    if (!el) return null;

    var eyeSize = 104;
    var margin = 72;

    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      el.style.transform = 'translate(calc(50vw - ' + (eyeSize * 0.5) + 'px), calc(32vh - ' + (eyeSize * 0.5) + 'px))';
      return { stop: function () {} };
    }

    var pos = {
      x: window.innerWidth * 0.5,
      y: window.innerHeight * 0.35
    };
    var vel = { x: 0, y: 0 };
    var target = { x: pos.x, y: pos.y };
    var tilt = 0;
    var floatPhase = Math.random() * Math.PI * 2;
    var running = true;
    var rafId = 0;

    function bounds() {
      return {
        minX: margin + eyeSize * 0.5,
        maxX: window.innerWidth - margin - eyeSize * 0.5,
        minY: margin + eyeSize * 0.5,
        maxY: window.innerHeight - margin - eyeSize * 0.5
      };
    }

    function pickTarget() {
      var b = bounds();
      var attempts = 0;
      var minDist = Math.min(window.innerWidth, window.innerHeight) * 0.28;

      do {
        target.x = b.minX + Math.random() * (b.maxX - b.minX);
        target.y = b.minY + Math.random() * (b.maxY - b.minY);
        attempts += 1;
      } while (
        attempts < 12 &&
        Math.hypot(target.x - pos.x, target.y - pos.y) < minDist
      );
    }

    function clampPos() {
      var b = bounds();
      if (pos.x < b.minX) { pos.x = b.minX; vel.x *= -0.35; }
      if (pos.x > b.maxX) { pos.x = b.maxX; vel.x *= -0.35; }
      if (pos.y < b.minY) { pos.y = b.minY; vel.y *= -0.35; }
      if (pos.y > b.maxY) { pos.y = b.maxY; vel.y *= -0.35; }
    }

    pickTarget();

    function tick(time) {
      if (!running || introClosed) return;

      var t = time * 0.001;
      var dx = target.x - pos.x;
      var dy = target.y - pos.y;
      var dist = Math.hypot(dx, dy);

      if (dist > 1) {
        var thrust = 0.022 + Math.min(dist, 200) * 0.00008;
        vel.x += (dx / dist) * thrust;
        vel.y += (dy / dist) * thrust;
      }

      vel.x += Math.sin(t * 0.75 + floatPhase) * 0.012;
      vel.y += Math.cos(t * 0.58 + floatPhase * 1.3) * 0.014;
      vel.y -= 0.0035;

      vel.x *= 0.988;
      vel.y *= 0.988;

      pos.x += vel.x;
      pos.y += vel.y;
      clampPos();

      var speed = Math.hypot(vel.x, vel.y);
      if (dist < 55 || speed < 0.12) pickTarget();

      var depth = 0.86 + (pos.y / Math.max(window.innerHeight, 1)) * 0.22;
      var bob = Math.sin(t * 2.4 + floatPhase) * 0.04;
      var scale = depth + bob;
      var bank = Math.atan2(vel.y, vel.x + 0.001) * 0.28;
      tilt += (bank - tilt) * 0.055;

      var lift = Math.sin(t * 1.6) * 3;

      el.style.transform =
        'translate3d(' + (pos.x - eyeSize * 0.5) + 'px,' + (pos.y - eyeSize * 0.5 + lift) + 'px,0) ' +
        'rotate(' + tilt + 'rad) scale(' + scale + ')';

      rafId = requestAnimationFrame(tick);
    }

    rafId = requestAnimationFrame(tick);

    return {
      stop: function () {
        running = false;
        cancelAnimationFrame(rafId);
      }
    };
  }

  function runIntro() {
    introClosed = false;
    var intro = createIntroScreen();
    intro.classList.add('intro--active');
    initIntroRenderers();
    halFloater = initHalFloater();
    initVcrClock();

    function enterSite() {
      closeIntro();
    }

    function unlockAudio() {
      tryStartMusic();
    }

    document.getElementById('intro-enter-main').addEventListener('click', enterSite);
    document.getElementById('intro-mute').addEventListener('click', function () {
      if (!introMusic) tryStartMusic();
      toggleMusic();
    });

    intro.addEventListener('click', unlockAudio, { once: true });
    intro.addEventListener('touchstart', unlockAudio, { once: true, passive: true });

    setTimeout(function () {
      tryStartMusic();
      startNarration();
    }, 400);

    document.addEventListener('keydown', function onKey(e) {
      if (e.key === 'Escape') {
        document.removeEventListener('keydown', onKey);
        enterSite();
      }
    });
  }

  function init() {
    if (!isHomepage()) return;
    if (localStorage.getItem(INTRO_KEY) === '1') return;

    if (synth) {
      if (synth.getVoices().length) britishVoice = findBritishVoice();
      synth.onvoiceschanged = function () {
        britishVoice = findBritishVoice();
      };
    }

    runIntro();
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }

  window.TechnovateVoice = {
    resetIntro: function () {
      localStorage.removeItem(INTRO_KEY);
    }
  };
})();
