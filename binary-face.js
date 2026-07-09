/* ============================================
   Technovate — Binary AI Face
   Matrix rain background + 1s/0s speaking face
   ============================================ */
(function () {
  'use strict';

  function getViewportSize(canvas) {
    if (canvas.classList && canvas.classList.contains('intro-matrix-bg')) {
      return {
        w: window.innerWidth || 1280,
        h: window.innerHeight || 720
      };
    }
    var rect = canvas.getBoundingClientRect();
    var w = Math.floor(rect.width) || window.innerWidth || 1280;
    var h = Math.floor(rect.height) || window.innerHeight || 720;
    return { w: w, h: h };
  }

  function setupCanvas(canvas, w, h) {
    var dpr = Math.min(window.devicePixelRatio || 1, 2);
    canvas.width = Math.floor(w * dpr);
    canvas.height = Math.floor(h * dpr);
    canvas.style.width = w + 'px';
    canvas.style.height = h + 'px';
    var ctx = canvas.getContext('2d');
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    return { ctx: ctx, w: w, h: h, dpr: dpr };
  }

  function createMatrixRain(canvas, opts) {
    opts = opts || {};
    var fontSize = opts.fontSize || 16;
    var trailLen = opts.trailLen || 24;
    var fadeAlpha = opts.fadeAlpha || 0.12;
    var headAlpha = opts.headAlpha || 1;
    var bodyAlpha = opts.bodyAlpha || 0.65;
    var speedMin = opts.speedMin || 2;
    var speedMax = opts.speedMax || 5;
    var W = 0;
    var H = 0;
    var ctx = null;
    var cols = [];
    var running = true;
    var animId = 0;
    var started = false;

    function resize() {
      var size = getViewportSize(canvas);
      var setup = setupCanvas(canvas, size.w, size.h);
      ctx = setup.ctx;
      W = setup.w;
      H = setup.h;

      var colCount = Math.max(1, Math.floor(W / fontSize));
      cols = [];
      for (var i = 0; i < colCount; i++) {
        var chars = [];
        for (var j = 0; j < trailLen; j++) {
          chars.push(Math.random() > 0.5 ? '1' : '0');
        }
        cols.push({
          x: i * fontSize + fontSize * 0.5,
          y: Math.random() * H,
          speed: speedMin + Math.random() * (speedMax - speedMin),
          chars: chars
        });
      }

      ctx.fillStyle = '#010204';
      ctx.fillRect(0, 0, W, H);
      started = W > 0 && H > 0;
    }

    function draw() {
      if (!running) return;

      if (!started || !ctx) {
        animId = requestAnimationFrame(draw);
        return;
      }

      ctx.fillStyle = 'rgba(1, 2, 4, ' + fadeAlpha + ')';
      ctx.fillRect(0, 0, W, H);

      ctx.font = 'bold ' + fontSize + 'px "Courier New", Consolas, monospace';
      ctx.textAlign = 'center';
      ctx.textBaseline = 'top';

      for (var i = 0; i < cols.length; i++) {
        var col = cols[i];
        col.y += col.speed;

        for (var j = 0; j < trailLen; j++) {
          var y = col.y - j * fontSize;
          if (y < -fontSize || y > H + fontSize) continue;

          var fade = 1 - j / trailLen;
          fade = fade * fade;

          if (j === 0) {
            ctx.fillStyle = 'rgba(180, 255, 180, ' + (fade * headAlpha) + ')';
            ctx.shadowColor = 'rgba(0, 255, 65, 1)';
            ctx.shadowBlur = 16;
          } else {
            ctx.fillStyle = 'rgba(0, 255, 65, ' + (fade * bodyAlpha) + ')';
            ctx.shadowBlur = 0;
          }

          if (Math.random() > 0.98) {
            col.chars[j] = col.chars[j] === '1' ? '0' : '1';
          }

          ctx.fillText(col.chars[j], col.x, y);
        }

        ctx.shadowBlur = 0;

        if (col.y > H + trailLen * fontSize) {
          col.y = -trailLen * fontSize * Math.random();
          col.speed = speedMin + Math.random() * (speedMax - speedMin);
        }
      }

      animId = requestAnimationFrame(draw);
    }

    resize();
    window.addEventListener('resize', resize);
    draw();

    return {
      stop: function () {
        running = false;
        cancelAnimationFrame(animId);
        window.removeEventListener('resize', resize);
      },
      refresh: resize
    };
  }

  function createFaceRenderer(canvas) {
    var ctx = null;
    var W = 0;
    var H = 0;
    var cellSize = 11;
    var cols = 0;
    var rows = 0;
    var cells = [];
    var speaking = false;
    var mouthPhase = 0;
    var animId = 0;
    var running = true;

    function faceRegion(nx, ny) {
      var cx = 0.5;
      var cy = 0.4;
      var dx = (nx - cx) / 0.24;
      var dy = (ny - cy) / 0.3;
      var inHead = dx * dx + dy * dy <= 1;

      if (!inHead) return 0;
      if (ny > 0.66 && Math.abs(nx - 0.5) > 0.11) return 0;

      var le = Math.pow((nx - 0.38) / 0.048, 2) + Math.pow((ny - 0.33) / 0.034, 2);
      var re = Math.pow((nx - 0.62) / 0.048, 2) + Math.pow((ny - 0.33) / 0.034, 2);
      if (le < 1 || re < 1) return 0;

      var cheekL = Math.pow((nx - 0.34) / 0.06, 2) + Math.pow((ny - 0.48) / 0.05, 2);
      var cheekR = Math.pow((nx - 0.66) / 0.06, 2) + Math.pow((ny - 0.48) / 0.05, 2);
      if (cheekL < 1 || cheekR < 1) return 5;

      var nose = Math.pow((nx - 0.5) / 0.028, 2) + Math.pow((ny - 0.44) / 0.07, 2);
      if (nose < 1) return 5;

      var open = speaking ? 0.55 + Math.sin(mouthPhase * 0.22) * 0.35 : 0.15;
      var mw = 0.09 + open * 0.05;
      var mh = 0.028 + open * 0.06;
      var md = Math.pow((nx - 0.5) / mw, 2) + Math.pow((ny - 0.54) / mh, 2);
      if (md < 0.45) return 0;
      if (md < 1) return 3;

      var brow = Math.pow((nx - 0.38) / 0.07, 2) + Math.pow((ny - 0.27) / 0.025, 2);
      var browR = Math.pow((nx - 0.62) / 0.07, 2) + Math.pow((ny - 0.27) / 0.025, 2);
      if (brow < 1 || browR < 1) return 4;

      return 1;
    }

    function buildGrid() {
      cols = Math.ceil(W / cellSize);
      rows = Math.ceil(H / cellSize);
      cells = [];
      for (var r = 0; r < rows; r++) {
        for (var c = 0; c < cols; c++) {
          var nx = (c + 0.5) / cols;
          var ny = (r + 0.5) / rows;
          var region = faceRegion(nx, ny);
          cells.push({
            c: c,
            r: r,
            region: region,
            char: Math.random() > 0.5 ? '1' : '0',
            tick: Math.random() * 100
          });
        }
      }
    }

    function resize() {
      var rect = canvas.getBoundingClientRect();
      var w = Math.floor(rect.width) || 520;
      var h = Math.floor(rect.height) || 360;
      var setup = setupCanvas(canvas, w, h);
      ctx = setup.ctx;
      W = setup.w;
      H = setup.h;
      buildGrid();
    }

    function drawFace() {
      if (!ctx) return;

      ctx.clearRect(0, 0, W, H);

      mouthPhase += speaking ? 1.8 : 0.4;
      ctx.font = 'bold ' + (cellSize - 1) + 'px "Courier New", Consolas, monospace';
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';

      for (var i = 0; i < cells.length; i++) {
        var cell = cells[i];
        if (!cell.region || cell.region === 5) continue;

        cell.tick += cell.region === 3 && speaking ? 0.35 : 0.04;
        if (cell.tick > 1) {
          cell.tick = 0;
          if (Math.random() > 0.65) {
            cell.char = cell.char === '1' ? '0' : '1';
          }
        }

        var x = cell.c * cellSize + cellSize * 0.5;
        var y = cell.r * cellSize + cellSize * 0.5;
        var alpha = 0.35;

        if (cell.region === 1) alpha = 0.65 + Math.sin(cell.tick * 3 + i) * 0.15;
        if (cell.region === 3) alpha = speaking ? 0.95 + Math.sin(mouthPhase * 0.3) * 0.05 : 0.75;
        if (cell.region === 4) alpha = 0.8;

        var hue = cell.region === 3 && speaking ? '0, 255, 220' : '0, 212, 255';

        ctx.shadowColor = 'rgba(' + hue + ', 0.9)';
        ctx.shadowBlur = cell.region === 3 ? 10 : 6;
        ctx.fillStyle = 'rgba(' + hue + ', ' + alpha + ')';
        ctx.fillText(cell.char, x, y);
      }

      ctx.shadowBlur = 0;
    }

    function draw() {
      if (!running) return;
      drawFace();
      animId = requestAnimationFrame(draw);
    }

    resize();
    window.addEventListener('resize', resize);
    draw();

    return {
      setSpeaking: function (val) {
        speaking = !!val;
      },
      stop: function () {
        running = false;
        cancelAnimationFrame(animId);
        window.removeEventListener('resize', resize);
      },
      refresh: resize
    };
  }

  window.TechnovateBinaryFace = {
    create: createFaceRenderer,
    createMatrixRain: createMatrixRain
  };
})();
