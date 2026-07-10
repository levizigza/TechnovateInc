/* ============================================
   Technovate — Nova holographic head assistant
   Floating human head replaces the chat box
   ============================================ */
(function () {
  'use strict';

  var KNOWLEDGE = {
    company: 'Technovate is a software development hub based in Calgary, Alberta, Canada. We build responsible AI and software solutions across five sectors: health, finance, education, enterprise, and community development.',
    contact: 'You can reach us at info@technovateinc.org. We are located in Calgary, Alberta, Canada. Visit our Contact page for more details.',
    sectors: 'We work across five sectors: Health and Wellness, Finance and Wealth, Education and Learning, Enterprise and Productivity, and Community and Relationships.',
    technology: 'Our technology stack is built on explainable AI, ethical data practices, and clear governance. Every solution is designed for auditability, compliance, and long-term scalability.',
    solutions: 'We offer purpose-built platforms for each sector, all sharing a unified technology foundation including AI orchestration, data governance, and institutional reporting.',
    projects: 'Our key projects include the Unified Platform Core, five sector-specific modules, and an impact reporting framework.',
    grants: 'We are structured for grant programs, accelerators, and institutional partnerships with transparent roadmaps and milestones.',
    impact: 'We measure impact through defined milestones, outcome tracking, and transparent reporting across all five sectors.',
    about: 'Technovate was founded to build technology that serves institutional and community needs, combining AI expertise with sector-specific domain knowledge.',
    careers: 'We are always looking for talented individuals passionate about AI and social impact. Reach out at info@technovateinc.org.'
  };

  var PATTERNS = [
    { keys: ['hello', 'hi', 'hey', 'greet'], response: 'Hello. I am Nova, your Technovate holographic guide. Tap me and ask about our company, sectors, technology, or how to get in touch.' },
    { keys: ['contact', 'email', 'reach', 'location', 'address', 'where', 'calgary'], response: KNOWLEDGE.contact },
    { keys: ['sector', 'health', 'finance', 'education', 'enterprise', 'community', 'industry'], response: KNOWLEDGE.sectors },
    { keys: ['tech', 'stack', 'ai', 'artificial', 'machine', 'explain'], response: KNOWLEDGE.technology },
    { keys: ['solution', 'product', 'offer', 'service', 'platform'], response: KNOWLEDGE.solutions },
    { keys: ['project', 'portfolio', 'built', 'develop'], response: KNOWLEDGE.projects },
    { keys: ['grant', 'fund', 'partnership', 'accelerator', 'invest'], response: KNOWLEDGE.grants },
    { keys: ['impact', 'measure', 'outcome', 'result', 'metric'], response: KNOWLEDGE.impact },
    { keys: ['about', 'who', 'company', 'mission', 'founded', 'what is technovate'], response: KNOWLEDGE.about },
    { keys: ['career', 'job', 'hiring', 'work', 'join', 'opportunity'], response: KNOWLEDGE.careers },
    { keys: ['help', 'can you', 'what can'], response: 'I can guide you through Technovate — sectors, technology, projects, grants, and contact details. Tap the microphone or speak to me directly.' },
    { keys: ['thank', 'thanks', 'bye', 'goodbye'], response: 'You are welcome. I am here whenever you need guidance. Have a wonderful day.' }
  ];

  var PROMPTS = [
    'What is Technovate?',
    'Your sectors',
    'Contact info',
    'Your technology'
  ];

  function aiHeadSvg(uid) {
    var e = 'rgba(0,212,255,0.62)';
    var eSoft = 'rgba(0,212,255,0.38)';
    var hi = 'rgba(210,248,255,0.48)';
    var mid = 'rgba(90,200,230,0.3)';
    var lo = 'rgba(24,90,120,0.42)';
    var sh = 'rgba(6,28,48,0.62)';
    var deep = 'rgba(2,10,22,0.82)';

    return (
      '<svg class="tv-nova-head__svg" viewBox="0 0 200 280" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">' +
        '<defs>' +
          '<radialGradient id="' + uid + 'Aura" cx="50%" cy="36%" r="58%">' +
            '<stop offset="0%" stop-color="rgba(0,212,255,0.28)"/>' +
            '<stop offset="100%" stop-color="rgba(0,0,0,0)"/>' +
          '</radialGradient>' +
          '<linearGradient id="' + uid + 'Lit" x1="20%" y1="0%" x2="80%" y2="100%">' +
            '<stop offset="0%" stop-color="rgba(220,252,255,0.55)"/>' +
            '<stop offset="100%" stop-color="rgba(0,160,210,0.22)"/>' +
          '</linearGradient>' +
        '</defs>' +
        '<ellipse cx="100" cy="132" rx="78" ry="98" fill="url(#' + uid + 'Aura)"/>' +
        '<g class="tv-nova-head__facets" stroke-linejoin="round">' +
          '<polygon points="74,54 126,54 118,68 82,68" fill="' + hi + '" stroke="' + e + '" stroke-width="0.65"/>' +
          '<polygon points="58,92 74,54 82,68 72,88" fill="' + mid + '" stroke="' + eSoft + '" stroke-width="0.55"/>' +
          '<polygon points="142,92 126,54 118,68 128,88" fill="' + lo + '" stroke="' + eSoft + '" stroke-width="0.55"/>' +
          '<polygon points="68,78 88,62 96,78 84,92" fill="' + hi + '" stroke="' + e + '" stroke-width="0.6"/>' +
          '<polygon points="132,78 112,62 104,78 116,92" fill="' + mid + '" stroke="' + e + '" stroke-width="0.6"/>' +
          '<polygon points="88,62 112,62 108,78 92,78" fill="url(#' + uid + 'Lit)" stroke="' + e + '" stroke-width="0.65"/>' +
          '<polygon points="84,92 96,78 108,78 116,92 108,102 92,102" fill="' + mid + '" stroke="' + e + '" stroke-width="0.6"/>' +
          '<polygon points="58,92 72,88 84,92 78,108 66,112" fill="' + lo + '" stroke="' + eSoft + '" stroke-width="0.55"/>' +
          '<polygon points="142,92 128,88 116,92 122,108 134,112" fill="' + sh + '" stroke="' + eSoft + '" stroke-width="0.55"/>' +
          '<g class="tv-nova-head__eye">' +
            '<polygon points="74,108 86,100 94,110 86,120" fill="' + deep + '" stroke="' + e + '" stroke-width="0.55"/>' +
            '<polygon points="86,100 92,102 90,108 84,106" fill="' + sh + '" stroke="none"/>' +
          '</g>' +
          '<g class="tv-nova-head__eye">' +
            '<polygon points="126,108 114,100 106,110 114,120" fill="' + deep + '" stroke="' + e + '" stroke-width="0.55"/>' +
            '<polygon points="114,100 108,102 110,108 116,106" fill="' + sh + '" stroke="none"/>' +
          '</g>' +
          '<polygon points="92,102 108,102 106,112 94,112" fill="' + lo + '" stroke="' + eSoft + '" stroke-width="0.5"/>' +
          '<polygon points="96,78 104,78 102,92 98,92" fill="' + hi + '" stroke="' + e + '" stroke-width="0.55"/>' +
          '<polygon points="98,92 102,92 104,108 100,118 96,108" fill="' + mid + '" stroke="' + e + '" stroke-width="0.6"/>' +
          '<polygon points="96,108 100,118 98,128 94,118" fill="' + lo + '" stroke="' + e + '" stroke-width="0.55"/>' +
          '<polygon points="104,108 100,118 102,128 106,118" fill="' + sh + '" stroke="' + e + '" stroke-width="0.55"/>' +
          '<polygon points="66,112 78,108 86,120 78,138 68,132" fill="' + mid + '" stroke="' + eSoft + '" stroke-width="0.55"/>' +
          '<polygon points="134,112 122,108 114,120 122,138 132,132" fill="' + lo + '" stroke="' + eSoft + '" stroke-width="0.55"/>' +
          '<polygon points="78,138 86,120 114,120 122,138 110,152 90,152" fill="' + hi + '" stroke="' + e + '" stroke-width="0.6"/>' +
          '<polygon points="86,120 100,118 114,120 110,136 90,136" fill="' + mid + '" stroke="' + eSoft + '" stroke-width="0.5"/>' +
          '<polygon points="90,136 110,136 108,142 92,142" fill="' + lo + '" stroke="' + eSoft + '" stroke-width="0.5"/>' +
          '<polygon points="92,142 108,142 104,148 96,148" fill="' + mid + '" stroke="' + e + '" stroke-width="0.55"/>' +
          '<path class="tv-nova-head__mouth" d="M96,148 L100,154 L104,148 Z" fill="' + hi + '" stroke="' + e + '" stroke-width="0.65" stroke-linejoin="round"/>' +
          '<polygon points="68,132 78,138 90,152 82,168 72,158" fill="' + lo + '" stroke="' + eSoft + '" stroke-width="0.55"/>' +
          '<polygon points="132,132 122,138 110,152 118,168 128,158" fill="' + sh + '" stroke="' + eSoft + '" stroke-width="0.55"/>' +
          '<polygon points="82,168 90,152 110,152 118,168 104,182 96,182" fill="' + mid + '" stroke="' + e + '" stroke-width="0.6"/>' +
          '<polygon points="96,182 104,182 100,192 96,192" fill="' + lo + '" stroke="' + eSoft + '" stroke-width="0.5"/>' +
          '<polygon points="52,118 58,92 66,112 62,132" fill="' + sh + '" stroke="' + eSoft + '" stroke-width="0.5"/>' +
          '<polygon points="148,118 142,92 134,112 138,132" fill="' + sh + '" stroke="' + eSoft + '" stroke-width="0.5"/>' +
          '<polygon points="50,118 54,128 58,132 56,118" fill="' + lo + '" stroke="' + e + '" stroke-width="0.5"/>' +
          '<polygon points="150,118 146,128 142,132 144,118" fill="' + lo + '" stroke="' + e + '" stroke-width="0.5"/>' +
          '<polygon points="82,168 76,208 88,218 96,192" fill="' + lo + '" stroke="' + eSoft + '" stroke-width="0.55"/>' +
          '<polygon points="118,168 124,208 112,218 104,192" fill="' + sh + '" stroke="' + eSoft + '" stroke-width="0.55"/>' +
          '<polygon points="96,192 104,192 108,218 92,218" fill="' + mid + '" stroke="' + e + '" stroke-width="0.55"/>' +
          '<polygon points="76,208 92,218 88,248 78,242" fill="' + lo + '" stroke="' + eSoft + '" stroke-width="0.5"/>' +
          '<polygon points="124,208 108,218 112,248 122,242" fill="' + sh + '" stroke="' + eSoft + '" stroke-width="0.5"/>' +
          '<polygon points="88,248 112,248 108,262 92,262" fill="' + mid + '" stroke="' + e + '" stroke-width="0.55"/>' +
        '</g>' +
      '</svg>'
    );
  }

  function findResponse(input) {
    var lower = input.toLowerCase().trim();
    if (!lower) return 'I did not catch that. Tap the microphone and try again.';

    for (var i = 0; i < PATTERNS.length; i++) {
      for (var j = 0; j < PATTERNS[i].keys.length; j++) {
        if (lower.indexOf(PATTERNS[i].keys[j]) !== -1) {
          return PATTERNS[i].response;
        }
      }
    }
    return 'I am not certain about that, but I can help with our sectors, technology, projects, grants, or contact information. Email info@technovateinc.org anytime.';
  }

  function findAssistantVoice() {
    if (!window.speechSynthesis) return null;
    var voices = window.speechSynthesis.getVoices();
    var priority = ['Microsoft Zira', 'Google UK English Female', 'Samantha', 'Victoria', 'Karen', 'en-GB', 'en-US'];
    var p, v;
    for (p = 0; p < priority.length; p++) {
      for (v = 0; v < voices.length; v++) {
        if (voices[v].name.indexOf(priority[p]) !== -1 || voices[v].lang.indexOf(priority[p]) !== -1) {
          return voices[v];
        }
      }
    }
    return voices[0] || null;
  }

  function createNova() {
    if (document.getElementById('tv-nova')) return;

    var uid = 'novaHead' + Math.floor(Math.random() * 10000);
    var reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    var synth = window.speechSynthesis;
    var assistantVoice = null;
    var recognition = null;
    var listening = false;
    var speaking = false;
    var active = false;
    var floatRaf = 0;
    var floatPhase = Math.random() * Math.PI * 2;

    var root = document.createElement('div');
    root.className = 'tv-nova';
    root.id = 'tv-nova';
    root.innerHTML =
      '<div class="tv-nova__hud" id="tv-nova-hud" hidden>' +
        '<p class="tv-nova__name">Nova</p>' +
        '<p class="tv-nova__speech" id="tv-nova-speech"></p>' +
        '<div class="tv-nova__prompts" id="tv-nova-prompts"></div>' +
      '</div>' +
      '<button class="tv-nova__mic" id="tv-nova-mic" type="button" aria-label="Speak to Nova">' +
        '<span class="tv-nova__mic-ring" aria-hidden="true"></span>' +
        '<svg viewBox="0 0 24 24" width="20" height="20"><path fill="currentColor" d="M12 14a3 3 0 0 0 3-3V6a3 3 0 1 0-6 0v5a3 3 0 0 0 3 3zm5-3a5 5 0 0 1-10 0H5a7 7 0 0 0 6 6.71V21h2v-3.29A7 7 0 0 0 19 11h-2z"/></svg>' +
      '</button>' +
      '<button class="tv-nova__head-wrap" id="tv-nova-head-btn" type="button" aria-label="Talk to Nova, holographic assistant">' +
        '<div class="tv-nova-head" id="tv-nova-head">' +
          '<div class="tv-nova-head__aura" aria-hidden="true"></div>' +
          '<div class="tv-nova-head__scan" aria-hidden="true"></div>' +
          aiHeadSvg(uid) +
        '</div>' +
      '</button>';

    document.body.appendChild(root);

    var hud = document.getElementById('tv-nova-hud');
    var speech = document.getElementById('tv-nova-speech');
    var prompts = document.getElementById('tv-nova-prompts');
    var micBtn = document.getElementById('tv-nova-mic');
    var headBtn = document.getElementById('tv-nova-head-btn');

    PROMPTS.forEach(function (label) {
      var btn = document.createElement('button');
      btn.type = 'button';
      btn.className = 'tv-nova__prompt';
      btn.textContent = label;
      btn.addEventListener('click', function () {
        handleQuestion(label);
      });
      prompts.appendChild(btn);
    });

    if (synth) {
      if (synth.getVoices().length) assistantVoice = findAssistantVoice();
      synth.onvoiceschanged = function () {
        assistantVoice = findAssistantVoice();
      };
    }

    var SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (SpeechRecognition) {
      recognition = new SpeechRecognition();
      recognition.continuous = false;
      recognition.interimResults = false;
      recognition.lang = 'en-US';

      recognition.onresult = function (e) {
        handleQuestion(e.results[0][0].transcript);
      };

      recognition.onerror = function () {
        listening = false;
        setState('idle');
        showSpeech('I could not hear you clearly. Tap the microphone and try again.');
      };

      recognition.onend = function () {
        listening = false;
        if (!speaking) setState(active ? 'idle' : 'idle');
      };
    }

    function setState(state) {
      root.classList.remove('tv-nova--listening', 'tv-nova--speaking', 'tv-nova--thinking', 'tv-nova--active');
      if (state === 'listening') root.classList.add('tv-nova--listening');
      if (state === 'speaking') root.classList.add('tv-nova--speaking');
      if (state === 'thinking') root.classList.add('tv-nova--thinking');
      if (active) root.classList.add('tv-nova--active');
    }

    function showSpeech(text) {
      speech.textContent = text;
    }

    function activate() {
      active = true;
      hud.hidden = false;
      setState('idle');
    }

    function speak(text, callback) {
      showSpeech(text);
      if (!synth) {
        if (callback) callback();
        return;
      }

      synth.cancel();
      speaking = true;
      setState('speaking');

      var utter = new SpeechSynthesisUtterance(text);
      utter.voice = assistantVoice;
      utter.rate = 0.92;
      utter.pitch = 1.05;
      utter.onend = utter.onerror = function () {
        speaking = false;
        setState('idle');
        if (callback) callback();
      };
      synth.speak(utter);
    }

    function handleQuestion(text) {
      activate();
      setState('thinking');
      showSpeech('You: ' + text);

      window.setTimeout(function () {
        var reply = findResponse(text);
        speak(reply);
      }, 350 + Math.random() * 300);
    }

    function startListening() {
      activate();
      if (!recognition) {
        showSpeech('Voice is not available here. Tap one of the prompts below.');
        return;
      }
      if (listening || speaking) return;
      try {
        listening = true;
        setState('listening');
        showSpeech('Listening...');
        recognition.start();
      } catch (err) {
        listening = false;
        setState('idle');
        showSpeech('Microphone not ready. Tap a prompt below.');
      }
    }

    headBtn.addEventListener('click', function () {
      if (!active) {
        activate();
        speak('Hello. I am Nova, your Technovate holographic guide. Tap the microphone and ask me anything.');
        return;
      }
      startListening();
    });

    micBtn.addEventListener('click', function (e) {
      e.stopPropagation();
      startListening();
    });

    if (!reduced) {
      function floatTick(time) {
        var t = time * 0.001;
        var y = Math.sin(t * 0.85 + floatPhase) * 10;
        var x = Math.cos(t * 0.5 + floatPhase) * 6;
        var rot = Math.sin(t * 0.35 + floatPhase) * 2;
        root.style.transform = 'translate(' + x + 'px,' + y + 'px) rotate(' + rot + 'deg)';
        floatRaf = requestAnimationFrame(floatTick);
      }
      floatRaf = requestAnimationFrame(floatTick);
    }
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', createNova);
  } else {
    createNova();
  }
})();
