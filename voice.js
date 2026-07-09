/* ============================================
   Technovate — Homepage intro
   Binary AI face + optional Attenborough narration
   ============================================ */
(function () {
  'use strict';

  var INTRO_KEY = 'technovate_intro_done';
  var synth = window.speechSynthesis;
  var britishVoice = null;
  var narrationPlaying = false;
  var faceRenderer = null;
  var matrixRenderer = null;

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

  function isHomepage() {
    var page = window.location.pathname.split('/').pop() || 'index.html';
    return page === 'index.html' || page === '' || page.indexOf('.html') === -1;
  }

  function findBritishVoice() {
    if (!synth) return null;
    var voices = synth.getVoices();
    var priority = ['Google UK English Male', 'Microsoft George', 'Daniel', 'en-GB'];
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

  function speak(text, onEnd) {
    if (!synth) {
      if (onEnd) onEnd();
      return;
    }
    var utter = new SpeechSynthesisUtterance(text);
    utter.voice = britishVoice;
    utter.rate = 0.78;
    utter.pitch = 0.88;
    utter.onend = onEnd;
    utter.onerror = onEnd;
    synth.speak(utter);
  }

  function setSpeaking(active) {
    narrationPlaying = active;
    if (faceRenderer) faceRenderer.setSpeaking(active);
    var wave = document.getElementById('intro-wave');
    if (wave) wave.classList.toggle('intro-wave--active', active);
  }

  function speakSequence(lines, index, callback) {
    if (index >= lines.length) {
      setSpeaking(false);
      if (callback) callback();
      return;
    }
    var line = lines[index];
    updateSubtitle(line.text);
    speak(line.text, function () {
      setTimeout(function () {
        speakSequence(lines, index + 1, callback);
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

  function createIntroScreen() {
    var intro = document.createElement('div');
    intro.id = 'cinematic-intro';
    intro.innerHTML =
      '<div class="intro-backdrop"></div>' +
      '<canvas class="intro-matrix-bg" id="intro-matrix-bg" aria-hidden="true"></canvas>' +
      '<button class="intro-enter" id="intro-enter" type="button" aria-label="Skip intro and enter website">Skip intro</button>' +
      '<div class="intro-content intro-content--face">' +
        '<div class="intro-face-wrap">' +
          '<canvas class="intro-binary-face" id="intro-binary-face" aria-hidden="true"></canvas>' +
          '<div class="intro-face-glow" aria-hidden="true"></div>' +
        '</div>' +
        '<p class="intro-subtitle" id="intro-subtitle">An optional welcome from Technovate</p>' +
        '<div class="intro-wave" id="intro-wave">' +
          '<span></span><span></span><span></span><span></span><span></span>' +
        '</div>' +
        '<p class="intro-brand">Technovate</p>' +
        '<p class="intro-tagline">Technology &amp; AI for health, wealth, and growth</p>' +
      '</div>' +
      '<div class="intro-actions">' +
        '<button class="intro-btn intro-btn--primary" id="intro-enter-bottom" type="button">Skip intro</button>' +
        '<button class="intro-btn intro-btn--ghost" id="intro-narration" type="button">Play introduction</button>' +
      '</div>';
    document.body.appendChild(intro);
    document.body.classList.add('intro-active');
    return intro;
  }

  function closeIntro() {
    if (synth) synth.cancel();
    setSpeaking(false);
    if (faceRenderer) {
      faceRenderer.stop();
      faceRenderer = null;
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
    if (narrationPlaying) return;
    setSpeaking(true);

    if (!synth) {
      var idx = 0;
      function nextLine() {
        if (idx >= INTRO_SCRIPT.length) {
          setSpeaking(false);
          return;
        }
        updateSubtitle(INTRO_SCRIPT[idx].text);
        var pause = INTRO_SCRIPT[idx].pause || 800;
        idx++;
        setTimeout(nextLine, pause + 1800);
      }
      nextLine();
      return;
    }

    speakSequence(INTRO_SCRIPT, 0, function () {
      updateSubtitle('Do come in.');
    });
  }

  function initIntroRenderers(intro) {
    var canvas = document.getElementById('intro-binary-face');
    var matrixCanvas = document.getElementById('intro-matrix-bg');

    if (window.TechnovateBinaryFace && matrixCanvas) {
      matrixRenderer = window.TechnovateBinaryFace.createMatrixRain(matrixCanvas, {
        fontSize: 18,
        trailLen: 28,
        fadeAlpha: 0.07,
        headAlpha: 0.9,
        bodyAlpha: 0.5,
        speedMin: 2,
        speedMax: 5
      });
    }

    if (window.TechnovateBinaryFace && canvas) {
      faceRenderer = window.TechnovateBinaryFace.create(canvas);
    }

    requestAnimationFrame(function () {
      if (matrixRenderer && matrixRenderer.refresh) matrixRenderer.refresh();
      if (faceRenderer && faceRenderer.refresh) faceRenderer.refresh();
    });
  }

  function runIntro() {
    var intro = createIntroScreen();

    requestAnimationFrame(function () {
      intro.classList.add('intro--active');
      requestAnimationFrame(function () {
        initIntroRenderers(intro);
      });
    });

    function onEnter() {
      closeIntro();
    }

    document.getElementById('intro-enter').addEventListener('click', onEnter);
    document.getElementById('intro-enter-bottom').addEventListener('click', onEnter);
    document.getElementById('intro-narration').addEventListener('click', startNarration);

    document.addEventListener('keydown', function onKey(e) {
      if (e.key === 'Escape') {
        document.removeEventListener('keydown', onKey);
        onEnter();
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
