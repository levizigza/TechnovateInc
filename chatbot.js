/* ============================================
   Technovate — Nova holographic robot assistant
   Faceted Asaro-style head, floating (no chat box)
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
    var metal = 'rgba(140,190,210,0.35)';
    var led = 'rgba(0,255,255,0.92)';

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
          '<linearGradient id="' + uid + 'Visor" x1="0%" y1="0%" x2="100%" y2="0%">' +
            '<stop offset="0%" stop-color="rgba(0,255,255,0.15)"/>' +
            '<stop offset="50%" stop-color="rgba(0,255,255,0.55)"/>' +
            '<stop offset="100%" stop-color="rgba(0,255,255,0.15)"/>' +
          '</linearGradient>' +
        '</defs>' +
        '<ellipse cx="100" cy="132" rx="78" ry="98" fill="url(#' + uid + 'Aura)"/>' +
        '<g class="tv-nova-head__facets" stroke-linejoin="round">' +
          /* cranium helmet — faceted dome */
          '<polygon points="68,38 132,38 124,54 76,54" fill="' + hi + '" stroke="' + e + '" stroke-width="0.65"/>' +
          '<polygon points="52,72 68,38 76,54 62,78" fill="' + lo + '" stroke="' + eSoft + '" stroke-width="0.55"/>' +
          '<polygon points="148,72 132,38 124,54 138,78" fill="' + sh + '" stroke="' + eSoft + '" stroke-width="0.55"/>' +
          '<polygon points="76,54 124,54 116,70 84,70" fill="url(#' + uid + 'Lit)" stroke="' + e + '" stroke-width="0.65"/>' +
          '<polygon points="62,78 76,54 84,70 72,86" fill="' + mid + '" stroke="' + eSoft + '" stroke-width="0.55"/>' +
          '<polygon points="138,78 124,54 116,70 128,86" fill="' + lo + '" stroke="' + eSoft + '" stroke-width="0.55"/>' +
          /* forehead sensor bank */
          '<polygon points="84,70 116,70 112,82 88,82" fill="' + deep + '" stroke="' + e + '" stroke-width="0.6"/>' +
          '<rect class="tv-nova-head__led tv-nova-head__led--forehead" x="94" y="73" width="12" height="4" rx="1" fill="' + led + '" stroke="' + e + '" stroke-width="0.4"/>' +
          '<line x1="90" y1="79" x2="110" y2="79" stroke="' + eSoft + '" stroke-width="0.45"/>' +
          /* visor brow plate */
          '<polygon points="72,82 128,82 120,96 80,96" fill="' + mid + '" stroke="' + e + '" stroke-width="0.6"/>' +
          '<polygon points="80,96 120,96 116,104 84,104" fill="url(#' + uid + 'Visor)" stroke="' + e + '" stroke-width="0.55"/>' +
          /* temple + ear modules */
          '<polygon points="48,98 62,78 72,86 66,108" fill="' + sh + '" stroke="' + eSoft + '" stroke-width="0.5"/>' +
          '<polygon points="152,98 138,78 128,86 134,108" fill="' + sh + '" stroke="' + eSoft + '" stroke-width="0.5"/>' +
          '<polygon points="42,104 48,98 54,112 48,124" fill="' + lo + '" stroke="' + e + '" stroke-width="0.55"/>' +
          '<polygon points="158,104 152,98 146,112 152,124" fill="' + lo + '" stroke="' + e + '" stroke-width="0.55"/>' +
          '<line class="tv-nova-head__antenna" x1="46" y1="104" x2="38" y2="78" stroke="' + e + '" stroke-width="0.9" stroke-linecap="round"/>' +
          '<circle cx="38" cy="76" r="2.2" fill="' + led + '" stroke="' + e + '" stroke-width="0.4"/>' +
          '<line class="tv-nova-head__antenna" x1="154" y1="104" x2="162" y2="78" stroke="' + e + '" stroke-width="0.9" stroke-linecap="round"/>' +
          '<circle cx="162" cy="76" r="2.2" fill="' + led + '" stroke="' + e + '" stroke-width="0.4"/>' +
          /* cheek armour plates */
          '<polygon points="66,108 80,96 84,104 76,124" fill="' + mid + '" stroke="' + eSoft + '" stroke-width="0.55"/>' +
          '<polygon points="134,108 120,96 116,104 124,124" fill="' + lo + '" stroke="' + eSoft + '" stroke-width="0.55"/>' +
          '<g class="tv-nova-head__vents" stroke="' + eSoft + '" stroke-width="0.45">' +
            '<line x1="70" y1="112" x2="74" y2="120"/>' +
            '<line x1="74" y1="110" x2="78" y2="118"/>' +
            '<line x1="122" y1="110" x2="126" y2="118"/>' +
            '<line x1="126" y1="112" x2="130" y2="120"/>' +
          '</g>' +
          /* optical sensor eyes */
          '<g class="tv-nova-head__eye">' +
            '<polygon points="72,108 88,100 96,112 88,124" fill="' + deep + '" stroke="' + e + '" stroke-width="0.6"/>' +
            '<polygon points="78,106 90,102 92,112 82,118" fill="' + sh + '" stroke="' + eSoft + '" stroke-width="0.45"/>' +
            '<rect x="80" y="108" width="8" height="4" rx="0.5" fill="' + led + '"/>' +
          '</g>' +
          '<g class="tv-nova-head__eye">' +
            '<polygon points="128,108 112,100 104,112 112,124" fill="' + deep + '" stroke="' + e + '" stroke-width="0.6"/>' +
            '<polygon points="122,106 110,102 108,112 118,118" fill="' + sh + '" stroke="' + eSoft + '" stroke-width="0.45"/>' +
            '<rect x="112" y="108" width="8" height="4" rx="0.5" fill="' + led + '"/>' +
          '</g>' +
          /* nose rangefinder */
          '<polygon points="96,104 104,104 102,120 98,120" fill="' + hi + '" stroke="' + e + '" stroke-width="0.55"/>' +
          '<polygon points="98,120 102,120 100,128 98,128" fill="' + led + '" stroke="none"/>' +
          /* mid-face panel */
          '<polygon points="84,104 116,104 112,124 88,124" fill="' + mid + '" stroke="' + eSoft + '" stroke-width="0.5"/>' +
          /* vocoder speaker grille */
          '<polygon points="88,124 112,124 108,136 92,136" fill="' + deep + '" stroke="' + e + '" stroke-width="0.6"/>' +
          '<g class="tv-nova-head__mouth">' +
            '<line x1="92" y1="128" x2="108" y2="128" stroke="' + led + '" stroke-width="1.1" stroke-linecap="round"/>' +
            '<line x1="93" y1="131" x2="107" y2="131" stroke="' + e + '" stroke-width="0.75" stroke-linecap="round"/>' +
            '<line x1="94" y1="134" x2="106" y2="134" stroke="' + eSoft + '" stroke-width="0.65" stroke-linecap="round"/>' +
          '</g>' +
          /* jaw guard */
          '<polygon points="76,124 88,124 92,136 82,148 74,138" fill="' + lo + '" stroke="' + eSoft + '" stroke-width="0.55"/>' +
          '<polygon points="124,124 112,124 108,136 118,148 126,138" fill="' + sh + '" stroke="' + eSoft + '" stroke-width="0.55"/>' +
          '<polygon points="82,148 92,136 108,136 118,148 104,158 96,158" fill="' + hi + '" stroke="' + e + '" stroke-width="0.6"/>' +
          '<polygon points="88,124 112,124 108,136 92,136" fill="' + mid + '" stroke="' + eSoft + '" stroke-width="0.45"/>' +
          /* neck — segmented actuator collar */
          '<polygon points="82,158 118,158 114,172 86,172" fill="' + mid + '" stroke="' + e + '" stroke-width="0.6"/>' +
          '<polygon points="86,172 114,172 110,186 90,186" fill="' + lo + '" stroke="' + eSoft + '" stroke-width="0.55"/>' +
          '<polygon points="90,186 110,186 106,200 94,200" fill="' + sh + '" stroke="' + eSoft + '" stroke-width="0.55"/>' +
          '<polygon points="94,200 106,200 102,214 98,214" fill="' + mid + '" stroke="' + e + '" stroke-width="0.5"/>' +
          '<line x1="88" y1="166" x2="112" y2="166" stroke="' + eSoft + '" stroke-width="0.4"/>' +
          '<line x1="90" y1="180" x2="110" y2="180" stroke="' + eSoft + '" stroke-width="0.4"/>' +
          '<line x1="92" y1="194" x2="108" y2="194" stroke="' + eSoft + '" stroke-width="0.4"/>' +
          /* bolt rivets */
          '<g class="tv-nova-head__bolts" fill="' + metal + '" stroke="' + eSoft + '" stroke-width="0.35">' +
            '<circle cx="76" cy="54" r="1.3"/>' +
            '<circle cx="124" cy="54" r="1.3"/>' +
            '<circle cx="72" cy="86" r="1.2"/>' +
            '<circle cx="128" cy="86" r="1.2"/>' +
            '<circle cx="82" cy="148" r="1.2"/>' +
            '<circle cx="118" cy="148" r="1.2"/>' +
            '<circle cx="86" cy="172" r="1.1"/>' +
            '<circle cx="114" cy="172" r="1.1"/>' +
          '</g>' +
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
    var speechMuted = false;
    var floatRaf = 0;
    var floatPhase = Math.random() * Math.PI * 2;

    try {
      speechMuted = localStorage.getItem('technovate_nova_muted') === '1';
    } catch (e) {}

    var root = document.createElement('div');
    root.className = 'tv-nova' + (speechMuted ? ' tv-nova--muted' : '');
    root.id = 'tv-nova';
    root.innerHTML =
      '<div class="tv-nova__hud" id="tv-nova-hud" hidden>' +
        '<div class="tv-nova__hud-top">' +
          '<p class="tv-nova__name">Nova</p>' +
          '<button class="tv-nova__hud-mute" id="tv-nova-hud-mute" type="button" aria-pressed="false">' +
            '<span class="tv-nova__hud-mute-label">Mute voice</span>' +
          '</button>' +
        '</div>' +
        '<p class="tv-nova__speech" id="tv-nova-speech"></p>' +
        '<div class="tv-nova__prompts" id="tv-nova-prompts"></div>' +
      '</div>' +
      '<button class="tv-nova__mute" id="tv-nova-mute" type="button" aria-pressed="false" aria-label="Mute Nova voice" title="Mute Nova voice">' +
        '<svg class="tv-nova__mute-icon tv-nova__mute-icon--on" viewBox="0 0 24 24" width="18" height="18" aria-hidden="true">' +
          '<path fill="currentColor" d="M3 9v6h4l5 5V4L7 9H3zm13.5 3c0-1.77-1.02-3.29-2.5-4.03v8.05c1.48-.73 2.5-2.25 2.5-4.02zM14 3.23v2.06c2.89.86 5 3.54 5 6.71s-2.11 5.85-5 6.71v2.06c4.01-.91 7-4.49 7-8.77s-2.99-7.86-7-8.77z"/>' +
        '</svg>' +
        '<svg class="tv-nova__mute-icon tv-nova__mute-icon--off" viewBox="0 0 24 24" width="18" height="18" aria-hidden="true">' +
          '<path fill="currentColor" d="M16.5 12c0-1.77-1.02-3.29-2.5-4.03v2.21l2.45 2.45c.03-.2.05-.41.05-.63zm2.5 0c0 .94-.2 1.82-.54 2.64l1.51 1.51C20.63 14.91 21 13.5 21 12c0-4.28-2.99-7.86-7-8.77v2.06c2.89.86 5 3.54 5 6.71zM4.27 3L3 4.27 7.73 9H3v6h4l5 5v-6.73l4.25 4.25c-.67.52-1.42.93-2.25 1.18v2.06c1.38-.31 2.63-.95 3.69-1.81L19.73 21 21 19.73l-9-9L4.27 3zM12 4L9.91 6.09 12 8.18V4z"/>' +
        '</svg>' +
        '<span class="tv-nova__mute-label">Mute</span>' +
      '</button>' +
      '<button class="tv-nova__mic" id="tv-nova-mic" type="button" aria-label="Speak to Nova">' +
        '<span class="tv-nova__mic-ring" aria-hidden="true"></span>' +
        '<svg viewBox="0 0 24 24" width="20" height="20"><path fill="currentColor" d="M12 14a3 3 0 0 0 3-3V6a3 3 0 1 0-6 0v5a3 3 0 0 0 3 3zm5-3a5 5 0 0 1-10 0H5a7 7 0 0 0 6 6.71V21h2v-3.29A7 7 0 0 0 19 11h-2z"/></svg>' +
      '</button>' +
      '<button class="tv-nova__head-wrap" id="tv-nova-head-btn" type="button" aria-label="Talk to Nova, holographic robot assistant">' +
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
    var muteBtn = document.getElementById('tv-nova-mute');
    var hudMuteBtn = document.getElementById('tv-nova-hud-mute');
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

    function updateMuteUi() {
      if (muteBtn) {
        muteBtn.setAttribute('aria-pressed', speechMuted ? 'true' : 'false');
        muteBtn.setAttribute('aria-label', speechMuted ? 'Unmute Nova voice' : 'Mute Nova voice');
        muteBtn.title = speechMuted ? 'Unmute Nova voice' : 'Mute Nova voice';
      }
      if (hudMuteBtn) {
        hudMuteBtn.setAttribute('aria-pressed', speechMuted ? 'true' : 'false');
        hudMuteBtn.querySelector('.tv-nova__hud-mute-label').textContent =
          speechMuted ? 'Voice muted' : 'Mute voice';
      }
      root.classList.toggle('tv-nova--muted', speechMuted);
    }

    function toggleMute() {
      speechMuted = !speechMuted;
      try {
        if (speechMuted) localStorage.setItem('technovate_nova_muted', '1');
        else localStorage.removeItem('technovate_nova_muted');
      } catch (e) {}
      if (speechMuted && synth) synth.cancel();
      if (speechMuted) {
        speaking = false;
        if (!listening) setState(active ? 'idle' : 'idle');
      }
      updateMuteUi();
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
      if (speechMuted || !synth) {
        speaking = false;
        setState('idle');
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

    if (muteBtn) {
      muteBtn.addEventListener('click', function (e) {
        e.stopPropagation();
        toggleMute();
      });
    }

    if (hudMuteBtn) {
      hudMuteBtn.addEventListener('click', function (e) {
        e.stopPropagation();
        toggleMute();
      });
    }

    updateMuteUi();

    window.TechnovateNova = {
      mute: function () {
        if (!speechMuted) toggleMute();
      },
      unmute: function () {
        if (speechMuted) toggleMute();
      },
      toggleMute: toggleMute,
      isMuted: function () { return speechMuted; }
    };

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
