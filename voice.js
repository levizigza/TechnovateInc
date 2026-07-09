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
  var vcrClockTimer = null;
  var hatchRevealTimer = null;
  var hatchAudioTimer = null;
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
  var HATCH_OPEN_MS = 700;
  var HOLO_REVEAL_MS = 900;
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


  function eyeMarkHtml() {
    if (window.TechnovateLogo && window.TechnovateLogo.eyeMarkSvg) {
      return window.TechnovateLogo.eyeMarkSvg();
    }
    return '';
  }

  var ASTRO_HEAD_HTML =
    '<div class="intro-astro-dock" id="intro-astro-dock">' +
      '<p class="intro-astro-prompt" id="intro-astro-prompt">Press the red button to begin</p>' +
      '<div class="intro-astro-head" id="intro-astro-head">' +
        '<div class="intro-astro-holo-beam" id="intro-astro-holo-beam" aria-hidden="true"></div>' +
        '<div class="intro-astro-dome">' +
          '<div class="intro-astro-hatch intro-astro-hatch--left" aria-hidden="true"></div>' +
          '<div class="intro-astro-hatch intro-astro-hatch--right" aria-hidden="true"></div>' +
          '<div class="intro-astro-dome__shine"></div>' +
          '<div class="intro-astro-dome__blue intro-astro-dome__blue--left"></div>' +
          '<div class="intro-astro-dome__blue intro-astro-dome__blue--right"></div>' +
          '<div class="intro-astro-sensor">' +
            '<div class="intro-astro-sensor__glow"></div>' +
            '<div class="intro-astro-sensor__housing"></div>' +
            '<div class="intro-astro-sensor__ring"></div>' +
            '<div class="intro-astro-sensor__lens"></div>' +
          '</div>' +
        '</div>' +
        '<div class="intro-astro-body">' +
          '<div class="intro-astro-body__stripe"></div>' +
          '<button class="intro-astro-button" id="intro-astro-button" type="button" aria-label="Activate hologram">' +
            '<span class="intro-astro-button__pulse" aria-hidden="true"></span>' +
            '<span class="intro-astro-button__core"></span>' +
          '</button>' +
          '<div class="intro-astro-body__badge">ASTRO · MECH</div>' +
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
    ensureAudioPhase();
    startNarration();
  }

  function ensureAudioPhase() {
    var stage = document.getElementById('intro-holo-stage');
    var projection = document.getElementById('intro-projection');
    var mark = document.getElementById('intro-logo-mark');
    var enterBtn = document.getElementById('intro-enter-main');
    if (stage) {
      stage.classList.remove('intro-holo-stage--waiting', 'intro-holo-stage--projecting', 'intro-holo-stage--static');
      stage.classList.add('intro-holo-stage--audio');
    }
    if (projection) projection.classList.add('intro-projection--audio');
    if (mark) mark.classList.remove('intro-logo-mark--static');
    if (enterBtn) enterBtn.classList.remove('intro-enter-btn--hidden');
  }

  function openHatchAndProject() {
    if (introClosed || introActivated) return;
    introActivated = true;

    var head = document.getElementById('intro-astro-head');
    var prompt = document.getElementById('intro-astro-prompt');
    var btn = document.getElementById('intro-astro-button');
    var beam = document.getElementById('intro-astro-holo-beam');
    var stage = document.getElementById('intro-holo-stage');
    var projection = document.getElementById('intro-projection');
    var enterBtn = document.getElementById('intro-enter-main');

    tryStartMusic();

    if (head) head.classList.add('intro-astro-head--open');
    if (beam) beam.classList.add('intro-astro-holo-beam--active');
    if (prompt) prompt.classList.add('intro-astro-prompt--hidden');
    if (btn) {
      btn.disabled = true;
      btn.classList.add('intro-astro-button--used');
    }

    clearTimeout(hatchRevealTimer);
    clearTimeout(hatchAudioTimer);

    hatchRevealTimer = setTimeout(function () {
      if (introClosed) return;
      if (projection) projection.classList.add('intro-projection--active', 'intro-projection--revealed');
      if (stage) {
        stage.classList.remove('intro-holo-stage--waiting');
        stage.classList.add('intro-holo-stage--projecting', 'intro-holo-stage--static');
      }
    }, HATCH_OPEN_MS);

    hatchAudioTimer = setTimeout(function () {
      if (!introClosed) transitionToAudioPhase();
    }, HATCH_OPEN_MS + HOLO_REVEAL_MS);
  }

  function transitionToAudioPhase() {
    if (introClosed) return;
    ensureAudioPhase();
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
      ASTRO_HEAD_HTML +
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
      '<div class="intro-projection" id="intro-projection" aria-hidden="true">' +
        '<div class="intro-projection__cone"></div>' +
        '<div class="intro-projection__beam"></div>' +
      '</div>' +
      '<div class="intro-content intro-content--holo">' +
        '<div class="intro-holo-stage intro-holo-stage--waiting" id="intro-holo-stage">' +
          '<div class="intro-holo-panel" id="intro-holo-panel">' +
            '<div class="intro-holo-panel__frame" aria-hidden="true"></div>' +
            '<div class="intro-holo-panel__scanlines" aria-hidden="true"></div>' +
            '<div class="intro-holo-static" id="intro-holo-static">' +
              '<div class="intro-logo-mark intro-logo-mark--static" id="intro-logo-mark">' + eyeMarkHtml() + '</div>' +
              '<p class="intro-holo-tagline">Technology &amp; AI for health, wealth, and growth</p>' +
            '</div>' +
            '<div class="intro-holo-audio" id="intro-holo-audio">' +
              '<p class="intro-subtitle" id="intro-subtitle">in the digital realm...</p>' +
              '<div class="intro-wave" id="intro-wave">' +
                '<span></span><span></span><span></span><span></span><span></span>' +
              '</div>' +
            '</div>' +
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
    introActivated = false;
    clearTimeout(hatchRevealTimer);
    clearTimeout(hatchAudioTimer);
    hatchRevealTimer = null;
    hatchAudioTimer = null;
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

  function runIntro() {
    introClosed = false;
    introActivated = false;
    var intro = createIntroScreen();
    intro.classList.add('intro--active');
    initIntroRenderers();
    initVcrClock();

    function enterSite() {
      closeIntro();
    }

    document.getElementById('intro-enter-main').addEventListener('click', enterSite);
    document.getElementById('intro-astro-button').addEventListener('click', function () {
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
