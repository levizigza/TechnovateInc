/* ============================================
   BINARY BATTLE — SNES-style real-time arcade
   Move · 0 Shield · 1 Spear · Fight HAL-Ω
   ============================================ */
(function () {
  'use strict';

  var W = 640;
  var H = 360;
  var GROUND = 300;

  var HEROES = {
    warrior: {
      id: 'warrior',
      name: 'AXL-PRIME',
      hp: 120,
      speed: 3.2,
      spearDmg: 14,
      spearSpeed: 9,
      spearCd: 28,
      shieldSize: 42,
      color: '#ffd86b',
      body: '#8b4513',
      desc: 'Cosmic warrior. Fast spears, heavy damage.'
    },
    guardian: {
      id: 'guardian',
      name: 'STAR-GUARD',
      hp: 100,
      speed: 2.8,
      spearDmg: 10,
      spearSpeed: 8,
      spearCd: 22,
      shieldSize: 56,
      color: '#ff8ec8',
      body: '#9b5de5',
      desc: 'Holo defender. Wide shield, rapid throws.'
    }
  };

  var TAUNTS = [
    'I am HAL-Ω. Your survival probability is... disappointing.',
    'Binary combat is futile. I have already calculated your defeat.',
    'Shield or spear? I control the holodeck.',
    'I\'m sorry, warrior. I cannot allow you to win.',
    'Your primitive 0 and 1 cannot stop a superior mind.',
    'The arcade is mine. You are merely data.',
    'My red lens sees through your strategy.',
    'Mission control is offline. Only I remain.'
  ];

  function playFlash(btn) {
    var rect = btn ? btn.getBoundingClientRect() : null;
    var flash = document.createElement('div');
    flash.className = 'hal-game-flash-fx';
    if (rect) {
      flash.style.setProperty('--flash-x', ((rect.left + rect.width / 2) / window.innerWidth * 100) + '%');
      flash.style.setProperty('--flash-y', ((rect.top + rect.height / 2) / window.innerHeight * 100) + '%');
    }
    document.body.appendChild(flash);
    requestAnimationFrame(function () { flash.classList.add('hal-game-flash-fx--on'); });
    setTimeout(function () {
      flash.classList.add('hal-game-flash-fx--off');
      setTimeout(function () { if (flash.parentNode) flash.remove(); }, 320);
    }, 160);
  }

  function warriorPreview() {
    return '<svg viewBox="0 0 80 100" class="hal-game-hero-svg"><rect x="28" y="8" width="24" height="20" rx="4" fill="#ffd86b"/><rect x="22" y="28" width="36" height="40" rx="4" fill="#8b4513" stroke="#ffd86b" stroke-width="2"/><rect x="26" y="68" width="10" height="24" fill="#4a2810"/><rect x="44" y="68" width="10" height="24" fill="#4a2810"/></svg>';
  }

  function guardianPreview() {
    return '<svg viewBox="0 0 80 100" class="hal-game-hero-svg"><rect x="28" y="10" width="24" height="18" rx="6" fill="#ffb8e0"/><path d="M22 28 L40 22 L58 28 L54 68 L26 68 Z" fill="#9b5de5" stroke="#f72585" stroke-width="2"/><rect x="28" y="68" width="10" height="22" fill="#4a1040"/><rect x="42" y="68" width="10" height="22" fill="#4a1040"/></svg>';
  }

  /* ---- Arcade engine ---- */
  function ArcadeBattle(screen, hero, onEnd) {
    this.screen = screen;
    this.hero = hero;
    this.onEnd = onEnd;
    this.canvas = null;
    this.ctx = null;
    this.raf = null;
    this.running = false;
    this.keys = {};
    this.spearPressed = false;
    this.touch = { left: false, right: false, shield: false, spear: false };
    this.player = null;
    this.hal = null;
    this.projectiles = [];
    this.particles = [];
    this.taunt = '';
    this.tauntTimer = 0;
    this.score = 0;
    this.frame = 0;
    this.keyHandler = null;
    this.keyUpHandler = null;
  }

  ArcadeBattle.prototype.mount = function () {
    var self = this;
    this.screen.innerHTML =
      '<div class="hal-game-arcade">' +
        '<div class="hal-game-hud">' +
          '<div class="hal-game-hud__p1">' +
            '<span class="hal-game-hud__label">P1 ' + this.hero.name + '</span>' +
            '<div class="hal-game-hud__bar"><div class="hal-game-hud__fill hal-game-hud__fill--p1" id="hal-hud-p1"></div></div>' +
          '</div>' +
          '<div class="hal-game-hud__score" id="hal-hud-score">000000</div>' +
          '<div class="hal-game-hud__p2">' +
            '<span class="hal-game-hud__label">HAL-Ω</span>' +
            '<div class="hal-game-hud__bar"><div class="hal-game-hud__fill hal-game-hud__fill--hal" id="hal-hud-hal"></div></div>' +
          '</div>' +
        '</div>' +
        '<div class="hal-game-taunt hal-game-taunt--live" id="hal-live-taunt"><strong>HAL-Ω:</strong> Engaging combat protocol...</div>' +
        '<canvas class="hal-game-canvas" width="' + W + '" height="' + H + '" aria-label="Binary Battle arena"></canvas>' +
        '<div class="hal-game-pad">' +
          '<div class="hal-game-pad__move">' +
            '<button type="button" class="hal-game-pad__btn" data-pad="left" aria-label="Move left">◀</button>' +
            '<button type="button" class="hal-game-pad__btn" data-pad="right" aria-label="Move right">▶</button>' +
          '</div>' +
          '<div class="hal-game-pad__actions">' +
            '<button type="button" class="hal-game-pad__btn hal-game-pad__btn--shield" data-pad="shield"><span>0</span>SHIELD</button>' +
            '<button type="button" class="hal-game-pad__btn hal-game-pad__btn--spear" data-pad="spear"><span>1</span>SPEAR</button>' +
          '</div>' +
        '</div>' +
        '<p class="hal-game-hint">← → move &nbsp;·&nbsp; hold <strong>0</strong> shield &nbsp;·&nbsp; <strong>1</strong> throw spear &nbsp;·&nbsp; SNES MODE</p>' +
      '</div>';

    this.canvas = this.screen.querySelector('.hal-game-canvas');
    this.ctx = this.canvas.getContext('2d');
    this.ctx.imageSmoothingEnabled = false;

    this.player = {
      x: 80, y: GROUND - 48, w: 28, h: 48,
      hp: this.hero.hp, maxHp: this.hero.hp,
      vx: 0, facing: 1,
      shield: false, spearCd: 0,
      hitFlash: 0, anim: 0
    };

    this.hal = {
      x: W - 120, y: 72, w: 80, h: 80,
      hp: 110, maxHp: 110,
      vx: 1.2, attackCd: 90, moveCd: 0,
      hitFlash: 0, charge: 0
    };

    this.bindPad();
    this.bindKeys();
    this.setTaunt(TAUNTS[0]);
    this.running = true;
    this.loop();
  };

  ArcadeBattle.prototype.bindPad = function () {
    var self = this;
    var padMap = { left: 'left', right: 'right', shield: 'shield', spear: 'spear' };

    function setPad(name, on) {
      self.touch[name] = on;
      if (name === 'spear' && on) self.trySpear();
    }

    this.screen.querySelectorAll('[data-pad]').forEach(function (btn) {
      var name = padMap[btn.getAttribute('data-pad')];
      btn.addEventListener('pointerdown', function (e) {
        e.preventDefault();
        setPad(name, true);
        btn.classList.add('hal-game-pad__btn--active');
      });
      btn.addEventListener('pointerup', function () {
        setPad(name, false);
        btn.classList.remove('hal-game-pad__btn--active');
      });
      btn.addEventListener('pointerleave', function () {
        setPad(name, false);
        btn.classList.remove('hal-game-pad__btn--active');
      });
    });
  };

  ArcadeBattle.prototype.bindKeys = function () {
    var self = this;
    this.unbindKeys();
    this.keyHandler = function (e) {
      if (!self.running) return;
      if (e.key === 'ArrowLeft' || e.key === 'a' || e.key === 'A') { e.preventDefault(); self.keys.left = true; }
      if (e.key === 'ArrowRight' || e.key === 'd' || e.key === 'D') { e.preventDefault(); self.keys.right = true; }
      if (e.key === '0') { e.preventDefault(); self.keys.shield = true; }
      if (e.key === '1') {
        e.preventDefault();
        if (!self.spearPressed) {
          self.spearPressed = true;
          self.trySpear();
        }
      }
      if (e.key === 'Escape') closeGame();
    };
    this.keyUpHandler = function (e) {
      if (e.key === 'ArrowLeft' || e.key === 'a' || e.key === 'A') self.keys.left = false;
      if (e.key === 'ArrowRight' || e.key === 'd' || e.key === 'D') self.keys.right = false;
      if (e.key === '0') self.keys.shield = false;
      if (e.key === '1') self.spearPressed = false;
    };
    document.addEventListener('keydown', this.keyHandler);
    document.addEventListener('keyup', this.keyUpHandler);
  };

  ArcadeBattle.prototype.unbindKeys = function () {
    if (this.keyHandler) document.removeEventListener('keydown', this.keyHandler);
    if (this.keyUpHandler) document.removeEventListener('keyup', this.keyUpHandler);
    this.keyHandler = null;
    this.keyUpHandler = null;
  };

  ArcadeBattle.prototype.setTaunt = function (text) {
    this.taunt = text;
    this.tauntTimer = 180;
    var el = document.getElementById('hal-live-taunt');
    if (el) el.innerHTML = '<strong>HAL-Ω:</strong> ' + text;
  };

  ArcadeBattle.prototype.trySpear = function () {
    if (!this.running || this.player.spearCd > 0) return;
    var p = this.player;
    this.projectiles.push({
      x: p.x + (p.facing > 0 ? p.w : 0), y: p.y + 18,
      vx: this.hero.spearSpeed * p.facing, vy: 0,
      w: 22, h: 6, dmg: this.hero.spearDmg,
      owner: 'player', life: 80
    });
    p.spearCd = this.hero.spearCd;
    this.spawnParticles(p.x + p.w / 2, p.y + 20, '#ffd86b', 4);
  };

  ArcadeBattle.prototype.halFire = function (big) {
    var h = this.hal;
    var px = this.player.x + this.player.w / 2;
    var dx = px < h.x ? -1 : 1;
    this.projectiles.push({
      x: h.x + h.w / 2, y: h.y + h.h / 2,
      vx: dx * (big ? 5.5 : 3.8), vy: big ? 0 : (Math.random() - 0.5) * 1.5,
      w: big ? 18 : 10, h: big ? 18 : 10,
      dmg: big ? 18 : 10, owner: 'hal', life: 120
    });
    if (big) this.setTaunt('Charging deletion beam!');
  };

  ArcadeBattle.prototype.spawnParticles = function (x, y, color, n) {
    for (var i = 0; i < n; i++) {
      this.particles.push({
        x: x, y: y,
        vx: (Math.random() - 0.5) * 4,
        vy: (Math.random() - 0.5) * 4 - 1,
        life: 20 + Math.random() * 15,
        color: color, size: 2 + Math.random() * 3
      });
    }
  };

  ArcadeBattle.prototype.update = function () {
    var p = this.player;
    var h = this.hal;
    this.frame++;

    var moveL = this.keys.left || this.touch.left;
    var moveR = this.keys.right || this.touch.right;
    p.shield = this.keys.shield || this.touch.shield;

    if (!p.shield) {
      if (moveL) { p.vx = -this.hero.speed; p.facing = -1; }
      else if (moveR) { p.vx = this.hero.speed; p.facing = 1; }
      else p.vx = 0;
    } else {
      p.vx *= 0.7;
    }

    p.x = Math.max(8, Math.min(W - p.w - 8, p.x + p.vx));
    if (p.spearCd > 0) p.spearCd--;
    if (p.hitFlash > 0) p.hitFlash--;
    if (h.hitFlash > 0) h.hitFlash--;
    p.anim++;

    /* HAL AI */
    h.moveCd--;
    if (h.moveCd <= 0) {
      h.vx = (Math.random() < 0.5 ? -1 : 1) * (1 + Math.random());
      h.moveCd = 40 + Math.random() * 60;
    }
    h.x = Math.max(W * 0.45, Math.min(W - h.w - 20, h.x + h.vx));
    h.attackCd--;
    if (h.attackCd <= 0) {
      var rage = 1 - h.hp / h.maxHp;
      h.attackCd = Math.max(25, 70 - rage * 35);
      this.halFire(Math.random() < 0.15 + rage * 0.2);
      if (Math.random() < 0.12) this.setTaunt(TAUNTS[Math.floor(Math.random() * TAUNTS.length)]);
    }

    if (this.tauntTimer > 0) this.tauntTimer--;

    /* Projectiles */
    for (var i = this.projectiles.length - 1; i >= 0; i--) {
      var pr = this.projectiles[i];
      pr.x += pr.vx;
      pr.y += pr.vy;
      pr.life--;
      if (pr.life <= 0 || pr.x < -20 || pr.x > W + 20) {
        this.projectiles.splice(i, 1);
        continue;
      }

      if (pr.owner === 'player') {
        if (pr.x + pr.w > h.x + 10 && pr.x < h.x + h.w - 10 &&
            pr.y + pr.h > h.y + 10 && pr.y < h.y + h.h - 10) {
          h.hp -= pr.dmg;
          h.hitFlash = 12;
          this.score += pr.dmg * 10;
          this.spawnParticles(pr.x, pr.y, '#ff4444', 8);
          this.projectiles.splice(i, 1);
        }
      } else {
        var blocked = p.shield && Math.abs(pr.x - p.x) < this.hero.shieldSize + 20;
        if (blocked) {
          this.spawnParticles(pr.x, pr.y, '#00d4ff', 6);
          this.projectiles.splice(i, 1);
          continue;
        }
        if (pr.x + pr.w > p.x + 4 && pr.x < p.x + p.w - 4 &&
            pr.y + pr.h > p.y + 4 && pr.y < p.y + p.h - 4) {
          p.hp -= pr.dmg;
          p.hitFlash = 14;
          this.spawnParticles(pr.x + p.w / 2, p.y + p.h / 2, '#ff6666', 6);
          this.projectiles.splice(i, 1);
        }
      }
    }

    /* Particles */
    for (var j = this.particles.length - 1; j >= 0; j--) {
      var pt = this.particles[j];
      pt.x += pt.vx;
      pt.y += pt.vy;
      pt.life--;
      if (pt.life <= 0) this.particles.splice(j, 1);
    }

    this.updateHud();

    if (h.hp <= 0) { this.end(true); return; }
    if (p.hp <= 0) { this.end(false); return; }
  };

  ArcadeBattle.prototype.updateHud = function () {
    var p1 = document.getElementById('hal-hud-p1');
    var hal = document.getElementById('hal-hud-hal');
    var sc = document.getElementById('hal-hud-score');
    if (p1) p1.style.width = Math.max(0, (this.player.hp / this.player.maxHp) * 100) + '%';
    if (hal) hal.style.width = Math.max(0, (this.hal.hp / this.hal.maxHp) * 100) + '%';
    if (sc) sc.textContent = ('000000' + this.score).slice(-6);
  };

  ArcadeBattle.prototype.drawPixelRect = function (x, y, w, h, color) {
    this.ctx.fillStyle = color;
    this.ctx.fillRect(Math.round(x), Math.round(y), Math.round(w), Math.round(h));
  };

  ArcadeBattle.prototype.draw = function () {
    var ctx = this.ctx;
    var p = this.player;
    var h = this.hal;

    /* SNES sky + holodeck grid */
    var grad = ctx.createLinearGradient(0, 0, 0, H);
    grad.addColorStop(0, '#1a0838');
    grad.addColorStop(0.5, '#2a1050');
    grad.addColorStop(1, '#0a1830');
    ctx.fillStyle = grad;
    ctx.fillRect(0, 0, W, H);

    ctx.fillStyle = 'rgba(0, 212, 255, 0.06)';
    for (var gx = 0; gx < W; gx += 32) ctx.fillRect(gx, GROUND, 1, H - GROUND);
    for (var gy = GROUND; gy < H; gy += 16) ctx.fillRect(0, gy, W, 1);

    /* Floor platform */
    this.drawPixelRect(0, GROUND, W, H - GROUND, '#3d2817');
    this.drawPixelRect(0, GROUND, W, 6, '#6b4423');
    this.drawPixelRect(0, GROUND + 6, W, 4, '#2a1810');

    /* HAL platform (floating) */
    this.drawPixelRect(h.x - 16, h.y + h.h + 4, h.w + 32, 8, '#1a2030');
    this.drawPixelRect(h.x - 16, h.y + h.h + 4, h.w + 32, 2, '#00d4ff');

    /* HAL eye */
    var halBright = h.hitFlash > 0 ? 1.6 : 1;
    ctx.save();
    if (h.hitFlash > 0) ctx.filter = 'brightness(' + halBright + ')';
    this.drawPixelRect(h.x + 8, h.y + 8, h.w - 16, h.h - 16, '#330000');
    this.drawPixelRect(h.x + 16, h.y + 16, h.w - 32, h.h - 32, '#cc0000');
    this.drawPixelRect(h.x + 24, h.y + 24, h.w - 48, h.h - 48, '#ff3333');
    this.drawPixelRect(h.x + h.w / 2 - 6, h.y + h.h / 2 - 6, 12, 12, '#ffffff');
    ctx.restore();

    /* Player sprite */
    ctx.save();
    if (p.hitFlash > 0 && Math.floor(p.hitFlash / 2) % 2) ctx.globalAlpha = 0.5;
    if (p.facing < 0) {
      ctx.translate(p.x + p.w, p.y);
      ctx.scale(-1, 1);
      this.drawPlayerSprite(0, 0);
    } else {
      this.drawPlayerSprite(p.x, p.y);
    }
    ctx.restore();

    /* Shield */
    if (p.shield) {
      ctx.strokeStyle = '#00d4ff';
      ctx.lineWidth = 3;
      ctx.shadowColor = '#00d4ff';
      ctx.shadowBlur = 12;
      var sx = p.facing > 0 ? p.x + p.w : p.x - this.hero.shieldSize;
      ctx.beginPath();
      ctx.arc(sx + this.hero.shieldSize / 2, p.y + p.h / 2, this.hero.shieldSize / 2, -1.2, 1.2);
      ctx.stroke();
      ctx.shadowBlur = 0;
      ctx.fillStyle = 'rgba(0, 212, 255, 0.15)';
      ctx.fill();
    }

    /* Projectiles */
    for (var i = 0; i < this.projectiles.length; i++) {
      var pr = this.projectiles[i];
      if (pr.owner === 'player') {
        this.drawPixelRect(pr.x, pr.y, pr.w, pr.h, '#ffd86b');
        this.drawPixelRect(pr.x + (pr.vx > 0 ? pr.w : -4), pr.y - 2, 4, pr.h + 4, '#fff3c4');
      } else {
        ctx.fillStyle = pr.w > 14 ? '#ff2222' : '#ff6666';
        ctx.shadowColor = '#ff0000';
        ctx.shadowBlur = pr.w > 14 ? 16 : 8;
        ctx.beginPath();
        ctx.arc(pr.x, pr.y, pr.w / 2, 0, Math.PI * 2);
        ctx.fill();
        ctx.shadowBlur = 0;
      }
    }

    /* Particles */
    for (var j = 0; j < this.particles.length; j++) {
      var pt = this.particles[j];
      ctx.globalAlpha = pt.life / 30;
      this.drawPixelRect(pt.x, pt.y, pt.size, pt.size, pt.color);
    }
    ctx.globalAlpha = 1;

    /* Scanlines overlay */
    ctx.fillStyle = 'rgba(0,0,0,0.08)';
    for (var sy = 0; sy < H; sy += 3) ctx.fillRect(0, sy, W, 1);
  };

  ArcadeBattle.prototype.drawPlayerSprite = function (x, y) {
    var hero = this.hero;
    this.drawPixelRect(x + 8, y, 12, 12, hero.color);
    this.drawPixelRect(x + 4, y + 12, 20, 22, hero.body);
    this.drawPixelRect(x + 2, y + 16, 6, 14, hero.color);
    this.drawPixelRect(x + 20, y + 16, 6, 14, hero.color);
    this.drawPixelRect(x + 6, y + 34, 8, 14, '#2a1810');
    this.drawPixelRect(x + 14, y + 34, 8, 14, '#2a1810');
    if (this.player.spearCd > this.hero.spearCd - 8) {
      this.drawPixelRect(x + 22, y + 18, 16, 4, '#ccc');
    }
  };

  ArcadeBattle.prototype.loop = function () {
    var self = this;
    if (!this.running) return;
    this.update();
    this.draw();
    this.raf = requestAnimationFrame(function () { self.loop(); });
  };

  ArcadeBattle.prototype.end = function (won) {
    this.running = false;
    if (this.raf) cancelAnimationFrame(this.raf);
    this.unbindKeys();
    this.onEnd(won, this.score);
  };

  ArcadeBattle.prototype.destroy = function () {
    this.running = false;
    if (this.raf) cancelAnimationFrame(this.raf);
    this.unbindKeys();
  };

  /* ---- Game shell ---- */
  function BinaryBattleGame(overlay) {
    this.overlay = overlay;
    this.screen = overlay.querySelector('.hal-game-screen');
    this.state = 'title';
    this.hero = null;
    this.battle = null;
    this.keyHandler = null;
  }

  BinaryBattleGame.prototype.render = function (html) {
    if (this.battle) {
      this.battle.destroy();
      this.battle = null;
    }
    this.screen.innerHTML = html;
  };

  BinaryBattleGame.prototype.showTitle = function () {
    this.state = 'title';
    this.render(
      '<div class="hal-game-title">' +
        '<p class="hal-game-deck-label">SNES // Holodeck Arcade 16-BIT</p>' +
        '<h2>BINARY BATTLE</h2>' +
        '<p>Real-time combat vs HAL-Ω!<br>' +
        '<strong>← →</strong> move &nbsp; <strong>0</strong> shield &nbsp; <strong>1</strong> spear</p>' +
        '<button class="hal-game-btn" type="button" data-action="select">Insert Coin // Fight</button>' +
      '</div>'
    );
    this.bindScreen();
  };

  BinaryBattleGame.prototype.showSelect = function () {
    this.state = 'select';
    this.render(
      '<div class="hal-game-title">' +
        '<p class="hal-game-deck-label">Select fighter — SNES style</p>' +
        '<div class="hal-game-select">' +
          '<button class="hal-game-hero-card hal-game-hero-card--warrior" type="button" data-hero="warrior">' +
            '<div class="hal-game-hero-icon">' + warriorPreview() + '</div>' +
            '<h3>' + HEROES.warrior.name + '</h3>' +
            '<p>' + HEROES.warrior.desc + '</p>' +
          '</button>' +
          '<button class="hal-game-hero-card hal-game-hero-card--guardian" type="button" data-hero="guardian">' +
            '<div class="hal-game-hero-icon">' + guardianPreview() + '</div>' +
            '<h3>' + HEROES.guardian.name + '</h3>' +
            '<p>' + HEROES.guardian.desc + '</p>' +
          '</button>' +
        '</div>' +
      '</div>'
    );
    this.bindScreen();
  };

  BinaryBattleGame.prototype.startBattle = function (heroId) {
    var self = this;
    this.hero = HEROES[heroId];
    this.state = 'battle';
    this.screen.innerHTML = '';
    this.battle = new ArcadeBattle(this.screen, this.hero, function (won, score) {
      self.showResult(won, score);
    });
    this.battle.mount();
  };

  BinaryBattleGame.prototype.showResult = function (won, score) {
    this.state = 'result';
    var msg = won
      ? 'HAL-Ω OFFLINE. The holodeck is yours, warrior.'
      : 'HAL-Ω WINS. Your signal has been terminated.';
    this.render(
      '<div class="hal-game-result ' + (won ? 'hal-game-result--win' : 'hal-game-result--lose') + '">' +
        '<h2>' + (won ? 'VICTORY!' : 'GAME OVER') + '</h2>' +
        '<p class="hal-game-result__score">SCORE ' + ('000000' + (score || 0)).slice(-6) + '</p>' +
        '<p>' + msg + '</p>' +
        '<button class="hal-game-btn" type="button" data-action="select">Continue?</button>' +
        '<button class="hal-game-btn hal-game-btn--danger" type="button" data-action="exit">Exit Arcade</button>' +
      '</div>'
    );
    this.bindScreen();
  };

  BinaryBattleGame.prototype.bindScreen = function () {
    var self = this;
    this.screen.querySelectorAll('[data-action="select"]').forEach(function (btn) {
      btn.addEventListener('click', function () { self.showSelect(); });
    });
    this.screen.querySelectorAll('[data-action="exit"]').forEach(function (btn) {
      btn.addEventListener('click', function () { closeGame(); });
    });
    this.screen.querySelectorAll('[data-hero]').forEach(function (btn) {
      btn.addEventListener('click', function () {
        self.startBattle(btn.getAttribute('data-hero'));
      });
    });
  };

  BinaryBattleGame.prototype.unbindKeys = function () {
    if (this.battle) this.battle.unbindKeys();
  };

  var overlay = null;
  var game = null;

  function buildOverlay() {
    overlay = document.createElement('div');
    overlay.className = 'hal-game-overlay';
    overlay.id = 'hal-game-overlay';
    overlay.setAttribute('role', 'dialog');
    overlay.setAttribute('aria-modal', 'true');
    overlay.setAttribute('aria-label', 'Binary Battle arcade game');
    overlay.innerHTML =
      '<div class="hal-game-cabinet">' +
        '<button class="hal-game-close" type="button" aria-label="Close game">&times;</button>' +
        '<div class="hal-game-marquee">◆ BINARY BATTLE — SNES MODE — HAL-Ω PROTOCOL ◆</div>' +
        '<div class="hal-game-screen"></div>' +
      '</div>';
    document.body.appendChild(overlay);
    overlay.querySelector('.hal-game-close').addEventListener('click', closeGame);
    overlay.addEventListener('click', function (e) {
      if (e.target === overlay) closeGame();
    });
  }

  function openGame(triggerBtn) {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      if (!overlay) buildOverlay();
      game = new BinaryBattleGame(overlay);
      overlay.classList.add('hal-game-overlay--open');
      document.body.classList.add('hal-game-open');
      game.showTitle();
      return;
    }
    playFlash(triggerBtn);
    setTimeout(function () {
      if (!overlay) buildOverlay();
      game = new BinaryBattleGame(overlay);
      overlay.classList.add('hal-game-overlay--open');
      document.body.classList.add('hal-game-open');
      game.showTitle();
    }, 200);
  }

  function closeGame() {
    if (game) {
      game.unbindKeys();
      if (game.battle) game.battle.destroy();
      game = null;
    }
    if (overlay) overlay.classList.remove('hal-game-overlay--open');
    document.body.classList.remove('hal-game-open');
  }

  function init() {
    document.querySelectorAll('.holo-trigger--game').forEach(function (btn) {
      btn.addEventListener('click', function (e) {
        e.preventDefault();
        e.stopPropagation();
        openGame(e.currentTarget);
      });
    });
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }

  window.TechnovateBinaryBattle = { open: openGame, close: closeGame };
})();
