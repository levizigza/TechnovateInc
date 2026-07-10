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
    return (
      '<svg class="tv-nova-head__svg" viewBox="0 0 200 280" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">' +
        '<defs>' +
          '<radialGradient id="' + uid + 'Aura" cx="42%" cy="40%" r="62%">' +
            '<stop offset="0%" stop-color="rgba(0,212,255,0.38)"/>' +
            '<stop offset="55%" stop-color="rgba(155,93,229,0.14)"/>' +
            '<stop offset="100%" stop-color="rgba(0,0,0,0)"/>' +
          '</radialGradient>' +
          '<linearGradient id="' + uid + 'Wire" x1="0%" y1="0%" x2="100%" y2="100%">' +
            '<stop offset="0%" stop-color="#d4fcff"/>' +
            '<stop offset="50%" stop-color="#00d4ff"/>' +
            '<stop offset="100%" stop-color="#9b5de5"/>' +
          '</linearGradient>' +
          '<linearGradient id="' + uid + 'Brain" x1="0%" y1="0%" x2="100%" y2="100%">' +
            '<stop offset="0%" stop-color="rgba(0,255,255,0.85)"/>' +
            '<stop offset="100%" stop-color="rgba(247,37,133,0.55)"/>' +
          '</linearGradient>' +
        '</defs>' +
        '<ellipse cx="88" cy="132" rx="78" ry="96" fill="url(#' + uid + 'Aura)"/>' +
        '<g class="tv-nova-head__hair" opacity="0.8">' +
          '<path d="M42 98 C34 62, 58 34, 92 30 C118 28, 142 42, 152 68" fill="none" stroke="url(#' + uid + 'Wire)" stroke-width="1.1"/>' +
          '<path d="M38 112 C30 142, 34 176, 48 204" fill="none" stroke="rgba(0,212,255,0.45)" stroke-width="0.8"/>' +
          '<path d="M52 48 C68 36, 96 32, 118 40" fill="none" stroke="rgba(247,37,133,0.4)" stroke-width="0.7"/>' +
        '</g>' +
        '<path class="tv-nova-head__skull" d="M46 118 C44 78, 72 48, 108 46 C138 44, 162 66, 166 98 C170 128, 160 158, 142 178 C132 190, 118 198, 108 202 L100 228 C94 242, 84 252, 72 258 L62 276" fill="rgba(4,10,22,0.82)" stroke="url(#' + uid + 'Wire)" stroke-width="1.3" stroke-linejoin="round"/>' +
        '<path d="M108 202 C118 210, 128 214, 140 218" fill="none" stroke="rgba(0,212,255,0.35)" stroke-width="0.8"/>' +
        '<g class="tv-nova-head__brain" opacity="0.92">' +
          '<path d="M58 92 L78 78 L98 86 L112 74 L132 82 L148 98 L142 118 L128 132 L108 138 L88 128 L68 118 L58 102 Z" fill="rgba(0,40,70,0.35)" stroke="rgba(0,212,255,0.35)" stroke-width="0.7"/>' +
          '<path d="M78 78 L98 86 L88 108 L68 118" fill="none" stroke="rgba(0,212,255,0.4)" stroke-width="0.55"/>' +
          '<path d="M98 86 L112 74 L132 82 L128 108" fill="none" stroke="rgba(155,93,229,0.42)" stroke-width="0.55"/>' +
          '<path d="M88 108 L108 112 L128 108 L142 118" fill="none" stroke="rgba(0,212,255,0.38)" stroke-width="0.5"/>' +
          '<path d="M68 118 L88 108 L108 112 L108 138" fill="none" stroke="rgba(247,37,133,0.35)" stroke-width="0.5"/>' +
          '<path d="M108 112 L128 108 L142 118 L128 132" fill="none" stroke="rgba(0,212,255,0.35)" stroke-width="0.5"/>' +
          '<circle cx="78" cy="78" r="2.2" fill="#00d4ff"/>' +
          '<circle cx="98" cy="86" r="2.5" fill="#b8f8ff"/>' +
          '<circle cx="112" cy="74" r="2" fill="#f72585"/>' +
          '<circle cx="132" cy="82" r="2.2" fill="#9b5de5"/>' +
          '<circle cx="128" cy="108" r="2" fill="#00d4ff"/>' +
          '<circle cx="108" cy="112" r="2.8" fill="#ffffff" opacity="0.9"/>' +
          '<circle cx="88" cy="108" r="2" fill="#00d4ff"/>' +
          '<circle cx="68" cy="118" r="1.8" fill="#f72585"/>' +
          '<circle cx="142" cy="118" r="2" fill="#9b5de5"/>' +
        '</g>' +
        '<ellipse class="tv-nova-head__eye" cx="138" cy="108" rx="10" ry="6.5" fill="url(#' + uid + 'Wire)" opacity="0.95"/>' +
        '<ellipse cx="141" cy="106" rx="3.5" ry="2.5" fill="#ffffff" opacity="0.92"/>' +
        '<path d="M124 94 C130 88, 142 90, 150 96" fill="none" stroke="rgba(0,212,255,0.6)" stroke-width="0.9"/>' +
        '<path d="M152 104 C158 112, 160 122, 154 130" fill="none" stroke="rgba(0,212,255,0.45)" stroke-width="0.8"/>' +
        '<path class="tv-nova-head__mouth" d="M132 148 Q142 154, 152 148" fill="none" stroke="url(#' + uid + 'Wire)" stroke-width="1.6" stroke-linecap="round"/>' +
        '<g class="tv-nova-head__circuits" opacity="0.8">' +
          '<path d="M88 198 L88 232 M100 206 L100 248 M112 214 L112 256 M124 220 L124 262" stroke="rgba(0,212,255,0.45)" stroke-width="0.75"/>' +
          '<path d="M88 232 L100 248 L112 256 L124 262" fill="none" stroke="rgba(155,93,229,0.35)" stroke-width="0.6"/>' +
          '<circle cx="88" cy="232" r="2.2" fill="#00d4ff"/>' +
          '<circle cx="100" cy="248" r="2.2" fill="#f72585"/>' +
          '<circle cx="112" cy="256" r="2.2" fill="#9b5de5"/>' +
          '<circle cx="124" cy="262" r="2.2" fill="#00d4ff"/>' +
        '</g>' +
        '<rect x="28" y="24" width="144" height="232" rx="16" fill="none" stroke="rgba(0,212,255,0.18)" stroke-width="0.9" stroke-dasharray="3 5"/>' +
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
