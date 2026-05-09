// ═══════════════════════════════════════════════════════
// VILLAIN-SHOP.JS — Loja Maldita (Prestígio 1+)
// Todos os itens compráveis uma vez. Transformações vilão
// exigem Marca Majin. SSJ2 Majin incluso.
// ═══════════════════════════════════════════════════════

const VILLAIN_SHOP_ITEMS = [

  // ══ ACESSÓRIOS ═══════════════════════════════════════

  {
    id: 'majin_mark',
    category: 'acessorio',
    icon: '😈',
    name: 'Marca Majin',
    desc: 'Símbolo de Babidi gravado na testa. +8 Força, +8 KiAtk permanentes. Necessária para todas as transformações vilão.',
    price: 2800,
    alignEvil: 3,
    races: null,
    requiresItem: null,
    requiresTransform: null,
    oneTime: true,
    effect(G) {
      G.customization.majinMark = true;
      G.forca  += 8;
      G.kiAtk  += 8;
      G.powerLevel = calcPowerLevel();
    },
    owned(G) { return !!G.customization?.majinMark; }
  },
  {
    id: 'scouter_red',
    category: 'acessorio',
    icon: '🔴',
    name: 'Leitor de Poder Vermelho',
    desc: '+5 Velocidade permanente. Revela HP e ATK do inimigo antes das batalhas.',
    price: 1200,
    alignEvil: 0,
    races: null,
    requiresItem: null,
    requiresTransform: null,
    oneTime: true,
    effect(G) { G.customization.scouterRed = true; G.velocidade += 5; G.powerLevel = calcPowerLevel(); },
    owned(G) { return !!G.customization?.scouterRed; }
  },
  {
    id: 'dark_armor',
    category: 'acessorio',
    icon: '🖤',
    name: 'Armadura das Trevas',
    desc: '+12 Defesa permanente. Imunidade ao primeiro golpe crítico por batalha.',
    price: 3500,
    alignEvil: 5,
    races: null,
    requiresItem: null,
    requiresTransform: null,
    oneTime: true,
    effect(G) { G.customization.darkArmor = true; G.defesa += 12; G.powerLevel = calcPowerLevel(); },
    owned(G) { return !!G.customization?.darkArmor; }
  },
  {
    id: 'ki_suppressor',
    category: 'acessorio',
    icon: '⛓️',
    name: 'Supressor de Ki',
    desc: 'Oculta seu poder real. +20% dano no primeiro turno de cada batalha.',
    price: 1800,
    alignEvil: 0,
    races: null,
    requiresItem: null,
    requiresTransform: null,
    oneTime: true,
    effect(G) { G.customization.kiSuppressor = true; },
    owned(G) { return !!G.customization?.kiSuppressor; }
  },
  {
    id: 'broken_halo',
    category: 'acessorio',
    icon: '💀',
    name: 'Auréola Quebrada',
    desc: '+20 Ki máx e +8 KiAtk permanentes. Aura negra exclusiva.',
    price: 4200,
    alignEvil: 8,
    races: null,
    requiresItem: null,
    requiresTransform: null,
    oneTime: true,
    effect(G) {
      G.customization.brokenHalo = true;
      G.maxKi += 20;
      G.ki = Math.min(G.maxKi, G.ki + 20);
      G.kiAtk += 8;
      G.powerLevel = calcPowerLevel();
    },
    owned(G) { return !!G.customization?.brokenHalo; }
  },
  {
    id: 'babidi_ring',
    category: 'acessorio',
    icon: '💍',
    name: 'Anel de Babidi',
    desc: '+10 KiAtk e +6 Força permanentes. +2 Alinhamento Maligno ao equipar.',
    price: 2000,
    alignEvil: 2,
    races: null,
    requiresItem: null,
    requiresTransform: null,
    oneTime: true,
    effect(G) {
      G.customization.babidiRing = true;
      G.kiAtk += 10; G.forca += 6;
      G.alignmentEvil = (G.alignmentEvil || 0) + 2;
      G.powerLevel = calcPowerLevel();
    },
    owned(G) { return !!G.customization?.babidiRing; }
  },

  // ══ TRANSFORMAÇÕES (todas exigem Marca Majin) ════════

  {
    id: 'majin_transform',
    category: 'transformacao',
    icon: '😈',
    name: 'Majinização',
    desc: 'Controle de Babidi: +25% em todos os atributos. Disponível para qualquer raça. Exige Marca Majin.',
    price: 5500,
    alignEvil: 6,
    races: null,
    requiresItem: 'majin_mark',
    requiresTransform: null,
    oneTime: true,
    effect(G) {
      if (!G.unlockedTransforms.includes('majinized')) G.unlockedTransforms.push('majinized');
      G.forca      = Math.round(G.forca      * 1.25);
      G.defesa     = Math.round(G.defesa     * 1.25);
      G.velocidade = Math.round(G.velocidade * 1.25);
      G.kiAtk      = Math.round(G.kiAtk      * 1.25);
      G.powerLevel = calcPowerLevel();
    },
    owned(G) { return (G.unlockedTransforms || []).includes('majinized'); }
  },
  {
    id: 'dark_ssj',
    category: 'transformacao',
    icon: '🖤⚡',
    name: 'Super Saiyajin Sombrio',
    desc: 'SSJ corrompido por Babidi. Cabelo negro com raios escuros. 12× de poder. Exige SSJ + Marca Majin.',
    price: 7000,
    alignEvil: 10,
    races: ['saiyajin', 'meio-saiyajin'],
    requiresItem: 'majin_mark',
    requiresTransform: 'ssj',
    oneTime: true,
    effect(G) {
      if (!G.unlockedTransforms.includes('dark_ssj')) G.unlockedTransforms.push('dark_ssj');
    },
    owned(G) { return (G.unlockedTransforms || []).includes('dark_ssj'); }
  },
  {
    id: 'majin_ssj2',
    category: 'transformacao',
    icon: '😈⚡',
    name: 'Super Saiyajin 2 Majin',
    desc: 'SSJ2 com Marca Majin ativa. Eletricidade roxa e aura sombria. 55× de poder. Exige SSJ2 + Marca Majin.',
    price: 8500,
    alignEvil: 12,
    races: ['saiyajin', 'meio-saiyajin'],
    requiresItem: 'majin_mark',
    requiresTransform: 'ssj2',
    oneTime: true,
    effect(G) {
      if (!G.unlockedTransforms.includes('majin_ssj2')) G.unlockedTransforms.push('majin_ssj2');
    },
    owned(G) { return (G.unlockedTransforms || []).includes('majin_ssj2'); }
  },
  {
    id: 'dark_namek',
    category: 'transformacao',
    icon: '🟣',
    name: 'Namek Corrompido',
    desc: 'Fusão Namek tomada por energia sombria. 7× poder + roubo de vida passivo. Exige Marca Majin.',
    price: 6000,
    alignEvil: 8,
    races: ['namekusei'],
    requiresItem: 'majin_mark',
    requiresTransform: null,
    oneTime: true,
    effect(G) {
      if (!G.unlockedTransforms.includes('dark_namek')) G.unlockedTransforms.push('dark_namek');
    },
    owned(G) { return (G.unlockedTransforms || []).includes('dark_namek'); }
  },
  {
    id: 'majin_android',
    category: 'transformacao',
    icon: '🖤🤖',
    name: 'Núcleo Corrompido',
    desc: 'Androide reconfigurado por magia de Babidi. +15 a todos os atributos. Exige Marca Majin.',
    price: 6500,
    alignEvil: 8,
    races: ['androide'],
    requiresItem: 'majin_mark',
    requiresTransform: null,
    oneTime: true,
    effect(G) {
      if (!G.unlockedTransforms.includes('majin_android')) G.unlockedTransforms.push('majin_android');
      G.forca += 15; G.defesa += 15; G.velocidade += 15; G.kiAtk += 15;
      G.powerLevel = calcPowerLevel();
    },
    owned(G) { return (G.unlockedTransforms || []).includes('majin_android'); }
  },

  // ══ CONSUMÍVEIS (compráveis múltiplas vezes) ══════════

  {
    id: 'dark_senzu',
    category: 'consumivel',
    icon: '🖤🫘',
    name: 'Senzu Venenosa',
    desc: 'Restaura HP, Ki e Stamina. +10% dano nas próximas 3 batalhas. Compre apenas uma vez.',
    price: 450,
    alignEvil: 0,
    races: null,
    requiresItem: null,
    requiresTransform: null,
    oneTime: true,
    effect(G) { G.inventory.darkSenzu = (G.inventory.darkSenzu || 0) + 1; G.customization.boughtDarkSenzu = true; },
    owned(G) { return !!G.customization?.boughtDarkSenzu; }
  },
  {
    id: 'energy_stone',
    category: 'consumivel',
    icon: '💜',
    name: 'Pedra de Energia Sombria',
    desc: '+30 Ki máx e +5 KiAtk permanentes. Compre apenas uma vez.',
    price: 2200,
    alignEvil: 4,
    races: null,
    requiresItem: null,
    requiresTransform: null,
    oneTime: true,
    effect(G) {
      G.customization.boughtEnergyStone = true;
      G.maxKi += 30;
      G.ki = Math.min(G.maxKi, G.ki + 30);
      G.kiAtk += 5;
      G.powerLevel = calcPowerLevel();
    },
    owned(G) { return !!G.customization?.boughtEnergyStone; }
  },
  {
    id: 'rage_boost',
    category: 'consumivel',
    icon: '🔴',
    name: 'Estimulante de Fúria',
    desc: '+20 Força por 5 dias de jogo. Compre apenas uma vez.',
    price: 880,
    alignEvil: 2,
    races: null,
    requiresItem: null,
    requiresTransform: null,
    oneTime: true,
    effect(G) {
      G.customization.boughtRageBoost = true;
      G.forca += 20;
      G._rageDays = (G._rageDays || 0) + 5;
      G.powerLevel = calcPowerLevel();
    },
    owned(G) { return !!G.customization?.boughtRageBoost; }
  },
  {
    id: 'dark_ki_crystal',
    category: 'consumivel',
    icon: '🔮',
    name: 'Cristal de Ki Negro',
    desc: '+15 a todos os atributos de uma vez. Compre apenas uma vez.',
    price: 4800,
    alignEvil: 6,
    races: null,
    requiresItem: null,
    requiresTransform: null,
    oneTime: true,
    effect(G) {
      G.customization.boughtDarkKiCrystal = true;
      G.forca += 15; G.defesa += 15; G.velocidade += 15; G.kiAtk += 15;
      G.powerLevel = calcPowerLevel();
    },
    owned(G) { return !!G.customization?.boughtDarkKiCrystal; }
  }
];

const VILLAIN_SHOP_CATEGORIES = [
  { id: 'todos',          label: '⚔️ Todos' },
  { id: 'acessorio',     label: '💎 Acessórios' },
  { id: 'transformacao', label: '😈 Transformações' },
  { id: 'consumivel',    label: '🧪 Consumíveis' }
];

let villainShopCategory = 'todos';

// ─── HELPERS ──────────────────────────────────────────
function _vshopItemFlagKey(itemId) {
  const map = {
    majin_mark:    'majinMark',
    scouter_red:   'scouterRed',
    dark_armor:    'darkArmor',
    ki_suppressor: 'kiSuppressor',
    broken_halo:   'brokenHalo',
    babidi_ring:   'babidiRing'
  };
  return map[itemId] || itemId;
}

function _vshopItemLabel(itemId) {
  const item = VILLAIN_SHOP_ITEMS.find(i => i.id === itemId);
  return item ? item.name : itemId;
}

// ─── RENDER ───────────────────────────────────────────
function renderVillainShop() {
  const container = document.getElementById('villain-shop-content');
  if (!container) return;

  const rank = G.prestigeRank || 0;

  if (rank < 1) {
    container.innerHTML = `
      <div class="villain-shop-locked">
        <div class="vshop-lock-icon">🔒</div>
        <h2>LOJA MALDITA</h2>
        <p>Disponível após o <strong>Prestígio 1</strong>.</p>
        <p class="vshop-lock-sub">Complete toda a história principal (Raditz → Cell Perfeito) e prestige.</p>
        ${(typeof canPrestige === 'function' && canPrestige())
          ? '<button class="btn btn-gold" onclick="openPrestigeModal()">🔥 Prestigiar Agora</button>'
          : ''}
      </div>`;
    return;
  }

  const alignEvil = G.alignmentEvil || 0;

  const filterHtml = VILLAIN_SHOP_CATEGORIES.map(cat =>
    `<button class="vshop-cat-btn ${villainShopCategory === cat.id ? 'active' : ''}"
       onclick="setVillainShopCat('${cat.id}')">${cat.label}</button>`
  ).join('');

  const items = VILLAIN_SHOP_ITEMS.filter(i =>
    villainShopCategory === 'todos' || i.category === villainShopCategory
  );

  const itemsHtml = items.map(item => {
    const isOwned        = item.owned(G);
    const meetsAlign     = alignEvil >= (item.alignEvil || 0);
    const meetsRace      = !item.races || item.races.includes(G.race);
    const meetsItem      = !item.requiresItem || !!G.customization?.[ _vshopItemFlagKey(item.requiresItem) ];
    const meetsTrans     = !item.requiresTransform || (G.unlockedTransforms || []).includes(item.requiresTransform);
    const blocked        = !meetsAlign || !meetsRace || !meetsItem || !meetsTrans;
    const cantAfford     = G.zeni < item.price;
    const alreadyOwned   = item.oneTime && isOwned;
    const canBuy         = !blocked && !cantAfford && !alreadyOwned;

    const lockReasons = [];
    if (!meetsAlign)  lockReasons.push(`Alinhamento Maligno ≥ ${item.alignEvil} (atual: ${alignEvil})`);
    if (!meetsRace)   lockReasons.push(`Raça necessária: ${item.races?.join(' ou ')}`);
    if (!meetsItem)   lockReasons.push(`Requer: ${_vshopItemLabel(item.requiresItem)}`);
    if (!meetsTrans)  lockReasons.push(`Requer transformação: ${item.requiresTransform?.toUpperCase()}`);

    let btnLabel = 'Comprar';
    if (alreadyOwned) btnLabel = '✓ Possuído';
    else if (blocked) btnLabel = '🔒 Bloqueado';
    else if (cantAfford) btnLabel = 'Sem Zeni';

    return `
      <div class="vshop-item ${alreadyOwned ? 'owned' : ''} ${blocked ? 'blocked' : ''}">
        <div class="vshop-item-icon">${item.icon}</div>
        <div class="vshop-item-body">
          <div class="vshop-item-name">
            ${item.name}
            ${alreadyOwned ? '<span class="vshop-owned-badge">✓</span>' : ''}
            ${item.alignEvil > 0 ? `<span class="vshop-evil-req">😈 Mal≥${item.alignEvil}</span>` : ''}
            ${!item.oneTime ? '<span class="vshop-repeat-badge">∞ ilimitado</span>' : ''}
          </div>
          <div class="vshop-item-desc">${item.desc}</div>
          ${item.races ? `<div class="vshop-item-race">Raças: ${item.races.join(', ')}</div>` : ''}
          ${item.requiresItem ? `<div class="vshop-item-req">⚠️ Requer: ${_vshopItemLabel(item.requiresItem)}</div>` : ''}
          ${item.requiresTransform ? `<div class="vshop-item-req">⚠️ Requer: ${item.requiresTransform.toUpperCase()}</div>` : ''}
          ${lockReasons.map(r => `<div class="vshop-lock-reason">🔒 ${r}</div>`).join('')}
        </div>
        <div class="vshop-item-price">
          <span class="vshop-price-val">${item.price.toLocaleString()} Z</span>
          <button class="btn btn-red btn-sm vshop-buy-btn"
            ${!canBuy ? 'disabled' : ''}
            onclick="buyVillainItem('${item.id}')">${btnLabel}</button>
        </div>
      </div>`;
  }).join('');

  container.innerHTML = `
    <div class="vshop-header-bar">
      <div class="vshop-prestige-badge">
        😈 Prestígio ${rank} &nbsp;·&nbsp; Mal: ${alignEvil} &nbsp;·&nbsp; Zeni: ${G.zeni.toLocaleString()}
      </div>
    </div>
    <div class="vshop-cat-filter">${filterHtml}</div>
    <div class="vshop-items">${itemsHtml}</div>`;
}

function setVillainShopCat(cat) {
  villainShopCategory = cat;
  renderVillainShop();
}

function buyVillainItem(itemId) {
  const item = VILLAIN_SHOP_ITEMS.find(i => i.id === itemId);
  if (!item) return;

  if (item.oneTime && item.owned(G))                                           { log('info', 'Item já possuído.'); return; }
  if (G.zeni < item.price)                                                      { log('warn', '💸 Zeni insuficiente.'); showNotif('💸 Sem Zeni!'); return; }
  if ((G.alignmentEvil || 0) < (item.alignEvil || 0))                          { log('warn', '⚠️ Alinhamento maligno insuficiente.'); showNotif('⚠️ Mal insuficiente!'); return; }
  if (item.races && !item.races.includes(G.race))                               { log('warn', '⚠️ Raça incompatível.'); showNotif('⚠️ Raça errada!'); return; }
  if (item.requiresItem && !G.customization?.[ _vshopItemFlagKey(item.requiresItem) ]) {
    log('warn', `⚠️ Requer: ${_vshopItemLabel(item.requiresItem)}.`);
    showNotif(`⚠️ Compre ${_vshopItemLabel(item.requiresItem)} primeiro!`);
    return;
  }
  if (item.requiresTransform && !(G.unlockedTransforms || []).includes(item.requiresTransform)) {
    log('warn', `⚠️ Requer: ${item.requiresTransform.toUpperCase()}.`);
    showNotif(`⚠️ Desbloqueie ${item.requiresTransform.toUpperCase()} primeiro!`);
    return;
  }

  mutate({ zeni: G.zeni - item.price });
  item.effect(G);
  G.powerLevel = calcPowerLevel();

  log('event', `😈 ${item.name} adquirido!`);
  showNotif(`😈 ${item.name}`);
  checkAchievements();
  updateUI();
  renderVillainShop();
}

function initVillainShopTab() {
  renderVillainShop();
}