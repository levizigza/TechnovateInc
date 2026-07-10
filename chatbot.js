/* ============================================
   Technovate — Holographic voice assistant
   Floating digital human head (voice-first)
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
    { keys: ['hello', 'hi', 'hey', 'greet'], response: 'Hello. I am your Technovate holographic guide. Ask me about our company, sectors, technology, projects, or how to get in touch.' },
    { keys: ['contact', 'email', 'reach', 'location', 'address', 'where', 'calgary'], response: KNOWLEDGE.contact },
    { keys: ['sector', 'health', 'finance', 'education', 'enterprise', 'community', 'industry'], response: KNOWLEDGE.sectors },
    { keys: ['tech', 'stack', 'ai', 'artificial', 'machine', 'explain'], response: KNOWLEDGE.technology },
    { keys: ['solution', 'product', 'offer', 'service', 'platform'], response: KNOWLEDGE.solutions },
    { keys: ['project', 'portfolio', 'built', 'develop'], response: KNOWLEDGE.projects },
    { keys: ['grant', 'fund', 'partnership', 'accelerator', 'invest'], response: KNOWLEDGE.grants },
    { keys: ['impact', 'measure', 'outcome', 'result', 'metric'], response: KNOWLEDGE.impact },
    { keys: ['about', 'who', 'company', 'mission', 'founded', 'what is technovate'], response: KNOWLEDGE.about },
    { keys: ['career', 'job', 'hiring', 'work', 'join', 'opportunity'], response: KNOWLEDGE.careers },
    { keys: ['help', 'can you', 'what can'], response: 'I can guide you through Technovate — our sectors, technology, projects, grants, and contact details. Just speak to me or tap a prompt below.' },
    { keys: ['thank', 'thanks', 'bye', 'goodbye'], response: 'You are welcome. I am here whenever you need guidance. Have a wonderful day.' }
  ];

  var SUGGESTIONS = [
    'What is Technovate?',
    'Tell me about your sectors',
    'How can I contact you?',
    'What technology do you use?'
  ];

  var AI_HEAD_SVG =
    '<svg class="tv-ai-head__svg" viewBox="0 0 220 280" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">' +
      '<defs>' +
        '<radialGradient id="aiHeadAura" cx="50%" cy="42%" r="58%">' +
          '<stop offset="0%" stop-color="rgba(0,212,255,0.35)"/>' +
          '<stop offset="55%" stop-color="rgba(155,93,229,0.12)"/>' +
          '<stop offset="100%" stop-color="rgba(0,0,0,0)"/>' +
        '</radialGradient>' +
        '<linearGradient id="aiFaceGlow" x1="0%" y1="0%" x2="100%" y2="100%">' +
          '<stop offset="0%" stop-color="#b8f8ff"/>' +
          '<stop offset="45%" stop-color="#00d4ff"/>' +
          '<stop offset="100%" stop-color="#9b5de5"/>' +
        '</linearGradient>' +
        '<linearGradient id="aiHairGlow" x1="0%" y1="0%" x2="0%" y2="100%">' +
          '<stop offset="0%" stop-color="#00d4ff"/>' +
          '<stop offset="100%" stop-color="#f72585"/>' +
        '</linearGradient>' +
      '</defs>' +
      '<ellipse cx="110" cy="138" rx="88" ry="102" fill="url(#aiHeadAura)"/>' +
      '<g class="tv-ai-head__hair">' +
        '<path d="M58 92 C42 48, 88 24, 118 34 C148 24, 178 52, 168 96 C176 118, 170 148, 158 168 L142 156 C152 128, 154 98, 138 72 C124 52, 96 50, 78 68 C64 84, 62 108, 68 132 Z" fill="none" stroke="url(#aiHairGlow)" stroke-width="1.4" opacity="0.75"/>' +
        '<path d="M72 58 C88 36, 112 30, 132 40" fill="none" stroke="rgba(0,212,255,0.55)" stroke-width="0.8"/>' +
        '<path d="M64 78 C54 108, 56 142, 68 170" fill="none" stroke="rgba(247,37,133,0.45)" stroke-width="0.7"/>' +
      '</g>' +
      '<path class="tv-ai-head__skull" d="M92 78 C98 52, 128 48, 148 62 C168 76, 174 104, 170 132 C168 154, 156 176, 136 188 C126 194, 108 196, 96 188 C78 176, 70 154, 72 128 C74 102, 82 86, 92 78 Z" fill="rgba(6,14,28,0.88)" stroke="rgba(0,212,255,0.45)" stroke-width="1.2"/>' +
      '<g class="tv-ai-head__mesh" opacity="0.82">' +
        '<path d="M104 92 L132 98 L148 118 L142 146 L118 158 L96 146 L88 118 Z" fill="none" stroke="rgba(0,212,255,0.35)" stroke-width="0.7"/>' +
        '<path d="M104 92 L118 118 L96 146" fill="none" stroke="rgba(155,93,229,0.4)" stroke-width="0.6"/>' +
        '<path d="M132 98 L148 118 L142 146" fill="none" stroke="rgba(0,212,255,0.4)" stroke-width="0.6"/>' +
        '<path d="M118 118 L142 146" fill="none" stroke="rgba(247,37,133,0.35)" stroke-width="0.5"/>' +
        '<circle cx="118" cy="118" r="3" fill="#00d4ff" opacity="0.8"/>' +
        '<circle cx="132" cy="98" r="2" fill="#f72585" opacity="0.7"/>' +
        '<circle cx="96" cy="146" r="2" fill="#9b5de5" opacity="0.7"/>' +
        '<path d="M88 118 H156 M104 92 V158 M148 118 V176" stroke="rgba(0,212,255,0.18)" stroke-width="0.5"/>' +
      '</g>' +
      '<ellipse class="tv-ai-head__eye" cx="138" cy="112" rx="11" ry="7" fill="url(#aiFaceGlow)" opacity="0.95"/>' +
      '<ellipse cx="141" cy="110" rx="4" ry="3" fill="#ffffff" opacity="0.9"/>' +
      '<path class="tv-ai-head__brow" d="M126 98 C132 92, 146 94, 152 100" fill="none" stroke="rgba(0,212,255,0.65)" stroke-width="1"/>' +
      '<path class="tv-ai-head__nose" d="M148 118 C152 126, 150 134, 144 138" fill="none" stroke="rgba(0,212,255,0.4)" stroke-width="0.8"/>' +
      '<path class="tv-ai-head__mouth" id="tv-ai-mouth" d="M128 152 Q142 162, 156 152" fill="none" stroke="url(#aiFaceGlow)" stroke-width="2" stroke-linecap="round"/>' +
      '<path d="M118 188 C126 206, 138 214, 152 220 L152 248 C138 242, 124 232, 118 218 Z" fill="rgba(4,10,20,0.9)" stroke="rgba(0,212,255,0.28)" stroke-width="1"/>' +
      '<g class="tv-ai-head__circuits" opacity="0.7">' +
        '<path d="M126 206 L126 238 M138 214 L138 252 M150 220 L150 248" stroke="rgba(0,212,255,0.45)" stroke-width="0.8"/>' +
        '<circle cx="126" cy="238" r="2.5" fill="#00d4ff"/>' +
        '<circle cx="138" cy="252" r="2.5" fill="#f72585"/>' +
        '<circle cx="150" cy="248" r="2.5" fill="#9b5de5"/>' +
      '</g>' +
      '<rect class="tv-ai-head__frame" x="34" y="28" width="152" height="224" rx="18" fill="none" stroke="rgba(0,212,255,0.22)" stroke-width="1" stroke-dasharray="4 6"/>' +
    '</svg>';

  function findResponse(input) {
    var lower = input.toLowerCase().trim();
    if (!lower) return 'I did not catch that. Tap the microphone or choose a prompt below, and I will guide you.';

    for (var i = 0; i < PATTERNS.length; i++) {
      for (var j = 0; j < PATTERNS[i].keys.length; j++) {
        if (lower.indexOf(PATTERNS[i].keys[j]) !== -1) {
          return PATTERNS[i].response;
        }
      }
    }
    return 'I am not certain about that, but I can help with our sectors, technology, projects, grants, or contact information. You may also email info@technovateinc.org.';
  }

  function findAssistantVoice() {
    if (!window.speechSynthesis) return null;
    var voices = window.speechSynthesis.getVoices();
    var priority = [
      'Microsoft Zira',
      'Google UK English Female',
      'Samantha',
      'Victoria',
      'Karen',
      'en-GB',
      'en-US'
    ];
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

  function createAssistant() {
    if (document.getElementById('tv-ai-assistant')) return;

    var reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    var synth = window.speechSynthesis;
    var assistantVoice = null;
    var recognition = null;
    var listening = false;
    var speaking = false;
    var opened = false;
    var floatRaf = 0;
    var floatPhase = Math.random() * Math.PI * 2;

    var root = document.createElement('div');
    root.className = 'tv-ai-assistant';
    root.id = 'tv-ai-assistant';
    root.innerHTML =
      '<div class="tv-ai-assistant__panel" id="tv-ai-panel" hidden>' +
        '<p class="tv-ai-assistant__caption" id="tv-ai-caption">Tap the hologram to begin.</p>' +
        '<div class="tv-ai-assistant__chips" id="tv-ai-chips"></div>' +
      '</div>' +
      '<button class="tv-ai-assistant__mic" id="tv-ai-mic" type="button" aria-label="Speak to assistant">' +
        '<span class="tv-ai-assistant__mic-ring" aria-hidden="true"></span>' +
        '<span class="tv-ai-assistant__mic-icon" aria-hidden="true">' +
          '<svg viewBox="0 0 24 24" width="18" height="18"><path fill="currentColor" d="M12 14a3 3 0 0 0 3-3V6a3 3 0 1 0-6 0v5a3 3 0 0 0 3 3zm5-3a5 5 0 0 1-10 0H5a7 7 0 0 0 6 6.71V21h2v-3.29A7 7 0 0 0 19 11h-2z"/></svg>' +
        '</span>' +
      '</button>' +
      '<button class="tv-ai-assistant__head-btn" id="tv-ai-head-btn" type="button" aria-label="Open holographic assistant">' +
        '<div class="tv-ai-head" id="tv-ai-head">' +
          '<div class="tv-ai-head__aura" aria-hidden="true"></div>' +
          '<div class="tv-ai-head__scan" aria-hidden="true"></div>' +
          AI_HEAD_SVG +
        '</div>' +
      '</button>';

    document.body.appendChild(root);

    var panel = document.getElementById('tv-ai-panel');
    var caption = document.getElementById('tv-ai-caption');
    var chips = document.getElementById('tv-ai-chips');
    var micBtn = document.getElementById('tv-ai-mic');
    var headBtn = document.getElementById('tv-ai-head-btn');
    var headEl = document.getElementById('tv-ai-head');

    SUGGESTIONS.forEach(function (label) {
      var chip = document.createElement('button');
      chip.type = 'button';
      chip.className = 'tv-ai-assistant__chip';
      chip.textContent = label;
      chip.addEventListener('click', function () {
        handleUserText(label);
      });
      chips.appendChild(chip);
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
      recognition.maxAlternatives = 1;

      recognition.onresult = function (e) {
        var text = e.results[0][0].transcript;
        handleUserText(text);
      };

      recognition.onerror = function () {
        setState('idle');
        showCaption('I could not hear you clearly. Try again or tap a prompt below.');
      };

      recognition.onend = function () {
        listening = false;
        if (!speaking) setState(opened ? 'idle' : 'idle');
      };
    }

    function setState(state) {
      root.classList.remove(
        'tv-ai-assistant--listening',
        'tv-ai-assistant--speaking',
        'tv-ai-assistant--thinking',
        'tv-ai-assistant--open'
      );
      if (state === 'listening') root.classList.add('tv-ai-assistant--listening');
      if (state === 'speaking') root.classList.add('tv-ai-assistant--speaking');
      if (state === 'thinking') root.classList.add('tv-ai-assistant--thinking');
      if (state === 'open' || opened) root.classList.add('tv-ai-assistant--open');
    }

    function showCaption(text) {
      caption.textContent = text;
    }

    function openAssistant() {
      opened = true;
      panel.hidden = false;
      setState('open');
      if (!root.dataset.greeted) {
        root.dataset.greeted = '1';
        speak('Hello. I am your Technovate holographic guide. Tap the microphone and ask me anything, or choose a prompt below.');
      }
    }

    function speak(text, callback) {
      if (!synth) {
        showCaption(text);
        if (callback) callback();
        return;
      }

      synth.cancel();
      speaking = true;
      setState('speaking');
      showCaption(text);

      var utter = new SpeechSynthesisUtterance(text);
      utter.voice = assistantVoice;
      utter.rate = 0.92;
      utter.pitch = 1.05;

      utter.onend = function () {
        speaking = false;
        setState(opened ? 'idle' : 'idle');
        if (callback) callback();
      };

      utter.onerror = function () {
        speaking = false;
        setState(opened ? 'idle' : 'idle');
        if (callback) callback();
      };

      synth.speak(utter);
    }

    function handleUserText(text) {
      openAssistant();
      setState('thinking');
      showCaption('You: ' + text);

      window.setTimeout(function () {
        var reply = findResponse(text);
        speak(reply);
      }, 350 + Math.random() * 300);
    }

    function startListening() {
      openAssistant();
      if (!recognition) {
        showCaption('Voice input is not available here. Tap one of the prompts below and I will answer aloud.');
        return;
      }
      if (listening || speaking) return;
      try {
        listening = true;
        setState('listening');
        showCaption('Listening... speak now.');
        recognition.start();
      } catch (err) {
        listening = false;
        setState('idle');
        showCaption('Microphone is not ready. Tap a prompt below instead.');
      }
    }

    headBtn.addEventListener('click', function () {
      if (!opened) {
        openAssistant();
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
        var y = Math.sin(t * 0.9 + floatPhase) * 8;
        var x = Math.cos(t * 0.55 + floatPhase) * 5;
        var rot = Math.sin(t * 0.4 + floatPhase) * 2.5;
        root.style.transform = 'translate(' + x + 'px,' + y + 'px) rotate(' + rot + 'deg)';
        floatRaf = requestAnimationFrame(floatTick);
      }
      floatRaf = requestAnimationFrame(floatTick);
    }
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', createAssistant);
  } else {
    createAssistant();
  }
})();
