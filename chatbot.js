/* ============================================
   Technovate AI Assistant
   Lightweight site-info chatbot widget
   ============================================ */
(function () {
  'use strict';

  var KNOWLEDGE = {
    company: 'Technovate is a software development hub based in Calgary, Alberta, Canada. We build responsible AI and software solutions across five sectors: health, finance, education, enterprise, and community development.',
    contact: 'You can reach us at info@technovateinc.org. We are located in Calgary, Alberta, Canada. Visit our Contact page for more details.',
    sectors: 'We work across five sectors: (1) Health & Wellness — AI-assisted health engagement and tracking; (2) Finance & Wealth — financial visibility tools and wealth tracking; (3) Education & Learning — adaptive platforms and skill tracking; (4) Enterprise & Productivity — workflow automation and AI tools; (5) Community & Relationships — civic participation and coordination tools.',
    technology: 'Our technology stack is built on explainable AI, ethical data practices, and clear governance. Every solution is designed for auditability, compliance, and long-term scalability. Visit our Technology page for the full breakdown.',
    solutions: 'We offer purpose-built platforms for each sector, all sharing a unified technology foundation. Our solutions include AI orchestration, data governance, institutional reporting, and sector-specific modules.',
    projects: 'Our key projects include the Unified Platform Core (shared infrastructure for authentication, AI, and reporting), five sector-specific modules, and an impact reporting framework. Visit the Projects page for details.',
    grants: 'We are structured for grant programs, accelerators, and institutional partnerships. Our roadmaps, milestones, and transparent reporting meet the standards required by funding bodies. Check the Grants page for current opportunities.',
    impact: 'We measure impact through defined milestones, outcome tracking, and transparent reporting. Our goal is measurable social and economic impact across all five sectors.',
    about: 'Technovate was founded with the mission to build technology that serves institutional and community needs. We combine AI expertise with sector-specific domain knowledge to deliver software that creates real-world impact.',
    careers: 'We are always looking for talented individuals passionate about AI and social impact. Reach out to us at info@technovateinc.org for current opportunities.',
  };

  var PATTERNS = [
    { keys: ['hello', 'hi', 'hey', 'greet'], response: 'Hello! I\'m the Technovate AI assistant. How can I help you today? You can ask me about our company, sectors, technology, projects, or how to get in touch.' },
    { keys: ['contact', 'email', 'reach', 'location', 'address', 'where', 'calgary'], response: KNOWLEDGE.contact },
    { keys: ['sector', 'health', 'finance', 'education', 'enterprise', 'community', 'industry'], response: KNOWLEDGE.sectors },
    { keys: ['tech', 'stack', 'ai', 'artificial', 'machine', 'explain'], response: KNOWLEDGE.technology },
    { keys: ['solution', 'product', 'offer', 'service', 'platform'], response: KNOWLEDGE.solutions },
    { keys: ['project', 'portfolio', 'built', 'develop'], response: KNOWLEDGE.projects },
    { keys: ['grant', 'fund', 'partnership', 'accelerator', 'invest'], response: KNOWLEDGE.grants },
    { keys: ['impact', 'measure', 'outcome', 'result', 'metric'], response: KNOWLEDGE.impact },
    { keys: ['about', 'who', 'company', 'mission', 'founded', 'what is technovate'], response: KNOWLEDGE.about },
    { keys: ['career', 'job', 'hiring', 'work', 'join', 'opportunity'], response: KNOWLEDGE.careers },
    { keys: ['help', 'can you', 'what can'], response: 'I can help you learn about Technovate — our sectors, technology, projects, grants, and how to get in touch. Just ask me anything!' },
    { keys: ['thank', 'thanks', 'bye', 'goodbye'], response: 'You\'re welcome! Feel free to come back anytime. Have a great day!' },
  ];

  function findResponse(input) {
    var lower = input.toLowerCase().trim();
    if (!lower) return 'Please type a question and I\'ll do my best to help!';

    for (var i = 0; i < PATTERNS.length; i++) {
      for (var j = 0; j < PATTERNS[i].keys.length; j++) {
        if (lower.indexOf(PATTERNS[i].keys[j]) !== -1) {
          return PATTERNS[i].response;
        }
      }
    }
    return 'I\'m not sure about that, but I\'d love to help! Try asking about our sectors, technology, projects, grants, or contact info. Or reach out directly at info@technovateinc.org.';
  }

  function createWidget() {
    var style = document.createElement('style');
    style.textContent = [
      '.ta-widget{position:fixed;bottom:24px;right:24px;z-index:9000;font-family:var(--font,"Inter",sans-serif);}',
      '.ta-toggle{width:56px;height:56px;border-radius:50%;border:none;cursor:pointer;display:flex;align-items:center;justify-content:center;',
      'background:linear-gradient(135deg,#2563eb,#1d4ed8);color:#fff;box-shadow:0 4px 24px rgba(37,99,235,0.35);transition:transform 0.3s cubic-bezier(0.22,1,0.36,1),box-shadow 0.3s;}',
      '.ta-toggle:hover{transform:scale(1.08);box-shadow:0 8px 32px rgba(37,99,235,0.45);}',
      '.ta-toggle svg{width:24px;height:24px;fill:currentColor;}',
      '.ta-toggle--open svg{width:20px;height:20px;}',
      '.ta-panel{position:absolute;bottom:72px;right:0;width:360px;max-width:calc(100vw - 32px);max-height:520px;border-radius:16px;overflow:hidden;',
      'background:#fff;box-shadow:0 24px 80px rgba(15,23,42,0.18),0 0 0 1px rgba(15,23,42,0.06);display:none;flex-direction:column;}',
      '.ta-panel--open{display:flex;}',
      '.ta-head{padding:16px 20px;background:linear-gradient(135deg,#0f172a,#1e293b);color:#fff;display:flex;align-items:center;gap:12px;}',
      '.ta-head__dot{width:10px;height:10px;border-radius:50%;background:#34d399;flex-shrink:0;box-shadow:0 0 8px rgba(52,211,153,0.5);}',
      '.ta-head__title{font-size:14px;font-weight:600;letter-spacing:-0.01em;}',
      '.ta-head__sub{font-size:11px;color:rgba(255,255,255,0.5);}',
      '.ta-body{flex:1;overflow-y:auto;padding:16px;display:flex;flex-direction:column;gap:10px;min-height:200px;max-height:350px;}',
      '.ta-msg{padding:10px 14px;border-radius:12px;font-size:13px;line-height:1.55;max-width:88%;animation:taFade 0.3s ease;}',
      '.ta-msg--bot{background:#f1f5f9;color:#334155;align-self:flex-start;border-bottom-left-radius:4px;}',
      '.ta-msg--user{background:linear-gradient(135deg,#2563eb,#1d4ed8);color:#fff;align-self:flex-end;border-bottom-right-radius:4px;}',
      '.ta-input{display:flex;padding:12px 16px;border-top:1px solid #e2e8f0;gap:8px;background:#fff;}',
      '.ta-input input{flex:1;border:1px solid #e2e8f0;border-radius:10px;padding:10px 14px;font-size:13px;font-family:inherit;outline:none;transition:border-color 0.2s;}',
      '.ta-input input:focus{border-color:#3b82f6;box-shadow:0 0 0 3px rgba(59,130,246,0.1);}',
      '.ta-input button{width:36px;height:36px;border-radius:50%;border:none;cursor:pointer;display:flex;align-items:center;justify-content:center;',
      'background:#2563eb;color:#fff;flex-shrink:0;transition:background 0.2s;}',
      '.ta-input button:hover{background:#1d4ed8;}',
      '.ta-input button svg{width:16px;height:16px;fill:currentColor;}',
      '@keyframes taFade{from{opacity:0;transform:translateY(8px)}to{opacity:1;transform:none}}',
      '@media(max-width:480px){.ta-panel{width:calc(100vw - 16px);right:-16px;bottom:64px;max-height:70vh;}}',
    ].join('\n');
    document.head.appendChild(style);

    var widget = document.createElement('div');
    widget.className = 'ta-widget';
    widget.innerHTML = [
      '<div class="ta-panel" id="ta-panel">',
        '<div class="ta-head">',
          '<div class="ta-head__dot"></div>',
          '<div><div class="ta-head__title">Technovate AI</div><div class="ta-head__sub">Ask me anything about Technovate</div></div>',
        '</div>',
        '<div class="ta-body" id="ta-body">',
          '<div class="ta-msg ta-msg--bot">Hi there! I\'m the Technovate AI assistant. Ask me about our sectors, technology, projects, grants, or anything else about the company.</div>',
        '</div>',
        '<div class="ta-input">',
          '<input type="text" id="ta-input" placeholder="Type your question..." autocomplete="off" />',
          '<button id="ta-send" aria-label="Send"><svg viewBox="0 0 24 24"><path d="M2.01 21L23 12 2.01 3 2 10l15 2-15 2z"/></svg></button>',
        '</div>',
      '</div>',
      '<button class="ta-toggle" id="ta-toggle" aria-label="Open AI assistant">',
        '<svg viewBox="0 0 24 24"><path d="M20 2H4c-1.1 0-2 .9-2 2v18l4-4h14c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2zm0 14H5.17L4 17.17V4h16v12z"/><path d="M7 9h2v2H7zm4 0h2v2h-2zm4 0h2v2h-2z"/></svg>',
      '</button>',
    ].join('');
    document.body.appendChild(widget);

    var toggle = document.getElementById('ta-toggle');
    var panel = document.getElementById('ta-panel');
    var body = document.getElementById('ta-body');
    var input = document.getElementById('ta-input');
    var send = document.getElementById('ta-send');
    var isOpen = false;

    function togglePanel() {
      isOpen = !isOpen;
      panel.classList.toggle('ta-panel--open', isOpen);
      if (isOpen) {
        toggle.innerHTML = '<svg viewBox="0 0 24 24"><path d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z"/></svg>';
        toggle.classList.add('ta-toggle--open');
        setTimeout(function () { input.focus(); }, 100);
      } else {
        toggle.innerHTML = '<svg viewBox="0 0 24 24"><path d="M20 2H4c-1.1 0-2 .9-2 2v18l4-4h14c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2zm0 14H5.17L4 17.17V4h16v12z"/><path d="M7 9h2v2H7zm4 0h2v2h-2zm4 0h2v2h-2z"/></svg>';
        toggle.classList.remove('ta-toggle--open');
      }
    }

    function addMessage(text, isUser) {
      var msg = document.createElement('div');
      msg.className = 'ta-msg ta-msg--' + (isUser ? 'user' : 'bot');
      msg.textContent = text;
      body.appendChild(msg);
      body.scrollTop = body.scrollHeight;
    }

    function handleSend() {
      var q = input.value.trim();
      if (!q) return;
      addMessage(q, true);
      input.value = '';

      setTimeout(function () {
        addMessage(findResponse(q), false);
      }, 300 + Math.random() * 400);
    }

    toggle.addEventListener('click', togglePanel);
    send.addEventListener('click', handleSend);
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
