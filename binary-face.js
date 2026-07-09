/* ============================================
   Technovate — Binary AI Face
   1s and 0s forming a speaking face silhouette
   ============================================ */
(function () {
  'use strict';

  function createFaceRenderer(canvas) {
    var ctx = canvas.getContext('2d');
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
            tick: Math.random() * 100,
            bg: region === 0 && Math.random() > 0.97
          });
        }
      }
    }

    function resize() {
      var rect = canvas.getBoundingClientRect();
      W = canvas.width = Math.floor(rect.width);
      H = canvas.height = Math.floor(rect.height);
      buildGrid();
    }

    function draw() {
      if (!running) return;

      ctx.fillStyle = '#000000';
      ctx.fillRect(0, 0, W, H);

      mouthPhase += speaking ? 1.8 : 0.4;
      ctx.font = (cellSize - 1) + 'px "Courier New", monospace';
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';

      for (var i = 0; i < cells.length; i++) {
        var cell = cells[i];
        var x = cell.c * cellSize + cellSize * 0.5;
        var y = cell.r * cellSize + cellSize * 0.5;

        if (!cell.region) {
          if (cell.bg) {
            ctx.fillStyle = 'rgba(0, 212, 255, 0.05)';
            ctx.fillText(cell.char, x, y);
          }
          continue;
        }
        if (cell.region === 5) continue;

        cell.tick += cell.region === 3 && speaking ? 0.35 : 0.04;
        if (cell.tick > 1) {
          cell.tick = 0;
          if (Math.random() > 0.65) {
            cell.char = cell.char === '1' ? '0' : '1';
          }
        }

        var alpha = 0.35;

        if (cell.region === 1) alpha = 0.55 + Math.sin(cell.tick * 3 + i) * 0.12;
        if (cell.region === 3) alpha = speaking ? 0.9 + Math.sin(mouthPhase * 0.3) * 0.1 : 0.6;
        if (cell.region === 4) alpha = 0.7;

        var hue = cell.region === 3 && speaking ? '0, 255, 220' : '0, 212, 255';

        ctx.fillStyle = 'rgba(' + hue + ', ' + alpha + ')';
        ctx.fillText(cell.char, x, y);
      }

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
      }
    };
  }

  window.TechnovateBinaryFace = {
    create: createFaceRenderer
  };
})();
