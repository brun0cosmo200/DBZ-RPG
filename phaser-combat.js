/**
 * phaser-combat.js — Arena 2D com Phaser 3
 * Sprint 2: sprites animados, parallax de background, partículas no especial.
 * Zero assets externos — tudo gerado via Graphics/RenderTexture.
 */
(function () {
  'use strict';

  let game = null;
  let sceneRef = null;

  // ─── PALETTES ───────────────────────────────────────
  const RACE_COLORS = {
    saiyajin:       { body: 0xff6600, hair: 0x2a1a00, skin: 0xf5c58a },
    'meio-saiyajin':{ body: 0x3344bb, hair: 0x1a1a1a, skin: 0xf5c58a },
    namekusei:      { body: 0x6633cc, hair: 0x224422, skin: 0x44aa44 },
    humano:         { body: 0x224488, hair: 0x332200, skin: 0xf5c58a },
    androide:       { body: 0x222244, hair: 0x334455, skin: 0xbbccdd },
    majin:          { body: 0xbb1144, hair: 0xffaaee, skin: 0xffbbcc }
  };

  const TRANSFORM_AURA = {
    ssj:        0xffee00,
    ssj2:       0xcc88ff,
    ssj3:       0xff4444,
    oozaru:     0xff6600,
    namefusion: 0x00ffcc
  };

  // ─── SCENE ──────────────────────────────────────────
  class CombatArenaScene extends Phaser.Scene {
    constructor() { super({ key: 'CombatArenaScene' }); }

    _buildPlayerTex(race, transform) {
      const key = `player_${race}_${transform}`;
      if (this.textures.exists(key)) return key;

      const pal   = RACE_COLORS[race] || RACE_COLORS.humano;
      const auraC = TRANSFORM_AURA[transform] || null;
      const hairC = auraC || pal.hair;
      const W = 48, H = 72, S = 2;

      const rt = this.add.renderTexture(0, 0, W, H).setVisible(false);
      const g  = this.add.graphics().setVisible(false);
      const px = (x, y, w, h, c) => { g.fillStyle(c, 1); g.fillRect(x*S, y*S, w*S, h*S); };

      px(8,24,3,8,pal.body); px(13,24,3,8,pal.body);
      px(8,30,3,2,0xffffff); px(13,30,3,2,0xffffff);
      px(7,14,10,10,pal.body);
      px(7,21,10,2,0xffffff);
      px(5,14,2,9,pal.body); px(17,14,2,9,pal.body);
      px(5,21,2,3,pal.skin); px(17,21,2,3,pal.skin);
      px(8,8,8,7,pal.skin);
      px(7,4,10,5,hairC);
      px(6,5,2,5,hairC); px(16,5,2,5,hairC);
      px(9,2,6,3,hairC);
      if (transform === 'ssj3') { px(9,0,6,3,hairC); px(9,28,6,8,hairC); }
      const eyeC = transform !== 'normal' ? 0x44aaff : 0x222222;
      px(9,11,2,2,eyeC); px(13,11,2,2,eyeC);

      rt.draw(g, 0, 0);
      rt.saveTexture(key);
      g.destroy(); rt.destroy();
      return key;
    }

    _buildEnemyTex(phase) {
      const key = `vegeta_${phase}`;
      if (this.textures.exists(key)) return key;

      const configs = [
        { hair: 0x1a1a1a, armor: 0x8888cc, suit: 0x222266 },
        { hair: 0xffee00, armor: 0x9999cc, suit: 0x222266 },
        { hair: 0xcc88ff, armor: 0x6644aa, suit: 0x111133 }
      ];
      const p = configs[Math.min(phase, 2)];
      const W = 48, H = 72, S = 2;

      const rt = this.add.renderTexture(0, 0, W, H).setVisible(false);
      const g  = this.add.graphics().setVisible(false);
      const px = (x, y, w, h, c) => { g.fillStyle(c, 1); g.fillRect(x*S, y*S, w*S, h*S); };

      px(8,24,3,8,p.suit); px(13,24,3,8,p.suit);
      px(8,30,3,2,0x1a1a44); px(13,30,3,2,0x1a1a44);
      px(7,14,10,10,p.armor);
      px(7,21,10,2,0xffffff);
      px(5,14,2,9,p.suit); px(17,14,2,9,p.suit);
      px(5,21,2,3,0xf5c58a); px(17,21,2,3,0xf5c58a);
      px(4,12,3,5,0xaaaaee); px(17,12,3,5,0xaaaaee);
      px(8,8,8,7,0xf5c58a);
      px(8,2,8,7,p.hair);
      px(7,3,2,6,p.hair); px(16,3,2,6,p.hair);
      px(9,1,6,2,p.hair);
      const ey = phase > 0 ? 0x44aaff : 0x333333;
      px(9,11,2,2,ey); px(13,11,2,2,ey);

      rt.draw(g, 0, 0);
      rt.saveTexture(key);
      g.destroy(); rt.destroy();
      return key;
    }

    _buildParallaxTextures() {
      const W = this.scale.width, H = this.scale.height;

      // Stars layer
      if (!this.textures.exists('bg_stars')) {
        const rt = this.add.renderTexture(0, 0, W, H).setVisible(false);
        const g  = this.add.graphics().setVisible(false);
        for (let i = 0; i < 90; i++) {
          g.fillStyle(0xaabbff, 0.3 + Math.random() * 0.6);
          g.fillCircle(
            Phaser.Math.Between(0, W),
            Phaser.Math.Between(0, H),
            Math.random() < 0.2 ? 2 : 1
          );
        }
        rt.draw(g, 0, 0);
        rt.saveTexture('bg_stars');
        g.destroy(); rt.destroy();
      }

      // Nebula layer
      if (!this.textures.exists('bg_nebula')) {
        const rt = this.add.renderTexture(0, 0, W, H).setVisible(false);
        const g  = this.add.graphics().setVisible(false);
        [[0.25, 0.35, 0x3300cc, 0.09], [0.7, 0.4, 0x004488, 0.07], [0.5, 0.65, 0x220044, 0.06]].forEach(([rx,ry,c,a]) => {
          g.fillStyle(c, a);
          g.fillEllipse(rx * W, ry * H, W * 0.55, H * 0.42);
        });
        rt.draw(g, 0, 0);
        rt.saveTexture('bg_nebula');
        g.destroy(); rt.destroy();
      }
    }

    _buildParticleTexture() {
      if (this.textures.exists('particle_orb')) return;
      const rt = this.add.renderTexture(0, 0, 12, 12).setVisible(false);
      const g  = this.add.graphics().setVisible(false);
      g.fillStyle(0xffffff, 1);
      g.fillCircle(6, 6, 6);
      rt.draw(g, 0, 0);
      rt.saveTexture('particle_orb');
      g.destroy(); rt.destroy();
    }

    create(data) {
      const W = this.scale.width, H = this.scale.height;

      // ─ Dark base
      this.add.rectangle(W/2, H/2, W, H, 0x04040f).setDepth(0);

      // ─ Parallax textures
      this._buildParallaxTextures();
      this.bgStars  = this.add.tileSprite(W/2, H/2, W, H, 'bg_stars').setDepth(1);
      this.bgNebula = this.add.tileSprite(W/2, H/2, W, H, 'bg_nebula').setDepth(2);

      // ─ Chão
      const gnd = this.add.graphics().setDepth(3);
      gnd.fillStyle(0x1e2e80, 0.25);
      gnd.fillEllipse(W/2, H*0.85, W*0.88, H*0.25);

      // ─ Partículas
      this._buildParticleTexture();
      this.emitter = this.add.particles(0, 0, 'particle_orb', {
        speed: { min: 55, max: 200 },
        angle: { min: 0, max: 360 },
        scale: { start: 0.85, end: 0 },
        alpha: { start: 1, end: 0 },
        lifespan: { min: 280, max: 620 },
        quantity: 0,
        blendMode: Phaser.BlendModes.ADD,
        emitting: false
      }).setDepth(11);

      // ─ Posições
      this._px = W * 0.25;
      this._py = H * 0.52;
      this._ex = W * 0.75;
      this._ey = H * 0.50;

      // ─ Jogador
      const race      = (typeof G !== 'undefined' && G.race)      ? G.race      : 'saiyajin';
      const transform = (typeof G !== 'undefined' && G.transform) ? G.transform : 'normal';
      const pKey = this._buildPlayerTex(race, transform);
      this.playerSprite = this.add.image(this._px, this._py, pKey).setDepth(5);
      this._addBob(this.playerSprite);

      // Aura
      const auraC = TRANSFORM_AURA[transform] || null;
      this._buildAura(this._px, this._py, auraC);

      // ─ Inimigo
      const eKey = this._buildEnemyTex(0);
      this.enemySprite = this.add.image(this._ex, this._ey, eKey)
        .setDepth(5).setFlipX(true);
      this._addBob(this.enemySprite);

      // Emoji overlay para inimigos não-Vegeta
      const icon = (data && data.icon) ? data.icon : '';
      this.enemyIcon = this.add.text(this._ex, this._ey - 44, icon, {
        fontSize: '26px'
      }).setOrigin(0.5).setDepth(7);

      sceneRef = this;
    }

    update() {
      if (this.bgStars)  this.bgStars.tilePositionX  += 0.05;
      if (this.bgNebula) this.bgNebula.tilePositionX += 0.018;
    }

    // ─── HELPERS ────────────────────────────────────────

    _addBob(target) {
      this.tweens.add({
        targets: target,
        y: target.y - 5,
        duration: 880,
        yoyo: true,
        repeat: -1,
        ease: 'Sine.easeInOut'
      });
    }

    _buildAura(x, y, color) {
      if (this._auraGfx) { this._auraGfx.destroy(); this._auraGfx = null; }
      if (!this._auraTween) {} else { this._auraTween.stop(); this._auraTween = null; }
      if (!color) return;
      const g = this.add.graphics().setDepth(4);
      g.fillStyle(color, 0.16);
      g.fillCircle(x, y, 34);
      g.fillStyle(color, 0.07);
      g.fillCircle(x, y, 50);
      this._auraGfx = g;
      this._auraTween = this.tweens.add({
        targets: g,
        scaleX: 1.1, scaleY: 1.1,
        alpha: 0.55,
        duration: 720,
        yoyo: true, repeat: -1,
        ease: 'Sine.easeInOut'
      });
    }

    _burst(x, y, n, tint) {
      this.emitter.setPosition(x, y);
      this.emitter.setParticleTint(tint);
      this.emitter.explode(n);
    }

    _floatText(side, txt, color) {
      const x = side === 'enemy' ? this._ex : this._px;
      const y = this._py - 38;
      const t = this.add.text(x, y, txt, {
        fontFamily: 'Rajdhani, Arial, sans-serif',
        fontSize: '19px', fontStyle: 'bold',
        color: color || '#ffffff',
        stroke: '#000000', strokeThickness: 3
      }).setOrigin(0.5).setDepth(13);
      this.tweens.add({
        targets: t,
        y: y - 38,
        alpha: 0,
        duration: 820,
        ease: 'Cubic.easeOut',
        onComplete: () => t.destroy()
      });
    }

    _flashEnemy(color) {
      if (!this.enemySprite) return;
      this.tweens.add({
        targets: [this.enemySprite, this.enemyIcon],
        scaleX: 1.26, scaleY: 1.26,
        duration: 65, yoyo: true, ease: 'Power2'
      });
      this.cameras.main.flash(90, (color>>16)&0xff, (color>>8)&0xff, color&0xff, false);
    }

    // ─── PUBLIC ACTIONS ─────────────────────────────────

    meleeLunge(dmg) {
      if (!this.playerSprite) return;
      const ox = this._px;
      this.tweens.add({
        targets: this.playerSprite,
        x: this._ex - 52,
        duration: 80, yoyo: true, ease: 'Power3',
        onYoyo: () => {
          this._flashEnemy(0xff4444);
          this._burst(this._ex - 28, this._ey, 16, 0xff6666);
          if (dmg) this._floatText('enemy', `-${dmg}`, '#ff6666');
        },
        onComplete: () => { if (this.playerSprite) this.playerSprite.x = ox; }
      });
    }

    kiBlast(dmg) {
      if (!this.playerSprite) return;
      const blast = this.add.graphics().setDepth(9);
      blast.fillStyle(0x4fc3f7, 1);
      blast.fillCircle(0, 0, 9);
      blast.setPosition(this._px + 26, this._py);
      this.tweens.add({
        targets: blast,
        x: this._ex - 22, y: this._ey,
        scaleX: 1.7, scaleY: 1.7,
        duration: 195, ease: 'Power2',
        onComplete: () => {
          blast.destroy();
          this._flashEnemy(0x4fc3f7);
          this._burst(this._ex - 18, this._ey, 24, 0x4fc3f7);
          if (dmg) this._floatText('enemy', `-${dmg}`, '#4fc3f7');
        }
      });
    }

    specialWave(dmg) {
      if (!this.playerSprite) return;
      // Charge
      this.tweens.add({
        targets: this.playerSprite,
        scaleX: 1.15, scaleY: 1.15,
        duration: 130, yoyo: true, ease: 'Power2',
        onYoyo: () => {
          // Onda
          const ring = this.add.graphics().setDepth(10);
          ring.lineStyle(5, 0xffd700, 1);
          ring.strokeCircle(0, 0, 18);
          ring.fillStyle(0xffd700, 0.22);
          ring.fillCircle(0, 0, 18);
          ring.setPosition(this._px, this._py);
          this.tweens.add({
            targets: ring,
            x: this._ex, y: this._ey,
            scaleX: 5.5, scaleY: 5.5,
            alpha: 0, duration: 310, ease: 'Cubic.easeOut',
            onComplete: () => {
              ring.destroy();
              this._flashEnemy(0xffd700);
              this._burst(this._ex, this._ey, 40, 0xffd700);
              this._burst(this._ex, this._ey, 18, 0xffffff);
              this.cameras.main.shake(200, 0.013);
              if (dmg) this._floatText('enemy', `-${dmg}`, '#ffd700');
            }
          });
        }
      });
    }

    enemyAttack(dmg) {
      if (!this.playerSprite) return;
      this.tweens.add({
        targets: this.playerSprite,
        x: this._px - 11,
        duration: 40, yoyo: true, repeat: 3, ease: 'Power2'
      });
      this.cameras.main.shake(100, 0.007);
      this._burst(this._px, this._py, 13, 0xff4444);
      if (dmg) this._floatText('player', `-${dmg}`, '#ff4444');
    }

    updateEnemyPhase(phase) {
      if (!this.enemySprite) return;
      const key = this._buildEnemyTex(phase);
      this.enemySprite.setTexture(key);
      const auraColors = [null, 0xffee00, 0xcc00ff];
      const c = auraColors[phase];
      if (c) {
        this._burst(this._ex, this._ey, 32, c);
        this.cameras.main.flash(200, (c>>16)&0xff, (c>>8)&0xff, c&0xff, false);
      }
    }
  }

  // ─── MOUNT / UNMOUNT ────────────────────────────────
  function mount(enemy) {
    const parent = document.getElementById('phaser-combat-container');
    if (!parent || typeof Phaser === 'undefined') return;
    unmount();

    const rect = parent.getBoundingClientRect();
    const w = Math.max(320, Math.floor(rect.width) || 420);

    game = new Phaser.Game({
      type: Phaser.AUTO,
      parent: 'phaser-combat-container',
      width: w,
      height: 210,
      transparent: false,
      backgroundColor: '#04040f',
      scene: CombatArenaScene,
      scale: { mode: Phaser.Scale.NONE, autoCenter: Phaser.Scale.NO_CENTER },
      banner: false
    });

    // Injetar dados do inimigo logo que a cena estiver pronta
    const icon = (enemy && enemy.icon) ? enemy.icon : '';
    const trySetIcon = () => {
      const sc = game && game.scene.getScene('CombatArenaScene');
      if (sc && sc.enemyIcon) { sc.enemyIcon.setText(icon); }
      else { setTimeout(trySetIcon, 60); }
    };
    setTimeout(trySetIcon, 60);
  }

  function unmount() {
    if (game) { game.destroy(true); game = null; sceneRef = null; }
  }

  window.DBZCombatPhaser = {
    mount,
    unmount,
    playerMelee(dmg)   { sceneRef && sceneRef.meleeLunge   && sceneRef.meleeLunge(dmg);   },
    playerKiBlast(dmg) { sceneRef && sceneRef.kiBlast      && sceneRef.kiBlast(dmg);       },
    playerSpecial(dmg) { sceneRef && sceneRef.specialWave  && sceneRef.specialWave(dmg);   },
    enemyAttack(dmg)   { sceneRef && sceneRef.enemyAttack  && sceneRef.enemyAttack(dmg);   },
    bossPhase(phase)   { sceneRef && sceneRef.updateEnemyPhase && sceneRef.updateEnemyPhase(phase); }
  };
})();