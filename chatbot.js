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
      '<svg class="tv-nova-head__svg" viewBox="0 0 220 300" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">' +
        '<defs>' +
          '<radialGradient id="' + uid + 'Aura" cx="50%" cy="38%" r="58%">' +
            '<stop offset="0%" stop-color="rgba(0,212,255,0.32)"/>' +
            '<stop offset="60%" stop-color="rgba(155,93,229,0.1)"/>' +
            '<stop offset="100%" stop-color="rgba(0,0,0,0)"/>' +
          '</radialGradient>' +
          '<linearGradient id="' + uid + 'Wire" x1="0%" y1="0%" x2="100%" y2="100%">' +
            '<stop offset="0%" stop-color="#e8feff"/>' +
            '<stop offset="45%" stop-color="#00d4ff"/>' +
            '<stop offset="100%" stop-color="#9b5de5"/>' +
          '</linearGradient>' +
          '<radialGradient id="' + uid + 'FaceVol" cx="48%" cy="40%" r="55%">' +
            '<stop offset="0%" stop-color="rgba(0,80,120,0.22)"/>' +
            '<stop offset="70%" stop-color="rgba(4,12,24,0.55)"/>' +
            '<stop offset="100%" stop-color="rgba(2,6,14,0.75)"/>' +
          '</radialGradient>' +
        '</defs>' +
        '<ellipse cx="110" cy="138" rx="82" ry="104" fill="url(#' + uid + 'Aura)"/>' +
        '<path class="tv-nova-head__sculpt" d="M78 56 C54 72, 46 104, 50 136 C54 166, 70 186, 92 194 C100 198, 110 200, 120 198 C142 192, 158 172, 166 142 C174 108, 168 72, 142 54 C128 44, 96 44, 78 56 Z" fill="url(#' + uid + 'FaceVol)" stroke="none"/>' +
        '<g class="tv-nova-head__hair" opacity="0.75" fill="none" stroke-width="0.65">' +
          '<path d="M68 62 C52 42, 78 28, 110 26 C142 28, 168 42, 152 62" stroke="rgba(0,212,255,0.5)"/>' +
          '<path d="M58 78 C44 98, 40 128, 46 158" stroke="rgba(0,212,255,0.35)"/>' +
          '<path d="M162 78 C176 98, 180 128, 174 158" stroke="rgba(247,37,133,0.3)"/>' +
          '<path d="M82 48 C96 36, 124 36, 138 48" stroke="rgba(155,93,229,0.4)"/>' +
          '<path d="M74 54 C66 68, 62 86, 64 104" stroke="rgba(0,212,255,0.28)"/>' +
          '<path d="M146 54 C154 68, 158 86, 156 104" stroke="rgba(0,212,255,0.28)"/>' +
        '</g>' +
        '<g class="tv-nova-head__mesh" fill="none" stroke-linecap="round" stroke-linejoin="round">' +
          '<g stroke="rgba(0,212,255,0.22)" stroke-width="0.45">' +
            '<path d="M110 34 L110 248 M92 48 L128 48 M84 62 L136 62 M78 76 L142 76 M72 90 L148 90 M68 104 L152 104 M66 118 L154 118 M68 132 L152 132 M72 146 L148 146 M78 160 L142 160 M86 174 L134 174 M94 188 L126 188 M98 202 L122 202 M100 216 L120 216"/>' +
            '<path d="M68 76 C84 68, 96 64, 110 62 C124 64, 136 68, 152 76 M66 104 C82 96, 96 92, 110 90 C124 92, 138 96, 154 104 M68 132 C84 124, 96 120, 110 118 C124 120, 136 124, 152 132 M74 160 C88 154, 98 150, 110 148 C122 150, 132 154, 146 160 M84 186 C94 182, 102 180, 110 178 C118 180, 126 182, 136 186"/>' +
            '<path d="M78 56 C88 72, 94 88, 96 104 M142 56 C132 72, 126 88, 124 104 M96 104 C100 118, 104 132, 108 146 M124 104 C120 118, 116 132, 112 146 M108 146 C108 158, 108 170, 110 182 M96 104 L124 104 M88 118 L132 118 M90 132 L130 132 M92 146 L128 146"/>' +
          '</g>' +
          '<g stroke="url(#' + uid + 'Wire)" stroke-width="0.55" opacity="0.9">' +
            '<path d="M110 48 L110 182"/>' +
            '<path d="M78 72 L142 72 M82 86 L138 86 M86 100 L134 100 M88 114 L132 114 M90 128 L130 128 M92 142 L128 142 M94 156 L126 156 M96 170 L124 170"/>' +
            '<path d="M78 56 L68 76 L66 104 L68 132 L74 160 L86 186 L110 198 L134 186 L146 160 L152 132 L154 104 L152 76 L142 56"/>' +
            '<path d="M78 56 L96 64 L110 68 L124 64 L142 56"/>' +
            '<path d="M68 76 L86 82 L110 86 L134 82 L152 76"/>' +
            '<path d="M66 104 L84 108 L110 112 L136 108 L154 104"/>' +
            '<path d="M68 132 L86 136 L110 140 L134 136 L152 132"/>' +
            '<path d="M74 160 L92 166 L110 170 L128 166 L146 160"/>' +
            '<path d="M86 186 L98 192 L110 194 L122 192 L134 186"/>' +
            '<path d="M78 56 L86 82 L84 108 L86 136 L94 156 L110 170 L126 156 L134 136 L136 108 L134 82 L142 56"/>' +
            '<path d="M142 56 L134 82 L136 108 L134 136 L126 156 L110 170 L94 156 L86 136 L84 108 L86 82 L78 56"/>' +
            '<path d="M96 64 L86 82 L84 108 M124 64 L134 82 L136 108 M84 108 L90 128 L94 156 M136 108 L130 128 L126 156 M110 86 L110 112 M110 112 L110 140 L110 170"/>' +
          '</g>' +
          '<g stroke="rgba(155,93,229,0.42)" stroke-width="0.4">' +
            '<path d="M78 72 L96 64 L110 68 L124 64 L142 72"/>' +
            '<path d="M66 104 L82 86 L110 82 L138 86 L154 104"/>' +
            '<path d="M68 132 L88 114 L110 110 L132 114 L152 132"/>' +
            '<path d="M74 160 L94 142 L110 138 L126 142 L146 160"/>' +
            '<path d="M86 82 L110 98 L134 82 M88 114 L110 128 L132 114 M94 142 L110 154 L126 142"/>' +
          '</g>' +
          '<g fill="#00d4ff" stroke="none" opacity="0.7">' +
            '<circle cx="110" cy="68" r="1.3"/><circle cx="86" cy="82" r="1.1"/><circle cx="134" cy="82" r="1.1"/>' +
            '<circle cx="68" cy="104" r="1.1"/><circle cx="110" cy="112" r="1.4"/><circle cx="152" cy="104" r="1.1"/>' +
            '<circle cx="74" cy="132" r="1"/><circle cx="110" cy="140" r="1.5"/><circle cx="146" cy="132" r="1"/>' +
            '<circle cx="86" cy="156" r="1"/><circle cx="110" cy="170" r="1.3"/><circle cx="134" cy="156" r="1"/>' +
          '</g>' +
        '</g>' +
        '<g class="tv-nova-head__features">' +
          '<g class="tv-nova-head__eye">' +
            '<ellipse cx="92" cy="98" rx="11" ry="7" fill="rgba(0,24,40,0.85)" stroke="rgba(0,212,255,0.65)" stroke-width="0.8"/>' +
            '<ellipse cx="93" cy="97" rx="4.5" ry="3.2" fill="url(#' + uid + 'Wire)" opacity="0.95"/>' +
            '<ellipse cx="94.5" cy="96" rx="1.8" ry="1.4" fill="#ffffff" opacity="0.95"/>' +
            '<path d="M80 92 C86 88, 98 88, 104 92" fill="none" stroke="rgba(0,212,255,0.55)" stroke-width="0.7"/>' +
          '</g>' +
          '<g class="tv-nova-head__eye">' +
            '<ellipse cx="128" cy="98" rx="11" ry="7" fill="rgba(0,24,40,0.85)" stroke="rgba(0,212,255,0.65)" stroke-width="0.8"/>' +
            '<ellipse cx="127" cy="97" rx="4.5" ry="3.2" fill="url(#' + uid + 'Wire)" opacity="0.95"/>' +
            '<ellipse cx="125.5" cy="96" rx="1.8" ry="1.4" fill="#ffffff" opacity="0.95"/>' +
            '<path d="M116 92 C122 88, 134 88, 140 92" fill="none" stroke="rgba(0,212,255,0.55)" stroke-width="0.7"/>' +
          '</g>' +
          '<path d="M110 86 L108 118 L110 124 L112 118 Z" fill="none" stroke="rgba(0,212,255,0.5)" stroke-width="0.65"/>' +
          '<path d="M102 118 C104 122, 106 124, 110 124 C114 124, 116 122, 118 118" fill="none" stroke="rgba(0,212,255,0.4)" stroke-width="0.55"/>' +
          '<path class="tv-nova-head__mouth" d="M94 150 Q110 158, 126 150" fill="none" stroke="url(#' + uid + 'Wire)" stroke-width="1.5" stroke-linecap="round"/>' +
          '<path d="M94 150 Q110 146, 126 150" fill="none" stroke="rgba(247,37,133,0.45)" stroke-width="0.6"/>' +
        '</g>' +
        '<g class="tv-nova-head__neck" fill="none" opacity="0.8">' +
          '<path d="M98 198 C96 214, 94 232, 92 252 M122 198 C124 214, 126 232, 128 252" stroke="rgba(0,212,255,0.4)" stroke-width="0.65"/>' +
          '<path d="M92 214 L110 220 L128 214 M90 232 L110 238 L130 232 M88 252 L110 258 L132 252" stroke="rgba(0,212,255,0.32)" stroke-width="0.5"/>' +
          '<path d="M92 214 L90 232 L88 252 M128 214 L130 232 L132 252 M98 198 L92 214 M122 198 L128 214" stroke="rgba(155,93,229,0.28)" stroke-width="0.45"/>' +
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
