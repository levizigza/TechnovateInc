/* ============================================
   Technovate — Intro cinematic score
   Epic space fanfare (Web Audio API, procedural)
   ============================================ */
(function () {
  'use strict';

  function createIntroMusic() {
    var ctx = null;
    var master = null;
    var nodes = [];
    var running = false;
    var started = false;
    var targetVolume = 0.48;
    var ducked = false;

    function getContext() {
      if (!ctx) {
        var AC = window.AudioContext || window.webkitAudioContext;
        if (!AC) return null;
        ctx = new AC();
      }
      return ctx;
    }

    function track(node) {
      nodes.push(node);
      return node;
    }

    function playFanfareNote(freq, time, duration, gainValue) {
      var osc = track(ctx.createOscillator());
      var gain = track(ctx.createGain());
      var filter = track(ctx.createBiquadFilter());

      osc.type = 'sawtooth';
      osc.frequency.setValueAtTime(freq, time);

      filter.type = 'lowpass';
      filter.frequency.setValueAtTime(500, time);
      filter.frequency.exponentialRampToValueAtTime(2800, time + 0.08);
      filter.frequency.exponentialRampToValueAtTime(900, time + duration);

      gain.gain.setValueAtTime(0.0001, time);
      gain.gain.exponentialRampToValueAtTime(gainValue, time + 0.05);
      gain.gain.exponentialRampToValueAtTime(0.0001, time + duration);

      osc.connect(filter);
      filter.connect(gain);
      gain.connect(master);
      osc.start(time);
      osc.stop(time + duration + 0.05);
    }

    function playTimpani(time) {
      var osc = track(ctx.createOscillator());
      var gain = track(ctx.createGain());
      osc.type = 'sine';
      osc.frequency.setValueAtTime(92, time);
      osc.frequency.exponentialRampToValueAtTime(48, time + 0.45);
      gain.gain.setValueAtTime(0.0001, time);
      gain.gain.exponentialRampToValueAtTime(0.35, time + 0.02);
      gain.gain.exponentialRampToValueAtTime(0.0001, time + 0.55);
      osc.connect(gain);
      gain.connect(master);
      osc.start(time);
      osc.stop(time + 0.6);
    }

    function buildGraph() {
      master = track(ctx.createGain());
      master.gain.value = 0;
      master.connect(ctx.destination);

      var now = ctx.currentTime + 0.05;
      var bass = track(ctx.createOscillator());
      var bassGain = track(ctx.createGain());
      var bassFilter = track(ctx.createBiquadFilter());
      bass.type = 'sawtooth';
      bass.frequency.value = 73.42;
      bassFilter.type = 'lowpass';
      bassFilter.frequency.value = 180;
      bassGain.gain.value = 0.16;
      bass.connect(bassFilter);
      bassFilter.connect(bassGain);
      bassGain.connect(master);
      bass.start();

      var fifth = track(ctx.createOscillator());
      var fifthGain = track(ctx.createGain());
      fifth.type = 'triangle';
      fifth.frequency.value = 110;
      fifthGain.gain.value = 0.08;
      fifth.connect(fifthGain);
      fifthGain.connect(master);
      fifth.start();

      var strings = track(ctx.createOscillator());
      var strings2 = track(ctx.createOscillator());
      var stringsGain = track(ctx.createGain());
      var stringsFilter = track(ctx.createBiquadFilter());
      strings.type = 'sawtooth';
      strings2.type = 'sawtooth';
      strings.frequency.value = 293.66;
      strings2.frequency.value = 296.2;
      stringsFilter.type = 'lowpass';
      stringsFilter.frequency.setValueAtTime(400, now);
      stringsFilter.frequency.linearRampToValueAtTime(2200, now + 6);
      stringsGain.gain.value = 0.07;
      strings.connect(stringsFilter);
      strings2.connect(stringsFilter);
      stringsFilter.connect(stringsGain);
      stringsGain.connect(master);
      strings.start();
      strings2.start();

      playFanfareNote(146.83, now + 0.4, 0.9, 0.14);
      playFanfareNote(174.61, now + 0.55, 0.9, 0.13);
      playFanfareNote(220.0, now + 0.7, 1.0, 0.15);
      playFanfareNote(293.66, now + 0.9, 1.4, 0.16);

      playTimpani(now + 0.35);
      playTimpani(now + 1.1);
      playTimpani(now + 2.0);

      playFanfareNote(174.61, now + 2.3, 0.8, 0.11);
      playFanfareNote(220.0, now + 2.45, 0.8, 0.12);
      playFanfareNote(261.63, now + 2.6, 1.0, 0.13);
      playFanfareNote(349.23, now + 2.85, 1.6, 0.14);
    }

    function fadeTo(value, duration) {
      if (!master || !ctx) return;
      var now = ctx.currentTime;
      master.gain.cancelScheduledValues(now);
      master.gain.setValueAtTime(master.gain.value, now);
      master.gain.linearRampToValueAtTime(value, now + duration);
    }

    function start() {
      if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return false;
      var context = getContext();
      if (!context) return false;

      if (context.state === 'suspended') {
        context.resume();
      }

      if (!started) {
        buildGraph();
        started = true;
      }

      running = true;
      fadeTo(ducked ? targetVolume * 0.3 : targetVolume, 2.2);
      return true;
    }

    function duck() {
      ducked = true;
      if (running) fadeTo(targetVolume * 0.22, 1);
    }

    function unduck() {
      ducked = false;
      if (running) fadeTo(targetVolume, 1.5);
    }

    function stop() {
      if (!master || !ctx) return;
      running = false;
      fadeTo(0, 0.8);
      setTimeout(function () {
        nodes.forEach(function (node) {
          try {
            if (node.stop) node.stop();
            node.disconnect();
          } catch (e) { /* noop */ }
        });
        nodes = [];
        if (ctx) {
          ctx.close();
          ctx = null;
        }
        started = false;
        master = null;
      }, 900);
    }

    return {
      tryStart: start,
      start: start,
      stop: stop,
      duck: duck,
      unduck: unduck
    };
  }

  window.TechnovateIntroMusic = {
    create: createIntroMusic
  };
})();
