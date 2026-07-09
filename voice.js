/* ============================================
   Technovate — Cinematic Voice Experience
   British AI narrator with epic intro
   ============================================ */
(function () {
  'use strict';

  var STORAGE_KEY = 'technovate_intro_seen';
  var VOICE_PREF_KEY = 'technovate_voice_enabled';

  var synth = window.speechSynthesis;
  var britishVoice = null;
  var voiceEnabled = localStorage.getItem(VOICE_PREF_KEY) !== 'false';
  var introComplete = false;

  /* ---- Cinematic welcome script — Attenborough style ---- */
  var INTRO_SCRIPT = [
    { text: 'Here...', pause: 1000 },
    { text: 'in the digital realm...', pause: 1200 },
    { text: 'something rather remarkable is taking shape.', pause: 1400 },
    { text: 'Technovate.', pause: 1600 },
    { text: 'A place where artificial intelligence...', pause: 800 },
    { text: 'is being crafted with purpose.', pause: 1200 },
    { text: 'Not merely for commerce or convenience.', pause: 1000 },
    { text: 'But for health.', pause: 600 },
    { text: 'For learning.', pause: 600 },
    { text: 'For the bonds that hold communities together.', pause: 1400 },
    { text: 'Each line of code...', pause: 800 },
    { text: 'a small act of service to the human story.', pause: 1600 },
    { text: 'Do come in.', pause: 0 }
  ];

  /* ---- Find best British voice ---- */
  function findBritishVoice() {
    if (!synth) return null;
    var voices = synth.getVoices();
    var priority = [
      'Google UK English Male',
      'Google UK English Female',
      'Microsoft George',
      'Microsoft Hazel',
      'Daniel',
      'en-GB',
      'en_GB'
    ];
    for (var p = 0; p < priority.length; p++) {
      for (var v = 0; v < voices.length; v++) {
        var voice = voices[v];
        if (voice.name.indexOf(priority[p]) !== -1 || voice.lang.indexOf(priority[p]) !== -1) {
          return voice;
        }
      }
    }
    for (var i = 0; i < voices.length; i++) {
      if (voices[i].lang.startsWith('en-GB') || voices[i].lang.startsWith('en_GB')) {
        return voices[i];
      }
    }
    for (var j = 0; j < voices.length; j++) {
      if (voices[j].lang.startsWith('en')) {
        return voices[j];
      }
    }
    return voices[0] || null;
  }

  /* ---- Speak with Attenborough-style delivery ---- */
  function speak(text, onEnd) {
    if (!synth || !voiceEnabled) {
      if (onEnd) onEnd();
      return;
    }
    var utter = new SpeechSynthesisUtterance(text);
    utter.voice = britishVoice;
    utter.rate = 0.78;
    utter.pitch = 0.88;
    utter.volume = 1;
    utter.onend = onEnd;
    utter.onerror = onEnd;
    synth.speak(utter);
  }

  function speakSequence(lines, index, callback) {
    if (index >= lines.length) {
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

  /* ---- Create intro screen ---- */
  function createIntroScreen() {
    var intro = document.createElement('div');
    intro.id = 'cinematic-intro';
    intro.innerHTML =
      '<div class="intro-backdrop"></div>' +
      '<canvas class="intro-matrix" aria-hidden="true"></canvas>' +
      '<div class="intro-content">' +
        '<div class="intro-logo">' +
          '<div class="intro-logo-icon">' +
            '<svg viewBox="0 0 24 24"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-1 17.93c-3.94-.49-7-3.85-7-7.93 0-.62.08-1.22.21-1.79L9 15v1c0 1.1.9 2 2 2v1.93zm6.9-2.54c-.26-.81-1-1.39-1.9-1.39h-1v-3c0-.55-.45-1-1-1H8v-2h2c.55 0 1-.45 1-1V7h2c1.1 0 2-.9 2-2v-.41c2.93 1.19 5 4.06 5 7.41 0 2.08-.8 3.97-2.1 5.39z"/></svg>' +
          '</div>' +
          '<span class="intro-logo-text">Technovate</span>' +
        '</div>' +
        '<p class="intro-subtitle" id="intro-subtitle"></p>' +
        '<div class="intro-wave">' +
          '<span></span><span></span><span></span><span></span><span></span>' +
        '</div>' +
      '</div>' +
      '<div class="intro-choices" id="intro-choices">' +
        '<p class="intro-prompt">How would you like to explore?</p>' +
        '<button class="intro-btn intro-btn--voice" id="btn-with-voice">' +
          '<span class="intro-btn-icon">🔊</span>' +
          '<span>Continue with AI Guide</span>' +
        '</button>' +
        '<button class="intro-btn intro-btn--silent" id="btn-silent">' +
          '<span class="intro-btn-icon">→</span>' +
          '<span>Enter Silently</span>' +
        '</button>' +
      '</div>' +
      '<button class="intro-skip" id="intro-skip">Skip intro</button>';
    document.body.appendChild(intro);
    return intro;
  }

  /* ---- Matrix rain for intro ---- */
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
        cols.push({ y: Math.random() * H, speed: 0.5 + Math.random() });
      }
    }

    function draw() {
      ctx.fillStyle = 'rgba(6, 11, 24, 0.08)';
      ctx.fillRect(0, 0, W, H);
      ctx.font = fontSize + 'px monospace';

      for (var i = 0; i < cols.length; i++) {
        var col = cols[i];
        var ch = chars[Math.floor(Math.random() * chars.length)];
        var brightness = Math.random();
        if (brightness > 0.95) {
          ctx.fillStyle = 'rgba(0, 212, 255, 0.95)';
        } else if (brightness > 0.8) {
          ctx.fillStyle = 'rgba(247, 37, 133, ' + (0.4 + brightness * 0.4) + ')';
        } else {
          ctx.fillStyle = 'rgba(0, 212, 255, ' + (0.2 + brightness * 0.4) + ')';
        }
        ctx.fillText(ch, i * fontSize, col.y);
        col.y += col.speed * 2;
        if (col.y > H && Math.random() > 0.98) {
          col.y = 0;
        }
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

  /* ---- Update subtitle text ---- */
  function updateSubtitle(text) {
    var el = document.getElementById('intro-subtitle');
    if (el) {
      el.textContent = text;
      el.classList.remove('intro-subtitle--fade');
      void el.offsetWidth;
      el.classList.add('intro-subtitle--fade');
    }
  }

  /* ---- Show choice buttons ---- */
  function showChoices() {
    var choices = document.getElementById('intro-choices');
    if (choices) {
      choices.classList.add('intro-choices--visible');
    }
  }

  /* ---- Close intro ---- */
  function closeIntro(withVoice) {
    var intro = document.getElementById('cinematic-intro');
    if (intro) {
      intro.classList.add('intro--closing');
      setTimeout(function () {
        intro.remove();
      }, 800);
    }
    localStorage.setItem(STORAGE_KEY, 'true');
    localStorage.setItem(VOICE_PREF_KEY, withVoice ? 'true' : 'false');
    voiceEnabled = withVoice;
    introComplete = true;

    if (withVoice) {
      createVoiceToggle();
    }
  }

  /* ---- Create persistent voice toggle ---- */
  function createVoiceToggle() {
    if (document.getElementById('voice-toggle')) return;

    var toggle = document.createElement('button');
    toggle.id = 'voice-toggle';
    toggle.className = 'voice-toggle' + (voiceEnabled ? ' voice-toggle--on' : '');
    toggle.setAttribute('aria-label', 'Toggle voice guide');
    toggle.innerHTML =
      '<svg class="voice-toggle__icon voice-toggle__icon--on" viewBox="0 0 24 24"><path d="M3 9v6h4l5 5V4L7 9H3zm13.5 3c0-1.77-1.02-3.29-2.5-4.03v8.05c1.48-.73 2.5-2.25 2.5-4.02zM14 3.23v2.06c2.89.86 5 3.54 5 6.71s-2.11 5.85-5 6.71v2.06c4.01-.91 7-4.49 7-8.77s-2.99-7.86-7-8.77z"/></svg>' +
      '<svg class="voice-toggle__icon voice-toggle__icon--off" viewBox="0 0 24 24"><path d="M16.5 12c0-1.77-1.02-3.29-2.5-4.03v2.21l2.45 2.45c.03-.2.05-.41.05-.63zm2.5 0c0 .94-.2 1.82-.54 2.64l1.51 1.51C20.63 14.91 21 13.5 21 12c0-4.28-2.99-7.86-7-8.77v2.06c2.89.86 5 3.54 5 6.71zM4.27 3L3 4.27 7.73 9H3v6h4l5 5v-6.73l4.25 4.25c-.67.52-1.42.93-2.25 1.18v2.06c1.38-.31 2.63-.95 3.69-1.81L19.73 21 21 19.73l-9-9L4.27 3zM12 4L9.91 6.09 12 8.18V4z"/></svg>';
    document.body.appendChild(toggle);

    toggle.addEventListener('click', function () {
      voiceEnabled = !voiceEnabled;
      localStorage.setItem(VOICE_PREF_KEY, voiceEnabled ? 'true' : 'false');
      toggle.classList.toggle('voice-toggle--on', voiceEnabled);
      if (!voiceEnabled && synth) {
        synth.cancel();
      }
    });
  }

  /* ---- Run intro sequence ---- */
  var stopMatrixFn = null;

  function runIntro() {
    var intro = createIntroScreen();
    stopMatrixFn = initIntroMatrix(intro.querySelector('.intro-matrix'));

    setTimeout(function () {
      intro.classList.add('intro--active');
    }, 100);

    setTimeout(function () {
      intro.querySelector('.intro-logo').classList.add('intro-logo--visible');
    }, 600);

    setTimeout(function () {
      intro.querySelector('.intro-wave').classList.add('intro-wave--active');
      speakSequence(INTRO_SCRIPT, 0, function () {
        setTimeout(showChoices, 500);
      });
    }, 1500);

    document.getElementById('btn-with-voice').addEventListener('click', function () {
      if (stopMatrixFn) stopMatrixFn();
      closeIntro(true);
    });

    document.getElementById('btn-silent').addEventListener('click', function () {
      if (stopMatrixFn) stopMatrixFn();
      closeIntro(false);
    });

    document.getElementById('intro-skip').addEventListener('click', function () {
      if (synth) synth.cancel();
      if (stopMatrixFn) stopMatrixFn();
      closeIntro(false);
    });
  }

  /* ---- Page narrations — Attenborough style ---- */
  var PAGE_NARRATIONS = {
    'about.html': 'And here we observe the origins of this endeavour. Built with patience. Designed with intention.',
    'technology.html': 'The technology at work here is quite extraordinary. Artificial intelligence, made transparent and accountable.',
    'solutions.html': 'Across five distinct territories, purpose-built tools are taking root.',
    'projects.html': 'A portfolio of work emerges. Each project, a response to genuine human need.',
    'impact.html': 'The effects ripple outward. Measurable change, touching lives in ways both seen and unseen.',
    'grants.html': 'Partnerships form the foundation. Prepared for scrutiny. Ready for accountability.',
    'contact.html': 'And so, should you wish to be part of this story, the invitation stands open.'
  };

  function narratePage() {
    if (!voiceEnabled || !introComplete) return;
    var page = window.location.pathname.split('/').pop() || 'index.html';
    var narration = PAGE_NARRATIONS[page];
    if (narration) {
      setTimeout(function () {
        speak(narration);
      }, 1000);
    }
  }

  /* ---- Init ---- */
  function init() {
    if (!synth) return;

    if (synth.getVoices().length) {
      britishVoice = findBritishVoice();
    }
    synth.onvoiceschanged = function () {
      britishVoice = findBritishVoice();
    };

    var page = window.location.pathname.split('/').pop() || 'index.html';
    var isHomepage = page === 'index.html' || page === '' || page.indexOf('.html') === -1;

    if (isHomepage) {
      runIntro();
    } else {
      introComplete = true;
      if (voiceEnabled) {
        createVoiceToggle();
        narratePage();
      }
    }
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }

  window.TechnovateVoice = {
    speak: speak,
    enable: function () {
      voiceEnabled = true;
      localStorage.setItem(VOICE_PREF_KEY, 'true');
    },
    disable: function () {
      voiceEnabled = false;
      localStorage.setItem(VOICE_PREF_KEY, 'false');
      if (synth) synth.cancel();
    },
    isEnabled: function () { return voiceEnabled; },
    resetIntro: function () {
      localStorage.removeItem(STORAGE_KEY);
      localStorage.removeItem(VOICE_PREF_KEY);
    }
  };
})();
