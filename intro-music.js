/* ============================================
   Technovate — Intro cinematic ambient
   Procedural CC0-style score (Web Audio API)
   Inspired by ambient space/documentary openings
   ============================================ */
(function () {
  'use strict';

  function createIntroMusic() {
    var ctx = null;
    var master = null;
    var padGain = null;
    var shimmerGain = null;
    var pulseGain = null;
    var oscillators = [];
    var running = false;
    var started = false;
    var targetVolume = 0.42;
    var ducked = false;

    function getContext() {
      if (!ctx) {
        var AC = window.AudioContext || window.webkitAudioContext;
        if (!AC) return null;
        ctx = new AC();
      }
      return ctx;
    }

    function buildGraph() {
      master = ctx.createGain();
      master.gain.value = 0;
      master.connect(ctx.destination);

      padGain = ctx.createGain();
      padGain.gain.value = 0.55;
      shimmerGain = ctx.createGain();
      shimmerGain.gain.value = 0.18;
      pulseGain = ctx.createGain();
      pulseGain.gain.value = 0.12;

      var padFilter = ctx.createBiquadFilter();
      padFilter.type = 'lowpass';
      padFilter.frequency.value = 900;
      padFilter.Q.value = 0.6;

      var shimmerFilter = ctx.createBiquadFilter();
      shimmerFilter.type = 'bandpass';
      shimmerFilter.frequency.value = 2400;
      shimmerFilter.Q.value = 1.2;

      padGain.connect(padFilter);
      shimmerGain.connect(shimmerFilter);
      pulseGain.connect(padFilter);

      padFilter.connect(master);
      shimmerFilter.connect(master);

      var roots = [55, 82.5, 110, 164.81];
      roots.forEach(function (freq, i) {
        var osc = ctx.createOscillator();
        osc.type = i === 0 ? 'sine' : 'triangle';
        osc.frequency.value = freq;
        var oscGain = ctx.createGain();
        oscGain.gain.value = 0.14 - i * 0.02;
        osc.connect(oscGain);
        oscGain.connect(padGain);
        osc.start();
        oscillators.push(osc);
      });

      var shimmer = ctx.createOscillator();
      shimmer.type = 'sine';
      shimmer.frequency.value = 880;
      var shimmerLfo = ctx.createOscillator();
      shimmerLfo.frequency.value = 0.08;
      var shimmerLfoGain = ctx.createGain();
      shimmerLfoGain.gain.value = 120;
      shimmerLfo.connect(shimmerLfoGain);
      shimmerLfoGain.connect(shimmer.frequency);
      shimmer.connect(shimmerGain);
      shimmer.start();
      shimmerLfo.start();
      oscillators.push(shimmer, shimmerLfo);

      var pulse = ctx.createOscillator();
      pulse.type = 'sine';
      pulse.frequency.value = 41.2;
      var pulseLfo = ctx.createOscillator();
      pulseLfo.frequency.value = 0.04;
      var pulseLfoGain = ctx.createGain();
      pulseLfoGain.gain.value = 8;
      pulseLfo.connect(pulseLfoGain);
      pulseLfoGain.connect(pulse.frequency);
      pulse.connect(pulseGain);
      pulse.start();
      pulseLfo.start();
      oscillators.push(pulse, pulseLfo);

      var bufferSize = ctx.sampleRate * 2;
      var noiseBuffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
      var data = noiseBuffer.getChannelData(0);
      for (var n = 0; n < bufferSize; n++) {
        data[n] = (Math.random() * 2 - 1) * 0.35;
      }
      var noise = ctx.createBufferSource();
      noise.buffer = noiseBuffer;
      noise.loop = true;
      var noiseFilter = ctx.createBiquadFilter();
      noiseFilter.type = 'highpass';
      noiseFilter.frequency.value = 4000;
      var noiseGain = ctx.createGain();
      noiseGain.gain.value = 0.025;
      noise.connect(noiseFilter);
      noiseFilter.connect(noiseGain);
      noiseGain.connect(shimmerGain);
      noise.start();
      oscillators.push(noise);
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
      fadeTo(ducked ? targetVolume * 0.35 : targetVolume, 2.8);
      return true;
    }

    function tryStart() {
      return start();
    }

    function duck() {
      ducked = true;
      if (running) fadeTo(targetVolume * 0.28, 1.2);
    }

    function unduck() {
      ducked = false;
      if (running) fadeTo(targetVolume, 1.8);
    }

    function stop() {
      if (!master || !ctx) return;
      running = false;
      fadeTo(0, 0.9);
      setTimeout(function () {
        oscillators.forEach(function (osc) {
          try { osc.stop(); } catch (e) { /* already stopped */ }
        });
        oscillators = [];
        if (ctx) {
          ctx.close();
          ctx = null;
        }
        started = false;
        master = null;
      }, 1000);
    }

    return {
      tryStart: tryStart,
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
