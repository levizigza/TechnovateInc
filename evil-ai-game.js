/* ============================================
   BINARY BATTLE — Real-time holodeck arcade
   Move · 0 Shield · 1 Spear · Fight HAL-Ω
   ============================================ */
(function () {
  'use strict';

  var W = 640;
  var H = 360;
  var GROUND = 300;
  var INTENSITY_MAX_FRAMES = 4800;
  var LAUNCH_KEYS = { ctrl: true, shift: true, code: 'KeyB' };

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
      desc: 'Male champion. Broad armor, powerful spear strikes.'
    },
    guardian: {
      id: 'guardian',
      name: 'STAR-GUARD',
      hp: 100,
      speed: 2.8,
      spearDmg: 10,
      spearSpeed: 8.5,
      spearCd: 20,
      shieldSize: 56,
      color: '#ff8ec8',
      body: '#9b5de5',
      hair: '#ffe566',
      weapon: 'bow',
      desc: 'Female guardian. Blonde bow-master with wide shield.'
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

  function isTypingTarget(el) {
    if (!el) return false;
    var tag = el.tagName;
    return tag === 'INPUT' || tag === 'TEXTAREA' || tag === 'SELECT' || el.isContentEditable;
  }

  function matchesLaunchShortcut(e) {
    return e.ctrlKey && e.shiftKey && e.code === LAUNCH_KEYS.code;
  }

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
    return (
      '<svg viewBox="0 0 80 100" class="hal-game-hero-svg hal-game-hero-svg--8bit">' +
        '<rect x="30" y="4" width="20" height="8" fill="#3a2010"/>' +
        '<rect x="28" y="12" width="24" height="10" fill="#d4a574"/>' +
        '<rect x="26" y="20" width="28" height="6" fill="#d4a574"/>' +
        '<rect x="32" y="14" width="4" height="3" fill="#1a1008"/><rect x="44" y="14" width="4" height="3" fill="#1a1008"/>' +
        '<rect x="30" y="12" width="20" height="2" fill="#3a2010"/>' +
        '<rect x="34" y="24" width="12" height="2" fill="#5a4030"/>' +
        '<rect x="20" y="26" width="40" height="26" fill="#8b4513"/>' +
        '<rect x="24" y="30" width="32" height="8" fill="#ffd86b"/>' +
        '<rect x="12" y="28" width="8" height="22" fill="#d4a574"/>' +
        '<rect x="60" y="28" width="8" height="22" fill="#d4a574"/>' +
        '<rect x="24" y="52" width="12" height="24" fill="#4a2810"/>' +
        '<rect x="44" y="52" width="12" height="24" fill="#4a2810"/>' +
        '<rect x="62" y="34" width="16" height="4" fill="#e0e0e0"/>' +
      '</svg>'
    );
  }

  function guardianPreview() {
    return (
      '<svg viewBox="0 0 80 100" class="hal-game-hero-svg hal-game-hero-svg--8bit">' +
        '<rect x="24" y="2" width="32" height="10" fill="#ffe566"/>' +
        '<rect x="18" y="6" width="10" height="22" fill="#f5d442"/>' +
        '<rect x="52" y="6" width="10" height="26" fill="#f5d442"/>' +
        '<rect x="28" y="4" width="24" height="6" fill="#fff0a8"/>' +
        '<rect x="30" y="14" width="20" height="12" fill="#ffc9a8"/>' +
        '<rect x="32" y="12" width="16" height="2" fill="#4a1040"/>' +
        '<rect x="34" y="18" width="3" height="3" fill="#4a1040"/><rect x="43" y="18" width="3" height="3" fill="#4a1040"/>' +
        '<rect x="36" y="24" width="8" height="2" fill="#f72585"/>' +
        '<rect x="30" y="26" width="20" height="8" fill="#9b5de5"/>' +
        '<rect x="26" y="34" width="28" height="22" fill="#9b5de5"/>' +
        '<rect x="22" y="48" width="36" height="14" fill="#9b5de5"/>' +
        '<rect x="32" y="28" width="16" height="4" fill="#f72585"/>' +
        '<rect x="14" y="30" width="6" height="16" fill="#ffc9a8"/>' +
        '<rect x="28" y="62" width="10" height="20" fill="#4a1040"/>' +
        '<rect x="42" y="62" width="10" height="20" fill="#4a1040"/>' +
        '<rect x="56" y="32" width="4" height="18" fill="#c9a020"/>' +
        '<rect x="62" y="36" width="4" height="10" fill="#c9a020"/>' +
        '<line x1="60" y1="34" x2="60" y2="52" stroke="#e8fcff" stroke-width="2"/>' +
        '<rect x="54" y="40" width="6" height="8" fill="#00d4ff"/>' +
      '</svg>'
    );
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
    this.currentGround = GROUND;
    this.elevator = {
      halPhase: 0,
      halBaseY: 56,
      playerPhase: 0
    };
    this.keyHandler = null;
    this.keyUpHandler = null;
  }

  ArcadeBattle.prototype.mount = function () {
    var self = this;
    var isGuardian = this.hero.id === 'guardian';
    var attackLabel = isGuardian ? 'ARROW' : 'SPEAR';
    var attackHint = isGuardian ? '<strong>1</strong> bow arrows' : '<strong>1</strong> spear';
    this.screen.innerHTML =
      '<div class="hal-game-arcade">' +
        '<div class="hal-game-hud">' +
          '<div class="hal-game-hud__p1">' +
            '<span class="hal-game-hud__label">P1 ' + this.hero.name + '</span>' +
            '<div class="hal-game-hud__bar"><div class="hal-game-hud__fill hal-game-hud__fill--p1" id="hal-hud-p1"></div></div>' +
          '</div>' +
          '<div class="hal-game-hud__score" id="hal-hud-score">000000</div>' +
          '<div class="hal-game-hud__level" id="hal-hud-level">LV 01</div>' +
          '<div class="hal-game-hud__p2">' +
            '<span class="hal-game-hud__label">HAL-Ω</span>' +
            '<div class="hal-game-hud__bar"><div class="hal-game-hud__fill hal-game-hud__fill--hal" id="hal-hud-hal"></div></div>' +
          '</div>' +
        '</div>' +
        '<div class="hal-game-taunt hal-game-taunt--live" id="hal-live-taunt"><strong>HAL-Ω:</strong> Engaging combat protocol...</div>' +
        '<div class="hal-game-canvas-wrap"><canvas class="hal-game-canvas" width="' + W + '" height="' + H + '" aria-label="Binary Battle arena"></canvas></div>' +
        '<div class="hal-game-pad">' +
          '<div class="hal-game-pad__move">' +
            '<button type="button" class="hal-game-pad__btn" data-pad="left" aria-label="Move left">◀</button>' +
            '<button type="button" class="hal-game-pad__btn" data-pad="right" aria-label="Move right">▶</button>' +
          '</div>' +
          '<div class="hal-game-pad__actions">' +
            '<button type="button" class="hal-game-pad__btn hal-game-pad__btn--shield" data-pad="shield"><span>0</span>SHIELD</button>' +
            '<button type="button" class="hal-game-pad__btn hal-game-pad__btn--spear" data-pad="spear"><span>1</span>' + attackLabel + '</button>' +
          '</div>' +
        '</div>' +
        '<p class="hal-game-hint">← → move &nbsp;·&nbsp; hold <strong>0</strong> shield &nbsp;·&nbsp; ' + attackHint + '</p>' +
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
      hitFlash: 0, burstCd: 0
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

  ArcadeBattle.prototype.getIntensity = function () {
    return Math.min(1, this.frame / INTENSITY_MAX_FRAMES);
  };

  ArcadeBattle.prototype.getLevel = function () {
    return Math.min(99, 1 + Math.floor(this.getIntensity() * 98));
  };

  ArcadeBattle.prototype.getSpeedMult = function () {
    return 1 + this.getIntensity() * 1.35;
  };

  ArcadeBattle.prototype.updateElevators = function () {
    var intensity = this.getIntensity();
    var ev = this.elevator;
    var h = this.hal;
    var p = this.player;

    var halSpeed = 0.018 + intensity * 0.065;
    var halAmp = 18 + intensity * 95;
    ev.halPhase += halSpeed;
    var halY = ev.halBaseY + Math.sin(ev.halPhase) * halAmp;
    if (intensity > 0.35) {
      halY += Math.sin(ev.halPhase * 2.6 + 1.2) * (intensity - 0.35) * 55;
    }
    if (intensity > 0.7) {
      halY += Math.sin(ev.halPhase * 4.1) * (intensity - 0.7) * 35;
    }
    h.y = Math.max(28, Math.min(GROUND - h.h - 36, halY));

    var playerSpeed = 0.012 + intensity * 0.04;
    var playerAmp = intensity * 34;
    ev.playerPhase += playerSpeed;
    this.currentGround = GROUND + Math.sin(ev.playerPhase) * playerAmp;
    if (intensity > 0.55) {
      this.currentGround += Math.sin(ev.playerPhase * 1.9 + 0.8) * (intensity - 0.55) * 22;
    }
    p.y = this.currentGround - p.h;
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
    var speed = this.getSpeedMult();
    var h = this.hal;

    if (this.hero.weapon === 'bow') {
      var ox = p.x + (p.facing > 0 ? p.w - 2 : 2);
      var oy = p.y + 16;
      var hx = h.x + h.w / 2;
      var hy = h.y + h.h / 2;
      var dx = hx - ox;
      var dy = hy - oy;
      var dist = Math.sqrt(dx * dx + dy * dy) || 1;
      var spd = this.hero.spearSpeed * speed;
      this.projectiles.push({
        x: ox, y: oy,
        vx: (dx / dist) * spd,
        vy: (dy / dist) * spd,
        w: 8, h: 12,
        dmg: this.hero.spearDmg,
        owner: 'player',
        life: 110,
        kind: 'one'
      });
      this.spawnParticles(ox, oy, '#00d4ff', 5);
    } else {
      this.projectiles.push({
        x: p.x + (p.facing > 0 ? p.w : 0), y: p.y + 18,
        vx: this.hero.spearSpeed * p.facing * speed, vy: 0,
        w: 22, h: 6, dmg: this.hero.spearDmg,
        owner: 'player', life: 90,
        kind: 'spear'
      });
      this.spawnParticles(p.x + p.w / 2, p.y + 20, '#ffd86b', 4);
    }

    p.spearCd = Math.max(10, Math.round(this.hero.spearCd * (1 - this.getIntensity() * 0.25)));
  };

  ArcadeBattle.prototype.halFire = function (big, spread) {
    var h = this.hal;
    var px = this.player.x + this.player.w / 2;
    var py = this.player.y + this.player.h / 2;
    var hx = h.x + h.w / 2;
    var hy = h.y + h.h / 2;
    var speed = this.getSpeedMult();
    var dx = px - hx;
    var dy = py - hy;
    var len = Math.sqrt(dx * dx + dy * dy) || 1;
    var nx = dx / len;
    var ny = dy / len;
    var base = big ? 5.5 : 3.8;
    var angle = spread || 0;
    var cos = Math.cos(angle);
    var sin = Math.sin(angle);
    var vx = (nx * cos - ny * sin) * base * speed;
    var vy = (nx * sin + ny * cos) * base * speed;

    this.projectiles.push({
      x: hx, y: hy,
      vx: vx, vy: vy,
      w: big ? 18 : 10, h: big ? 18 : 10,
      dmg: Math.round((big ? 18 : 10) * (1 + this.getIntensity() * 0.25)),
      owner: 'hal', life: 140
    });
    if (big) this.setTaunt('Deletion beam online!');
  };

  ArcadeBattle.prototype.halBurst = function () {
    var intensity = this.getIntensity();
    var rage = 1 - this.hal.hp / this.hal.maxHp;
    var shots = 1 + Math.floor(intensity * 4) + (rage > 0.4 ? 1 : 0);
    var bigChance = 0.12 + intensity * 0.22 + rage * 0.15;

    for (var i = 0; i < shots; i++) {
      var spread = (i - (shots - 1) / 2) * (0.22 + intensity * 0.18);
      this.halFire(Math.random() < bigChance && i === 0, spread);
    }

    if (intensity > 0.45 && this.frame % 90 < shots) {
      this.halFire(false, (Math.random() - 0.5) * 0.5);
    }
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
    var intensity = this.getIntensity();
    var speedMult = this.getSpeedMult();
    this.frame++;

    this.updateElevators();

    var moveL = this.keys.left || this.touch.left;
    var moveR = this.keys.right || this.touch.right;
    p.shield = this.keys.shield || this.touch.shield;
    var moveSpeed = this.hero.speed * (0.92 + intensity * 0.18);

    if (!p.shield) {
      if (moveL) { p.vx = -moveSpeed; p.facing = -1; }
      else if (moveR) { p.vx = moveSpeed; p.facing = 1; }
      else p.vx = 0;
    } else {
      p.vx *= 0.7;
    }

    p.x = Math.max(8, Math.min(W - p.w - 8, p.x + p.vx));
    if (p.spearCd > 0) p.spearCd--;
    if (p.hitFlash > 0) p.hitFlash--;
    if (h.hitFlash > 0) h.hitFlash--;
    p.anim++;

    /* HAL AI — faster and burstier over time */
    h.moveCd--;
    if (h.moveCd <= 0) {
      h.vx = (Math.random() < 0.5 ? -1 : 1) * (1.1 + Math.random() * (1.2 + intensity * 2));
      h.moveCd = Math.max(18, Math.round((40 + Math.random() * 60) * (1 - intensity * 0.55)));
    }
    h.x = Math.max(W * 0.42, Math.min(W - h.w - 20, h.x + h.vx * speedMult * 0.35));

    h.attackCd--;
    if (h.attackCd <= 0) {
      var rage = 1 - h.hp / h.maxHp;
      h.attackCd = Math.max(14, Math.round((78 - intensity * 52 - rage * 22) / speedMult));
      this.halBurst();
      if (Math.random() < 0.1 + intensity * 0.12) {
        this.setTaunt(TAUNTS[Math.floor(Math.random() * TAUNTS.length)]);
      }
    }

    if (this.tauntTimer > 0) this.tauntTimer--;

    /* Projectiles */
    for (var i = this.projectiles.length - 1; i >= 0; i--) {
      var pr = this.projectiles[i];
      pr.x += pr.vx;
      pr.y += pr.vy;
      pr.life--;
      if (pr.life <= 0 || pr.x < -30 || pr.x > W + 30 || pr.y < -30 || pr.y > H + 30) {
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
        var pcx = p.x + p.w / 2;
        var pcy = p.y + p.h / 2;
        var blocked = p.shield && Math.sqrt((pr.x - pcx) * (pr.x - pcx) + (pr.y - pcy) * (pr.y - pcy)) < this.hero.shieldSize + 14;
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
    var lv = document.getElementById('hal-hud-level');
    if (p1) p1.style.width = Math.max(0, (this.player.hp / this.player.maxHp) * 100) + '%';
    if (hal) hal.style.width = Math.max(0, (this.hal.hp / this.hal.maxHp) * 100) + '%';
    if (sc) sc.textContent = ('000000' + this.score).slice(-6);
    if (lv) lv.textContent = 'LV ' + ('0' + this.getLevel()).slice(-2);
  };

  ArcadeBattle.prototype.drawElevatorShaft = function (x, top, bottom, intensity) {
    var ctx = this.ctx;
    this.drawPixelRect(x, top, 10, bottom - top, '#141c28');
    this.drawPixelRect(x + 2, top, 2, bottom - top, '#00d4ff');
    this.drawPixelRect(x + 6, top, 2, bottom - top, '#00d4ff');
    var pulse = Math.floor(this.frame / (12 - intensity * 6)) % 2;
    if (pulse) {
      this.drawPixelRect(x + 1, top + 8, 8, 4, '#ff4444');
      this.drawPixelRect(x + 1, bottom - 14, 8, 4, '#00ff88');
    }
  };

  ArcadeBattle.prototype.drawPixelRect = function (x, y, w, h, color) {
    var P = 2;
    this.ctx.fillStyle = color;
    this.ctx.fillRect(
      Math.round(x / P) * P,
      Math.round(y / P) * P,
      Math.max(P, Math.round(w / P) * P),
      Math.max(P, Math.round(h / P) * P)
    );
  };

  ArcadeBattle.prototype.draw8BitSky = function () {
    var bands = ['#140620', '#1c0830', '#240838', '#1a0830', '#120820'];
    var bandH = 36;
    for (var i = 0; i < bands.length; i++) {
      this.drawPixelRect(0, i * bandH, W, bandH, bands[i]);
    }
    this.drawPixelRect(0, bands.length * bandH, W, H - bands.length * bandH, '#0c1428');
  };

  ArcadeBattle.prototype.draw8BitOverlay = function () {
    var ctx = this.ctx;
    for (var sy = 0; sy < H; sy += 2) {
      if (sy % 4 === 0) {
        ctx.fillStyle = 'rgba(0,0,0,0.14)';
        ctx.fillRect(0, sy, W, 1);
      }
    }
    ctx.fillStyle = 'rgba(0, 212, 255, 0.04)';
    ctx.fillRect(0, 0, W, 4);
  };

  ArcadeBattle.prototype.draw = function () {
    var ctx = this.ctx;
    var p = this.player;
    var h = this.hal;
    var ground = this.currentGround;
    var intensity = this.getIntensity();

    /* 8-bit holodeck sky */
    this.draw8BitSky();

    this.drawElevatorShaft(24, 24, ground, intensity);
    this.drawElevatorShaft(W - 34, 24, h.y + h.h + 12, intensity);

    ctx.fillStyle = 'rgba(0, 212, 255, 0.06)';
    for (var gx = 0; gx < W; gx += 32) ctx.fillRect(gx, ground, 1, H - ground);
    for (var gy = ground; gy < H; gy += 16) ctx.fillRect(0, gy, W, 1);

    /* Player elevator platform */
    this.drawPixelRect(0, ground, W, H - ground, '#3d2817');
    this.drawPixelRect(0, ground, W, 6, '#6b4423');
    this.drawPixelRect(0, ground + 6, W, 4, '#2a1810');
    this.drawPixelRect(18, ground - 4, W - 36, 4, '#00d4ff');
    this.drawPixelRect(30, ground - 10, 8, 6, '#1a2030');
    this.drawPixelRect(W - 38, ground - 10, 8, 6, '#1a2030');

    /* HAL elevator platform */
    var platY = h.y + h.h + 4;
    this.drawPixelRect(h.x - 20, platY, h.w + 40, 10, '#1a2030');
    this.drawPixelRect(h.x - 20, platY, h.w + 40, 3, '#00d4ff');
    this.drawPixelRect(h.x - 8, platY + 10, 6, 18, '#2a3040');
    this.drawPixelRect(h.x + h.w + 2, platY + 10, 6, 18, '#2a3040');

    /* HAL eye — chunky pixels */
    if (h.hitFlash > 0 && Math.floor(h.hitFlash / 2) % 2) {
      this.drawPixelRect(h.x, h.y, h.w, h.h, '#ffffff');
    } else {
      this.drawPixelRect(h.x, h.y, h.w, h.h, '#220000');
      this.drawPixelRect(h.x + 8, h.y + 8, h.w - 16, h.h - 16, '#660000');
      this.drawPixelRect(h.x + 16, h.y + 16, h.w - 32, h.h - 32, '#cc0000');
      this.drawPixelRect(h.x + 24, h.y + 24, h.w - 48, h.h - 48, '#ff2222');
      this.drawPixelRect(h.x + 28, h.y + 28, h.w - 56, h.h - 56, '#ff6666');
      this.drawPixelRect(h.x + 32, h.y + 32, h.w - 64, h.h - 64, '#ffffff');
    }

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

    /* Shield — blocky 8-bit arc */
    if (p.shield) {
      var sx = p.facing > 0 ? p.x + p.w : p.x - this.hero.shieldSize;
      var sy = p.y + 4;
      this.drawPixelRect(sx, sy, this.hero.shieldSize, p.h - 8, 'rgba(0, 212, 255, 0.2)');
      this.drawPixelRect(sx, sy, 4, p.h - 8, '#00d4ff');
      this.drawPixelRect(sx + this.hero.shieldSize - 4, sy, 4, p.h - 8, '#00d4ff');
      this.drawPixelRect(sx, sy, this.hero.shieldSize, 4, '#00d4ff');
      this.drawPixelRect(sx, sy + p.h - 12, this.hero.shieldSize, 4, '#00d4ff');
      this.drawPixelRect(sx + 8, sy + 10, this.hero.shieldSize - 16, p.h - 28, '#66f0ff');
    }

    /* Projectiles */
    for (var i = 0; i < this.projectiles.length; i++) {
      var pr = this.projectiles[i];
      if (pr.owner === 'player') {
        if (pr.kind === 'one') {
          this.drawOneGlyph(pr.x, pr.y, '#00d4ff', 1);
          this.drawPixelRect(pr.x - pr.vx * 0.6, pr.y - pr.vy * 0.6, 3, 3, 'rgba(0, 212, 255, 0.35)');
        } else {
          this.drawPixelRect(pr.x, pr.y, pr.w, pr.h, '#ffd86b');
          this.drawPixelRect(pr.x + (pr.vx > 0 ? pr.w : -4), pr.y - 2, 4, pr.h + 4, '#fff3c4');
        }
      } else {
        var sz = pr.w > 14 ? 14 : 8;
        this.drawPixelRect(pr.x - sz / 2, pr.y - sz / 2, sz, sz, pr.w > 14 ? '#ff2222' : '#ff6666');
        this.drawPixelRect(pr.x - sz / 2 + 2, pr.y - sz / 2 + 2, sz - 4, sz - 4, '#ffaaaa');
      }
    }

    /* Particles */
    for (var j = 0; j < this.particles.length; j++) {
      var pt = this.particles[j];
      ctx.globalAlpha = pt.life / 30;
      this.drawPixelRect(pt.x, pt.y, pt.size, pt.size, pt.color);
    }
    ctx.globalAlpha = 1;

    this.draw8BitOverlay();
  };

  ArcadeBattle.prototype.drawOneGlyph = function (x, y, color, scale) {
    var s = scale || 1;
    this.drawPixelRect(x + 2 * s, y, 2 * s, 10 * s, color);
    this.drawPixelRect(x, y, 5 * s, 2 * s, color);
    this.drawPixelRect(x, y + 8 * s, 5 * s, 2 * s, color);
  };

  ArcadeBattle.prototype.drawWarriorSprite = function (x, y) {
    var hero = this.hero;
    var firing = this.player.spearCd > hero.spearCd - 8;

    this.drawPixelRect(x + 6, y, 16, 8, '#3a2010');
    this.drawPixelRect(x + 6, y + 8, 16, 10, '#d4a574');
    this.drawPixelRect(x + 4, y + 16, 20, 6, '#d4a574');
    this.drawPixelRect(x + 6, y + 6, 16, 3, '#3a2010');
    this.drawPixelRect(x + 8, y + 12, 4, 3, '#1a1008');
    this.drawPixelRect(x + 16, y + 12, 4, 3, '#1a1008');
    this.drawPixelRect(x + 10, y + 20, 8, 2, '#5a4030');
    this.drawPixelRect(x + 12, y + 18, 4, 2, '#5a4030');

    this.drawPixelRect(x + 2, y + 22, 24, 20, hero.body);
    this.drawPixelRect(x + 6, y + 26, 16, 8, hero.color);
    this.drawPixelRect(x - 2, y + 24, 6, 16, '#d4a574');
    this.drawPixelRect(x + 24, y + 24, 6, 16, '#d4a574');

    this.drawPixelRect(x + 4, y + 42, 8, 14, '#4a2810');
    this.drawPixelRect(x + 16, y + 42, 8, 14, '#4a2810');
    this.drawPixelRect(x + 2, y + 54, 10, 4, '#2a1810');
    this.drawPixelRect(x + 16, y + 54, 10, 4, '#2a1810');

    if (firing) {
      this.drawPixelRect(x + 26, y + 20, 18, 4, '#e8e8e8');
      this.drawPixelRect(x + 42, y + 18, 4, 8, '#c0c0c0');
    }
  };

  ArcadeBattle.prototype.drawGuardianSprite = function (x, y) {
    var hero = this.hero;
    var firing = this.player.spearCd > hero.spearCd - 10;

    this.drawPixelRect(x + 2, y - 6, 24, 10, hero.hair);
    this.drawPixelRect(x - 2, y - 2, 8, 18, '#f5d442');
    this.drawPixelRect(x + 22, y - 2, 8, 20, '#f5d442');
    this.drawPixelRect(x + 4, y - 4, 20, 6, '#fff0a8');

    this.drawPixelRect(x + 8, y + 4, 12, 10, '#ffc9a8');
    this.drawPixelRect(x + 8, y + 2, 12, 2, '#4a1040');
    this.drawPixelRect(x + 10, y + 8, 3, 3, '#4a1040');
    this.drawPixelRect(x + 17, y + 8, 3, 3, '#4a1040');
    this.drawPixelRect(x + 9, y + 6, 4, 1, '#4a1040');
    this.drawPixelRect(x + 16, y + 6, 4, 1, '#4a1040');
    this.drawPixelRect(x + 12, y + 12, 4, 2, '#f72585');

    this.drawPixelRect(x + 10, y + 14, 8, 6, hero.body);
    this.drawPixelRect(x + 6, y + 20, 16, 14, hero.body);
    this.drawPixelRect(x + 4, y + 34, 20, 10, hero.body);
    this.drawPixelRect(x + 8, y + 16, 12, 4, '#f72585');

    this.drawPixelRect(x + 0, y + 22, 5, 12, '#ffc9a8');
    this.drawPixelRect(x + 6, y + 44, 7, 12, '#4a1040');
    this.drawPixelRect(x + 15, y + 44, 7, 12, '#4a1040');

    var bowX = x + 22;
    var bowY = y + 14;
    this.drawPixelRect(bowX, bowY, 2, 18, '#c9a020');
    this.drawPixelRect(bowX + 8, bowY + 2, 2, 14, '#c9a020');
    if (firing) {
      this.drawPixelRect(bowX + 2, bowY + 4, 6, 10, '#e8fcff');
      this.drawOneGlyph(bowX + 4, bowY + 6, '#00d4ff', 0.8);
    } else {
      this.drawPixelRect(bowX + 1, bowY + 2, 1, 14, '#e8fcff');
      this.drawPixelRect(bowX + 9, bowY + 4, 1, 10, '#e8fcff');
    }
  };

  ArcadeBattle.prototype.drawPlayerSprite = function (x, y) {
    if (this.hero.id === 'guardian') {
      this.drawGuardianSprite(x, y);
    } else {
      this.drawWarriorSprite(x, y);
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
        '<p class="hal-game-deck-label">8-BIT HOLODECK ARCADE</p>' +
        '<h2>BINARY BATTLE</h2>' +
        '<p>Real-time combat vs HAL-Ω!<br>' +
        '<strong>← →</strong> move &nbsp; <strong>0</strong> shield &nbsp; <strong>1</strong> spear<br>' +
        'Shortcut: <strong>Ctrl+Shift+B</strong></p>' +
        '<button class="hal-game-btn" type="button" data-action="select">Insert Coin // Fight</button>' +
      '</div>'
    );
    this.bindScreen();
  };

  BinaryBattleGame.prototype.showSelect = function () {
    this.state = 'select';
    this.render(
      '<div class="hal-game-title">' +
        '<p class="hal-game-deck-label">Select your fighter</p>' +
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
  var globalShortcutHandler = null;

  function bindGlobalShortcut() {
    if (globalShortcutHandler) return;
    globalShortcutHandler = function (e) {
      if (isTypingTarget(document.activeElement)) return;
      if (!matchesLaunchShortcut(e)) return;
      e.preventDefault();
      if (overlay && overlay.classList.contains('hal-game-overlay--open')) {
        closeGame();
      } else {
        openGame(document.querySelector('.holo-trigger--game'));
      }
    };
    document.addEventListener('keydown', globalShortcutHandler);
  }

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
        '<div class="hal-game-marquee">◆ BINARY BATTLE — 8-BIT HOLODECK — HAL-Ω PROTOCOL ◆</div>' +
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
    bindGlobalShortcut();
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
