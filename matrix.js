/* ============================================
   Technovate — Matrix Binary Rain
   Falling 1s and 0s, subtle AI-tech aesthetic
   ============================================ */
(function () {
  'use strict';

  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

  var CHAR_SET = '01';
  var FONT_SIZE = 14;
  var COL_SPEED_MIN = 0.3;
  var COL_SPEED_MAX = 1.2;

  function createRain(container, opts) {
    opts = opts || {};
    var opacity = opts.opacity || 0.07;
    var color = opts.color || '59, 130, 246';
    var density = opts.density || 1;

    var canvas = document.createElement('canvas');
    canvas.className = 'matrix-rain';
    canvas.setAttribute('aria-hidden', 'true');
    canvas.style.cssText =
      'position:absolute;inset:0;width:100%;height:100%;' +
      'pointer-events:none;z-index:0;opacity:' + opacity + ';';
    container.style.position = container.style.position || 'relative';
    container.insertBefore(canvas, container.firstChild);

    var ctx = canvas.getContext('2d');
    var cols = [];
    var W, H, colCount;

    function resize() {
      var rect = container.getBoundingClientRect();
      W = canvas.width = rect.width;
      H = canvas.height = rect.height;
      colCount = Math.floor((W / FONT_SIZE) * density);
      while (cols.length < colCount) {
        cols.push({
          x: cols.length * (W / colCount),
          y: Math.random() * H,
          speed: COL_SPEED_MIN + Math.random() * (COL_SPEED_MAX - COL_SPEED_MIN),
          chars: []
        });
      }
      cols.length = colCount;
      for (var i = 0; i < colCount; i++) {
        cols[i].x = i * (W / colCount);
      }
    }

    function draw() {
      ctx.clearRect(0, 0, W, H);

      for (var i = 0; i < cols.length; i++) {
        var col = cols[i];
        col.y += col.speed;

        var trail = Math.floor(H / FONT_SIZE * 0.6);
        for (var j = 0; j < trail; j++) {
          var charY = col.y - j * FONT_SIZE;
          if (charY < 0 || charY > H) continue;

          var fade = 1 - (j / trail);
          fade = fade * fade;

          if (j === 0) {
            ctx.fillStyle = 'rgba(255, 255, 255, ' + (fade * 0.9) + ')';
          } else {
            ctx.fillStyle = 'rgba(' + color + ', ' + (fade * 0.8) + ')';
          }

          ctx.font = FONT_SIZE + 'px monospace';
          var ch = CHAR_SET[Math.floor(Math.random() * CHAR_SET.length)];
          ctx.fillText(ch, col.x, charY);
        }

        if (col.y > H + trail * FONT_SIZE) {
          col.y = -FONT_SIZE;
          col.speed = COL_SPEED_MIN + Math.random() * (COL_SPEED_MAX - COL_SPEED_MIN);
        }
      }
    }

    resize();
    var resizeTimer;
    window.addEventListener('resize', function () {
      clearTimeout(resizeTimer);
      resizeTimer = setTimeout(resize, 200);
    });

    var running = true;
    var observer = new IntersectionObserver(function (entries) {
      running = entries[0].isIntersecting;
    }, { threshold: 0 });
    observer.observe(container);

    function loop() {
      if (running) draw();
      requestAnimationFrame(loop);
    }
    loop();

    return canvas;
  }

  function init() {
    var hero = document.querySelector('.hero-immersive');
    if (hero) {
      createRain(hero, { opacity: 0.04, density: 0.35, color: '59, 130, 246' });
    }

    document.querySelectorAll('.page-header-immersive').forEach(function (ph) {
      createRain(ph, { opacity: 0.035, density: 0.3, color: '59, 130, 246' });
    });
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
