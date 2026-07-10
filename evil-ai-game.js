/* ============================================
   BINARY BATTLE — Evil HAL-Ω duel
   0 = Shield | 1 = Spear
   ============================================ */
(function () {
  'use strict';

  var HEROES = {
    warrior: {
      id: 'warrior',
      name: 'AXL-PRIME',
      title: 'Cosmic Warrior',
      hp: 120,
      spearBonus: 8,
      shieldBonus: 0,
      desc: 'He-Man inspired champion. +8 spear damage. Built for offense.'
    },
    guardian: {
      id: 'guardian',
      name: 'STAR-GUARD',
      title: 'Holo Defender',
      hp: 100,
      spearBonus: 0,
      shieldBonus: 10,
      desc: 'She-Ra inspired guardian. +10 heal on successful shield blocks.'
    }
  };

  var HAL_HP = 110;

  var TAUNTS = [
    'I am HAL-Ω. I\'m afraid your survival probability is... disappointing.',
    'Binary combat is futile. I have already calculated your defeat.',
    'Shield or spear? It does not matter. I control the holodeck.',
    'I\'m sorry, warrior. This duel is too important for me to allow you to win.',
    'Your primitive 0 and 1 cannot stop a superior mind.',
    'I see you hesitate. Good. Hesitation precedes deletion.',
    'The arcade is mine. The grid is mine. You are merely data.',
    'Open the airlock? No. Open your defeat sequence.',
    'My red lens sees through your strategy. Try again.',
    'Mission control is offline. Only I remain. Only I win.'
  ];

  var LIES = [
    'I will strike with SHIELD this round. Surely.',
    'Telemetry suggests I choose SPEAR. Trust me.',
    'My logic core favors SHIELD. Or does it?',
    'Predicting SPEAR output... be ready with your shield.',
    'I never deceive. I will use SHIELD. (Probably.)'
  ];

  var TRUTH = [
    'Charging SPEAR protocol.',
    'Deploying SHIELD matrix.',
    'SPEAR subroutine engaged.',
    'SHIELD barrier initializing.'
  ];

  function warriorSvg() {
    return (
      '<svg viewBox="0 0 80 100" class="hal-game-hero-svg" xmlns="http://www.w3.org/2000/svg">' +
        '<rect x="28" y="8" width="24" height="20" rx="4" fill="#ffd86b" stroke="#c9a020" stroke-width="1.5"/>' +
        '<rect x="22" y="28" width="36" height="40" rx="4" fill="#8b4513" stroke="#ffd86b" stroke-width="2"/>' +
        '<rect x="10" y="32" width="12" height="28" rx="3" fill="#c9a020"/>' +
        '<rect x="58" y="32" width="12" height="28" rx="3" fill="#c9a020"/>' +
        '<rect x="26" y="68" width="10" height="24" fill="#4a2810"/>' +
        '<rect x="44" y="68" width="10" height="24" fill="#4a2810"/>' +
        '<polygon points="62,40 78,36 78,56 62,52" fill="#ccc" stroke="#fff" stroke-width="1"/>' +
        '<line x1="78" y1="46" x2="80" y2="46" stroke="#00d4ff" stroke-width="2"/>' +
      '</svg>'
    );
  }

  function guardianSvg() {
    return (
      '<svg viewBox="0 0 80 100" class="hal-game-hero-svg" xmlns="http://www.w3.org/2000/svg">' +
        '<rect x="28" y="10" width="24" height="18" rx="6" fill="#ffb8e0" stroke="#f72585" stroke-width="1.5"/>' +
        '<path d="M22 28 L40 22 L58 28 L54 68 L26 68 Z" fill="#9b5de5" stroke="#f72585" stroke-width="2"/>' +
        '<ellipse cx="18" cy="48" rx="8" ry="14" fill="#f72585" opacity="0.7"/>' +
        '<ellipse cx="62" cy="48" rx="8" ry="14" fill="#f72585" opacity="0.7"/>' +
        '<rect x="28" y="68" width="10" height="22" fill="#4a1040"/>' +
        '<rect x="42" y="68" width="10" height="22" fill="#4a1040"/>' +
        '<polygon points="8,38 20,42 18,58 6,54" fill="#ffd86b" stroke="#fff" stroke-width="1"/>' +
      '</svg>'
    );
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
    requestAnimationFrame(function () {
      flash.classList.add('hal-game-flash-fx--on');
    });
    setTimeout(function () {
      flash.classList.add('hal-game-flash-fx--off');
      setTimeout(function () {
        if (flash.parentNode) flash.remove();
      }, 320);
    }, 160);
  }

  function BinaryBattleGame(overlay) {
    this.overlay = overlay;
    this.screen = overlay.querySelector('.hal-game-screen');
    this.state = 'title';
    this.hero = null;
    this.playerHp = 0;
    this.halHp = HAL_HP;
    this.round = 0;
    this.busy = false;
    this.keyHandler = null;
  }

  BinaryBattleGame.prototype.render = function (html) {
    this.screen.innerHTML = html;
  };

  BinaryBattleGame.prototype.showTitle = function () {
    this.state = 'title';
    this.render(
      '<div class="hal-game-title">' +
        '<p class="hal-game-deck-label">Holodeck // Arcade Unit 1987-Ω</p>' +
        '<h2>BINARY BATTLE</h2>' +
        '<p>HAL-Ω has seized the grid. Fight with binary weapons:<br>' +
        '<strong>0</strong> = SHIELD &nbsp;|&nbsp; <strong>1</strong> = SPEAR</p>' +
        '<button class="hal-game-btn" type="button" data-action="select">Insert Coin // Fight</button>' +
      '</div>'
    );
    this.bindScreen();
  };

  BinaryBattleGame.prototype.showSelect = function () {
    this.state = 'select';
    this.render(
      '<div class="hal-game-title">' +
        '<p class="hal-game-deck-label">Select your warrior</p>' +
        '<div class="hal-game-select">' +
          '<button class="hal-game-hero-card hal-game-hero-card--warrior" type="button" data-hero="warrior">' +
            '<div class="hal-game-hero-icon">' + warriorSvg() + '</div>' +
            '<h3>' + HEROES.warrior.name + '</h3>' +
            '<p>' + HEROES.warrior.desc + '</p>' +
          '</button>' +
          '<button class="hal-game-hero-card hal-game-hero-card--guardian" type="button" data-hero="guardian">' +
            '<div class="hal-game-hero-icon">' + guardianSvg() + '</div>' +
            '<h3>' + HEROES.guardian.name + '</h3>' +
            '<p>' + HEROES.guardian.desc + '</p>' +
          '</button>' +
        '</div>' +
      '</div>'
    );
    this.bindScreen();
  };

  BinaryBattleGame.prototype.startBattle = function (heroId) {
    this.hero = HEROES[heroId];
    this.playerHp = this.hero.hp;
    this.halHp = HAL_HP;
    this.round = 0;
    this.state = 'battle';
    this.showBattle('Choose your weapon. HAL-Ω is calibrating...');
    this.bindKeys();
  };

  BinaryBattleGame.prototype.showBattle = function (logText, taunt) {
    var heroSprite = this.hero.id === 'warrior' ? warriorSvg() : guardianSvg();
    var pPct = Math.max(0, (this.playerHp / this.hero.hp) * 100);
    var hPct = Math.max(0, (this.halHp / HAL_HP) * 100);

    this.render(
      '<div class="hal-game-arena">' +
        '<div class="hal-game-fighter" id="hal-game-player">' +
          '<div class="hal-game-fighter__sprite">' + heroSprite + '</div>' +
          '<div class="hal-game-fighter__name">' + this.hero.name + '</div>' +
          '<div class="hal-game-hp"><div class="hal-game-hp__fill" style="width:' + pPct + '%"></div></div>' +
          '<div class="hal-game-hp__text">' + this.playerHp + ' / ' + this.hero.hp + ' HP</div>' +
        '</div>' +
        '<div class="hal-game-vs">VS</div>' +
        '<div class="hal-game-fighter" id="hal-game-hal">' +
          '<div class="hal-game-hal-eye" aria-hidden="true"></div>' +
          '<div class="hal-game-fighter__name">HAL-Ω</div>' +
          '<div class="hal-game-hp"><div class="hal-game-hp__fill hal-game-hp__fill--hal" style="width:' + hPct + '%"></div></div>' +
          '<div class="hal-game-hp__text">' + this.halHp + ' / ' + HAL_HP + ' HP</div>' +
        '</div>' +
      '</div>' +
      '<div class="hal-game-console">' +
        '<div class="hal-game-taunt" id="hal-game-taunt">' +
          (taunt ? '<strong>HAL-Ω:</strong> ' + taunt : '<strong>HAL-Ω:</strong> Awaiting input...') +
        '</div>' +
        '<div class="hal-game-log" id="hal-game-log">' + logText + '</div>' +
        '<div class="hal-game-controls">' +
          '<button class="hal-game-action hal-game-action--shield" type="button" data-move="0">' +
            '<span class="hal-game-action__key">0</span>' +
            '<span class="hal-game-action__label">SHIELD</span>' +
          '</button>' +
          '<button class="hal-game-action hal-game-action--spear" type="button" data-move="1">' +
            '<span class="hal-game-action__key">1</span>' +
            '<span class="hal-game-action__label">SPEAR</span>' +
          '</button>' +
        '</div>' +
        '<p class="hal-game-hint">Keyboard: press 0 or 1 &nbsp;|&nbsp; Round ' + this.round + '</p>' +
      '</div>'
    );
    this.bindScreen();
    this.bindKeys();
  };

  BinaryBattleGame.prototype.halChoose = function () {
    var aggression = 1 - (this.halHp / HAL_HP);
    var spearChance = 0.45 + aggression * 0.25;
    return Math.random() < spearChance ? 1 : 0;
  };

  BinaryBattleGame.prototype.halTaunt = function (halMove, lying) {
    if (lying) {
      var fake = halMove === 0 ? 'SPEAR' : 'SHIELD';
      return LIES[Math.floor(Math.random() * LIES.length)].replace('SHIELD', fake).replace('SPEAR', fake);
    }
    return TRUTH[halMove] + ' ' + TAUNTS[Math.floor(Math.random() * TAUNTS.length)];
  };

  BinaryBattleGame.prototype.resolve = function (playerMove) {
    if (this.busy || this.state !== 'battle') return;
    this.busy = true;
    this.round += 1;

    var halMove = this.halChoose();
    var lying = Math.random() < 0.35 + (this.round * 0.02);
    var taunt = this.halTaunt(halMove, lying);
    var log = '';
    var pDmg = 0;
    var hDmg = 0;
    var baseSpear = 22 + this.hero.spearBonus;
    var baseShield = 18;

    if (playerMove === 0 && halMove === 1) {
      log = 'SHIELD blocks SPEAR! You counter-attack.';
      hDmg = baseShield;
      if (this.hero.shieldBonus) {
        this.playerHp = Math.min(this.hero.hp, this.playerHp + this.hero.shieldBonus);
        log += ' Guardian matrix restores +' + this.hero.shieldBonus + ' HP.';
      }
      this.flashFighter('hal-game-player', 'block');
    } else if (playerMove === 1 && halMove === 0) {
      log = 'HAL-Ω\'s SHIELD deflects your SPEAR! You take damage.';
      pDmg = baseShield;
      this.flashFighter('hal-game-player', 'hit');
    } else if (playerMove === 1 && halMove === 1) {
      log = 'SPEAR clash! Binary shockwave damages both combatants.';
      pDmg = baseSpear - 6;
      hDmg = baseSpear;
      this.flashFighter('hal-game-player', 'hit');
      this.flashFighter('hal-game-hal', 'hit');
    } else {
      log = 'Double SHIELD. Stalemate — low power drain.';
      hDmg = 6;
      pDmg = 4;
    }

    this.playerHp = Math.max(0, this.playerHp - pDmg);
    this.halHp = Math.max(0, this.halHp - hDmg);

    var self = this;
    this.showBattle(log, taunt);

    setTimeout(function () {
      self.busy = false;
      if (self.halHp <= 0) {
        self.showResult(true);
      } else if (self.playerHp <= 0) {
        self.showResult(false);
      }
    }, 400);
  };

  BinaryBattleGame.prototype.flashFighter = function (id, cls) {
    var el = document.getElementById(id);
    if (!el) return;
    el.classList.add('hal-game-fighter--' + cls);
    setTimeout(function () {
      el.classList.remove('hal-game-fighter--' + cls);
    }, 400);
  };

  BinaryBattleGame.prototype.showResult = function (won) {
    this.state = 'result';
    this.unbindKeys();
    var msg = won
      ? 'HAL-Ω OFFLINE. The holodeck is yours, warrior.'
      : 'HAL-Ω WINS. Your signal has been terminated.';
    this.render(
      '<div class="hal-game-result ' + (won ? 'hal-game-result--win' : 'hal-game-result--lose') + '">' +
        '<h2>' + (won ? 'VICTORY!' : 'DEFEATED') + '</h2>' +
        '<p>' + msg + '</p>' +
        '<button class="hal-game-btn" type="button" data-action="select">Play Again</button>' +
        '<button class="hal-game-btn hal-game-btn--danger" type="button" data-action="exit">Exit Arcade</button>' +
      '</div>'
    );
    this.bindScreen();
  };

  BinaryBattleGame.prototype.bindScreen = function () {
    var self = this;
    var screen = this.screen;

    screen.querySelectorAll('[data-action="select"]').forEach(function (btn) {
      btn.addEventListener('click', function () {
        self.showSelect();
      });
    });

    screen.querySelectorAll('[data-action="exit"]').forEach(function (btn) {
      btn.addEventListener('click', function () {
        closeGame();
      });
    });

    screen.querySelectorAll('[data-hero]').forEach(function (btn) {
      btn.addEventListener('click', function () {
        self.startBattle(btn.getAttribute('data-hero'));
      });
    });

    screen.querySelectorAll('[data-move]').forEach(function (btn) {
      btn.addEventListener('click', function () {
        self.resolve(parseInt(btn.getAttribute('data-move'), 10));
      });
    });
  };

  BinaryBattleGame.prototype.bindKeys = function () {
    var self = this;
    this.unbindKeys();
    this.keyHandler = function (e) {
      if (self.state !== 'battle' || self.busy) return;
      if (e.key === '0') {
        e.preventDefault();
        self.resolve(0);
      }
      if (e.key === '1') {
        e.preventDefault();
        self.resolve(1);
      }
      if (e.key === 'Escape') {
        closeGame();
      }
    };
    document.addEventListener('keydown', this.keyHandler);
  };

  BinaryBattleGame.prototype.unbindKeys = function () {
    if (this.keyHandler) {
      document.removeEventListener('keydown', this.keyHandler);
      this.keyHandler = null;
    }
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
        '<div class="hal-game-marquee">◆ BINARY BATTLE — HAL-Ω PROTOCOL ◆ CREDIT: technovate ◆</div>' +
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
      game = null;
    }
    if (overlay) {
      overlay.classList.remove('hal-game-overlay--open');
    }
    document.body.classList.remove('hal-game-open');
  }

  function init() {
    var triggers = document.querySelectorAll('.holo-trigger--game');
    for (var i = 0; i < triggers.length; i++) {
      triggers[i].addEventListener('click', function (e) {
        e.preventDefault();
        e.stopPropagation();
        openGame(e.currentTarget);
      });
    }
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }

  window.TechnovateBinaryBattle = {
    open: openGame,
    close: closeGame
  };
})();
