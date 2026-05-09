// ═══════════════════════════════════════════════════════
// PRESTIGE.JS — Sistema de Prestígio + Saga Majin Boo
// Ao completar toda a história → Prestígio com bônus permanentes
// Prestígio 1+ desbloqueia: Saga Majin, Transformações Vilão, Loja Maldita
// ═══════════════════════════════════════════════════════

// IDs de todas as missões da história principal (Saiyajin → Cell)
const STORY_COMPLETE_MISSIONS = [
  's_raditz','s_saibamen','s_nappa','s_vegeta_saga',
  's_dodoria','s_zarbon','s_ginyu','s_freeza',
  's_android19','s_android1718','s_cell_imperfect','s_cell_perfect'
];

// ─── HERANÇA SAIYAJIN (bônus por prestígio) ─────────────
const PRESTIGE_HERITAGES = [
  {
    rank: 1,
    name: 'Herança Saiyajin',
    icon: '🔥',
    desc: 'O sangue Saiyajin endurece após cada ciclo. Bônus permanentes ao reiniciar.',
    bonuses: { forca: 8, defesa: 4, velocidade: 6, kiAtk: 6, maxHp: 40, maxKi: 20 },
    unlocks: ['saga_majin', 'loja_maldita', 'transform_majin_villain']
  },
  {
    rank: 2,
    name: 'Linhagem de Guerreiro',
    icon: '⚡',
    desc: 'Segunda vez — você conhece o caminho. Atributos extras e XP acelerado.',
    bonuses: { forca: 15, defesa: 8, velocidade: 12, kiAtk: 12, maxHp: 80, maxKi: 40 },
    unlocks: ['saga_majin', 'loja_maldita', 'transform_majin_villain', 'ssj_god']
  },
  {
    rank: 3,
    name: 'Lenda Viva',
    icon: '👑',
    desc: 'Terceiro ciclo — você transcende a mera lenda.',
    bonuses: { forca: 25, defesa: 15, velocidade: 20, kiAtk: 20, maxHp: 150, maxKi: 80 },
    unlocks: ['saga_majin', 'loja_maldita', 'transform_majin_villain', 'ssj_god', 'ultra_instinct']
  }
];

// ─── MISSÕES DA SAGA MAJIN BOO ───────────────────────────
const MAJIN_SAGA_MISSIONS = [
  {
    id: 'sm_babidi',
    saga: 'Saga Majin Boo',
    icon: '🧙',
    title: 'Babidi, o Feiticeiro',
    desc: 'Um pequeno mago com poder de corromper almas — e ressuscitar um terror antigo.',
    minLevel: 18,
    stamCost: 25,
    xpReward: 200,
    zeniReward: 600,
    prestigeRequired: 1,
    enemy: {
      id: 'babidi',
      name: 'Babidi',
      icon: '🧙',
      baseHp: 380, baseAtk: 55, baseDef: 28,
      xpReward: 0, zeniReward: 0,
      moves: ['Magia Proibida', 'Controle Mental', 'Escudo Mágico'],
      storyScale: 1.3
    },
    choiceGood: {
      label: 'Bem: destruir o grimório de Babidi',
      blurb: 'A magia negra é erradicada desta dimensão.',
      good: 3, discountAdd: 0.03
    },
    choiceEvil: {
      label: 'Mal: usar a magia de Babidi como arma',
      blurb: 'A marca Majin potencializa seus golpes sombrios.',
      evil: 4, unlockVillain: 'majin_control'
    }
  },
  {
    id: 'sm_dabura',
    saga: 'Saga Majin Boo',
    icon: '😈',
    title: 'Dabura, Rei do Inferno',
    desc: 'O general mais poderoso de Babidi. Possui Ki místico e olhar de pedra.',
    minLevel: 20,
    stamCost: 28,
    xpReward: 240,
    zeniReward: 800,
    prestigeRequired: 1,
    enemy: {
      id: 'dabura',
      name: 'Dabura',
      icon: '😈',
      baseHp: 520, baseAtk: 72, baseDef: 38,
      xpReward: 0, zeniReward: 0,
      moves: ['Olhar de Pedra', 'Lança do Inferno', 'Cospe Ácido'],
      storyScale: 1.35
    },
    choiceGood: {
      label: 'Bem: libertar Dabura da influência de Babidi',
      blurb: 'Sua compaixão fortalece o Ki da luz.',
      good: 3, discountAdd: 0.025
    },
    choiceEvil: {
      label: 'Mal: absorver o Ki do inferno de Dabura',
      blurb: 'Fúria sombria eleva suas transformações malditas.',
      evil: 4, unlockVillain: 'hellfire_ki'
    }
  },
  {
    id: 'sm_fatboo',
    saga: 'Saga Majin Boo',
    icon: '🍬',
    title: 'Majin Boo Gordo',
    desc: 'Um ser de pura destruição infantil. Inocente... e absolutamente aterrorizante.',
    minLevel: 22,
    stamCost: 30,
    xpReward: 280,
    zeniReward: 1000,
    prestigeRequired: 1,
    enemy: {
      id: 'fat_boo',
      name: 'Majin Boo (Gordo)',
      icon: '🍬',
      baseHp: 700, baseAtk: 88, baseDef: 45,
      xpReward: 0, zeniReward: 0,
      moves: ['Remodelação', 'Canhão de Boo', 'Regeneração Imediata'],
      storyScale: 1.4
    },
    choiceGood: {
      label: 'Bem: tentar purificar Boo com bondade',
      blurb: 'A bondade é uma arma que Boo não entende.',
      good: 4, discountAdd: 0.04
    },
    choiceEvil: {
      label: 'Mal: provocar a ira de Boo intencionalmente',
      blurb: 'Canalizando o caos puro como combustível.',
      evil: 5, unlockVillain: 'chaos_energy'
    }
  },
  {
    id: 'sm_evilboo',
    saga: 'Saga Majin Boo',
    icon: '👿',
    title: 'Boo do Mal — Forma Pura',
    desc: 'O bem foi expelido. O que resta é pura brutalidade sem limites.',
    minLevel: 25,
    stamCost: 35,
    xpReward: 380,
    zeniReward: 1500,
    prestigeRequired: 1,
    enemy: {
      id: 'evil_boo',
      name: 'Boo Puro',
      icon: '👿',
      baseHp: 1100, baseAtk: 115, baseDef: 60,
      xpReward: 0, zeniReward: 0,
      moves: ['Explosão de Ki Sombrio', 'Absorção Total', 'Transformação Final'],
      storyScale: 1.5
    },
    choiceGood: {
      label: 'Bem: unir forças com o universo inteiro',
      blurb: 'O Espírito Bomba de toda a Terra concentrado em suas mãos.',
      good: 5, discountAdd: 0.05
    },
    choiceEvil: {
      label: 'Mal: absorver o poder de Boo para si',
      blurb: 'Você toca o abismo — e ele te sorri de volta.',
      evil: 6, unlockVillain: 'boo_absorption'
    }
  }
];

// ─── FUNÇÕES PRINCIPAIS ──────────────────────────────────

function isStoryComplete() {
  return STORY_COMPLETE_MISSIONS.every(id => G.storyCompleted.includes(id));
}

function canPrestige() {
  return isStoryComplete();
}

function getPrestigeRank() {
  return G.prestigeRank || 0;
}

function hasMajinSagaUnlocked() {
  return (G.prestigeRank || 0) >= 1;
}

function openPrestigeModal() {
  if (!canPrestige()) {
    log('warn', '⚠️ Complete toda a história principal (até Cell Perfeito) para prestigiar.');
    showNotif('⚠️ Conclua a história!');
    return;
  }
  const modal = document.getElementById('prestige-modal');
  if (!modal) return;
  renderPrestigeModal();
  modal.classList.add('show');
}

function closePrestigeModal() {
  const modal = document.getElementById('prestige-modal');
  if (modal) modal.classList.remove('show');
}

function renderPrestigeModal() {
  const content = document.getElementById('prestige-content');
  if (!content) return;

  const rank = getPrestigeRank();
  const nextRank = rank + 1;
  const heritage = PRESTIGE_HERITAGES[Math.min(nextRank - 1, PRESTIGE_HERITAGES.length - 1)];
  const maxed = rank >= PRESTIGE_HERITAGES.length;

  if (maxed) {
    content.innerHTML = `
      <div class="prestige-maxed">
        <div class="prestige-crown">👑</div>
        <h2>LENDA MÁXIMA</h2>
        <p>Você atingiu o ápice do prestígio. Sua lenda está gravada no universo.</p>
        <div class="prestige-rank-badge">Prestígio ${rank} — ${PRESTIGE_HERITAGES[rank-1]?.name || 'Lenda'}</div>
      </div>`;
    return;
  }

  const bonusList = Object.entries(heritage.bonuses)
    .map(([k, v]) => `<span class="prestige-bonus-item">+${v} ${STAT_LABELS_PT[k] || k}</span>`)
    .join('');

  const unlockList = heritage.unlocks.map(u => {
    const labels = {
      saga_majin: '🍬 Saga Majin Boo desbloqueada',
      loja_maldita: '🏴‍☠️ Loja Maldita desbloqueada',
      transform_majin_villain: '😈 Transformações vilão Majin',
      ssj_god: '🔴 Super Saiyajin Deus (loja)',
      ultra_instinct: '⚪ Instinto Superior (loja)'
    };
    return `<li>${labels[u] || u}</li>`;
  }).join('');

  content.innerHTML = `
    <div class="prestige-warning">
      ⚠️ O prestígio <strong>reinicia seu personagem</strong> (nível, atributos, recursos) mas mantém conquistas, itens especiais e o nome.
    </div>
    <div class="prestige-rank-display">
      <span class="prestige-rank-current">Prestígio Atual: ${rank}</span>
      <span class="prestige-rank-arrow">→</span>
      <span class="prestige-rank-next">${heritage.icon} Prestígio ${nextRank}: ${heritage.name}</span>
    </div>
    <div class="prestige-section">
      <h3>Bônus Permanentes</h3>
      <div class="prestige-bonuses">${bonusList}</div>
    </div>
    <div class="prestige-section">
      <h3>Desbloqueios Permanentes</h3>
      <ul class="prestige-unlocks">${unlockList}</ul>
    </div>
    <button class="btn btn-gold btn-full prestige-confirm-btn" onclick="doPrestige()">
      ${heritage.icon} PRESTIGIAR — Renascer como ${heritage.name}
    </button>`;
}

const STAT_LABELS_PT = {
  forca: 'Força', defesa: 'Defesa', velocidade: 'Velocidade',
  kiAtk: 'Ki Atk', maxHp: 'HP Máx', maxKi: 'Ki Máx'
};

function doPrestige() {
  if (!canPrestige()) return;
  if (!confirm('CONFIRMAÇÃO FINAL: Reiniciar o personagem para o Prestígio? Bônus permanentes serão aplicados ao novo início.')) return;

  const currentRank = getPrestigeRank();
  const newRank = currentRank + 1;
  const heritage = PRESTIGE_HERITAGES[Math.min(newRank - 1, PRESTIGE_HERITAGES.length - 1)];

  // Guardar dados permanentes
  const savedName = G.name;
  const savedRace = G.race;
  const savedCls = G.cls;
  const savedCustomization = { ...G.customization };
  const savedAchievements = { ...G.achievements };
  const savedInventory = { senzu: Math.floor((G.inventory.senzu || 0) * 0.3), esferas: G.inventory.esferas };
  const savedMasterTechs = G.masterTraining ? [...(G.masterTraining.unlockedTechs || [])] : [];
  const savedSlot = G._activeSlot;

  // Reiniciar
  G = createInitialState();
  G.name = savedName;
  G.race = savedRace;
  G.cls = savedCls;
  G.customization = savedCustomization;
  G.achievements = savedAchievements;
  G.inventory = { ...G.inventory, ...savedInventory };
  G.masterTraining = { masterId: null, consecutiveDays: 0, unlockedTechs: savedMasterTechs, lastDay: 0 };
  G._activeSlot = savedSlot;

  // Aplicar bônus de herança
  Object.entries(heritage.bonuses).forEach(([k, v]) => {
    if (k === 'maxHp') G.maxHp += v;
    else if (k === 'maxKi') G.maxKi += v;
    else G[k] = (G[k] || 0) + v;
  });

  // Aplicar desbloqueios raça
  const raceData = RACES[G.race];
  if (raceData) {
    const rb = raceData.bonuses || {};
    Object.keys(rb).forEach(k => {
      if (k === 'maxHp') G.maxHp += rb[k];
      else if (k === 'maxKi') G.maxKi += rb[k];
      else G[k] = (G[k] || 0) + rb[k];
    });
  }

  // Aplicar bônus de classe
  const clsData = CLASSES[G.cls];
  if (clsData) {
    const cb = clsData.bonuses || {};
    Object.keys(cb).forEach(k => {
      if (k === 'maxKi') G.maxKi += cb[k];
      else G[k] = (G[k] || 0) + cb[k];
    });
  }

  G.hp = G.maxHp;
  G.ki = G.maxKi;
  G.stamina = G.maxStamina;

  // Setar prestígio
  G.prestigeRank = newRank;
  G.prestigeHeritage = heritage.name;
  G.prestigeUnlocks = heritage.unlocks;
  G.powerLevel = calcPowerLevel();

  closePrestigeModal();
  log('event', `🔥 PRESTÍGIO ${newRank}! ${heritage.name} ativado. Renasceu mais forte!`);
  showNotif(`🔥 PRESTÍGIO ${newRank}!`);

  saveGame(true);
  initGame();
  updateUI();
}

// ─── RENDER SAGA MAJIN NA TAB HISTÓRIA ─────────────────
// Chamado por renderStoryTab() em story.js via hook

function getMajinSagaMissions() {
  return MAJIN_SAGA_MISSIONS;
}

// ─── MODAL HTML INJECTION ──────────────────────────────
(function injectPrestigeModal() {
  if (document.getElementById('prestige-modal')) return;
  const modal = document.createElement('div');
  modal.id = 'prestige-modal';
  modal.className = 'modal-overlay';
  modal.innerHTML = `
    <div class="modal-box prestige-modal-box">
      <div class="modal-header">
        <span>🔥 SISTEMA DE PRESTÍGIO</span>
        <button class="btn btn-ghost btn-sm" onclick="closePrestigeModal()">✕</button>
      </div>
      <div id="prestige-content" style="padding:16px;overflow-y:auto;max-height:70vh"></div>
    </div>`;
  document.body.appendChild(modal);
})();