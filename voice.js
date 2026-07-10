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
  var hatchRevealTimer = null;
  var eyeSettleTimer = null;
  var holoPanelTimer = null;
  var hatchAudioTimer = null;
  var flashTimer = null;
  var chargeTimer = null;
  var holoEyeLife = null;
  var introMusic = null;
  var introNarration = null;
  var musicEnabled = true;
  var useSpeechFallback = false;
  var narrationTimer = null;
  var loopTimer = null;
  var introClosed = false;
  var MUSIC_PRE_ROLL_MS = 1600;
  var LOOP_PAUSE_MS = 2800;
  var NOSE_CHARGE_MS = 1300;
  var NOSE_FLASH_MS = 550;
  var PROJECTOR_BEAM_MS = 1500;
  var EYE_ALIVE_MS = 2200;
  var HOLO_PANEL_MS = 700;
  var introActivated = false;

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


  function holoPortalHtml() {
    if (window.TechnovateLogo && window.TechnovateLogo.holoPortalHtml) {
      return window.TechnovateLogo.holoPortalHtml();
    }
    return '';
  }

  function startHoloEyeLife() {
    if (!window.TechnovateLogo) return;
    var unit = document.getElementById('intro-holo-eye-unit');
    if (!unit) return;
    if (holoEyeLife) holoEyeLife.stop();
    holoEyeLife = window.TechnovateLogo.createHoloEyeLife(unit);
  }

  function stopHoloEyeLife() {
    if (holoEyeLife) {
      holoEyeLife.stop();
      holoEyeLife = null;
    }
  }

  var ASTRO_HEAD_HTML =
    '<div class="intro-astro-dock" id="intro-astro-dock">' +
      '<p class="intro-astro-prompt" id="intro-astro-prompt">Press the red button to begin</p>' +
      '<div class="intro-astro-head" id="intro-astro-head">' +
        '<div class="intro-astro-dome" id="intro-astro-dome">' +
          '<div class="intro-astro-dome__shine"></div>' +
          '<div class="intro-astro-dome__blue intro-astro-dome__blue--left"></div>' +
          '<div class="intro-astro-dome__blue intro-astro-dome__blue--right"></div>' +
          '<div class="intro-astro-sensor" id="intro-astro-sensor">' +
            '<div class="intro-astro-projector" id="intro-astro-projector">' +
              '<div class="intro-astro-sensor__glow"></div>' +
              '<div class="intro-astro-sensor__housing"></div>' +
              '<div class="intro-astro-sensor__ring"></div>' +
              '<div class="intro-astro-sensor__lens" id="intro-astro-sensor-lens">' +
                '<div class="intro-astro-crypto-wheel" id="intro-astro-crypto-wheel" aria-hidden="true">' +
                  '<svg class="intro-astro-crypto-wheel__svg" viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">' +
                    cryptoWheelSvg() +
                  '</svg>' +
                '</div>' +
              '</div>' +
              '<div class="intro-astro-nose-flash" id="intro-astro-nose-flash" aria-hidden="true"></div>' +
              '<div class="intro-astro-projector-beam" id="intro-astro-projector-beam" aria-hidden="true">' +
                '<div class="intro-astro-projector-beam__core"></div>' +
                '<div class="intro-astro-projector-beam__dust"></div>' +
                '<div class="intro-astro-projector-beam__scanlines"></div>' +
              '</div>' +
            '</div>' +
          '</div>' +
        '</div>' +
        '<div class="intro-astro-body">' +
          '<button class="intro-astro-button" id="intro-astro-button" type="button" aria-label="Activate hologram">' +
            '<span class="intro-astro-button__pulse" aria-hidden="true"></span>' +
            '<span class="intro-astro-button__core"></span>' +
          '</button>' +
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
    var astroHead = document.getElementById('intro-astro-head');
    if (astroHead) astroHead.classList.toggle('intro-astro-head--speaking', active);
    if (holoEyeLife && holoEyeLife.setSpeaking) holoEyeLife.setSpeaking(active);
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
    revealHoloPanel();
    ensureAudioPhase();
    startNarration();
  }

  function ensureAudioPhase() {
    var intro = document.getElementById('cinematic-intro');
    var stage = document.getElementById('intro-holo-stage');
    var projection = document.getElementById('intro-projection');
    var enterBtn = document.getElementById('intro-enter-main');
    if (intro) intro.classList.add('intro--holo-focus');
    if (stage) {
      stage.classList.remove('intro-holo-stage--waiting', 'intro-holo-stage--portal-opening', 'intro-holo-stage--eye-alive');
      stage.classList.add('intro-holo-stage--holo-revealed', 'intro-holo-stage--audio');
    }
    if (projection) projection.classList.add('intro-projection--audio');
    if (enterBtn) enterBtn.classList.remove('intro-enter-btn--hidden');
  }

  function revealHoloPanel() {
    if (introClosed) return;
    var intro = document.getElementById('cinematic-intro');
    var stage = document.getElementById('intro-holo-stage');
    var sacred = document.getElementById('intro-sacred-geo');
    var enterBtn = document.getElementById('intro-enter-main');
    if (intro) intro.classList.add('intro--holo-focus');
    if (stage) {
      stage.classList.remove('intro-holo-stage--eye-alive');
      stage.classList.add('intro-holo-stage--holo-revealed');
    }
    if (sacred) sacred.classList.add('intro-sacred-geo--active');
    if (enterBtn) enterBtn.classList.remove('intro-enter-btn--hidden');
  }

  function cryptoWheelRing(cx, cy, radius, count, charset, layer) {
    var markup = '<g class="intro-astro-crypto-wheel__rotor intro-astro-crypto-wheel__rotor--' + layer + '">';
    markup += '<circle cx="' + cx + '" cy="' + cy + '" r="' + radius + '" class="intro-astro-crypto-wheel__track"/>';
    var i;
    for (i = 0; i < count; i++) {
      var angle = (i / count) * Math.PI * 2 - Math.PI / 2;
      var x = cx + Math.cos(angle) * radius;
      var y = cy + Math.sin(angle) * radius;
      markup += '<text x="' + x.toFixed(1) + '" y="' + y.toFixed(1) + '" class="intro-astro-crypto-wheel__glyph">' +
        charset.charAt(i % charset.length) + '</text>';
    }
    markup += '</g>';
    return markup;
  }

  function cryptoWheelSvg() {
    return (
      cryptoWheelRing(50, 50, 43, 16, '01F3A9C7E2B4D806', 'outer') +
      cryptoWheelRing(50, 50, 30, 12, 'C0DEAE5719F0', 'mid') +
      cryptoWheelRing(50, 50, 18, 8, '5EC8R2PT', 'inner') +
      '<circle cx="50" cy="50" r="7" class="intro-astro-crypto-wheel__hub"/>' +
      '<circle cx="50" cy="50" r="2.2" class="intro-astro-crypto-wheel__pin"/>'
    );
  }

  function openHatchAndProject() {
    if (introClosed || introActivated) return;
    introActivated = true;

    var prompt = document.getElementById('intro-astro-prompt');
    var btn = document.getElementById('intro-astro-button');
    var sensor = document.getElementById('intro-astro-sensor');
    var head = document.getElementById('intro-astro-head');
    var stage = document.getElementById('intro-holo-stage');
    var projection = document.getElementById('intro-projection');
    var holoPortal = document.getElementById('intro-holo-portal');

    if (prompt) prompt.classList.add('intro-astro-prompt--hidden');
    if (btn) {
      btn.disabled = true;
      btn.classList.add('intro-astro-button--used');
    }
    if (sensor) sensor.classList.add('intro-astro-sensor--activating');
    if (head) head.classList.add('intro-astro-head--activating');

    clearTimeout(hatchRevealTimer);
    clearTimeout(eyeSettleTimer);
    clearTimeout(holoPanelTimer);
    clearTimeout(hatchAudioTimer);
    clearTimeout(flashTimer);
    clearTimeout(chargeTimer);

    ensureMusic();
    if (introMusic && musicEnabled && introMusic.unlock) introMusic.unlock();

    chargeTimer = setTimeout(function () {
      if (introClosed) return;
      if (sensor) sensor.classList.add('intro-astro-sensor--charging');
      if (head) head.classList.add('intro-astro-head--charging');
    }, NOSE_CHARGE_MS - 420);

    flashTimer = setTimeout(function () {
      if (introClosed) return;
      if (sensor) {
        sensor.classList.remove('intro-astro-sensor--activating', 'intro-astro-sensor--charging');
        sensor.classList.add('intro-astro-sensor--flashing');
      }
      if (head) {
        head.classList.remove('intro-astro-head--activating', 'intro-astro-head--charging');
        head.classList.add('intro-astro-head--flashing');
      }
      if (projection) projection.classList.add('intro-projection--flash');
    }, NOSE_CHARGE_MS);

    hatchRevealTimer = setTimeout(function () {
      if (introClosed) return;
      if (sensor) {
        sensor.classList.remove('intro-astro-sensor--flashing');
        sensor.classList.add('intro-astro-sensor--projecting');
      }
      if (head) {
        head.classList.remove('intro-astro-head--flashing', 'intro-astro-head--charging');
        head.classList.add('intro-astro-head--projecting');
      }
      if (projection) {
        projection.classList.remove('intro-projection--flash');
        projection.classList.add('intro-projection--active');
      }
      if (stage) {
        stage.classList.remove('intro-holo-stage--waiting');
        stage.classList.add('intro-holo-stage--portal-opening');
      }
      if (holoPortal) holoPortal.classList.add('intro-holo-portal--active');
    }, NOSE_CHARGE_MS + NOSE_FLASH_MS);

    eyeSettleTimer = setTimeout(function () {
      if (introClosed) return;
      if (stage) {
        stage.classList.remove('intro-holo-stage--portal-opening');
        stage.classList.add('intro-holo-stage--eye-alive');
      }
      if (holoPortal) holoPortal.classList.add('intro-holo-portal--settled');
      startHoloEyeLife();
    }, NOSE_CHARGE_MS + NOSE_FLASH_MS + PROJECTOR_BEAM_MS);

    holoPanelTimer = setTimeout(function () {
      revealHoloPanel();
    }, NOSE_CHARGE_MS + NOSE_FLASH_MS + PROJECTOR_BEAM_MS + EYE_ALIVE_MS);

    hatchAudioTimer = setTimeout(function () {
      if (!introClosed) transitionToAudioPhase();
    }, NOSE_CHARGE_MS + NOSE_FLASH_MS + PROJECTOR_BEAM_MS + EYE_ALIVE_MS + HOLO_PANEL_MS);
  }

  function transitionToAudioPhase() {
    if (introClosed) return;
    ensureAudioPhase();
    startNarration();
  }

  function beginNarrationVoice() {
    narrationTimer = null;
    ensureNarration();

    if (useSpeechFallback || !introNarration) {
      setSpeaking(true);
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
    if (!musicEnabled) return;
    ensureMusic();
    if (!introMusic) return;
    if (introMusic.unlock) introMusic.unlock();
    introMusic.tryStart();
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
        setSpeaking(true);
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
    intro.className = 'holo-scanlines intro-cinematic';
    intro.innerHTML =
      '<div class="intro-backdrop"></div>' +
      '<canvas class="intro-matrix-bg" id="intro-matrix-bg" aria-hidden="true"></canvas>' +
      ASTRO_HEAD_HTML +
      '<div class="intro-vcr-overlay" aria-hidden="true">' +
        '<div class="intro-vcr-vignette"></div>' +
        '<div class="intro-vcr-scanlines"></div>' +
        '<div class="intro-vcr-tracking"></div>' +
        '<div class="intro-vcr-noise"></div>' +
      '</div>' +
      '<div class="intro-projection" id="intro-projection" aria-hidden="true">' +
        '<div class="intro-projection__flash" id="intro-projection-flash" aria-hidden="true"></div>' +
        '<div class="intro-projection__cone"></div>' +
        '<div class="intro-projection__beam"></div>' +
        '<div class="intro-projection__screen" aria-hidden="true"></div>' +
        '<div class="intro-projection__scanlines" aria-hidden="true"></div>' +
      '</div>' +
      '<div class="intro-sacred-geo" id="intro-sacred-geo" aria-hidden="true">' +
        '<div class="intro-sacred-geo__ring intro-sacred-geo__ring--outer"></div>' +
        '<div class="intro-sacred-geo__ring intro-sacred-geo__ring--mid"></div>' +
        '<div class="intro-sacred-geo__ring intro-sacred-geo__ring--inner"></div>' +
        '<div class="intro-sacred-geo__flower"></div>' +
      '</div>' +
      '<div class="intro-content intro-content--holo">' +
        '<div class="intro-holo-stage intro-holo-stage--waiting" id="intro-holo-stage">' +
          '<div class="intro-holo-stage__aura" aria-hidden="true"></div>' +
          '<div class="intro-holo-panel intro-holo-panel--dormant" id="intro-holo-panel">' +
            '<div class="intro-holo-panel__aura" aria-hidden="true"></div>' +
            holoPortalHtml() +
            '<div class="intro-holo-brand">' +
              '<h1 class="intro-logo-text intro-holo-brand__name">Technovate</h1>' +
              '<p class="intro-holo-brand__systems">Digital Systems</p>' +
            '</div>' +
            '<button class="intro-enter-btn intro-enter-btn--hidden" id="intro-enter-main" type="button" aria-label="Enter website">' +
              '<span class="intro-enter-btn__label">Enter</span>' +
              '<span class="intro-enter-btn__key" aria-hidden="true">↵</span>' +
            '</button>' +
            '<div class="intro-holo-audio" id="intro-holo-audio">' +
              '<p class="intro-subtitle" id="intro-subtitle">in the digital realm...</p>' +
              '<div class="intro-wave" id="intro-wave">' +
                '<span></span><span></span><span></span><span></span><span></span>' +
              '</div>' +
            '</div>' +
          '</div>' +
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
    introActivated = false;
    clearTimeout(hatchRevealTimer);
    clearTimeout(eyeSettleTimer);
    clearTimeout(holoPanelTimer);
    clearTimeout(hatchAudioTimer);
    clearTimeout(flashTimer);
    clearTimeout(chargeTimer);
    hatchRevealTimer = null;
    eyeSettleTimer = null;
    holoPanelTimer = null;
    hatchAudioTimer = null;
    flashTimer = null;
    chargeTimer = null;
    stopHoloEyeLife();
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
    updateSubtitle('Here...');
    setPrelude(true);
    tryStartMusic();

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

  function runIntro() {
    introClosed = false;
    introActivated = false;
    var intro = createIntroScreen();
    intro.classList.add('intro--active');
    initIntroRenderers();

    function enterSite() {
      closeIntro();
    }

    document.getElementById('intro-enter-main').addEventListener('click', function (e) {
      e.stopPropagation();
      enterSite();
    });
    document.getElementById('intro-astro-button').addEventListener('click', function (e) {
      e.stopPropagation();
      openHatchAndProject();
    });
    document.getElementById('intro-astro-dock').addEventListener('click', function (e) {
      if (e.target.closest('#intro-enter-main')) return;
      openHatchAndProject();
    });
    document.getElementById('intro-mute').addEventListener('click', function () {
      if (!introMusic) tryStartMusic();
      toggleMusic();
    });

    document.addEventListener('keydown', function onKey(e) {
      if (e.key === 'Escape' || e.key === 'Enter') {
        document.removeEventListener('keydown', onKey);
        enterSite();
      }
    });
  }

  function shouldForceIntro() {
    return /[?&](intro|reset)=1/.test(window.location.search);
  }

  function init() {
    if (!isHomepage()) return;
    if (shouldForceIntro()) {
      localStorage.removeItem(INTRO_KEY);
    }
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
