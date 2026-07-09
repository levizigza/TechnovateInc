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
  var introMusic = null;
  var introNarration = null;
  var musicEnabled = true;
  var useSpeechFallback = false;
  var narrationTimer = null;
  var MUSIC_PRE_ROLL_MS = 3800;

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

  var GLOBE_SVG = '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-1 17.93c-3.94-.49-7-3.85-7-7.93 0-.62.08-1.22.21-1.79L9 15v1c0 1.1.9 2 2 2v1.93zm6.9-2.54c-.26-.81-1-1.39-1.9-1.39h-1v-3c0-.55-.45-1-1-1H8v-2h2c.55 0 1-.45 1-1V7h2c1.1 0 2-.9 2-2v-.41c2.93 1.19 5 4.06 5 7.41 0 2.08-.8 3.97-2.1 5.39z"/></svg>';

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

  function beginNarrationVoice() {
    narrationTimer = null;
    setSpeaking(true);
    ensureNarration();

    if (useSpeechFallback || !introNarration) {
      speakSequenceFallback(INTRO_SCRIPT, 0, function () {
        updateSubtitle('Do come in.');
        narrationPlaying = false;
      });
      return;
    }

    introNarration.play(function () {
      updateSubtitle('Do come in.');
      setSpeaking(false);
      narrationPlaying = false;
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
    intro.className = 'holo-scanlines';
    intro.innerHTML =
      '<div class="intro-backdrop"></div>' +
      '<canvas class="intro-matrix-bg" id="intro-matrix-bg" aria-hidden="true"></canvas>' +
      '<div class="intro-skip-bar">' +
        '<button class="intro-skip-bar__btn" id="intro-enter-main" type="button" aria-label="Skip intro and enter website">' +
          'Skip intro — Enter website →' +
        '</button>' +
      '</div>' +
      '<div class="intro-content intro-content--holo">' +
        '<div class="intro-logo intro-logo--visible">' +
          '<div class="intro-logo-icon">' + GLOBE_SVG + '</div>' +
          '<h1 class="intro-logo-text">Technovate</h1>' +
        '</div>' +
        '<p class="intro-subtitle" id="intro-subtitle">in the digital realm...</p>' +
        '<div class="intro-wave intro-wave--active" id="intro-wave">' +
          '<span></span><span></span><span></span><span></span><span></span>' +
        '</div>' +
      '</div>' +
      '<div class="intro-actions">' +
        '<button class="intro-btn intro-btn--ghost" id="intro-narration" type="button">Play introduction</button>' +
        '<button class="intro-btn intro-btn--mute" id="intro-mute" type="button" aria-pressed="false" title="Toggle intro music">Music on</button>' +
      '</div>';
    document.body.appendChild(intro);
    document.body.classList.add('intro-active');
    return intro;
  }

  function stopNarration() {
    clearNarrationTimer();
    if (synth) synth.cancel();
    if (introNarration) introNarration.stop();
    setSpeaking(false);
    setPrelude(false);
    narrationPlaying = false;
  }

  function closeIntro() {
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
    if (narrationPlaying || narrationTimer) return;

    narrationPlaying = true;
    tryStartMusic();
    updateSubtitle('Here...');
    setPrelude(true);

    var playBtn = document.getElementById('intro-narration');
    if (playBtn) {
      playBtn.disabled = true;
      playBtn.textContent = 'Playing…';
    }

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
    var intro = createIntroScreen();
    intro.classList.add('intro--active');
    initIntroRenderers();

    function enterSite() {
      closeIntro();
    }

    function unlockAudio() {
      tryStartMusic();
    }

    document.getElementById('intro-enter-main').addEventListener('click', enterSite);
    document.getElementById('intro-narration').addEventListener('click', function () {
      tryStartMusic();
      startNarration();
    });
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
