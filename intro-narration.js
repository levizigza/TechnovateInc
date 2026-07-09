/* ============================================
   Technovate — Intro narration
   Pre-rendered British neural voice (en-GB-RyanNeural)
   Generated via edge-tts; plays locally with no API key
   ============================================ */
(function () {
  'use strict';

  var TRACKS = [
    { file: 'assets/narration/01-here.mp3', text: 'Here...', pause: 700 },
    { file: 'assets/narration/02-realm.mp3', text: 'in the digital realm...', pause: 900 },
    { file: 'assets/narration/03-shape.mp3', text: 'something rather remarkable is taking shape.', pause: 1100 },
    { file: 'assets/narration/04-technovate.mp3', text: 'Technovate.', pause: 1300 },
    { file: 'assets/narration/05-ai.mp3', text: 'A place where artificial intelligence...', pause: 600 },
    { file: 'assets/narration/06-purpose.mp3', text: 'is being crafted with purpose.', pause: 900 },
    { file: 'assets/narration/07-commerce.mp3', text: 'Not merely for commerce or convenience.', pause: 700 },
    { file: 'assets/narration/08-health.mp3', text: 'But for health.', pause: 350 },
    { file: 'assets/narration/09-learning.mp3', text: 'For learning.', pause: 350 },
    { file: 'assets/narration/10-communities.mp3', text: 'For the bonds that hold communities together.', pause: 1000 },
    { file: 'assets/narration/11-code.mp3', text: 'Each line of code...', pause: 500 },
    { file: 'assets/narration/12-story.mp3', text: 'a small act of service to the human story.', pause: 1200 },
    { file: 'assets/narration/13-come-in.mp3', text: 'Do come in.', pause: 0 }
  ];

  function assetBase() {
    var path = window.location.pathname;
    if (path.endsWith('/')) return path;
    var slash = path.lastIndexOf('/');
    return slash >= 0 ? path.slice(0, slash + 1) : '/';
  }

  function createNarration(handlers) {
    handlers = handlers || {};
    var currentAudio = null;
    var playing = false;
    var stopped = false;
    var base = assetBase();

    function stopAudio() {
      if (!currentAudio) return;
      currentAudio.onended = null;
      currentAudio.onerror = null;
      currentAudio.pause();
      currentAudio.src = '';
      currentAudio = null;
    }

    function playLine(index, onComplete) {
      if (stopped) {
        playing = false;
        return;
      }

      if (index >= TRACKS.length) {
        playing = false;
        if (onComplete) onComplete();
        return;
      }

      var track = TRACKS[index];
      if (handlers.onLine) handlers.onLine(track.text, index);

      var audio = new Audio(base + track.file);
      currentAudio = audio;

      audio.onended = function () {
        currentAudio = null;
        setTimeout(function () {
          playLine(index + 1, onComplete);
        }, track.pause || 400);
      };

      audio.onerror = function () {
        currentAudio = null;
        if (handlers.onError) handlers.onError(track);
        setTimeout(function () {
          playLine(index + 1, onComplete);
        }, track.pause || 400);
      };

      var playPromise = audio.play();
      if (playPromise && playPromise.catch) {
        playPromise.catch(function () {
          if (handlers.onBlocked) handlers.onBlocked();
          playing = false;
          stopAudio();
        });
      }
    }

    return {
      play: function (onComplete) {
        stopped = false;
        playing = true;
        playLine(0, onComplete);
      },
      stop: function () {
        stopped = true;
        playing = false;
        stopAudio();
      },
      isPlaying: function () {
        return playing;
      },
      getTracks: function () {
        return TRACKS.slice();
      }
    };
  }

  window.TechnovateIntroNarration = {
    create: createNarration,
    tracks: TRACKS
  };
})();
