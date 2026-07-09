/* ============================================
   Technovate — Intro cinematic score
   Electronic robot ambience (Web Audio API)
   ============================================ */
(function () {
  'use strict';

  function createIntroMusic() {
    var ctx = null;
    var master = null;
    var nodes = [];
    var running = false;
    var started = false;
    var targetVolume = 0.44;
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

    function playRobotBlip(freq, time, duration, gainValue) {
      var osc = track(ctx.createOscillator());
      var gain = track(ctx.createGain());
      var filter = track(ctx.createBiquadFilter());

      osc.type = 'square';
      osc.frequency.setValueAtTime(freq * 1.08, time);
      osc.frequency.exponentialRampToValueAtTime(freq * 0.72, time + duration);

      filter.type = 'bandpass';
      filter.frequency.setValueAtTime(freq * 2.2, time);
      filter.Q.value = 8;

      gain.gain.setValueAtTime(0.0001, time);
      gain.gain.exponentialRampToValueAtTime(gainValue, time + 0.008);
      gain.gain.exponentialRampToValueAtTime(0.0001, time + duration);

      osc.connect(filter);
      filter.connect(gain);
      gain.connect(master);
      osc.start(time);
      osc.stop(time + duration + 0.02);
    }

    function playRobotChirp(freq, time, duration, gainValue) {
      var osc = track(ctx.createOscillator());
      var gain = track(ctx.createGain());
      var filter = track(ctx.createBiquadFilter());

      osc.type = 'sawtooth';
      osc.frequency.setValueAtTime(freq, time);
      osc.frequency.linearRampToValueAtTime(freq * 1.6, time + duration * 0.4);
      osc.frequency.exponentialRampToValueAtTime(freq * 0.5, time + duration);

      filter.type = 'lowpass';
      filter.frequency.setValueAtTime(900, time);
      filter.frequency.exponentialRampToValueAtTime(3200, time + duration * 0.25);
      filter.frequency.exponentialRampToValueAtTime(400, time + duration);

      gain.gain.setValueAtTime(0.0001, time);
      gain.gain.exponentialRampToValueAtTime(gainValue, time + 0.01);
      gain.gain.exponentialRampToValueAtTime(0.0001, time + duration);

      osc.connect(filter);
      filter.connect(gain);
      gain.connect(master);
      osc.start(time);
      osc.stop(time + duration + 0.02);
    }

    function buildGraph() {
      master = track(ctx.createGain());
      master.gain.value = 0;
      master.connect(ctx.destination);

      var now = ctx.currentTime + 0.05;

      var hum = track(ctx.createOscillator());
      var humGain = track(ctx.createGain());
      var humFilter = track(ctx.createBiquadFilter());
      hum.type = 'square';
      hum.frequency.value = 55;
      humFilter.type = 'lowpass';
      humFilter.frequency.value = 140;
      humGain.gain.value = 0.1;
      hum.connect(humFilter);
      humFilter.connect(humGain);
      humGain.connect(master);
      hum.start();

      var sub = track(ctx.createOscillator());
      var subGain = track(ctx.createGain());
      sub.type = 'triangle';
      sub.frequency.value = 110;
      subGain.gain.value = 0.05;
      sub.connect(subGain);
      subGain.connect(master);
      sub.start();

      var lfo = track(ctx.createOscillator());
      var lfoGain = track(ctx.createGain());
      lfo.type = 'sine';
      lfo.frequency.value = 4.5;
      lfoGain.gain.value = 28;
      lfo.connect(lfoGain);
      lfoGain.connect(humFilter.frequency);
      lfo.start();

      var arpNotes = [196, 233, 294, 349, 392, 440, 523, 587];
      for (var i = 0; i < 32; i++) {
        playRobotBlip(arpNotes[i % arpNotes.length], now + 0.15 + i * 0.16, 0.07, 0.09 + (i % 4) * 0.01);
      }

      playRobotChirp(880, now + 0.5, 0.35, 0.06);
      playRobotChirp(660, now + 1.2, 0.4, 0.07);
      playRobotChirp(1046, now + 2.0, 0.5, 0.08);
      playRobotChirp(523, now + 2.8, 0.45, 0.07);

      var bufferSize = ctx.sampleRate * 2;
      var noiseBuffer = track(ctx.createBuffer(1, bufferSize, ctx.sampleRate));
      var data = noiseBuffer.getChannelData(0);
      for (var n = 0; n < bufferSize; n++) {
        data[n] = (Math.random() * 2 - 1) * 0.4;
      }

      var noise = track(ctx.createBufferSource());
      noise.buffer = noiseBuffer;
      noise.loop = true;
      var noiseFilter = track(ctx.createBiquadFilter());
      noiseFilter.type = 'bandpass';
      noiseFilter.frequency.value = 2200;
      noiseFilter.Q.value = 2.5;
      var noiseGain = track(ctx.createGain());
      noiseGain.gain.value = 0.018;
      noise.connect(noiseFilter);
      noiseFilter.connect(noiseGain);
      noiseGain.connect(master);
      noise.start();

      var pulse = track(ctx.createOscillator());
      var pulseGain = track(ctx.createGain());
      pulse.type = 'square';
      pulse.frequency.value = 2.2;
      var pulseMod = track(ctx.createGain());
      pulseMod.gain.value = 0.012;
      pulse.connect(pulseMod);
      pulseMod.connect(noiseGain.gain);
      pulse.start();
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
      fadeTo(ducked ? targetVolume * 0.28 : targetVolume, 1.8);
      return true;
    }

    function duck() {
      ducked = true;
      if (running) fadeTo(targetVolume * 0.18, 0.8);
    }

    function unduck() {
      ducked = false;
      if (running) fadeTo(targetVolume, 1.2);
    }

    function stop() {
      if (!master || !ctx) return;
      running = false;
      fadeTo(0, 0.7);
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
      }, 800);
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
