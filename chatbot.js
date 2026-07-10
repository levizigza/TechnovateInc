/* ============================================
   Technovate — Holographic box chat assistant
   Classic chat widget with digital human head
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
    { keys: ['hello', 'hi', 'hey', 'greet'], response: 'Hello. I am Nova, your Technovate holographic guide. Ask me about our company, sectors, technology, projects, or how to get in touch.' },
    { keys: ['contact', 'email', 'reach', 'location', 'address', 'where', 'calgary'], response: KNOWLEDGE.contact },
    { keys: ['sector', 'health', 'finance', 'education', 'enterprise', 'community', 'industry'], response: KNOWLEDGE.sectors },
    { keys: ['tech', 'stack', 'ai', 'artificial', 'machine', 'explain'], response: KNOWLEDGE.technology },
    { keys: ['solution', 'product', 'offer', 'service', 'platform'], response: KNOWLEDGE.solutions },
    { keys: ['project', 'portfolio', 'built', 'develop'], response: KNOWLEDGE.projects },
    { keys: ['grant', 'fund', 'partnership', 'accelerator', 'invest'], response: KNOWLEDGE.grants },
    { keys: ['impact', 'measure', 'outcome', 'result', 'metric'], response: KNOWLEDGE.impact },
    { keys: ['about', 'who', 'company', 'mission', 'founded', 'what is technovate'], response: KNOWLEDGE.about },
    { keys: ['career', 'job', 'hiring', 'work', 'join', 'opportunity'], response: KNOWLEDGE.careers },
    { keys: ['help', 'can you', 'what can'], response: 'I can guide you through Technovate — our sectors, technology, projects, grants, and contact details. Type a question or tap the microphone to speak.' },
    { keys: ['thank', 'thanks', 'bye', 'goodbye'], response: 'You are welcome. I am here whenever you need guidance. Have a wonderful day.' }
  ];

  var GREETING = 'Hello. I am Nova, your Technovate holographic guide. Ask me anything about the company, or tap the microphone to speak with me.';

  function aiHeadSvg(uid) {
    return (
      '<svg class="tv-chat-avatar__svg" viewBox="0 0 220 280" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">' +
        '<defs>' +
          '<radialGradient id="' + uid + 'Aura" cx="50%" cy="42%" r="58%">' +
            '<stop offset="0%" stop-color="rgba(0,212,255,0.35)"/>' +
            '<stop offset="55%" stop-color="rgba(155,93,229,0.12)"/>' +
            '<stop offset="100%" stop-color="rgba(0,0,0,0)"/>' +
          '</radialGradient>' +
          '<linearGradient id="' + uid + 'Face" x1="0%" y1="0%" x2="100%" y2="100%">' +
            '<stop offset="0%" stop-color="#b8f8ff"/>' +
            '<stop offset="45%" stop-color="#00d4ff"/>' +
            '<stop offset="100%" stop-color="#9b5de5"/>' +
          '</linearGradient>' +
          '<linearGradient id="' + uid + 'Hair" x1="0%" y1="0%" x2="0%" y2="100%">' +
            '<stop offset="0%" stop-color="#00d4ff"/>' +
            '<stop offset="100%" stop-color="#f72585"/>' +
          '</linearGradient>' +
        '</defs>' +
        '<ellipse cx="110" cy="138" rx="88" ry="102" fill="url(#' + uid + 'Aura)"/>' +
        '<path d="M58 92 C42 48, 88 24, 118 34 C148 24, 178 52, 168 96 C176 118, 170 148, 158 168 L142 156 C152 128, 154 98, 138 72 C124 52, 96 50, 78 68 C64 84, 62 108, 68 132 Z" fill="none" stroke="url(#' + uid + 'Hair)" stroke-width="1.4" opacity="0.75"/>' +
        '<path d="M92 78 C98 52, 128 48, 148 62 C168 76, 174 104, 170 132 C168 154, 156 176, 136 188 C126 194, 108 196, 96 188 C78 176, 70 154, 72 128 C74 102, 82 86, 92 78 Z" fill="rgba(6,14,28,0.88)" stroke="rgba(0,212,255,0.45)" stroke-width="1.2"/>' +
        '<g opacity="0.82">' +
          '<path d="M104 92 L132 98 L148 118 L142 146 L118 158 L96 146 L88 118 Z" fill="none" stroke="rgba(0,212,255,0.35)" stroke-width="0.7"/>' +
          '<circle cx="118" cy="118" r="3" fill="#00d4ff" opacity="0.8"/>' +
        '</g>' +
        '<ellipse class="tv-chat-avatar__eye" cx="138" cy="112" rx="11" ry="7" fill="url(#' + uid + 'Face)" opacity="0.95"/>' +
        '<ellipse cx="141" cy="110" rx="4" ry="3" fill="#ffffff" opacity="0.9"/>' +
        '<path class="tv-chat-avatar__mouth" d="M128 152 Q142 162, 156 152" fill="none" stroke="url(#' + uid + 'Face)" stroke-width="2" stroke-linecap="round"/>' +
        '<path d="M118 188 C126 206, 138 214, 152 220 L152 248 C138 242, 124 232, 118 218 Z" fill="rgba(4,10,20,0.9)" stroke="rgba(0,212,255,0.28)" stroke-width="1"/>' +
      '</svg>'
    );
  }

  function findResponse(input) {
    var lower = input.toLowerCase().trim();
    if (!lower) return 'Please type or say a question and I will help you.';

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

  function createWidget() {
    if (document.getElementById('tv-chat-widget')) return;

    var uid = 'chatHead' + Math.floor(Math.random() * 10000);
    var headSvg = aiHeadSvg(uid);
    var synth = window.speechSynthesis;
    var assistantVoice = null;
    var recognition = null;
    var listening = false;
    var speaking = false;
    var isOpen = false;

    var widget = document.createElement('div');
    widget.className = 'tv-chat-widget';
    widget.id = 'tv-chat-widget';
    widget.innerHTML =
      '<div class="tv-chat-panel" id="tv-chat-panel">' +
        '<div class="tv-chat-panel__head">' +
          '<div class="tv-chat-avatar tv-chat-avatar--panel">' + headSvg + '</div>' +
          '<div class="tv-chat-panel__meta">' +
            '<div class="tv-chat-panel__title">Nova</div>' +
            '<div class="tv-chat-panel__sub">Holographic guide</div>' +
          '</div>' +
          '<button class="tv-chat-panel__mic" id="tv-chat-mic" type="button" aria-label="Speak to Nova">' +
            '<svg viewBox="0 0 24 24" width="18" height="18"><path fill="currentColor" d="M12 14a3 3 0 0 0 3-3V6a3 3 0 1 0-6 0v5a3 3 0 0 0 3 3zm5-3a5 5 0 0 1-10 0H5a7 7 0 0 0 6 6.71V21h2v-3.29A7 7 0 0 0 19 11h-2z"/></svg>' +
          '</button>' +
        '</div>' +
        '<div class="tv-chat-panel__body" id="tv-chat-body"></div>' +
        '<div class="tv-chat-panel__input">' +
          '<input type="text" id="tv-chat-input" placeholder="Ask Nova anything..." autocomplete="off" />' +
          '<button id="tv-chat-send" type="button" aria-label="Send message">' +
            '<svg viewBox="0 0 24 24" width="16" height="16"><path fill="currentColor" d="M2.01 21L23 12 2.01 3 2 10l15 2-15 2z"/></svg>' +
          '</button>' +
        '</div>' +
      '</div>' +
      '<button class="tv-chat-toggle" id="tv-chat-toggle" type="button" aria-label="Open chat assistant">' +
        '<span class="tv-chat-avatar tv-chat-avatar--toggle">' + headSvg + '</span>' +
      '</button>';

    document.body.appendChild(widget);

    var panel = document.getElementById('tv-chat-panel');
    var body = document.getElementById('tv-chat-body');
    var input = document.getElementById('tv-chat-input');
    var send = document.getElementById('tv-chat-send');
    var toggle = document.getElementById('tv-chat-toggle');
    var mic = document.getElementById('tv-chat-mic');

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
        var text = e.results[0][0].transcript;
        input.value = text;
        handleSend();
      };

      recognition.onerror = function () {
        listening = false;
        widget.classList.remove('tv-chat-widget--listening');
        addMessage('I could not hear you clearly. Please try again or type your question.', false);
      };

      recognition.onend = function () {
        listening = false;
        widget.classList.remove('tv-chat-widget--listening');
      };
    }

    function addMessage(text, isUser) {
      var msg = document.createElement('div');
      msg.className = 'tv-chat-msg tv-chat-msg--' + (isUser ? 'user' : 'bot');
      msg.textContent = text;
      body.appendChild(msg);
      body.scrollTop = body.scrollHeight;
    }

    function speak(text) {
      if (!synth) return;
      synth.cancel();
      speaking = true;
      widget.classList.add('tv-chat-widget--speaking');

      var utter = new SpeechSynthesisUtterance(text);
      utter.voice = assistantVoice;
      utter.rate = 0.92;
      utter.pitch = 1.05;
      utter.onend = utter.onerror = function () {
        speaking = false;
        widget.classList.remove('tv-chat-widget--speaking');
      };
      synth.speak(utter);
    }

    function respond(text) {
      widget.classList.add('tv-chat-widget--thinking');
      window.setTimeout(function () {
        widget.classList.remove('tv-chat-widget--thinking');
        var reply = findResponse(text);
        addMessage(reply, false);
        speak(reply);
      }, 320 + Math.random() * 280);
    }

    function handleSend() {
      var q = input.value.trim();
      if (!q) return;
      addMessage(q, true);
      input.value = '';
      respond(q);
    }

    function togglePanel() {
      isOpen = !isOpen;
      panel.classList.toggle('tv-chat-panel--open', isOpen);
      toggle.classList.toggle('tv-chat-toggle--open', isOpen);
      toggle.setAttribute('aria-label', isOpen ? 'Close chat assistant' : 'Open chat assistant');

      if (isOpen && !widget.dataset.greeted) {
        widget.dataset.greeted = '1';
        addMessage(GREETING, false);
        speak(GREETING);
        window.setTimeout(function () { input.focus(); }, 120);
      } else if (isOpen) {
        input.focus();
      }
    }

    function startListening() {
      if (!recognition) {
        addMessage('Voice input is not available in this browser. Please type your question instead.', false);
        return;
      }
      if (listening || speaking) return;
      try {
        listening = true;
        widget.classList.add('tv-chat-widget--listening');
        recognition.start();
      } catch (err) {
        listening = false;
        widget.classList.remove('tv-chat-widget--listening');
      }
    }

    toggle.addEventListener('click', togglePanel);
    send.addEventListener('click', handleSend);
    mic.addEventListener('click', startListening);
    input.addEventListener('keydown', function (e) {
      if (e.key === 'Enter') handleSend();
    });
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', createWidget);
  } else {
    createWidget();
  }
})();
