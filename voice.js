/* ============================================
   Technovate — Homepage intro (visual only)
   Optional narration on intro screen only
   ============================================ */
(function () {
  'use strict';

  var SESSION_KEY = 'technovate_intro_done';
  var synth = window.speechSynthesis;
  var britishVoice = null;
  var narrationPlaying = false;
  var stopMatrixFn = null;

  var INTRO_SCRIPT = [
    { text: 'Here, in the digital realm, something rather remarkable is taking shape.', pause: 1200 },
    { text: 'Technovate.', pause: 1400 },
    { text: 'A place where artificial intelligence is crafted with purpose.', pause: 1200 },
    { text: 'For health. For learning. For the bonds that hold communities together.', pause: 1400 },
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

  function speakSequence(lines, index, callback) {
    if (index >= lines.length) {
      narrationPlaying = false;
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
      '<canvas class="intro-matrix" aria-hidden="true"></canvas>' +
      '<button class="intro-enter" id="intro-enter" type="button">Enter website</button>' +
      '<div class="intro-content">' +
        '<div class="intro-logo">' +
          '<div class="intro-logo-icon">' +
            '<svg viewBox="0 0 24 24"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-1 17.93c-3.94-.49-7-3.85-7-7.93 0-.62.08-1.22.21-1.79L9 15v1c0 1.1.9 2 2 2v1.93zm6.9-2.54c-.26-.81-1-1.39-1.9-1.39h-1v-3c0-.55-.45-1-1-1H8v-2h2c.55 0 1-.45 1-1V7h2c1.1 0 2-.9 2-2v-.41c2.93 1.19 5 4.06 5 7.41 0 2.08-.8 3.97-2.1 5.39z"/></svg>' +
          '</div>' +
          '<span class="intro-logo-text">Technovate</span>' +
        '</div>' +
        '<p class="intro-tagline">Technology &amp; AI for health, wealth, and growth</p>' +
        '<p class="intro-subtitle" id="intro-subtitle"></p>' +
        '<div class="intro-wave" id="intro-wave" hidden>' +
          '<span></span><span></span><span></span><span></span><span></span>' +
        '</div>' +
      '</div>' +
      '<div class="intro-actions">' +
        '<button class="intro-btn intro-btn--primary" id="intro-enter-bottom" type="button">Enter website</button>' +
        '<button class="intro-btn intro-btn--ghost" id="intro-narration" type="button">Play introduction</button>' +
      '</div>';
    document.body.appendChild(intro);
    document.body.classList.add('intro-active');
    return intro;
  }

  function initIntroMatrix(canvas) {
    var ctx = canvas.getContext('2d');
    var W, H, cols = [];
    var fontSize = 16;
    var chars = '01';

    function resize() {
      W = canvas.width = window.innerWidth;
      H = canvas.height = window.innerHeight;
      var colCount = Math.floor(W / fontSize);
      cols = [];
      for (var i = 0; i < colCount; i++) {
        cols.push({ y: Math.random() * H, speed: 0.4 + Math.random() * 0.6 });
      }
    }

    function draw() {
      ctx.fillStyle = 'rgba(6, 11, 24, 0.1)';
      ctx.fillRect(0, 0, W, H);
      ctx.font = fontSize + 'px monospace';
      for (var i = 0; i < cols.length; i++) {
        var col = cols[i];
        var ch = chars[Math.floor(Math.random() * chars.length)];
        ctx.fillStyle = Math.random() > 0.92
          ? 'rgba(0, 212, 255, 0.7)'
          : 'rgba(0, 212, 255, ' + (0.15 + Math.random() * 0.25) + ')';
        ctx.fillText(ch, i * fontSize, col.y);
        col.y += col.speed * 2;
        if (col.y > H && Math.random() > 0.98) col.y = 0;
      }
    }

    resize();
    window.addEventListener('resize', resize);
    var animId;
    function loop() {
      draw();
      animId = requestAnimationFrame(loop);
    }
    loop();
    return function stop() {
      cancelAnimationFrame(animId);
    };
  }

  function closeIntro() {
    if (synth) synth.cancel();
    narrationPlaying = false;
    if (stopMatrixFn) stopMatrixFn();

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

    sessionStorage.setItem(SESSION_KEY, '1');
  }

  function startNarration() {
    if (!synth || narrationPlaying) return;
    narrationPlaying = true;
    var wave = document.getElementById('intro-wave');
    if (wave) {
      wave.hidden = false;
      wave.classList.add('intro-wave--active');
    }
    speakSequence(INTRO_SCRIPT, 0, function () {
      if (wave) wave.classList.remove('intro-wave--active');
    });
  }

  function runIntro() {
    var intro = createIntroScreen();
    stopMatrixFn = initIntroMatrix(intro.querySelector('.intro-matrix'));

    requestAnimationFrame(function () {
      intro.classList.add('intro--active');
      setTimeout(function () {
        intro.querySelector('.intro-logo').classList.add('intro-logo--visible');
      }, 200);
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
    if (sessionStorage.getItem(SESSION_KEY) === '1') return;

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
      sessionStorage.removeItem(SESSION_KEY);
    }
  };
})();
