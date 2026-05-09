// ═══════════════════════════════════════════════════════
// ENGINE.JS — State, Events, Progression, Pixel Art
// DBZ Life RPG V3
// ═══════════════════════════════════════════════════════

const SAVE_VERSION = '3.2.0';
const SAVE_SLOT_PREFIX = 'dbz_save_slot_';
const NUM_SAVE_SLOTS = 3;

// ─── MUTATE — centraliza mutações de G ────────────────
// Uso: mutate({ hp: G.hp - dmg, ki: G.ki - cost })
// Emite 'state:change' para reações futuras (autosave, UI reativa).
function mutate(patch) {
  Object.assign(G, patch);
  EventBus.emit('state:change', patch);
}

// ─── INITIAL STATE FACTORY ────────────────────────────
function createInitialState() {
  return {
    version: SAVE_VERSION,
    // Identity
    name: '',
    race: 'saiyajin',
    cls: 'guerreiro',
    // Progression
    level: 1,
    xp: 0,
    xpNext: 100,
    attrPts: 0,
    // Resources
    hp: 100, maxHp: 100,
    ki: 50,  maxKi: 50,
    stamina: 80, maxStamina: 80,
    zeni: 0,
    // Attributes
    forca: 10,
    defesa: 8,
    velocidade: 10,
    kiAtk: 8,
    // State
    transform: 'normal',
    powerLevel: 1,
    // World
    day: 1,
    arc: 'Início da Jornada',
    currentLocation: 'Terra — Kame House',
    // Tracking
    battlesWon: 0,
    daysTraining: 0,
    torneiosVencidos: 0,
    dungeonClears: 0,
    overtrainStreak: 0,   // consecutive intense trains
    totalDays: 1,
    // Collections
    skills: { kamehameha: 0, barreira: 0, teletransporte: 0, zenkai: 0, especial: 0 },
    inventory: { senzu: 1, esferas: 0 },
    missions: {},
    achievements: {},
    bossDefeated: { vegeta: false },
    storyCompleted: [],
    storyChoices: {},
    alignmentGood: 0,
    alignmentEvil: 0,
    shopHeroDiscount: 0,
    shopVillainAccess: [],
    skillsVillain: {
      death_beam: 0, galick_gun: 0, big_bang: 0, crusher_ball: 0,
      energy_drain: 0, absorption_dark: 0
    },
    // Customization
    customization: {
      suitColor: null,       // override cor do traje
      hairColor: null,       // override cor do cabelo
      skinColor: null,       // override cor da pele
      title: '',             // título do personagem
      motto: '',             // frase/lema
      emblem: '⚡',          // emblema do personagem
      auraStyle: 'default'   // estilo da aura
    },
    // Unlocked transforms (purchased)
    unlockedTransforms: [],
    // Status effects (transient, not saved)
    statusEffects: [],

    // Mestres
    masterTraining: { masterId: null, consecutiveDays: 0, unlockedTechs: [], lastDay: 0 },

    // Prestígio
    prestigeRank: 0,
    prestigeHeritage: '',
    prestigeUnlocks: [],
  };
}

// ─── GLOBAL STATE ─────────────────────────────────────
let G = createInitialState();

// ─── EVENT BUS ────────────────────────────────────────
const EventBus = {
  _listeners: {},
  on(event, fn) {
    if (!this._listeners[event]) this._listeners[event] = [];
    this._listeners[event].push(fn);
  },
  emit(event, data) {
    (this._listeners[event] || []).forEach(fn => fn(data));
  }
};

// ─── RACE CONFIGS ─────────────────────────────────────
const RACES = {
  saiyajin: {
    label: 'Saiyajin',
    bonuses: { forca: 5, maxHp: 20 },
    passive: 'Zenkai: +XP após derrotas em batalha. +50% XP de batalha.',
    transforms: ['normal', 'ssj', 'ssj2', 'oozaru', 'dark_ssj', 'majin_ssj2', 'majinized'],
    specialStat: 'forca'
  },
  'meio-saiyajin': {
    label: 'Meio-Saiyajin',
    bonuses: { kiAtk: 6, maxKi: 20, forca: 3 },
    passive: 'SSJ2 mais fácil. Ki natural elevado.',
    transforms: ['normal', 'ssj', 'ssj2', 'dark_ssj', 'majin_ssj2', 'majinized'],
    specialStat: 'kiAtk'
  },
  namekusei: {
    label: 'Namekusei',
    bonuses: { defesa: 5, maxKi: 20 },
    passive: 'Regeneração: HP restaura 45% ao descansar. Fusão especial.',
    transforms: ['normal', 'namefusion', 'dark_namek', 'majinized'],
    specialStat: 'defesa'
  },
  humano: {
    label: 'Humano',
    bonuses: { kiAtk: 5, maxKi: 10 },
    passive: 'Adaptação: +30% Ki natural. Aprende habilidades mais rápido.',
    transforms: ['normal', 'majinized'],
    specialStat: 'kiAtk'
  },
  androide: {
    label: 'Androide',
    bonuses: { forca: 3, velocidade: 5 },
    passive: 'Núcleo Energético: Sem custo de Ki em combate. Alta velocidade.',
    transforms: ['normal', 'majin_android'],
    specialStat: 'velocidade'
  },
  majin: {
    label: 'Majin',
    bonuses: { maxHp: 30, defesa: 3 },
    passive: 'Absorção: Recupera 20% do dano causado como HP. Boost de fúria.',
    transforms: ['normal', 'ssj', 'majinized'],
    specialStat: 'defesa'
  }
};

const CLASSES = {
  guerreiro:  { label: 'Guerreiro',   bonuses: { forca: 5, defesa: 3 },      passive: '+30% dano físico' },
  'ki-mestre':{ label: 'Ki Mestre',   bonuses: { kiAtk: 8, maxKi: 30 },      passive: '+40% dano de Ki' },
  veloz:      { label: 'Veloz',       bonuses: { velocidade: 8, defesa: 2 },  passive: '15% chance de esquiva' }
};

// ─── HELPERS ──────────────────────────────────────────
function rand(a, b) { return Math.floor(Math.random() * (b - a + 1)) + a; }
function clamp(v, min, max) { return Math.max(min, Math.min(max, v)); }
function raceLabel(r) { return RACES[r]?.label || r; }
function classLabel(c) { return CLASSES[c]?.label || c; }

function calcPowerLevel() {
  const base = (G.forca + G.defesa + G.velocidade + G.kiAtk) * 10 * G.level;
  const mult = {
    normal: 1, ssj: 50, ssj2: 100, oozaru: 10, namefusion: 5,
    majinized: 10, dark_ssj: 60, majin_ssj2: 120, dark_namek: 7, majin_android: 6
  }[G.transform] || 1;
  return Math.round(base * mult);
}

// ─── CHARACTER CREATION ───────────────────────────────
let selectedRace = 'saiyajin';
let selectedClass = 'guerreiro';

function selectRace(el) {
  document.querySelectorAll('.race-card').forEach(c => c.classList.remove('selected'));
  el.classList.add('selected');
  selectedRace = el.getAttribute('data-race') || 'saiyajin';
}

function selectClass(el) {
  document.querySelectorAll('.class-card').forEach(c => c.classList.remove('selected'));
  el.classList.add('selected');
  selectedClass = el.getAttribute('data-class') || 'guerreiro';
}

function createCharacter() {
  const name = document.getElementById('char-name-input').value.trim();
  if (!name) { alert('Digite um nome para seu guerreiro!'); return; }

  G = createInitialState();
  G.name = name;
  G.race = selectedRace;
  G.cls = selectedClass;

  // ── Lê personalização inicial da tela de criação ──
  const suitSw  = document.querySelector('#creation-suit-swatches .cr-swatch.selected');
  const hairSw  = document.querySelector('#creation-hair-swatches .cr-swatch.selected');
  const emblemEl = document.querySelector('#creation-emblems .cr-emblem.selected');
  const mottoEl  = document.getElementById('creation-motto-input');
  const titleEl  = document.getElementById('creation-title-select');

  G.customization.suitColor  = (suitSw  && suitSw.dataset.val)   || null;
  G.customization.hairColor  = (hairSw  && hairSw.dataset.val)   || null;
  G.customization.emblem     = (emblemEl && emblemEl.dataset.val) || '⚡';
  G.customization.motto      = mottoEl  ? mottoEl.value.trim()   : '';
  G.customization.title      = titleEl  ? titleEl.value          : '';

  // ── Apply race bonuses ──
  const rb = RACES[G.race]?.bonuses || {};
  Object.keys(rb).forEach(k => {
    if (k === 'maxHp') G.maxHp += rb[k];
    else if (k === 'maxKi') G.maxKi += rb[k];
    else G[k] += rb[k];
  });

  // ── Apply class bonuses ──
  const cb = CLASSES[G.cls]?.bonuses || {};
  Object.keys(cb).forEach(k => {
    if (k === 'maxKi') G.maxKi += cb[k];
    else G[k] += cb[k];
  });

  // ── Bônus inicial de desenvolvimento por raça + classe ──
  // Cada combinação dá um kit de começo temático
  const devKits = {
    saiyajin_guerreiro:   { forca: 3, defesa: 1 },
    saiyajin_veloz:       { forca: 2, velocidade: 2 },
    saiyajin_kiMestre:    { forca: 2, kiAtk: 2 },
    'meio-saiyajin_guerreiro':{ kiAtk: 2, forca: 2 },
    'meio-saiyajin_veloz':    { kiAtk: 2, velocidade: 2 },
    'meio-saiyajin_kiMestre': { kiAtk: 4 },
    namekusei_guerreiro:  { defesa: 3, forca: 1 },
    namekusei_veloz:      { defesa: 2, velocidade: 2 },
    namekusei_kiMestre:   { defesa: 2, kiAtk: 2 },
    humano_guerreiro:     { forca: 2, kiAtk: 2 },
    humano_veloz:         { velocidade: 3, kiAtk: 1 },
    humano_kiMestre:      { kiAtk: 4 },
    androide_guerreiro:   { forca: 2, velocidade: 2 },
    androide_veloz:       { velocidade: 4 },
    androide_kiMestre:    { velocidade: 2, kiAtk: 2 },
    majin_guerreiro:      { defesa: 2, forca: 2 },
    majin_veloz:          { defesa: 2, velocidade: 2 },
    majin_kiMestre:       { defesa: 2, kiAtk: 2 }
  };
  const devKey = `${G.race}_${G.cls.replace('-', '')}`;
  const kit = devKits[devKey] || {};
  Object.keys(kit).forEach(stat => { G[stat] = (G[stat] || 0) + kit[stat]; });

  G.hp = G.maxHp;
  G.ki = G.maxKi;
  G.stamina = G.maxStamina;
  G.powerLevel = calcPowerLevel();
  G._activeSlot = 0;   // novo personagem vai pro slot 0 por padrão

  document.getElementById('creation-screen').style.display = 'none';
  document.getElementById('game-screen').style.display = 'block';
  initGame();
}

// ─── LEVEL UP ─────────────────────────────────────────
function checkLevelUp() {
  let leveled = false;
  while (G.xp >= G.xpNext) {
    G.xp -= G.xpNext;
    G.level++;
    G.xpNext = Math.round(G.xpNext * 1.28);
    G.attrPts += 3; // 3 pontos por nível (era 2)

    const hpGain = 12 + Math.floor(G.level * 1.25);
    const kiGain = 6 + Math.floor(G.level * 0.65);
    const stGain = 3;
    G.maxHp += hpGain;
    G.maxKi += kiGain;
    G.maxStamina += stGain;
    G.hp = G.maxHp;
    G.ki = G.maxKi;
    G.stamina = G.maxStamina;

    // ── Crescimento automático temático por raça + classe ──
    // Cada level, o guerreiro cresce no stat principal da sua combinação
    const raceGrowth = {
      saiyajin: 'forca', 'meio-saiyajin': 'kiAtk',
      namekusei: 'defesa', humano: 'kiAtk',
      androide: 'velocidade', majin: 'defesa'
    };
    const clsGrowth = { guerreiro: 'forca', 'ki-mestre': 'kiAtk', veloz: 'velocidade' };
    const raceStat = raceGrowth[G.race] || 'forca';
    const clsStat  = clsGrowth[G.cls]  || 'forca';

    // stat da raça cresce a cada 2 níveis, stat da classe a cada 3 níveis
    if (G.level % 2 === 0) G[raceStat] = (G[raceStat] || 0) + 1;
    if (G.level % 3 === 0) G[clsStat]  = (G[clsStat]  || 0) + 1;

    G.powerLevel = calcPowerLevel();
    leveled = true;

    showLevelUpModal(G.level, hpGain, kiGain);
    EventBus.emit('level:up', { level: G.level });

    if (Math.random() < 0.4) {
      setTimeout(() => triggerRandomEvent(), 600);
    }
  }
  return leveled;
}

function upgradeAttr(attr) {
  if (G.attrPts <= 0) { log('warn', '⚠️ Sem pontos de atributo!'); return; }
  G.attrPts--;
  const labels = { forca: '💪 Força', defesa: '🛡️ Defesa', velocidade: '💨 Velocidade', ki: '✨ Ki Atk' };
  const field = attr === 'ki' ? 'kiAtk' : attr;
  G[field] += 2;
  G.powerLevel = calcPowerLevel();
  log('gain', `${labels[attr] || attr} +2 — Nível de Poder: ${G.powerLevel.toLocaleString()}`);
  updateUI();
}

// ─── ARC SYSTEM ───────────────────────────────────────
function updateArc() {
  const arcs = [
    [0, 'Início da Jornada'],
    [3, 'Saga Saiyajin'],
    [7, 'Saga de Namek'],
    [12, 'Saga de Cell'],
    [18, 'Saga de Majin Boo'],
    [25, 'Saga de Super'],
    [35, 'Além dos Deuses']
  ];
  for (let i = arcs.length - 1; i >= 0; i--) {
    if (G.level >= arcs[i][0]) { G.arc = arcs[i][1]; break; }
  }
  const el = document.getElementById('arc-display');
  if (el) el.textContent = G.arc;
}

// ─── TRANSFORM SYSTEM ─────────────────────────────────
const TRANSFORM_CONFIG = {
  ssj: {
    reqLevel: 5, kiCost: 30, label: 'SUPER SAIYAJIN', aura: 'aura-ssj',
    races: ['saiyajin', 'meio-saiyajin', 'majin'],
    minStats: { forca: 22, kiAtk: 18, velocidade: 16 },
    minStatsOverride: { majin: { forca: 20, kiAtk: 20, defesa: 16 } }
  },
  ssj2: {
    reqLevel: 12, kiCost: 50, label: 'SUPER SAIYAJIN 2', aura: 'aura-ssj2',
    races: ['saiyajin', 'meio-saiyajin'],
    levelOverride: { 'meio-saiyajin': 9 },
    minStats: { forca: 42, kiAtk: 36, velocidade: 30, defesa: 24 },
    minStatsOverride: { 'meio-saiyajin': { forca: 38, kiAtk: 38, velocidade: 28, defesa: 22 } }
  },
  ssj3: {
    reqLevel: 99, kiCost: 999, label: 'REMOVIDO', aura: 'aura-ssj3',
    races: [],
    minStats: { forca: 999 }
  },
  oozaru: {
    reqLevel: 6, kiCost: 40, label: 'GREAT APE', aura: 'aura-oozaru',
    races: ['saiyajin'],
    minStats: { forca: 32, defesa: 18, velocidade: 20 }
  },
  namefusion: {
    reqLevel: 8, kiCost: 60, label: 'NAMEK FUSÃO', aura: 'aura-namefusion',
    races: ['namekusei'],
    minStats: { kiAtk: 38, defesa: 32, forca: 22 }
  },
  // ── Transformações Vilão (Loja Maldita — Prestígio 1+) ──
  majinized: {
    reqLevel: 10, kiCost: 35, label: 'MAJINIZADO', aura: 'aura-majinized',
    races: ['saiyajin','meio-saiyajin','namekusei','humano','androide','majin'],
    minStats: { forca: 30, kiAtk: 28 }
  },
  dark_ssj: {
    reqLevel: 14, kiCost: 55, label: 'SSJ SOMBRIO', aura: 'aura-dark-ssj',
    races: ['saiyajin', 'meio-saiyajin'],
    minStats: { forca: 50, kiAtk: 42, velocidade: 35 }
  },
  majin_ssj2: {
    reqLevel: 18, kiCost: 70, label: 'SSJ2 MAJIN', aura: 'aura-majin-ssj2',
    races: ['saiyajin', 'meio-saiyajin'],
    minStats: { forca: 65, kiAtk: 58, velocidade: 45, defesa: 38 }
  },
  dark_namek: {
    reqLevel: 12, kiCost: 50, label: 'NAMEK CORROMPIDO', aura: 'aura-dark-namek',
    races: ['namekusei'],
    minStats: { kiAtk: 42, defesa: 36, forca: 28 }
  },
  majin_android: {
    reqLevel: 12, kiCost: 0, label: 'NÚCLEO CORROMPIDO', aura: 'aura-majin-android',
    races: ['androide'],
    minStats: { forca: 38, velocidade: 40, defesa: 30 }
  }
};

const TRANSFORM_STAT_LABELS = { forca: 'FOR', defesa: 'DEF', velocidade: 'VEL', kiAtk: 'KI' };

function getTransformMinStats(transformKey) {
  const cfg = TRANSFORM_CONFIG[transformKey];
  if (!cfg || !cfg.minStats) return {};
  const base = { ...cfg.minStats };
  const ov = cfg.minStatsOverride && cfg.minStatsOverride[G.race];
  if (ov) Object.assign(base, ov);
  return base;
}

function getTransformStatBlockers(transformKey) {
  const need = getTransformMinStats(transformKey);
  const out = [];
  Object.keys(need).forEach(stat => {
    const v = need[stat];
    const have = G[stat] || 0;
    if (have < v) out.push({ stat, need: v, have });
  });
  return out;
}

function refreshTransformReqHints() {
  const el = document.getElementById('transform-reqs');
  if (!el) return;
  if (!G.name) {
    el.innerHTML = '';
    return;
  }
  if (G.race === 'androide') {
    el.innerHTML = '<span class="transform-reqs-muted">Androides não transformam.</span>';
    return;
  }
  const next = getNextTransform();
  if (next === 'normal') {
    el.innerHTML = '<span class="transform-reqs-muted">Próximo: REVERTER à forma base (sem requisitos).</span>';
    return;
  }
  const cfg = TRANSFORM_CONFIG[next];
  if (!cfg) {
    el.innerHTML = '';
    return;
  }
  const reqLv = (cfg.levelOverride && cfg.levelOverride[G.race]) || cfg.reqLevel;
  const needStats = getTransformMinStats(next);
  const lvOk = G.level >= reqLv;
  const kiLine = `Na ativação: <strong>−${cfg.kiCost}</strong> Ki`;
  const parts = [];
  parts.push(`<span class="${lvOk ? 'req-ok' : 'req-bad'}">Nv ≥ ${reqLv} ${lvOk ? '✓' : '(atual ' + G.level + ')'}</span>`);
  Object.keys(needStats).forEach(st => {
    const need = needStats[st];
    const have = G[st] || 0;
    const ok = have >= need;
    const lab = TRANSFORM_STAT_LABELS[st] || st;
    parts.push(`<span class="${ok ? 'req-ok' : 'req-bad'}">${lab} ≥ ${need} ${ok ? '✓' : '(' + have + ')'}</span>`);
  });
  parts.push(`<span class="transform-reqs-muted">${kiLine} · Inspiração: DB Rage / Block C</span>`);
  el.innerHTML = parts.join(' · ');
}

function getTransformOrder() {
  return RACES[G.race]?.transforms || ['normal'];
}

function getNextTransform() {
  const order = getTransformOrder();
  const idx = order.indexOf(G.transform);
  return idx < order.length - 1 ? order[idx + 1] : 'normal';
}

function doTransform() {
  const hasVillainAndroid = (G.unlockedTransforms || []).includes('majin_android');
  if (G.race === 'androide' && !hasVillainAndroid) {
    log('info', '🤖 Androides não se transformam sem modificação especial.');
    return;
  }

  const allForms = RACES[G.race]?.transforms || ['normal'];
  const available = allForms.filter(f => f !== 'normal');
  if (available.length === 0) {
    log('info', 'Nenhuma transformação disponível para sua raça.');
    return;
  }
  _openTransformModal(available);
}

function _openTransformModal(available) {
  const existing = document.getElementById('transform-select-modal');
  if (existing) existing.remove();

  const LABELS = {
    ssj: '⚡ Super Saiyajin', ssj2: '⚡⚡ Super Saiyajin 2',
    oozaru: '🦍 Oozaru (Great Ape)', namefusion: '🟢 Fusão Namekusei',
    majinized: '😈 Majinizado', dark_ssj: '🖤⚡ SSJ Sombrio',
    majin_ssj2: '😈⚡ SSJ2 Majin', dark_namek: '🟣 Namek Corrompido',
    majin_android: '🖤🤖 Núcleo Corrompido'
  };
  const VILLAIN_FORMS = new Set(['majinized','dark_ssj','majin_ssj2','dark_namek','majin_android']);

  const isOwned = (f) => (G.unlockedTransforms || []).includes(f);
  const c = (f) => TRANSFORM_CONFIG[f];

  let rows = '';

  if (G.transform !== 'normal') {
    rows += `<button class="tf-modal-row tf-revert" onclick="_selectTransform('normal')">
      🌙 <span>Forma Base — Reverter</span>
      <span class="tf-modal-status tf-active">ATIVO ✓</span>
    </button>`;
  }

  available.forEach(f => {
    const cfg = c(f);
    if (!cfg) return;
    const owned    = isOwned(f);
    const active   = G.transform === f;
    const reqLv    = (cfg.levelOverride && cfg.levelOverride[G.race]) || cfg.reqLevel;
    const lvOk     = G.level >= reqLv;
    const statBlk  = getTransformStatBlockers(f);
    const kiCost   = cfg.kiCost || 0;
    const kiOk     = G.race === 'androide' || G.ki >= kiCost;
    const villain  = VILLAIN_FORMS.has(f);

    let status = '', disabled = '';
    if (active) {
      status = '<span class="tf-modal-status tf-active">ATIVO ✓</span>';
    } else if (!owned) {
      status = '<span class="tf-modal-status tf-locked">🔒 Compre na Loja</span>';
      disabled = 'disabled';
    } else if (!lvOk) {
      status = `<span class="tf-modal-status tf-locked">Nv.${reqLv} necessário</span>`;
      disabled = 'disabled';
    } else if (statBlk.length) {
      const txt = statBlk.map(b => `${TRANSFORM_STAT_LABELS[b.stat] || b.stat} ${b.have}/${b.need}`).join(' ');
      status = `<span class="tf-modal-status tf-locked">📊 ${txt}</span>`;
      disabled = 'disabled';
    } else if (!kiOk) {
      status = `<span class="tf-modal-status tf-locked">⚡ −${kiCost} Ki</span>`;
      disabled = 'disabled';
    } else {
      status = kiCost > 0
        ? `<span class="tf-modal-status tf-ready">⚡ −${kiCost} Ki</span>`
        : `<span class="tf-modal-status tf-ready">Ativar</span>`;
    }

    rows += `<button class="tf-modal-row ${villain ? 'tf-villain' : ''} ${active ? 'tf-row-active' : ''}"
      ${disabled} onclick="_selectTransform('${f}')">
      <span class="tf-modal-name">${LABELS[f] || f.toUpperCase()}</span>
      ${status}
    </button>`;
  });

  const modal = document.createElement('div');
  modal.id = 'transform-select-modal';
  modal.className = 'modal-overlay';
  modal.innerHTML = `
    <div class="modal-box" style="max-width:380px">
      <div class="modal-header">
        <span>⚡ Escolher Transformação</span>
        <button class="btn btn-ghost btn-sm" onclick="document.getElementById('transform-select-modal').remove()">✕</button>
      </div>
      <div style="padding:12px 16px;display:flex;flex-direction:column;gap:8px">${rows}</div>
    </div>`;
  modal.addEventListener('click', (e) => { if (e.target === modal) modal.remove(); });
  document.body.appendChild(modal);
  requestAnimationFrame(() => modal.classList.add('show'));
}

function _selectTransform(form) {
  const modal = document.getElementById('transform-select-modal');
  if (modal) modal.remove();

  if (form === 'normal') {
    G.transform = 'normal';
    log('ki', '🌙 Voltando à forma base.');
    _applyTransformVisuals();
    return;
  }

  const cfg = TRANSFORM_CONFIG[form];
  if (!cfg) return;

  if (!(G.unlockedTransforms || []).includes(form)) {
    log('warn', `🔒 ${cfg.label} não desbloqueada! Compre na Loja.`);
    showNotif('🔒 Compre na Loja!');
    return;
  }

  const reqLevel = (cfg.levelOverride && cfg.levelOverride[G.race]) || cfg.reqLevel;
  if (G.level < reqLevel) {
    log('warn', `⚠️ ${cfg.label} requer Nível ${reqLevel}.`);
    showNotif(`Nível ${reqLevel} necessário`);
    return;
  }

  const statBlock = getTransformStatBlockers(form);
  if (statBlock.length) {
    const txt = statBlock.map(b => `${TRANSFORM_STAT_LABELS[b.stat] || b.stat} ${b.have}/${b.need}`).join(', ');
    log('warn', `⚠️ ${cfg.label}: stats insuficientes. Falta: ${txt}.`);
    showNotif('Stats insuficientes');
    return;
  }

  const kiCost = cfg.kiCost || 0;
  if (G.race !== 'androide' && G.ki < kiCost) {
    log('warn', `⚡ Ki insuficiente! Necessário: ${kiCost} Ki.`);
    return;
  }

  if (G.race !== 'androide' && kiCost > 0) G.ki -= kiCost;
  G.transform = form;
  G.powerLevel = calcPowerLevel();
  log('ki', `⚡⚡ ${cfg.label}! Poder: ${G.powerLevel.toLocaleString()}`);
  showNotif(`⚡ ${cfg.label}!`);
  _applyTransformVisuals();
}

function _applyTransformVisuals() {
  G.powerLevel = calcPowerLevel();
  updateTransformBadge();
  updateAvatarAura();
  drawPixelChar('pixel-canvas', G.race, G.transform, 96, 128);
  updateNextTransformLabel();
  updateUI();
}

function updateNextTransformLabel() {
  const el = document.getElementById('next-transform-label');
  if (!el) return;
  // Com o novo modal de seleção, o botão sempre diz "Transformar"
  // mas mostramos a forma ativa se houver
  if (G.transform && G.transform !== 'normal') {
    const labels = {
      ssj: 'SSJ', ssj2: 'SSJ2', oozaru: 'GREAT APE',
      namefusion: 'FUSÃO', majinized: 'MAJIN', dark_ssj: 'SSJ SOMBRIO',
      majin_ssj2: 'SSJ2 MAJIN', dark_namek: 'NAMEK ☠', majin_android: 'NÚCLEO ☠'
    };
    el.textContent = labels[G.transform] || G.transform.toUpperCase();
  } else {
    el.textContent = 'TRANSFORMAR';
  }
}

function updateTransformBadge() {
  const badge = document.getElementById('transform-badge');
  if (!badge) return;
  const map = {
    normal:        { cls: 't-normal',       txt: 'NORMAL' },
    ssj:           { cls: 't-ssj',          txt: 'SUPER SAIYAJIN' },
    ssj2:          { cls: 't-ssj2',         txt: 'SSJ2' },
    oozaru:        { cls: 't-oozaru',       txt: 'GREAT APE' },
    namefusion:    { cls: 't-namefusion',   txt: 'NAMEK FUSÃO' },
    majinized:     { cls: 't-majinized',    txt: 'MAJINIZADO' },
    dark_ssj:      { cls: 't-dark-ssj',     txt: 'SSJ SOMBRIO' },
    majin_ssj2:    { cls: 't-majin-ssj2',   txt: 'SSJ2 MAJIN' },
    dark_namek:    { cls: 't-dark-namek',   txt: 'NAMEK CORROMPIDO' },
    majin_android: { cls: 't-majin-android',txt: 'NÚCLEO CORROMPIDO' }
  };
  const m = map[G.transform] || map.normal;
  badge.className = `transform-badge ${m.cls}`;
  badge.textContent = m.txt;
}

function updateAvatarAura() {
  const aura = document.getElementById('avatar-aura');
  if (!aura) return;
  const auraMap = {
    ssj: 'aura-ssj', ssj2: 'aura-ssj2', ssj3: 'aura-ssj3',
    oozaru: 'aura-oozaru', namefusion: 'aura-namefusion',
    majinized: 'aura-majinized', dark_ssj: 'aura-dark-ssj',
    majin_ssj2: 'aura-majin-ssj2', dark_namek: 'aura-dark-namek',
    majin_android: 'aura-majin-android'
  };
  aura.className = 'avatar-aura ' + (auraMap[G.transform] || '');
}

// ─── SVG CHARACTER RENDERER ───────────────────────────
// Substitui o pixel art por SVG vetorial com formas fiéis ao anime.
// Uso: drawPixelChar('canvas-id', race, transform, W, H, mirror)
// O canvas é substituído por um <svg> inline adjacente com id = canvasId + '-svg'
// Para retrocompatibilidade, o canvas original é ocultado.

function _getOrCreateSVG(canvasId, W, H) {
  const svgId = canvasId + '-svg';
  let svg = document.getElementById(svgId);
  if (!svg) {
    svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
    svg.id = svgId;
    svg.setAttribute('xmlns', 'http://www.w3.org/2000/svg');
    svg.style.display = 'block';
    const cv = document.getElementById(canvasId);
    if (cv) {
      cv.style.display = 'none';
      cv.parentNode.insertBefore(svg, cv.nextSibling);
    } else {
      document.body.appendChild(svg);
    }
  }
  svg.setAttribute('width', W);
  svg.setAttribute('height', H);
  svg.setAttribute('viewBox', '0 0 ' + W + ' ' + H);
  svg.style.overflow = 'visible';
  while (svg.firstChild) svg.removeChild(svg.firstChild);
  return svg;
}

function _svgNs(tag, attrs) {
  const el = document.createElementNS('http://www.w3.org/2000/svg', tag);
  for (const [k, v] of Object.entries(attrs || {})) el.setAttribute(k, v);
  return el;
}

function _svgRect(svg, x, y, w, h, fill, rx) {
  svg.appendChild(_svgNs('rect', { x, y, width: w, height: h, fill, rx: rx || 2 }));
}

function _svgCircle(svg, cx, cy, r, fill, op) {
  const e = _svgNs('circle', { cx, cy, r, fill });
  if (op !== undefined) e.setAttribute('opacity', op);
  svg.appendChild(e);
}

function _svgPath(svg, d, fill, stroke, sw) {
  const e = _svgNs('path', { d, fill: fill || 'none' });
  if (stroke) { e.setAttribute('stroke', stroke); e.setAttribute('stroke-width', sw || 1); }
  svg.appendChild(e);
}

function _svgEllipse(svg, cx, cy, rx, ry, fill, op) {
  const e = _svgNs('ellipse', { cx, cy, rx, ry, fill });
  if (op !== undefined) e.setAttribute('opacity', op);
  svg.appendChild(e);
}

function drawPixelChar(canvasId, race, transform, W, H, mirror) {
  const svg = _getOrCreateSVG(canvasId, W, H);

  const PALETTES = {
    saiyajin:        { hair: '#2a1a00', skin: '#f5c58a', suit: '#ff6600', boots: '#1a1a1a', belt: '#ffcc00' },
    'meio-saiyajin': { hair: '#1a1a1a', skin: '#f5c58a', suit: '#3344bb', boots: '#1a1a1a', belt: '#ffcc00' },
    namekusei:       { hair: '#224422', skin: '#44aa44', suit: '#6633cc', boots: '#223388', belt: '#ffffff' },
    humano:          { hair: '#332200', skin: '#f0c070', suit: '#224488', boots: '#442200', belt: '#ffcc00' },
    androide:        { hair: '#334455', skin: '#bbccdd', suit: '#222244', boots: '#223344', belt: '#00aaff' },
    majin:           { hair: '#ffaaee', skin: '#ffbbcc', suit: '#bb1144', boots: '#661133', belt: '#ffeeaa' }
  };

  const pal = { ...(PALETTES[race] || PALETTES.humano) };
  if (typeof G !== 'undefined' && G.customization && !mirror) {
    if (G.customization.suitColor) pal.suit = G.customization.suitColor;
    if (G.customization.hairColor) pal.hair = G.customization.hairColor;
    if (G.customization.skinColor) pal.skin = G.customization.skinColor;
  }

  // Escala: o viewBox interno usa coordenadas 0-120 x 0-220, escala pro W/H real
  const sx = W / 120;
  const sy = H / 220;
  // Helper escalado
  const R = (x,y,w,h,fill,rx) => _svgRect(svg, x*sx, y*sy, w*sx, h*sy, fill, (rx||2)*Math.min(sx,sy));
  const C = (cx,cy,r,fill,op) => _svgCircle(svg, cx*sx, cy*sy, r*Math.min(sx,sy), fill, op);
  const P = (d,fill,stroke,sw) => {
    // Escala path simples: substitui coordenadas numéricas
    const scaled = d.replace(/(-?\d+(?:\.\d+)?)\s+(-?\d+(?:\.\d+)?)/g,
      (_,a,b) => (parseFloat(a)*sx).toFixed(1)+' '+(parseFloat(b)*sy).toFixed(1));
    _svgPath(svg, scaled, fill, stroke, sw ? sw*Math.min(sx,sy) : undefined);
  };
  const E = (cx,cy,rx,ry,fill,op) => _svgEllipse(svg, cx*sx, cy*sy, rx*sx, ry*sy, fill, op);

  if (mirror) {
    const g = _svgNs('g', { transform: 'translate('+W+',0) scale(-1,1)' });
    svg.appendChild(g);
    // Redireciona helpers para o grupo
    const origAppend = svg.appendChild.bind(svg);
    svg.appendChild = (el) => g.appendChild(el);
    _drawCharBody(R, C, P, E, pal, race, transform);
    svg.appendChild = origAppend;
  } else {
    _drawCharBody(R, C, P, E, pal, race, transform);
  }
}

function _drawCharBody(R, C, P, E, c, race, transform) {
  const isSSJ    = ['ssj','ssj2','majin_ssj2'].includes(transform);
  const hairCol  = isSSJ ? '#ffee00' : c.hair;
  const auraCol  = { ssj:'#ffdd00', ssj2:'#ffee33', oozaru:'#885500', namefusion:'#00ffcc',
                     majinized:'#ff00aa', dark_ssj:'#cc0033', majin_ssj2:'#cc0099',
                     dark_namek:'#7722cc', majin_android:'#00cc44' }[transform] || null;

  const eyeCol   = ['ssj','ssj2','namefusion'].includes(transform) ? '#00ddaa'
                 : ['oozaru','majinized','dark_ssj','majin_ssj2','dark_namek','majin_android'].includes(transform) ? '#ff2222'
                 : '#222222';

  // ── Oozaru: silhueta de macaco grande ─────────────────
  if (transform === 'oozaru') {
    const fur = '#5a3a00', darkFur = '#3a2200';
    E(60, 200, 50, 12, '#00000030', 1);
    R(25,80,70,90,fur,8); R(20,90,80,60,fur,6);
    R(20,85,10,60,darkFur,3); R(90,85,10,60,darkFur,3);
    R(8,88,22,55,fur,6); R(90,88,22,55,fur,6);
    R(5,138,18,15,darkFur,3); R(97,138,18,15,darkFur,3);
    R(32,165,22,38,fur,4); R(66,165,22,38,fur,4);
    R(28,198,28,14,darkFur,3); R(64,198,28,14,darkFur,3);
    R(20,30,80,60,fur,10);
    R(30,58,60,28,c.skin,6);
    C(42,48,8,'#cc0000'); C(78,48,8,'#cc0000');
    C(42,48,5,'#ff2222'); C(78,48,5,'#ff2222');
    C(44,46,2,'#ffaaaa'); C(80,46,2,'#ffaaaa');
    C(45,68,4,'#3a1a00'); C(65,68,4,'#3a1a00');
    P('M 35 75 Q 60 85 85 75','none','#3a1a00',2);
    R(18,24,84,20,darkFur,8); R(25,15,70,18,darkFur,6);
    P('M 95 160 Q 115 150 110 170 Q 105 185 90 180','none',fur,6);
    return;
  }

  // ── Dark SSJ: visual inspirado na imagem (Saiyajin do Mal) ────────────────
  if (transform === 'dark_ssj') {
    const dPurple='#2a0a3a', armorM='#4a1a6a', armorL='#6a2a88',
          dBoots='#1a0822', dBelt='#3a0a4a', dHair='#1a0030', dHairH='#3a0055',
          aRed='#cc0033', aSkin='#d4906a';

    // Aura de chão
    E(60,210,55,12,aRed,0.35);
    E(60,210,35,7,'#ff0044',0.2);
    // Pilares de aura
    for(const [x,y,w,h] of [[6,145,10,65],[3,128,7,82],[130,145,10,65],[137,128,7,82]]) {
      R(x,y,w,h,aRed+'55',2);
    }
    // Spikes laterais de energia
    P('M 18 118 L 2 98 L 16 108 L 5 82 L 20 105 Z',aRed+'88');
    P('M 102 118 L 118 98 L 104 108 L 115 82 L 100 105 Z',aRed+'88');
    P('M 16 148 L 1 132 L 14 142 L 4 124 L 18 138 Z',aRed+'66');
    P('M 104 148 L 119 132 L 106 142 L 116 124 L 102 138 Z',aRed+'66');

    // Pernas
    P('M 38 155 L 50 155 L 52 210 L 34 210 Z',dPurple);
    P('M 70 155 L 86 155 L 90 210 L 72 210 Z',dPurple);
    R(32,204,24,12,dBoots,3); R(70,204,24,12,dBoots,3);
    R(34,204,20,3,'#3a1a55',2); R(72,204,20,3,'#3a1a55',2);
    // Cintura
    R(30,148,60,12,dBelt,3);

    // Torso
    R(28,95,64,58,dPurple,4);
    // Placas de armadura
    P('M 32 97 L 62 95 L 60 142 L 32 145 Z',armorM);
    P('M 64 95 L 96 97 L 96 145 L 64 142 Z',armorM);
    P('M 32 97 L 62 95 L 62 102 L 32 104 Z',armorL);
    P('M 64 95 L 96 97 L 96 103 L 64 102 Z',armorL);
    P('M 62 95 L 64 95 L 66 145 L 60 145 Z','#1a0828');
    // Detalhes de batalha
    P('M 44 106 L 52 120 L 42 126','none','#1a0828',1);
    P('M 82 108 L 74 122','none','#1a0828',1);

    // Ombreiras angulares
    P('M 28 102 L 10 95 L 8 118 L 28 116 Z',armorM);
    P('M 92 102 L 110 95 L 112 118 L 92 116 Z',armorM);
    P('M 28 102 L 10 95 L 12 101 L 28 108 Z',armorL);
    P('M 92 102 L 110 95 L 108 101 L 92 108 Z',armorL);
    // Espinhos nas ombreiras
    P('M 10 95 L 3 87 L 12 93 Z',armorL);
    P('M 110 95 L 117 87 L 108 93 Z',armorL);

    // Braços
    P('M 28 96 L 14 96 L 10 160 L 26 160 Z',dPurple);
    P('M 92 96 L 106 96 L 110 160 L 94 160 Z',dPurple);
    R(8,156,22,14,armorM,3); R(100,156,22,14,armorM,3);
    R(6,167,26,16,aSkin,3); R(100,167,26,16,aSkin,3);

    // Pescoço
    R(52,90,20,8,aSkin,2);

    // Cabeça
    P('M 34 54 Q 34 36 60 34 Q 86 36 86 54 L 86 96 Q 86 102 60 102 Q 34 102 34 96 Z',aSkin);
    // Orelhas
    P('M 34 66 Q 24 72 26 84 Q 28 90 34 86 Q 30 78 32 68 Z',aSkin);
    P('M 86 66 Q 96 72 94 84 Q 92 90 86 86 Q 90 78 88 68 Z',aSkin);

    // Sobrancelhas raivosas — grossas, inclinadas para dentro
    P('M 38 62 L 58 56 L 60 61 L 40 67 Z','#1a0030');
    P('M 82 62 L 62 56 L 60 61 L 80 67 Z','#1a0030');

    // Olhos vermelhos brilhantes
    C(48,74,8,'#ffffff'); C(72,74,8,'#ffffff');
    C(48,74,6,'#cc0000'); C(72,74,6,'#cc0000');
    C(48,74,3.5,'#ff2222'); C(72,74,3.5,'#ff2222');
    C(46,72,2,'#ff6666'); C(70,72,2,'#ff6666');
    C(48,74,10,'#cc000030'); C(72,74,10,'#cc000030');

    // Nariz
    P('M 56 82 Q 60 88 64 82','none','#b07050',1.5);
    // Boca / snarl
    P('M 44 94 Q 60 102 76 94 Q 68 98 60 96 Q 52 98 44 94','none','#1a0028',1.5);
    R(52,94,8,4,'#ffffff',1); R(64,94,8,4,'#ffffff',1);

    // Marca M do Majin na testa (personagem com poder sombrio)
    P('M 50 48 L 54 40 L 60 47 L 66 40 L 70 48','none','#ff00aa',2.5);
    C(60,47,3,'#ff00cc66');

    // Cabelo escuro volumoso com reflexos avermelhados — cabelo do Saiyajin do Mal
    // Volume lateral esquerdo
    P('M 34 54 Q 18 44 12 28 Q 10 14 18 10 Q 26 6 34 18 Q 28 26 30 40 Q 32 46 34 54 Z',dHair);
    P('M 34 54 Q 20 46 16 32 Q 18 24 24 20 Q 28 28 30 40 Z',dHairH);
    // Volume lateral direito
    P('M 86 54 Q 102 44 108 28 Q 110 14 102 10 Q 94 6 86 18 Q 92 26 90 40 Q 88 46 86 54 Z',dHair);
    P('M 86 54 Q 100 46 104 32 Q 102 24 96 20 Q 92 28 90 40 Z',dHairH);
    // Picos centrais para cima — agressivos
    P('M 42 38 Q 38 18 44 4 Q 50 -4 56 2 Q 50 10 48 24 Q 46 32 44 38 Z',dHair);
    P('M 56 2 Q 62 -6 70 0 Q 74 10 70 22 Q 66 12 60 12 Z',dHair);
    P('M 70 0 Q 76 -6 84 2 Q 90 12 86 24 Q 82 14 76 14 Z',dHair);
    P('M 84 8 Q 92 2 98 12 Q 100 24 94 34 Q 92 22 88 18 Z',dHair);
    // Highlight avermelhado nos picos
    P('M 56 8 Q 60 2 64 4 Q 60 12 58 16 Z',dHairH);
    P('M 72 4 Q 76 0 80 6 Q 76 14 74 16 Z',dHairH);
    // Base do cabelo — testa
    P('M 34 56 Q 38 46 44 44 L 76 44 Q 82 46 86 56 L 86 64 Q 64 54 60 52 Q 56 54 34 64 Z',dHair);
    // Mecha caindo na testa (traço icônico)
    P('M 54 56 Q 50 68 46 82 Q 50 78 52 70 Q 54 64 56 62 Z',dHair);
    // Faíscas de energia vermelha no cabelo
    P('M 46 24 L 42 16 L 48 22','none',aRed,1.5);
    P('M 88 24 L 92 16 L 86 22','none',aRed,1.5);
    P('M 68 6 L 66 0 L 70 4','none',aRed,1.5);

    // Aura final ao redor do corpo
    E(60,155,68,92,aRed,0.06);
    E(60,155,48,66,'#8800aa',0.06);
    return;
  }

  // ── Base compartilhada para todas as outras transformações ─────────────────

  // Sombra no chão
  E(60,215,48,8,'#00000020',1);

  // Aura ambiente
  if (auraCol) {
    E(60,130,52,70,auraCol,0.12);
    E(60,130,30,45,auraCol,0.08);
  }

  // Antenas Namek
  if (race === 'namekusei' || transform === 'namefusion') {
    P('M 44 42 Q 36 18 30 8','none',c.hair,3);
    P('M 76 42 Q 84 18 90 8','none',c.hair,3);
    C(30,7,4,c.hair); C(90,7,4,c.hair);
  }

  // Pernas
  P('M 36 155 L 48 155 L 50 210 L 32 210 Z',c.suit);
  P('M 64 155 L 78 155 L 80 210 L 66 210 Z',c.suit);
  R(30,204,22,10,c.boots,2); R(64,204,22,10,c.boots,2);
  // Cinto
  R(28,148,64,12,c.belt,2);

  // Torso / gi
  R(26,95,68,58,c.suit,4);
  // Gola V
  P('M 60 95 L 52 115 L 60 118 L 68 115 Z',c.skin);
  // Detalhes do gi
  P('M 28 95 L 28 148','none','#00000022',1.5);
  P('M 92 95 L 92 148','none','#00000022',1.5);

  // Androide: detalhes de núcleo
  if (race === 'androide' || transform === 'majin_android') {
    R(38,110,14,3,'#00aaff',1); R(68,110,14,3,'#00aaff',1);
    R(44,120,32,2,'#00aaff33',1);
  }
  if (transform === 'majin_android') {
    R(36,98,48,50,'#00110033',4);
    C(48,112,3,'#00ff44'); C(72,112,3,'#00ff44');
    R(44,122,32,2,'#00ff44',1);
  }

  // Namek corrompido — escurece traje e pele
  if (transform === 'dark_namek') {
    R(26,95,68,58,'#441166',4);
  }

  // Braços
  P('M 26 95 L 14 95 L 10 155 L 24 155 Z',c.suit);
  P('M 94 95 L 106 95 L 110 155 L 96 155 Z',c.suit);
  R(8,152,18,12,c.skin,3); R(94,152,18,12,c.skin,3);

  // Marca Majin
  if (['majinized','majin_ssj2'].includes(transform)) {
    C(60,118,4,'#ff00cc');
  }

  // Pescoço
  R(50,90,20,8,c.skin,2);

  // Cabeça
  const skinCol = transform === 'dark_namek' ? '#226633' : c.skin;
  R(34,44,52,52,skinCol,8);

  // Orelhas
  P('M 34 58 Q 24 64 26 76 Q 28 82 34 78 Q 30 70 32 60 Z',skinCol);
  P('M 86 58 Q 96 64 94 76 Q 92 82 86 78 Q 90 70 88 60 Z',skinCol);

  // Sobrancelhas
  const browCol = transform === 'dark_ssj' ? '#220044' : hairCol;
  R(38,60,16,3,browCol,1); R(66,60,16,3,browCol,1);

  // Olhos
  C(48,70,6,'#ffffff'); C(72,70,6,'#ffffff');
  C(48,70,4,eyeCol); C(72,70,4,eyeCol);
  C(50,68,2,'#ffffff88'); C(74,68,2,'#ffffff88');

  // Nariz
  P('M 56 78 Q 60 83 64 78','none','#c09060',1.5);

  // Boca
  P('M 46 88 Q 60 94 74 88','none','#c09060',1.5);

  // Marca Majin na testa
  if (['majinized','majin_ssj2'].includes(transform)) {
    P('M 50 50 Q 60 44 70 50 Q 60 56 50 50','#ff00cc');
  }

  // ── CABELO por transformação ───────────────────────────
  if (transform === 'ssj') {
    // SSJ — picos dourados para cima
    P('M 34 50 Q 28 34 36 20 Q 46 10 54 18 Q 40 22 40 40 Z',hairCol);
    P('M 54 18 Q 60 6 68 12 Q 72 22 66 32 Q 60 18 54 18 Z',hairCol);
    P('M 66 32 Q 76 14 84 24 Q 84 38 74 46 Z',hairCol);
    R(36,44,48,10,hairCol,2);
    P('M 36 50 Q 24 42 18 36 Q 22 28 32 36 Z',hairCol);
    P('M 84 50 Q 96 42 102 36 Q 98 28 88 36 Z',hairCol);
    // Picos de aura
    for (const [x,y] of [[12,100],[10,116],[108,100],[110,116],[8,132],[112,132]]) {
      P('M '+x+' '+y+' L '+(x+(x<60?-16:16))+' '+(y-4)+' L '+(x+(x<60?-12:12))+' '+(y+8)+'',auraCol+'cc');
    }
  } else if (transform === 'ssj2' || transform === 'majin_ssj2') {
    // SSJ2 — picos mais agressivos + bang + relâmpagos
    P('M 32 50 Q 24 30 36 16 Q 48 6 56 16 Q 42 20 40 42 Z',hairCol);
    P('M 56 16 Q 60 4 70 8 Q 76 18 70 30 Z',hairCol);
    P('M 70 30 Q 80 12 90 20 Q 90 36 80 46 Z',hairCol);
    P('M 32 50 Q 18 44 12 30 Q 16 22 28 32 Z',hairCol);
    P('M 88 50 Q 102 44 108 30 Q 104 22 92 32 Z',hairCol);
    R(34,42,52,12,hairCol,2);
    // Bang característico SSJ2
    P('M 54 50 Q 52 62 50 72 Q 54 68 56 60 Z',hairCol);
    // Relâmpagos brancos
    for (const [x1,y1,x2,y2] of [[8,94,18,108],[8,112,20,122],[112,94,102,108],[112,112,100,122]]) {
      P('M '+x1+' '+y1+' L '+((x1+x2)/2+3)+' '+((y1+y2)/2-3)+' L '+x2+' '+y2,'none','#ffffff',1.5);
    }
    for (const [x,y] of [[10,98],[10,120],[110,98],[110,120]]) {
      P('M '+x+' '+y+' L '+(x+(x<60?-14:14))+' '+(y-4)+' L '+(x+(x<60?-10:10))+' '+(y+8)+'',auraCol+'cc');
    }
    if (transform === 'majin_ssj2') {
      P('M 50 50 Q 60 44 70 50 Q 60 56 50 50','#ff00cc');
    }
  } else if (transform === 'namefusion') {
    P('M 36 50 Q 32 38 40 28 Q 50 20 60 24 Q 72 20 80 28 Q 88 38 84 50 Z',c.suit);
    R(36,38,48,14,c.suit,3);
  } else if (transform === 'majinized') {
    if (race === 'saiyajin' || race === 'meio-saiyajin') {
      P('M 36 48 Q 28 32 34 18 Q 44 8 52 16 Q 38 20 40 38 Z',c.hair);
      P('M 52 16 Q 58 6 66 10 Q 70 18 64 26 Z',c.hair);
      P('M 64 26 Q 76 12 82 22 Q 80 36 70 40 Z',c.hair);
      R(36,42,48,12,c.hair,2);
    } else {
      R(34,36,52,18,c.hair,4);
    }
    P('M 46 50 L 50 42 L 60 49 L 70 42 L 74 50','none','#ff00cc',2.5);
  } else {
    // Normal — cabelo base por raça
    if (race === 'saiyajin' || race === 'meio-saiyajin') {
      P('M 36 48 Q 28 32 34 18 Q 44 8 52 16 Q 38 20 40 36 Z',c.hair);
      P('M 52 16 Q 58 6 66 10 Q 70 18 64 26 Z',c.hair);
      P('M 64 26 Q 76 12 82 22 Q 80 36 70 40 Z',c.hair);
      R(36,42,48,12,c.hair,2);
    } else if (race === 'humano') {
      P('M 34 50 Q 32 38 38 28 Q 50 22 60 24 Q 70 22 82 28 Q 88 38 86 50 Z',c.hair);
    } else if (race === 'androide') {
      P('M 34 50 Q 33 40 40 34 Q 54 28 66 34 Q 76 38 78 50 Z',c.hair);
      P('M 34 50 L 32 43 Q 34 36 38 34','none',c.hair,3);
    } else if (race === 'majin') {
      P('M 32 50 Q 26 36 34 26 Q 48 18 60 26 Q 72 18 86 26 Q 94 36 88 50 Z',c.hair);
      C(34,30,8,c.hair); C(86,30,8,c.hair); C(60,20,10,c.hair);
    }
    // Namekusei: sem cabelo
  }

  // Pilares de aura genéricos
  if (auraCol && transform !== 'normal') {
    for (const [x,h] of [[4,38],[7,52],[9,32],[111,38],[113,52],[115,32]]) {
      R(x,210-h,3,h,auraCol+'44',1);
    }
  }
}

function drawVegeta(canvasId, phase, W, H) {
  const cv = document.getElementById(canvasId);
  if (!cv) return;
  const ctx = cv.getContext('2d');
  ctx.clearRect(0, 0, W, H);
  ctx.imageSmoothingEnabled = false;

  const configs = [
    { hair: '#1a1a1a', suit: '#222266', armor: '#8888cc', boots: '#1a1a44', aura: null },
    { hair: '#ffee00', suit: '#222266', armor: '#9999cc', boots: '#1a1a44', aura: '#ffee00' },
    { hair: '#cc88ff', suit: '#111133', armor: '#6644aa', boots: '#0a0a22', aura: '#cc00ff' }
  ];
  const p = configs[Math.min(phase, 2)];
  const scale = W / 24;

  if (p.aura) {
    const g = ctx.createRadialGradient(W / 2, H * 0.55, 8, W / 2, H * 0.55, 38);
    g.addColorStop(0, p.aura + '88'); g.addColorStop(1, p.aura + '00');
    ctx.fillStyle = g; ctx.fillRect(0, 0, W, H);
  }

  const px = (x, y, w, h, col) => {
    ctx.fillStyle = col; ctx.fillRect(x * scale, y * scale, w * scale, h * scale);
  };

  ctx.save(); ctx.translate(W, 0); ctx.scale(-1, 1);

  // Legs
  px(8, 24, 3, 8, p.suit); px(13, 24, 3, 8, p.suit);
  px(8, 30, 3, 2, p.boots); px(13, 30, 3, 2, p.boots);

  // Body + armor
  px(7, 14, 10, 10, p.armor);
  px(7, 21, 10, 2, '#ffffff');

  // Arms
  px(5, 14, 2, 9, p.suit); px(17, 14, 2, 9, p.suit);
  px(5, 21, 2, 3, '#f5c58a'); px(17, 21, 2, 3, '#f5c58a');

  // Shoulder pads
  px(4, 12, 3, 5, '#aaaaee'); px(17, 12, 3, 5, '#aaaaee');

  // Face
  px(8, 8, 8, 7, '#f5c58a');

  // Iconic upright Vegeta hair
  px(8, 2, 8, 7, p.hair);
  px(7, 3, 2, 6, p.hair);
  px(16, 3, 2, 6, p.hair);
  px(9, 1, 6, 2, p.hair);

  // Eyes
  const ey = phase > 0 ? '#44aaff' : '#333333';
  px(9, 11, 2, 2, ey); px(13, 11, 2, 2, ey);

  // Aura spikes
  if (p.aura) {
    [[6, 13], [18, 13], [5, 18], [19, 18]].forEach(([x, y]) =>
      px(x, y, 2, 3, p.aura + 'cc')
    );
  }

  ctx.restore();
}

// ─── SAVE / LOAD ──────────────────────────────────────
// ─── SAVE / LOAD — multi-slot ─────────────────────────

/** Lê metadados superficiais de todos os slots sem inflar G. */
function readAllSlotMeta() {
  return Array.from({ length: NUM_SAVE_SLOTS }, (_, i) => {
    try {
      const raw = localStorage.getItem(SAVE_SLOT_PREFIX + i);
      if (!raw) return { slot: i, empty: true };
      const d = JSON.parse(raw);
      return {
        slot: i, empty: false,
        name: d.name || '?',
        race: d.race || '?',
        level: d.level || 1,
        day: d.day || 1,
        savedAt: d.savedAt || 0,
        arc: d.arc || ''
      };
    } catch { return { slot: i, empty: true }; }
  });
}

function _applyRawSave(saved) {
  const defaults = createInitialState();
  G = { ...defaults, ...saved, statusEffects: [] };
  G.skills         = { ...defaults.skills,         ...saved.skills };
  G.inventory      = { ...defaults.inventory,      ...saved.inventory };
  G.bossDefeated   = { ...defaults.bossDefeated,   ...saved.bossDefeated };
  G.storyCompleted = Array.isArray(saved.storyCompleted) ? saved.storyCompleted : [];
  G.storyChoices   = (typeof saved.storyChoices === 'object' && saved.storyChoices)
    ? { ...defaults.storyChoices, ...saved.storyChoices }
    : { ...defaults.storyChoices };
  G.alignmentGood      = typeof saved.alignmentGood  === 'number' ? saved.alignmentGood  : 0;
  G.alignmentEvil      = typeof saved.alignmentEvil  === 'number' ? saved.alignmentEvil  : 0;
  G.shopHeroDiscount   = typeof saved.shopHeroDiscount === 'number' ? saved.shopHeroDiscount : 0;
  G.shopVillainAccess  = Array.isArray(saved.shopVillainAccess) ? saved.shopVillainAccess : [];
  G.skillsVillain      = { ...defaults.skillsVillain, ...(saved.skillsVillain || {}) };
  G.customization      = { ...defaults.customization, ...(saved.customization || {}) };
  G.unlockedTransforms = Array.isArray(saved.unlockedTransforms) ? saved.unlockedTransforms : [];
  G.masterTraining   = { ...defaults.masterTraining, ...(saved.masterTraining || {}) };
  G.prestigeRank     = typeof saved.prestigeRank === 'number' ? saved.prestigeRank : 0;
  G.prestigeHeritage = saved.prestigeHeritage || '';
  G.prestigeUnlocks  = Array.isArray(saved.prestigeUnlocks) ? saved.prestigeUnlocks : [];
}

function saveToSlot(slot, manual = true) {
  try {
    const saveData = { ...G, statusEffects: [], savedAt: Date.now() };
    localStorage.setItem(SAVE_SLOT_PREFIX + slot, JSON.stringify(saveData));
    if (manual) {
      log('save', `💾 Salvo no Slot ${slot + 1}!`);
      showNotif(`💾 SLOT ${slot + 1} SALVO!`);
    } else {
      showToast(`💾 Auto-save (Slot ${slot + 1})`);
    }
  } catch (e) {
    log('warn', '⚠️ Erro ao salvar no slot ' + (slot + 1));
  }
}

function loadFromSlot(slot) {
  try {
    const raw = localStorage.getItem(SAVE_SLOT_PREFIX + slot);
    if (!raw) { alert(`Slot ${slot + 1} está vazio.`); return; }
    const saved = JSON.parse(raw);
    _applyRawSave(saved);
    G._activeSlot = slot;   // lembra qual slot está ativo para o autosave
    document.getElementById('creation-screen').style.display = 'none';
    document.getElementById('game-screen').style.display = 'block';
    closeSaveModal();
    initGame();
    log('save', `📂 Slot ${slot + 1} carregado — ${G.name}, Nível ${G.level}, Dia ${G.day}`);
    showNotif(`📂 SLOT ${slot + 1} CARREGADO!`);
  } catch (e) {
    alert('Erro ao carregar slot ' + (slot + 1) + ': ' + e.message);
  }
}

function deleteSlot(slot) {
  if (!confirm(`Apagar o save do Slot ${slot + 1}? Esta ação é irreversível.`)) return;
  localStorage.removeItem(SAVE_SLOT_PREFIX + slot);
  openSaveModal();   // re-render
}

// ── Compat: autosave usa o slot ativo (salvo em G._activeSlot) ou slot 0 ──
function saveGame(manual = false) {
  const slot = (typeof G._activeSlot === 'number') ? G._activeSlot : 0;
  saveToSlot(slot, manual);
}

// ── Compat: botão antigo de "Carregar" abre o painel de slots ──
function loadGame() {
  openSaveModal();
}

// ─── SAVE MODAL UI ────────────────────────────────────

function openSaveModal(mode = 'load') {
  let modal = document.getElementById('save-slots-modal');
  if (!modal) {
    modal = document.createElement('div');
    modal.id = 'save-slots-modal';
    modal.className = 'modal-overlay';
    modal.innerHTML = `
      <div class="modal-box" style="max-width:480px">
        <div class="modal-header">
          <span id="save-modal-title">💾 SAVES</span>
          <button class="btn btn-ghost btn-sm" onclick="closeSaveModal()">✕</button>
        </div>
        <div id="save-slots-list" style="display:flex;flex-direction:column;gap:10px;padding:16px"></div>
      </div>`;
    document.body.appendChild(modal);
  }

  modal._mode = mode;
  document.getElementById('save-modal-title').textContent =
    mode === 'save' ? '💾 SALVAR JOGO' : '📂 CARREGAR / GERENCIAR SAVES';

  const list = document.getElementById('save-slots-list');
  list.innerHTML = '';
  const metas = readAllSlotMeta();
  const activeSlot = (typeof G._activeSlot === 'number') ? G._activeSlot : 0;

  metas.forEach(m => {
    const card = document.createElement('div');
    card.style.cssText = `
      background:var(--panel-dark,#0d1128);
      border:1px solid ${m.slot === activeSlot && !m.empty ? 'var(--gold,#ffd700)' : 'var(--border,#1e2a5a)'};
      border-radius:8px;padding:12px 14px;display:flex;align-items:center;gap:12px`;

    if (m.empty) {
      card.innerHTML = `
        <div style="flex:1;color:var(--text-dim,#888)">Slot ${m.slot + 1} — Vazio</div>
        ${mode === 'save' ? `<button class="btn btn-blue btn-sm" onclick="saveToSlot(${m.slot});openSaveModal('save')">Salvar aqui</button>` : ''}`;
    } else {
      const d = new Date(m.savedAt);
      const dateStr = m.savedAt ? d.toLocaleString('pt-BR', { day:'2-digit', month:'2-digit', hour:'2-digit', minute:'2-digit' }) : '—';
      card.innerHTML = `
        <div style="flex:1">
          <div style="font-weight:700;color:var(--gold,#ffd700)">${m.name}
            ${m.slot === activeSlot ? '<span style="font-size:10px;color:var(--green-hp,#44ff88);margin-left:6px">● ativo</span>' : ''}
          </div>
          <div style="font-size:11px;color:var(--text-dim,#888)">${m.arc || ''} · Nv ${m.level} · Dia ${m.day}</div>
          <div style="font-size:10px;color:var(--text-dim,#888)">${dateStr}</div>
        </div>
        <div style="display:flex;gap:6px;flex-shrink:0">
          ${mode === 'save'
            ? `<button class="btn btn-blue btn-sm" onclick="saveToSlot(${m.slot});openSaveModal('save')">Sobrescrever</button>`
            : `<button class="btn btn-gold btn-sm" onclick="loadFromSlot(${m.slot})">Carregar</button>`}
          <button class="btn btn-ghost btn-sm" style="color:var(--red-power,#ff4444)" onclick="deleteSlot(${m.slot})">🗑</button>
        </div>`;
    }
    list.appendChild(card);
  });

  // Toggle entre modos
  const toggleRow = document.createElement('div');
  toggleRow.style.cssText = 'display:flex;gap:8px;justify-content:center;margin-top:4px';
  toggleRow.innerHTML = `
    <button class="btn btn-ghost btn-sm" onclick="openSaveModal('load')">📂 Carregar</button>
    <button class="btn btn-ghost btn-sm" onclick="openSaveModal('save')">💾 Salvar</button>`;
  list.appendChild(toggleRow);

  modal.classList.add('show');
}

function closeSaveModal() {
  const modal = document.getElementById('save-slots-modal');
  if (modal) modal.classList.remove('show');
}

// ─── STARS BACKGROUND ─────────────────────────────────
(function initStars() {
  const cv = document.getElementById('stars-canvas');
  const ctx = cv.getContext('2d');
  const stars = [];
  let paused = false;

  function resize() { cv.width = innerWidth; cv.height = innerHeight; }
  window.addEventListener('resize', resize); resize();

  for (let i = 0; i < 180; i++) {
    stars.push({
      x: Math.random(), y: Math.random(),
      r: Math.random() * 1.4 + 0.2,
      speed: Math.random() * 0.0002 + 0.00003,
      twinkle: Math.random() * Math.PI * 2
    });
  }

  document.addEventListener('visibilitychange', () => { paused = document.hidden; });

  function draw() {
    if (!paused) {
      ctx.clearRect(0, 0, cv.width, cv.height);
      const t = Date.now() * 0.001;
      stars.forEach(s => {
        s.x += s.speed;
        if (s.x > 1) s.x = 0;
        const alpha = 0.25 + Math.sin(t + s.twinkle) * 0.2;
        ctx.beginPath();
        ctx.arc(s.x * cv.width, s.y * cv.height, s.r, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(170,190,255,${alpha})`;
        ctx.fill();
      });
    }
    requestAnimationFrame(draw);
  }
  draw();
})();