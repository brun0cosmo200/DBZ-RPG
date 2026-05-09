// ═══════════════════════════════════════════════════════
// COMBAT.JS — Turn-Based Combat System
// ═══════════════════════════════════════════════════════

const ENEMIES = [
  {
    id: 'saibaman',
    name: 'Saibaman',
    icon: '🌱',
    baseHp: 72,   baseAtk: 14,  baseDef: 5,
    xpReward: 30, zeniReward: 40,
    minLevel: 1, maxLevel: 5,
    moves: ['Ácido Explosivo', 'Mordida', 'Carga'],
    loot: ['Senzu Bean (10%)', '+Força (5%)'],
    description: 'Pequeno mas perigoso. Ácido explosivo pode surpreender.'
  },
  {
    id: 'soldado_freeza',
    name: 'Soldado Freeza',
    icon: '👽',
    baseHp: 118,  baseAtk: 21,  baseDef: 10,
    xpReward: 55, zeniReward: 80,
    minLevel: 2, maxLevel: 8,
    moves: ['Tiro de Ki', 'Soco Duplo', 'Bloqueio'],
    loot: ['Zeni Extra (20%)', '+Vel (5%)'],
    description: 'Treinado para matar. Usa Ki básico mas com precisão.'
  },
  {
    id: 'guerreiro_z',
    name: 'Guerreiro Z Rival',
    icon: '🥷',
    baseHp: 188,  baseAtk: 30,  baseDef: 17,
    xpReward: 90, zeniReward: 130,
    minLevel: 4, maxLevel: 12,
    moves: ['Kamehameha Fraco', 'Contra-ataque', 'Rajada'],
    loot: ['Senzu Bean (15%)', '+KiAtk (8%)'],
    description: 'Um guerreiro como você. Usa técnicas conhecidas contra você.'
  },
  {
    id: 'ginyu_force',
    name: 'Ginyu Force',
    icon: '💜',
    baseHp: 305,  baseAtk: 44,  baseDef: 24,
    xpReward: 150, zeniReward: 220,
    minLevel: 7, maxLevel: 18,
    moves: ['Pose Especial', 'Troca de Corpo', 'Tiro Máximo'],
    loot: ['Zeni x2 (20%)', '+Defesa (8%)'],
    description: 'Elite de Freeza. A pose especial aumenta poder temporariamente.'
  },
  {
    id: 'freeza_f1',
    name: 'Freeza 1ª Forma',
    icon: '🦀',
    baseHp: 515,  baseAtk: 62,  baseDef: 36,
    xpReward: 280, zeniReward: 500,
    minLevel: 12, maxLevel: 99,
    moves: ['Garras de Freeza', 'Death Beam', 'Rir Malevolente'],
    loot: ['Senzu x2 (20%)', '+Força +3 (10%)'],
    description: 'Imperador do universo. Cada forma é mais mortal que a anterior.'
  }
];

// Combat state (not persisted) — var para outros scripts (história) verificarem após startCombat
var combatState = null;

// ─── INIT COMBAT UI ───────────────────────────────────
function initCombatTab() {
  const list = document.getElementById('enemy-select-list');
  if (!list) return;
  list.innerHTML = '';

  ENEMIES.forEach(enemy => {
    const scaledHp  = Math.round(enemy.baseHp  * (1 + G.level * 0.38));
    const scaledAtk = Math.round(enemy.baseAtk * (1 + G.level * 0.34));
    const el = document.createElement('div');
    el.className = 'enemy-option';
    el.innerHTML = `
      <div class="enemy-opt-icon">${enemy.icon}</div>
      <div style="flex:1">
        <div class="enemy-opt-name">${enemy.name}</div>
        <div class="enemy-opt-power">HP: ${scaledHp} | ATK: ${scaledAtk}</div>
      </div>
      <div style="text-align:right">
        <div class="enemy-opt-reward">+${enemy.xpReward * G.level} XP</div>
        <div class="enemy-opt-reward">+${enemy.zeniReward * G.level} Z</div>
      </div>`;
    el.onclick = () => startCombat(enemy);
    list.appendChild(el);
  });
}

function villainDmgMultKi() {
  const v = G.skillsVillain || {};
  return 1
    + (v.death_beam || 0) * 0.055
    + (v.galick_gun || 0) * 0.05
    + (v.big_bang || 0) * 0.065
    + (v.crusher_ball || 0) * 0.045
    + (v.absorption_dark || 0) * 0.04;
}

function villainDmgMultPhys() {
  const v = G.skillsVillain || {};
  return 1 + (v.energy_drain || 0) * 0.035 + (v.absorption_dark || 0) * 0.03;
}

// ─── START COMBAT ─────────────────────────────────────
function startCombat(enemyTemplate, opts = {}) {
  const stamCost = opts.stamOverride != null ? opts.stamOverride : 15;
  if (G.stamina < stamCost) {
    log('warn', '😓 Stamina muito baixa para batalhar. Descanse primeiro!');
    showNotif('Stamina baixa!');
    return;
  }
  if (G.ki < 10 && G.race !== 'androide') {
    log('warn', '⚡ Ki muito baixo para batalhar (mín. 10)!');
    return;
  }

  const baseCurve = opts.storyMode ? 0.46 : 0.38;
  const sagaScale = enemyTemplate.storyScale || 1;
  const levelMult = (1 + G.level * baseCurve) * sagaScale;
  const enemy = {
    ...enemyTemplate,
    hp:    Math.round(enemyTemplate.baseHp  * levelMult),
    maxHp: Math.round(enemyTemplate.baseHp  * levelMult),
    atk:   Math.round(enemyTemplate.baseAtk * levelMult),
    def:   Math.round(enemyTemplate.baseDef * levelMult),
    status: null,
    statusTurns: 0
  };

  combatState = {
    enemy,
    playerHp: G.hp,
    playerKi: G.ki,
    turn: 0,
    playerDefending: false,
    enemyStunned: false,
    combo: 0,
    finished: false
  };

  mutate({ stamina: Math.max(0, G.stamina - stamCost), day: G.day + 1 });

  // Switch to combat view
  document.getElementById('combat-idle').style.display = 'none';
  document.getElementById('combat-arena').style.display = 'block';

  drawPixelChar('combat-player-canvas', G.race, G.transform, 72, 96);
  document.getElementById('combat-player-name').textContent = G.name;
  document.getElementById('combat-enemy-sprite').textContent = enemy.icon;
  document.getElementById('combat-enemy-name').textContent   = enemy.name;
  document.getElementById('combat-enemy-status').textContent = '';

  updateCombatUI();
  renderCombatActions();
  combatLog(`⚔️ ${G.name} vs ${enemy.name}! Luta por turnos iniciada!`);
  combatLog(`💬 ${getEnemyTaunt(enemy.id)}`);
  if (window.DBZCombatPhaser) window.DBZCombatPhaser.mount(enemy);
}

function _villainLeechOnHit(finalDmg) {
  const v = G.skillsVillain || {};
  const leech = (v.energy_drain || 0) * 0.02 + (v.absorption_dark || 0) * 0.025;
  if (leech <= 0) return;
  const heal = Math.round(finalDmg * leech);
  if (heal > 0 && combatState) {
    combatState.playerHp = Math.min(G.maxHp, combatState.playerHp + heal);
    combatLog(`🩸 Técnica sombria: +${heal} HP`);
  }
}

// ─── COMBAT ACTIONS ───────────────────────────────────
function renderCombatActions() {
  const acts = document.getElementById('combat-action-buttons');
  if (!acts) return;
  const cs = combatState;
  if (!cs || cs.finished) return;

  const kiCostKi = G.race === 'androide' ? 0 : 15;
  const kiCostKamehameha = G.race === 'androide' ? 0 : 30;

  acts.innerHTML = `
    <button class="btn btn-red" onclick="combatAction('fisico')">
      👊 FÍSICO<br><span style="font-size:9px;opacity:.7">Dano base</span>
    </button>
    <button class="btn btn-blue" onclick="combatAction('ki')" ${cs.playerKi < kiCostKi && G.race !== 'androide' ? 'disabled' : ''}>
      ⚡ KI ATK<br><span style="font-size:9px;opacity:.7">${kiCostKi > 0 ? `-${kiCostKi} Ki` : 'Grátis'}</span>
    </button>
    <button class="btn btn-green" onclick="combatAction('defender')">
      🛡️ DEFENDER<br><span style="font-size:9px;opacity:.7">Reduz dano</span>
    </button>
    <button class="btn btn-gold" onclick="combatAction('kamehameha')" ${cs.playerKi < kiCostKamehameha && G.race !== 'androide' ? 'disabled' : ''}>
      🌊 ESPECIAL<br><span style="font-size:9px;opacity:.7">${kiCostKamehameha > 0 ? `-${kiCostKamehameha} Ki` : 'Grátis'}</span>
    </button>
    <button class="btn btn-purple" onclick="combatAction('fugir')">
      💨 FUGIR<br><span style="font-size:9px;opacity:.7">50% chance</span>
    </button>
    <button class="btn btn-green" onclick="combatAction('senzu')" ${!G.inventory.senzu ? 'disabled' : ''}>
      🫘 SENZU<br><span style="font-size:9px;opacity:.7">(${G.inventory.senzu || 0})</span>
    </button>`;
}

function combatAction(type) {
  const cs = combatState;
  if (!cs || cs.finished) return;

  cs.turn++;
  cs.playerDefending = false;
  let playerDmg = 0;

  // ── Player attack ──
  switch (type) {
    case 'fisico': {
      const base = G.forca * 4 + rand(-8, 10);
      const classBonus = G.cls === 'guerreiro' ? 1.28 : 1;
      const transformBonus = { ssj: 1.48, ssj2: 2.1, ssj3: 3.35, oozaru: 1.95, namefusion: 1.75 }[G.transform] || 1;
      playerDmg = Math.round(base * classBonus * transformBonus * villainDmgMultPhys());
      cs.combo++;
      if (cs.combo >= 3) {
        playerDmg = Math.round(playerDmg * (1 + cs.combo * 0.18));
        combatLog(`💥 COMBO x${cs.combo}! Dano amplificado!`);
      }
      combatLog(`👊 Ataque físico: ${playerDmg} de dano!`);
      break;
    }
    case 'ki': {
      const cost = G.race === 'androide' ? 0 : 15;
      if (cs.playerKi < cost && G.race !== 'androide') { combatLog('⚠️ Ki insuficiente!'); return; }
      cs.playerKi -= cost;
      const base = G.kiAtk * 5 + rand(-5, 12);
      const classBonus = G.cls === 'ki-mestre' ? 1.38 : 1;
      playerDmg = Math.round(base * classBonus * villainDmgMultKi());
      cs.combo = 0;
      combatLog(`⚡ Ataque de Ki: ${playerDmg} de dano!`);
      break;
    }
    case 'kamehameha': {
      const cost = G.race === 'androide' ? 0 : 30;
      if (cs.playerKi < cost && G.race !== 'androide') { combatLog('⚠️ Ki insuficiente para especial!'); return; }
      cs.playerKi -= cost;
      const skillLvl = G.skills.kamehameha || 1;
      playerDmg = Math.round((G.kiAtk * 12 + G.forca * 4) * skillLvl * (G.cls === 'ki-mestre' ? 1.45 : 1) * villainDmgMultKi());
      cs.combo = 0;
      const names = { saiyajin: 'KAMEHAMEHA', 'meio-saiyajin': 'KAMEHAMEHA', namekusei: 'MAKANKOSAPPO', humano: 'KAMEHAMEHA', androide: 'ENERGY BLAST', majin: 'FÚRIA MAJIN' };
      combatLog(`🌊 ${names[G.race] || 'ESPECIAL'}! ${playerDmg} de dano devastador!`);
      showNotif(`🌊 ${names[G.race] || 'ESPECIAL'}!`);
      break;
    }
    case 'defender': {
      cs.playerDefending = true;
      cs.combo = 0;
      combatLog(`🛡️ ${G.name} assume posição defensiva!`);
      enemyAttack(cs);
      updateCombatUI();
      renderCombatActions();
      checkCombatEnd();
      return;
    }
    case 'senzu': {
      if (!G.inventory.senzu) { combatLog('🫘 Sem Senzu!'); return; }
      mutate({ inventory: { ...G.inventory, senzu: G.inventory.senzu - 1 } });
      cs.playerHp = G.maxHp;
      cs.playerKi = G.maxKi;
      combatLog('🫘 SENZU BEAN! Totalmente restaurado!');
      updateCombatUI();
      renderCombatActions();
      return;
    }
    case 'fugir': {
      const escapeChance = G.velocidade / (G.velocidade + cs.enemy.atk * 0.3);
      if (Math.random() < escapeChance) {
        combatLog(`💨 ${G.name} escapou da batalha!`);
        cs.finished = true;
        G.hp = cs.playerHp;
        G.ki = cs.playerKi;
        endCombat(false, true);
      } else {
        combatLog(`❌ Falhou ao escapar!`);
        enemyAttack(cs);
        updateCombatUI();
        renderCombatActions();
        checkCombatEnd();
      }
      return;
    }
  }

  // Apply damage to enemy
  const finalDmg = Math.max(1, playerDmg - Math.floor(cs.enemy.def * 0.34));
  cs.enemy.hp = Math.max(0, cs.enemy.hp - finalDmg);

  if (window.DBZCombatPhaser) {
    if (type === 'fisico') window.DBZCombatPhaser.playerMelee(finalDmg);
    if (type === 'ki') window.DBZCombatPhaser.playerKiBlast(finalDmg);
    if (type === 'kamehameha') window.DBZCombatPhaser.playerSpecial(finalDmg);
  }

  _villainLeechOnHit(finalDmg);

  // Majin HP absorption
  if (G.race === 'majin') {
    const absorb = Math.round(finalDmg * 0.2);
    cs.playerHp = Math.min(G.maxHp, cs.playerHp + absorb);
    combatLog(`💜 Absorção Majin: +${absorb} HP!`);
  }

  updateCombatUI();

  if (cs.enemy.hp <= 0) {
    endCombat(true);
    return;
  }

  // Enemy counter-attack
  if (!cs.enemyStunned) {
    enemyAttack(cs);
  } else {
    cs.enemyStunned = false;
    combatLog(`💫 ${cs.enemy.name} atordoado! Pulou o turno.`);
  }

  updateCombatUI();
  renderCombatActions();
  checkCombatEnd();
}

function enemyAttack(cs) {
  const enemy = cs.enemy;
  const baseDmg = (enemy.atk + rand(-8, 12)) * 1.12;
  let dmg = Math.max(2, Math.round(baseDmg) - Math.floor(G.defesa * 2.1));

  if (cs.playerDefending) {
    dmg = Math.round(dmg * 0.35);
    // Chance to counter
    if (G.cls === 'veloz' && Math.random() < 0.3) {
      const ctr = Math.round(G.velocidade * 3);
      cs.enemy.hp = Math.max(0, cs.enemy.hp - ctr);
      combatLog(`💨 Contra-ataque veloz! ${ctr} de dano devolvido!`);
    }
  }

  // Dodge chance for Veloz
  if (G.cls === 'veloz' && !cs.playerDefending && Math.random() < 0.15) {
    combatLog(`💨 Esquivou do ataque de ${enemy.name}!`);
    return;
  }

  // Teletransporte dodge bonus
  if (G.skills.teletransporte > 0 && Math.random() < G.skills.teletransporte * 0.08) {
    combatLog(`💨 Teletransporte! Esquivou!`);
    return;
  }

  cs.playerHp = Math.max(0, cs.playerHp - dmg);

  const move = enemy.moves[Math.floor(Math.random() * enemy.moves.length)];
  combatLog(`${enemy.icon} ${enemy.name} usa ${move}! ${dmg} de dano.`);
  if (window.DBZCombatPhaser) window.DBZCombatPhaser.enemyAttack(dmg);

  // Flash damage on player avatar
  const canvas = document.getElementById('combat-player-canvas');
  if (canvas) { canvas.classList.add('damaged'); setTimeout(() => canvas.classList.remove('damaged'), 300); }
}

function checkCombatEnd() {
  if (combatState && combatState.playerHp <= 0) {
    endCombat(false);
  }
}

function endCombat(won, fled = false) {
  const cs = combatState;
  if (!cs) return;
  cs.finished = true;

  mutate({ hp: cs.playerHp, ki: cs.playerKi });

  const storyCtx = window.storyCombatContext;

  if (won && storyCtx && storyCtx.mission) {
    window.storyCombatContext = null;
    const m = storyCtx.mission;
    if (!G.storyCompleted.includes(m.id)) G.storyCompleted.push(m.id);
    mutate({ xp: G.xp + m.xpReward, zeni: G.zeni + m.zeniReward, battlesWon: G.battlesWon + 1 });
    const rewardMsg = `📖 Vitória histórica! +${m.xpReward} XP, +${m.zeniReward} Z`;
    combatLog(rewardMsg);
    log('battle', rewardMsg);
    window._pendingStoryChoice = m;
    showNotif('📖 Capítulo vencido!');
  } else if (won) {
    const xpGain = Math.round(cs.enemy.xpReward * G.level * 0.88);
    const zeniGain = Math.round(cs.enemy.zeniReward * G.level * 0.9);
    const saiyajinBonus = (G.race === 'saiyajin' || G.race === 'meio-saiyajin') ? Math.round(xpGain * 0.45) : 0;

    mutate({ xp: G.xp + xpGain + saiyajinBonus, zeni: G.zeni + zeniGain, battlesWon: G.battlesWon + 1 });

    let rewardMsg = `🏆 VITÓRIA! +${xpGain} XP, +${zeniGain} Zeni`;
    if (saiyajinBonus > 0) rewardMsg += `, +${saiyajinBonus} XP (Zenkai!)`;
    combatLog(rewardMsg);
    log('battle', rewardMsg);

    if (Math.random() < 0.08) {
      mutate({ inventory: { ...G.inventory, senzu: G.inventory.senzu + 1 } });
      combatLog('🫘 Senzu Bean encontrada!');
    }

    showNotif(`🏆 +${xpGain + saiyajinBonus} XP!`);
  } else {
    if (storyCtx) window.storyCombatContext = null;
    if (!fled) {
      const fallbackXp = Math.round(cs.enemy.xpReward * G.level * 0.22);
      mutate({ xp: G.xp + fallbackXp, hp: Math.max(1, G.maxHp * 0.05) });
      combatLog(`💀 Derrota... +${fallbackXp} XP pela experiência.`);
      log('battle', `💀 Derrotado por ${cs.enemy.name}. +${fallbackXp} XP.`);

      if ((G.race === 'saiyajin' || G.race === 'meio-saiyajin') && G.skills.zenkai > 0) {
        const bonus = G.skills.zenkai * 3;
        const forcaGain = Math.max(1, Math.round(bonus * 0.1));
        mutate({ forca: G.forca + forcaGain, powerLevel: calcPowerLevel() });
        log('battle', `💥 Zenkai ativado! Poder crescendo após derrota!`);
      }
    }
  }

  checkLevelUp();
  checkMissions();
  checkAchievements();
  updateUI();

  // Show result overlay in combat log
  const acts = document.getElementById('combat-action-buttons');
  if (acts) {
    acts.innerHTML = `
      <button class="btn btn-gold btn-full" onclick="exitCombat()" style="grid-column:1/-1;font-size:13px;padding:10px;">
        ${won ? '🏆 VITÓRIA — CONTINUAR' : '💀 DERROTA — SAIR'}
      </button>`;
  }

  document.getElementById('turn-indicator').textContent = won ? '⚡ VITÓRIA!' : '💀 DERROTA';
  document.getElementById('turn-indicator').style.color = won ? 'var(--green-hp)' : 'var(--red-power)';
}

function exitCombat() {
  const pendingStory = window._pendingStoryChoice;
  if (pendingStory) {
    window._pendingStoryChoice = null;
  }

  combatState = null;
  if (window.DBZCombatPhaser) window.DBZCombatPhaser.unmount();
  document.getElementById('combat-idle').style.display = 'block';
  document.getElementById('combat-arena').style.display = 'none';
  document.getElementById('turn-indicator').textContent = 'Seu Turno';
  document.getElementById('turn-indicator').style.color = '';
  initCombatTab();
  updateUI();

  if (pendingStory && typeof playStoryVictoryCutscene === 'function') {
    playStoryVictoryCutscene(pendingStory.id, () => {
      if (typeof openStoryChoiceModal === 'function') openStoryChoiceModal(pendingStory);
    });
  } else if (pendingStory && typeof openStoryChoiceModal === 'function') {
    openStoryChoiceModal(pendingStory);
  }
}

// ─── COMBAT UI UPDATE ─────────────────────────────────
function updateCombatUI() {
  const cs = combatState;
  if (!cs) return;

  const pHpPct = Math.max(0, cs.playerHp / G.maxHp * 100);
  const eHpPct = Math.max(0, cs.enemy.hp / cs.enemy.maxHp * 100);
  const kPct   = Math.max(0, cs.playerKi / G.maxKi * 100);

  document.getElementById('combat-player-hp-fill').style.width = pHpPct + '%';
  document.getElementById('combat-enemy-hp-fill').style.width  = eHpPct + '%';
  document.getElementById('combat-player-ki-fill').style.width = kPct + '%';

  document.getElementById('combat-player-hp-text').textContent = `${Math.max(0,Math.round(cs.playerHp))}/${G.maxHp}`;
  document.getElementById('combat-enemy-hp-text').textContent  = `${Math.max(0,Math.round(cs.enemy.hp))}/${cs.enemy.maxHp}`;
  document.getElementById('combat-player-ki-text').textContent = `Ki: ${Math.max(0,Math.round(cs.playerKi))}`;

  // HP bar color change
  const pFill = document.getElementById('combat-player-hp-fill');
  if (pHpPct < 20) pFill.style.background = 'var(--red-power)';
  else if (pHpPct < 50) pFill.style.background = '#ffcc00';
  else pFill.style.background = 'var(--green-hp)';
}

function combatLog(msg) {
  const el = document.getElementById('combat-log');
  if (!el) return;
  const p = document.createElement('p');
  p.style.margin = '0';
  p.style.color = msg.includes('💥') || msg.includes('🌊') ? 'var(--gold)'
    : msg.includes('💀') || msg.includes('❌') ? 'var(--red-power)'
    : msg.includes('🏆') || msg.includes('🫘') ? 'var(--green-hp)'
    : msg.includes('🛡️') ? 'var(--blue-ki)'
    : 'var(--text-dim)';
  p.textContent = msg;
  el.appendChild(p);
  el.scrollTop = el.scrollHeight;
}

function getEnemyTaunt(id) {
  const taunts = {
    saibaman: 'Sayonara!!! *BOOM*',
    soldado_freeza: 'Em nome do Senhor Freeza, vou te destruir!',
    guerreiro_z: 'Vamos ver quem é o guerreiro mais forte!',
    ginyu_force: '★ GINYU FORCE — FORMAÇÃO ESPECIAL! ★',
    freeza_f1: '"Essa força de combate... que pena. Ridícula."',
    raditz: 'Kakaroto... você se esconde neste planeta lixo!',
    saibamen_swarm: 'SCRITCH SCRITCH — *explosões*',
    nappa: 'HA! Patéticos insetos!',
    vegeta_saga: 'Eu sou o príncipe de todos os Saiyajins!',
    dodoria: 'Freeza-sama vai adorar seu cadáver!',
    zarbon: 'Não manche meu rosto, verme!',
    ginyu_story: '★ CHEGOU A HORA DA POSE! ★',
    freeza_story: 'Brinque de guerreiro enquanto pode...',
    android19: 'Absorvendo energia... delicioso.',
    android1718: 'Nós não paramos por ninguém.',
    cell_imp: 'Preciso... de mais... poder...',
    cell_perfect: 'Sou a perfeição. O torneio é meu palco.'
  };
  return taunts[id] || 'Preparado para lutar?';
}

function doBattle() {
  switchTab('combate');
  initCombatTab();
}