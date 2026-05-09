// ═══════════════════════════════════════════════════════
// UI.JS — DOM, abas, log, modais, listas dinâmicas
// ═══════════════════════════════════════════════════════

const MISSION_DEFS = [
  { id: 'win3', icon: '⚔️', title: 'Primeiras Vitórias', desc: 'Vença 3 batalhas no modo Combate.', check: () => G.battlesWon >= 3, reward: () => { G.zeni += 200; G.xp += 40; } },
  { id: 'level5', icon: '⭐', title: 'Poder Crescente', desc: 'Alcance o nível 5.', check: () => G.level >= 5, reward: () => { G.inventory.senzu += 1; G.attrPts += 1; } },
  { id: 'zeni1k', icon: '💰', title: 'Colecionador', desc: 'Acumule 1000 Zeni.', check: () => G.zeni >= 1000, reward: () => { G.xp += 80; } },
  { id: 'train10', icon: '💪', title: 'Disciplina', desc: 'Treine 10 dias no total.', check: () => G.daysTraining >= 10, reward: () => { G.forca += 3; G.powerLevel = calcPowerLevel(); } },
  { id: 'dungeon1', icon: '🏰', title: 'Explorador', desc: 'Complete 1 dungeon.', check: () => G.dungeonClears >= 1, reward: () => { G.zeni += 350; } }
];

const SKILL_DEFS = [
  { id: 'kamehameha', icon: '🌊', name: 'Kamehameha / Especial', desc: 'Aumenta drasticamente o dano do ataque especial em combate.', price: 400, max: 5 },
  { id: 'barreira', icon: '🛡️', name: 'Barreira de Ki', desc: 'Reduz dano recebido em combates futuros (efeito passivo leve).', price: 350, max: 4 },
  { id: 'teletransporte', icon: '💨', name: 'Teletransporte', desc: 'Chance extra de esquivar ataques inimigos.', price: 500, max: 3 },
  { id: 'zenkai', icon: '💥', name: 'Zenkai (Saiyajin)', desc: 'Após derrotas, ganho de atributo aumentado.', price: 600, max: 3, races: ['saiyajin', 'meio-saiyajin'] },
  { id: 'especial', icon: '✨', name: 'Maestria em Ki', desc: 'Multiplicador do seu golpe especial.', price: 450, max: 5 }
];

const SHOP_ITEMS = [
  { id: 'senzu', icon: '🫘', name: 'Senzu Bean', desc: 'Restaura HP e Ki completamente.', price: 165, buy: () => { G.inventory.senzu += 1; } },
  { id: 'potion', icon: '🧪', name: 'Poção de Ki', desc: '+5 Ki máx. e recupera Ki atual.', price: 135, buy: () => { G.maxKi += 5; G.ki = Math.min(G.maxKi, G.ki + 5); } },
  { id: 'weights', icon: '🏋️', name: 'Traje Pesado', desc: '+2 Força permanente.', price: 920, buy: () => { G.forca += 2; G.powerLevel = calcPowerLevel(); } },
  { id: 'capsule', icon: '💊', name: 'Cápsula Hoi-Poi', desc: '+150 Zeni de suprimentos.', price: 55, buy: () => { G.zeni += 150; } }
];

const VILLAIN_SKILL_DEFS = [
  { id: 'death_beam', unlock: 'death_beam', icon: '🔴', name: 'Death Beam', desc: 'Técnica de precisão cruel: +5,5% dano em Ki e especiais por nível.', price: 640, max: 5 },
  { id: 'galick_gun', unlock: 'galick_gun', icon: '🟣', name: 'Galick Gun', desc: 'Rajada roxa: +5% dano físico e Ki por nível.', price: 700, max: 4 },
  { id: 'big_bang', unlock: 'big_bang', icon: '🟠', name: 'Big Bang Attack', desc: 'Esfera de destruição: +6,5% dano do especial por nível.', price: 780, max: 4 },
  { id: 'crusher_ball', unlock: 'crusher_ball', icon: '🟡', name: 'Crusher Ball', desc: 'Projétil instável: +4,5% dano Ki por nível.', price: 620, max: 5 },
  { id: 'energy_drain', unlock: 'energy_drain', icon: '⚫', name: 'Dreno de Ki', desc: 'Rouba vida ao ferir: escala com nível da habilidade (combate).', price: 820, max: 4 },
  { id: 'absorption_dark', unlock: 'absorption_dark', icon: '🩸', name: 'Absorção Bio', desc: 'Fúria biológica: +3% dano físico e roubo de vida por nível.', price: 900, max: 3 }
];

const DBZ_TAB_ORDER = ['acao', 'combate', 'dungeon', 'missoes', 'historia', 'habilidades', 'loja', 'conquistas'];

// ─── TRANSFORM SHOP DEFINITIONS ──────────────────────
const TRANSFORM_SHOP_DEFS = [
  {
    id: 'ssj', icon: '⚡', name: 'Super Saiyajin',
    desc: 'Cabelo dourado e aura flamejante. Multiplica poder em 50×. Ki Custo: 30.',
    price: 1200, races: ['saiyajin', 'meio-saiyajin', 'majin'],
    reqLevel: 5, color: '#ffd700'
  },
  {
    id: 'ssj2', icon: '⚡⚡', name: 'Super Saiyajin 2',
    desc: 'Eletricidade na aura. 100× de poder base. Ki Custo: 50. Exige SSJ desbloqueado.',
    price: 2800, races: ['saiyajin', 'meio-saiyajin'],
    reqLevel: 12, requires: 'ssj', color: '#cc88ff'
  },
  {
    id: 'ssj3', icon: '💛', name: 'Super Saiyajin 3',
    desc: 'Cabelo comprido dourado. 400× de poder base absurdo. Ki Custo: 80.',
    price: 6000, races: ['saiyajin'],
    reqLevel: 20, requires: 'ssj2', color: '#ffaa00'
  },
  {
    id: 'oozaru', icon: '🦍', name: 'Oozaru (Great Ape)',
    desc: 'Transformação macacão lunar. 10× poder bruto. Ki Custo: 40.',
    price: 1800, races: ['saiyajin'],
    reqLevel: 6, color: '#ff6600'
  },
  {
    id: 'namefusion', icon: '🟢', name: 'Fusão Namekusei',
    desc: 'Fusão mística com outro Namek. 5× poder + bônus de defesa. Ki Custo: 60.',
    price: 2200, races: ['namekusei'],
    reqLevel: 8, color: '#00ffcc'
  }
];

const ACHIEVEMENT_DEFS = [
  { id: 'firstblood', icon: '🩸', name: 'Primeiro Sangue', desc: 'Vença sua primeira batalha.' },
  { id: 'ssj', icon: '⚡', name: 'Lendário', desc: 'Transforme-se em Super Saiyajin.' },
  { id: 'rich', icon: '💎', name: 'Magnata', desc: 'Tenha 5000 Zeni ao mesmo tempo.' },
  { id: 'survivor', icon: '🔥', name: 'Sobrevivente', desc: 'Treino intenso com HP em estado crítico.' },
  { id: 'vegeta', icon: '👑', name: 'Orgulho Quebrado', desc: 'Derrote Vegeta no modo Boss.' },
  { id: 'story_cell', icon: '🧬', name: 'Jogo Perfeito', desc: 'Conclua o Modo História até Cell Perfeito.' }
];

function switchTab(name) {
  document.querySelectorAll('.tab-btn').forEach(b => {
    b.classList.toggle('active', b.dataset.tab === name);
  });
  document.querySelectorAll('.tab-content').forEach(c => {
    c.classList.toggle('active', c.id === 'tab-' + name);
  });
  if (name === 'combate') initCombatTab();
  if (name === 'dungeon') initDungeonTab();
  if (name === 'missoes') renderMissions();
  if (name === 'historia') renderStoryTab();
  if (name === 'habilidades') renderSkills();
  if (name === 'loja') renderShop();
  if (name === 'conquistas') renderAchievements();
  if (name === 'loja-maldita') initVillainShopTab();
}

function log(type, msg) {
  const box = document.getElementById('game-log');
  if (!box) return;
  const p = document.createElement('p');
  p.className = 'log-entry log-' + (type || 'info');
  p.textContent = msg;
  box.appendChild(p);
  box.scrollTop = box.scrollHeight;
}

function clearLog() {
  const box = document.getElementById('game-log');
  if (box) box.innerHTML = '';
}

function showNotif(text) {
  const old = document.querySelector('.notif');
  if (old) old.remove();
  const n = document.createElement('div');
  n.className = 'notif';
  n.textContent = text;
  document.body.appendChild(n);
  setTimeout(() => n.remove(), 2600);
}

function showToast(text) {
  const t = document.createElement('div');
  t.className = 'save-toast';
  t.textContent = text;
  document.body.appendChild(t);
  setTimeout(() => t.remove(), 2800);
}

function showLevelUpModal(level, hpGain, kiGain) {
  const m = document.getElementById('levelup-modal');
  const num = document.getElementById('levelup-number');
  const rew = document.getElementById('levelup-rewards');

  const raceGrowth = {
    saiyajin: ['💪 Força', 'forca'], 'meio-saiyajin': ['✨ Ki Atk', 'kiAtk'],
    namekusei: ['🛡️ Defesa', 'defesa'], humano: ['✨ Ki Atk', 'kiAtk'],
    androide: ['💨 Velocidade', 'velocidade'], majin: ['🛡️ Defesa', 'defesa']
  };
  const clsGrowth = {
    guerreiro: ['💪 Força', 'forca'], 'ki-mestre': ['✨ Ki Atk', 'kiAtk'], veloz: ['💨 Velocidade', 'velocidade']
  };
  const [raceLabel] = raceGrowth[G.race] || ['💪 Força'];
  const [clsLabel]  = clsGrowth[G.cls]  || ['💪 Força'];
  const showRace = level % 2 === 0;
  const showCls  = level % 3 === 0;

  if (num) num.textContent = String(level);
  if (rew) {
    rew.innerHTML = `
      <div>❤️ HP máx. <strong>+${hpGain}</strong></div>
      <div>⚡ Ki máx. <strong>+${kiGain}</strong></div>
      <div>✨ <strong>+3</strong> pontos de atributo</div>
      ${showRace ? `<div style="color:#ffd700">${raceLabel} <strong>+1</strong> <span style="font-size:10px;opacity:.7">(crescimento da raça)</span></div>` : ''}
      ${showCls  ? `<div style="color:#88ccff">${clsLabel} <strong>+1</strong> <span style="font-size:10px;opacity:.7">(domínio de classe)</span></div>` : ''}`;
  }
  if (m) m.classList.add('show');
}

function closeLevelUp() {
  const m = document.getElementById('levelup-modal');
  if (m) m.classList.remove('show');
  checkLevelUp();
}

function updateUI() {
  updateArc();

  const setTxt = (id, v) => {
    const el = document.getElementById(id);
    if (el) el.textContent = v;
  };

  setTxt('day-display', String(G.day));
  setTxt('location-display', G.currentLocation.split('—')[0].trim());
  setTxt('zeni-display', G.zeni.toLocaleString());
  setTxt('char-name-display', G.name || '?');
  setTxt('char-sub', `${raceLabel(G.race)} · ${classLabel(G.cls)}`);
  setTxt('power-level', 'PODER: ' + calcPowerLevel().toLocaleString());

  // Customization: emblem + title
  const cust = G.customization || {};
  const emblemEl = document.getElementById('char-emblem');
  if (emblemEl) emblemEl.textContent = cust.emblem || '⚡';
  const titleEl = document.getElementById('char-title-display');
  if (titleEl) titleEl.textContent = cust.title || '';
  const mottoEl = document.getElementById('char-motto-display');
  if (mottoEl) {
    mottoEl.textContent = cust.motto ? `"${cust.motto}"` : '';
    mottoEl.style.display = cust.motto ? '' : 'none';
  }

  setTxt('hp-text', `${Math.round(G.hp)}/${G.maxHp}`);
  setTxt('ki-text', `${Math.round(G.ki)}/${G.maxKi}`);
  setTxt('xp-text', `${G.xp}/${G.xpNext}`);
  setTxt('stam-text', `${Math.round(G.stamina)}/${G.maxStamina}`);

  const hpPct = (G.hp / G.maxHp) * 100;
  const kiPct = (G.ki / G.maxKi) * 100;
  const xpPct = (G.xp / G.xpNext) * 100;
  const stPct = (G.stamina / G.maxStamina) * 100;

  const hpBar = document.getElementById('hp-bar');
  if (hpBar) {
    hpBar.style.width = hpPct + '%';
    hpBar.classList.remove('low', 'danger');
    if (hpPct < 25) hpBar.classList.add('danger');
    else if (hpPct < 50) hpBar.classList.add('low');
  }
  const kiBar = document.getElementById('ki-bar');
  if (kiBar) kiBar.style.width = kiPct + '%';
  const xpBar = document.getElementById('xp-bar');
  if (xpBar) xpBar.style.width = xpPct + '%';
  const stBar = document.getElementById('stam-bar');
  if (stBar) stBar.style.width = stPct + '%';

  setTxt('stat-forca', String(G.forca));
  setTxt('stat-defesa', String(G.defesa));
  setTxt('stat-vel', String(G.velocidade));
  setTxt('stat-ki', String(G.kiAtk));
  setTxt('stat-nivel', String(G.level));
  setTxt('stat-pts', String(G.attrPts));

  setTxt('inv-senzu', String(G.inventory.senzu));
  setTxt('inv-esferas', String(G.inventory.esferas));
  setTxt('inv-torneios', String(G.torneiosVencidos));
  setTxt('inv-batalhas', String(G.battlesWon));

  updateTransformBadge();
  updateAvatarAura();
  updateNextTransformLabel();
  if (typeof refreshTransformReqHints === 'function') refreshTransformReqHints();
  drawPixelChar('pixel-canvas', G.race, G.transform, 96, 128);

  document.querySelectorAll('.stat-btn').forEach(btn => {
    btn.disabled = G.attrPts <= 0;
  });

  refreshActionButtons();
  checkAchievements();
}

function refreshActionButtons() {
  const low = G.stamina < 20;
  const treinar = document.getElementById('btn-treinar');
  const intenso = document.getElementById('btn-treinar-intenso');
  const med = document.getElementById('btn-meditar');
  const exp = document.getElementById('btn-explorar');
  const trab = document.getElementById('btn-trabalhar');
  const desc = document.getElementById('btn-descansar');

  if (treinar) treinar.disabled = G.stamina < 20 || G.hp <= 12;
  if (intenso) intenso.disabled = G.stamina < 40 || G.hp <= 28;
  if (med) med.disabled = G.stamina < 5;
  if (exp) exp.disabled = G.stamina < 10;
  if (trab) trab.disabled = G.stamina < 10;
  if (desc) desc.disabled = false;

  const bossBtn = document.getElementById('btn-boss');
  if (bossBtn) bossBtn.disabled = !!G.bossDefeated.vegeta;
}

function triggerRandomEvent() {
  const pool = [
    { icon: '🐉', title: 'Shenlong?', text: 'Você sente uma energia colossal no horizonte... nada acontece — ainda.', choices: [{ label: 'Ok', fn: () => closeEventModal() }] },
    { icon: '👽', title: 'Nave Saiyajin', text: 'Um pedaço de metal cai perto de você. Vende por 80 Zeni?', choices: [
      { label: 'Vender (+80 Z)', fn: () => { G.zeni += 80; log('gain', '💰 +80 Zeni do ferro-velho espacial.'); closeEventModal(); updateUI(); } },
      { label: 'Guardar', fn: () => closeEventModal() }
    ]},
    { icon: '🥋', title: 'Mestre Kame', text: 'O velho tartaruga oferece dicas: +15 XP se você meditar agora (sem custo de dia).', choices: [
      { label: 'Aceitar (+15 XP)', fn: () => { G.xp += 15; log('event', '🥋 Dica do Mestre Kame: +15 XP'); checkLevelUp(); closeEventModal(); updateUI(); } },
      { label: 'Depois', fn: () => closeEventModal() }
    ]}
  ];
  const ev = pool[rand(0, pool.length - 1)];
  openEventModal(ev.icon, ev.title, ev.text, ev.choices);
}

function openEventModal(icon, title, text, choices) {
  document.getElementById('ev-icon').textContent = icon;
  document.getElementById('ev-title').textContent = title;
  document.getElementById('ev-text').textContent = text;
  const wrap = document.getElementById('ev-choices');
  wrap.innerHTML = '';
  choices.forEach(ch => {
    const b = document.createElement('button');
    b.className = 'btn btn-gold btn-full';
    b.textContent = ch.label;
    b.onclick = () => ch.fn();
    wrap.appendChild(b);
  });
  document.getElementById('event-modal').classList.add('show');
}

function closeEventModal() {
  document.getElementById('event-modal').classList.remove('show');
}

function renderMissions() {
  const list = document.getElementById('mission-list');
  if (!list) return;
  list.innerHTML = '';
  MISSION_DEFS.forEach(m => {
    if (m.check() && !G.missions[m.id]) {
      G.missions[m.id] = true;
      m.reward();
      log('event', `📜 Missão completa: ${m.title}!`);
      showNotif('📜 ' + m.title);
    }
    const done = !!G.missions[m.id];
    const el = document.createElement('div');
    el.className = 'mission-entry ' + (done ? 'done' : 'available');
    el.innerHTML = `
      <div class="mission-icon-big">${m.icon}</div>
      <div class="mission-details">
        <div class="mission-title">${m.title}</div>
        <div class="mission-desc">${m.desc}</div>
        <div class="mission-reward">${done ? 'Concluída' : 'Recompensa ao completar'}</div>
      </div>
      <div class="mission-done-badge">${done ? '✓' : '○'}</div>`;
    list.appendChild(el);
  });
}

function checkMissions() {
  renderMissions();
}

function renderSkills() {
  const list = document.getElementById('skill-list');
  if (!list) return;
  list.innerHTML = '';
  SKILL_DEFS.forEach(s => {
    if (s.races && !s.races.includes(G.race)) return;
    const lvl = G.skills[s.id] || 0;
    const maxed = lvl >= s.max;
    const p = shopPriceAfterDiscount(s.price);
    const el = document.createElement('div');
    el.className = 'skill-entry';
    el.innerHTML = `
      <div class="skill-icon-big">${s.icon}</div>
      <div class="skill-details">
        <div class="skill-title">${s.name}<span class="skill-lvl">Nv.${lvl}/${s.max}</span></div>
        <div class="skill-desc">${s.desc}</div>
      </div>
      <button class="btn btn-blue btn-sm" ${maxed || G.zeni < p ? 'disabled' : ''}>${p} Z</button>`;
    const btn = el.querySelector('button');
    btn.onclick = () => {
      if (G.zeni < p || maxed) return;
      G.zeni -= p;
      G.skills[s.id] = (G.skills[s.id] || 0) + 1;
      log('gain', `${s.name} aprimorado para nv.${G.skills[s.id]}!`);
      renderSkills();
      updateUI();
    };
    list.appendChild(el);
  });
}

function shopPriceAfterDiscount(base) {
  const d = Math.min(0.22, G.shopHeroDiscount || 0);
  return Math.max(1, Math.floor(base * (1 - d)));
}

function villainTechUnlocked(def) {
  const a = G.shopVillainAccess || [];
  if (a.includes('perfect_evil')) return true;
  return a.includes(def.unlock);
}

function renderShop() {
  const grid = document.getElementById('shop-grid');
  if (!grid) return;
  grid.innerHTML = '';

  const hint = document.createElement('div');
  hint.className = 'shop-hint';
  const dPct = Math.round((G.shopHeroDiscount || 0) * 100);
  hint.innerHTML = dPct > 0
    ? `☀️ Desconto de herói ativo: <strong>${dPct}%</strong> em itens gerais e técnicas heróicas (Modo História — caminho do bem).`
    : '💡 Escolhas no <strong>Modo História</strong> alteram preços e desbloqueiam o arsenal sombrio.';
  grid.appendChild(hint);

  SHOP_ITEMS.forEach(item => {
    const price = shopPriceAfterDiscount(item.price);
    const el = document.createElement('div');
    el.className = 'shop-item';
    el.innerHTML = `
      <div class="shop-item-icon">${item.icon}</div>
      <div class="shop-item-name">${item.name}</div>
      <div class="shop-item-desc">${item.desc}</div>
      <div class="shop-item-footer">
        <span class="shop-item-price">${price} Z${price < item.price ? ` <span class="price-was">${item.price}</span>` : ''}</span>
        <button class="btn btn-gold btn-sm">Comprar</button>
      </div>`;
    const btn = el.querySelector('button');
    btn.disabled = G.zeni < price;
    btn.onclick = () => {
      if (G.zeni < price) return;
      G.zeni -= price;
      item.buy();
      log('gain', `🏪 Comprou: ${item.name}`);
      renderShop();
      updateUI();
    };
    grid.appendChild(el);
  });

  const villainHeader = document.createElement('div');
  villainHeader.className = 'shop-villain-header';
  villainHeader.innerHTML = '<span>🌑 Arsenal sombrio</span><small>Técnicas de vilões — exigem escolhas &quot;Mal&quot; na história ou domínio final.</small>';
  grid.appendChild(villainHeader);

  VILLAIN_SKILL_DEFS.forEach(def => {
    const visible = villainTechUnlocked(def);
    const lvl = (G.skillsVillain && G.skillsVillain[def.id]) || 0;
    const maxed = lvl >= def.max;
    const price = shopPriceAfterDiscount(def.price);
    const el = document.createElement('div');
    el.className = 'shop-item shop-item-villain' + (!visible ? ' shop-item-locked' : '');
    el.innerHTML = `
      <div class="shop-item-icon">${def.icon}</div>
      <div class="shop-item-name">${def.name}</div>
      <div class="shop-item-desc">${visible ? def.desc : '🔒 Complete capítulos da história e escolha o caminho das trevas para desbloquear.'}</div>
      <div class="shop-item-footer">
        <span class="shop-item-price">${visible ? price + ' Z' : '—'}</span>
        <button class="btn btn-purple btn-sm" ${!visible || maxed || G.zeni < price ? 'disabled' : ''}>${visible ? 'Comprar' : 'Bloqueado'}</button>
      </div>`;
    if (visible) {
      const btn = el.querySelector('button');
      btn.onclick = () => {
        if (G.zeni < price || maxed) return;
        G.zeni -= price;
        G.skillsVillain[def.id] = (G.skillsVillain[def.id] || 0) + 1;
        log('gain', `${def.name} (vilão) nv.${G.skillsVillain[def.id]}!`);
        renderShop();
        updateUI();
      };
    }
    grid.appendChild(el);
  });

  // ── TRANSFORM SHOP ──────────────────────────────────
  const tHeader = document.createElement('div');
  tHeader.className = 'shop-villain-header';
  tHeader.innerHTML = '<span>🔱 Transformações</span><small>Desbloqueie formas lendárias — compre uma vez, use para sempre.</small>';
  grid.appendChild(tHeader);

  if (G.race === 'androide') {
    const noT = document.createElement('div');
    noT.className = 'shop-hint';
    noT.textContent = '🤖 Androides são perfeitos em sua forma base. Nenhuma transformação disponível.';
    grid.appendChild(noT);
  } else {
    const raceTransforms = TRANSFORM_SHOP_DEFS.filter(t => t.races.includes(G.race));
    if (raceTransforms.length === 0) {
      const noT = document.createElement('div');
      noT.className = 'shop-hint';
      noT.textContent = 'Nenhuma transformação disponível para sua raça.';
      grid.appendChild(noT);
    }
    raceTransforms.forEach(t => {
      const unlocked = (G.unlockedTransforms || []).includes(t.id);
      const requiresOk = !t.requires || (G.unlockedTransforms || []).includes(t.requires);
      const levelOk = G.level >= t.reqLevel;
      const canBuy = !unlocked && requiresOk && levelOk && G.zeni >= t.price;
      const el = document.createElement('div');
      el.className = 'shop-item shop-item-transform' + (unlocked ? ' shop-item-owned' : '');
      el.style.borderColor = t.color + '55';
      el.innerHTML = `
        <div class="shop-item-icon" style="text-shadow:0 0 12px ${t.color}">${t.icon}</div>
        <div class="shop-item-name" style="color:${t.color}">${t.name}</div>
        <div class="shop-item-desc">${t.desc}
          ${t.requires ? `<br><small>⚠️ Requer: ${TRANSFORM_SHOP_DEFS.find(x=>x.id===t.requires)?.name || t.requires}</small>` : ''}
          ${!levelOk ? `<br><small style="color:#ff6666">Nível ${t.reqLevel} necessário (atual: ${G.level})</small>` : ''}
          ${!requiresOk ? `<br><small style="color:#ff8866">Desbloqueie a transformação anterior primeiro.</small>` : ''}
        </div>
        <div class="shop-item-footer">
          <span class="shop-item-price" style="color:${t.color}">${unlocked ? '✓ POSSUÍDA' : t.price + ' Z'}</span>
          <button class="btn btn-sm" style="${unlocked ? 'background:#1a2a1a;color:#44cc44;border-color:#44cc44' : `background:${t.color}22;border-color:${t.color};color:${t.color}`}"
            ${unlocked || !canBuy ? 'disabled' : ''}>${unlocked ? 'Desbloqueada' : 'Comprar'}</button>
        </div>`;
      if (!unlocked && canBuy) {
        el.querySelector('button').onclick = () => {
          if (G.zeni < t.price) return;
          G.zeni -= t.price;
          G.unlockedTransforms = G.unlockedTransforms || [];
          G.unlockedTransforms.push(t.id);
          log('gain', `🔱 Transformação desbloqueada: ${t.name}!`);
          showNotif(`🔱 ${t.name} desbloqueada!`);
          renderShop();
          updateUI();
        };
      }
      grid.appendChild(el);
    });
  }

  // ── PERSONALIZAÇÃO ───────────────────────────────────
  const custHeader = document.createElement('div');
  custHeader.className = 'shop-villain-header';
  custHeader.innerHTML = '<span>🎨 Personalização</span><small>Customize a aparência do seu guerreiro.</small>';
  grid.appendChild(custHeader);

  const custEl = document.createElement('div');
  custEl.className = 'shop-customization-panel';
  const cust = G.customization || {};

  const SUIT_COLORS = [
    { label: 'Original', value: null },
    { label: 'Laranja', value: '#ff6600' }, { label: 'Azul', value: '#2244cc' },
    { label: 'Vermelho', value: '#cc2222' }, { label: 'Verde', value: '#228844' },
    { label: 'Roxo', value: '#772299' }, { label: 'Preto', value: '#1a1a2e' },
    { label: 'Dourado', value: '#ccaa00' }, { label: 'Ciano', value: '#00aacc' }
  ];
  const HAIR_COLORS = [
    { label: 'Original', value: null },
    { label: 'Preto', value: '#1a1a1a' }, { label: 'Castanho', value: '#3a2010' },
    { label: 'Loiro', value: '#ccaa00' }, { label: 'Branco', value: '#ddeeff' },
    { label: 'Azul', value: '#1144aa' }, { label: 'Roxo', value: '#662299' },
    { label: 'Vermelho', value: '#aa1111' }, { label: 'Rosa', value: '#dd6699' }
  ];
  const EMBLEMS = ['⚡','🔥','💫','🌊','🌙','☀️','❄️','🌀','💀','🐉','👑','⚔️'];
  const TITLES = ['', 'O Lendário', 'A Lenda Viva', 'Destruidor de Mundos', 'Protetor do Universo',
    'O Indomável', 'Espírito de Combate', 'Além dos Deuses', 'Guerreiro Eterno', 'O Último Saiyajin'];

  custEl.innerHTML = `
    <div class="cust-row">
      <label>🥋 Cor do Traje</label>
      <div class="cust-swatches" id="cust-suit-swatches">
        ${SUIT_COLORS.map(sc => `
          <div class="cust-swatch ${cust.suitColor === sc.value ? 'selected' : ''}" 
               data-val="${sc.value || ''}" 
               style="background:${sc.value || '#888'};${!sc.value ? 'background:linear-gradient(135deg,#888 50%,#ccc 50%)' : ''}"
               title="${sc.label}"></div>
        `).join('')}
      </div>
    </div>
    <div class="cust-row">
      <label>💇 Cor do Cabelo</label>
      <div class="cust-swatches" id="cust-hair-swatches">
        ${HAIR_COLORS.map(hc => `
          <div class="cust-swatch ${cust.hairColor === hc.value ? 'selected' : ''}" 
               data-val="${hc.value || ''}" 
               style="background:${hc.value || '#888'};${!hc.value ? 'background:linear-gradient(135deg,#888 50%,#ccc 50%)' : ''}"
               title="${hc.label}"></div>
        `).join('')}
      </div>
    </div>
    <div class="cust-row">
      <label>✨ Emblema</label>
      <div class="cust-emblems" id="cust-emblems">
        ${EMBLEMS.map(e => `<div class="cust-emblem ${cust.emblem === e ? 'selected' : ''}" data-val="${e}">${e}</div>`).join('')}
      </div>
    </div>
    <div class="cust-row">
      <label>👑 Título</label>
      <select id="cust-title-select" style="width:100%;padding:6px 10px;background:#0a0a1a;color:#dde0ff;border:1px solid #334;border-radius:6px;font-family:inherit">
        ${TITLES.map(t => `<option value="${t}" ${cust.title === t ? 'selected' : ''}>${t || '(sem título)'}</option>`).join('')}
      </select>
    </div>
    <div class="cust-row">
      <label>💬 Lema do Guerreiro</label>
      <input id="cust-motto-input" type="text" maxlength="40" placeholder="ex: Meu poder não tem limites!" 
             value="${cust.motto || ''}"
             style="width:100%;padding:6px 10px;background:#0a0a1a;color:#dde0ff;border:1px solid #334;border-radius:6px;font-family:inherit;box-sizing:border-box"/>
    </div>
    <div style="display:flex;gap:8px;margin-top:8px;">
      <button class="btn btn-gold btn-sm" id="cust-apply-btn" style="flex:1">✅ Aplicar</button>
      <button class="btn btn-sm" id="cust-reset-btn" style="flex:0;background:#1a0a0a;border-color:#663333;color:#cc6666">↩️ Reset</button>
    </div>
  `;
  grid.appendChild(custEl);

  // Swatch click handlers
  custEl.querySelectorAll('#cust-suit-swatches .cust-swatch').forEach(sw => {
    sw.onclick = () => {
      custEl.querySelectorAll('#cust-suit-swatches .cust-swatch').forEach(x => x.classList.remove('selected'));
      sw.classList.add('selected');
    };
  });
  custEl.querySelectorAll('#cust-hair-swatches .cust-swatch').forEach(sw => {
    sw.onclick = () => {
      custEl.querySelectorAll('#cust-hair-swatches .cust-swatch').forEach(x => x.classList.remove('selected'));
      sw.classList.add('selected');
    };
  });
  custEl.querySelectorAll('#cust-emblems .cust-emblem').forEach(em => {
    em.onclick = () => {
      custEl.querySelectorAll('#cust-emblems .cust-emblem').forEach(x => x.classList.remove('selected'));
      em.classList.add('selected');
    };
  });

  custEl.querySelector('#cust-apply-btn').onclick = () => {
    const suit = custEl.querySelector('#cust-suit-swatches .cust-swatch.selected');
    const hair = custEl.querySelector('#cust-hair-swatches .cust-swatch.selected');
    const emblem = custEl.querySelector('#cust-emblems .cust-emblem.selected');
    G.customization.suitColor = suit ? (suit.dataset.val || null) : null;
    G.customization.hairColor = hair ? (hair.dataset.val || null) : null;
    G.customization.emblem = emblem ? emblem.dataset.val : '⚡';
    G.customization.title = custEl.querySelector('#cust-title-select').value;
    G.customization.motto = custEl.querySelector('#cust-motto-input').value.trim();
    log('info', `🎨 Visual atualizado! Título: ${G.customization.title || 'Nenhum'}`);
    showNotif('🎨 Visual salvo!');
    updateUI();
    saveGame(false);
  };

  custEl.querySelector('#cust-reset-btn').onclick = () => {
    G.customization = { suitColor: null, hairColor: null, skinColor: null, title: '', motto: '', emblem: '⚡', auraStyle: 'default' };
    log('info', '🎨 Visual resetado para o padrão da raça.');
    renderShop();
    updateUI();
  };
}

function renderAchievements() {
  const list = document.getElementById('achievement-list');
  if (!list) return;
  list.innerHTML = '';
  ACHIEVEMENT_DEFS.forEach(a => {
    const ok = G.achievements[a.id];
    const el = document.createElement('div');
    el.className = 'achievement-entry' + (ok ? ' unlocked' : '');
    el.innerHTML = `
      <div class="ach-icon-big">${a.icon}</div>
      <div>
        <div class="ach-name">${a.name}</div>
        <div class="ach-desc">${a.desc}</div>
      </div>
      <div class="ach-check">${ok ? '★' : ''}</div>`;
    list.appendChild(el);
  });
}

function checkAchievements() {
  const unlock = (id) => {
    if (G.achievements[id]) return;
    G.achievements[id] = true;
    const a = ACHIEVEMENT_DEFS.find(x => x.id === id);
    log('event', `🏆 Conquista: ${a ? a.name : id}!`);
    showNotif('🏆 ' + (a ? a.name : id));
  };

  if (G.battlesWon >= 1) unlock('firstblood');
  if (G.transform !== 'normal' && (G.race === 'saiyajin' || G.race === 'meio-saiyajin' || G.race === 'majin')) {
    if (['ssj', 'ssj2', 'ssj3'].includes(G.transform)) unlock('ssj');
  }
  if (G.zeni >= 5000) unlock('rich');
  if (G.bossDefeated.vegeta) unlock('vegeta');
  if (Array.isArray(G.storyCompleted) && G.storyCompleted.includes('s_cell_perfect')) unlock('story_cell');
}