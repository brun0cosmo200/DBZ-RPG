// ═══════════════════════════════════════════════════════
// MASTERS.JS — NPCs Mestres: Kame, Piccolo, Rei Kai
// Treino diário consecutivo → técnicas únicas
// ═══════════════════════════════════════════════════════

const MASTERS = {
  kame: {
    id: 'kame',
    name: 'Mestre Kame',
    icon: '🐢',
    title: 'Mestre da Tartaruga',
    portrait: '🐢',
    alignment: 'good', // requer alignmentGood >= threshold
    alignThreshold: 5,
    location: 'Terra — Kame House',
    desc: 'O mestre pervertido com sabedoria infinita. Ensina o Kamehameha em sua forma mais pura.',
    flavor: '"A força não vem dos músculos — vem do coração... e de muito treino."',
    dailyStamCost: 15,
    // Progressão: daysWithMaster => técnicas desbloqueadas
    techniques: [
      {
        day: 1,
        name: 'Kamehameha Básico',
        id: 'kame_t1',
        icon: '🌊',
        desc: '+12% dano de Ki permanente. Fundação da onda de Ki.',
        effect: (G) => { G.kiAtk = Math.round(G.kiAtk * 1.12); G.powerLevel = calcPowerLevel(); }
      },
      {
        day: 4,
        name: 'Concentração Solar',
        id: 'kame_t2',
        icon: '☀️',
        desc: 'Meditação restaura +35% Ki (era 22%). Técnica de foco extremo.',
        effect: (G) => { G._kameConcentration = true; }
      },
      {
        day: 8,
        name: 'Kamehameha Supremo',
        id: 'kame_t3',
        icon: '🌊🌊',
        desc: '+20% dano do especial e +8 KiAtk permanente. A onda definitiva.',
        effect: (G) => { G.kiAtk += 8; G.powerLevel = calcPowerLevel(); }
      },
      {
        day: 15,
        name: 'Ondas Controladas',
        id: 'kame_t4',
        icon: '💫',
        desc: '+15 Ki máximo e custo de Ki em combate reduzido em 10%.',
        effect: (G) => { G.maxKi += 15; G.ki = Math.min(G.maxKi, G.ki + 15); G._kameCostReduce = 0.10; }
      }
    ]
  },
  piccolo: {
    id: 'piccolo',
    name: 'Piccolo',
    icon: '👘',
    title: 'O Guerreiro Demônio',
    portrait: '👘',
    alignment: 'neutral', // sem requisito de alinhamento
    alignThreshold: 0,
    location: 'Terra — Penhasco da Batalha',
    desc: 'Treinador brutal. Sem misericórdia, sem desculpas. Seu método forma campeões.',
    flavor: '"Você é fraco. Mas isso muda hoje — ou você morre tentando."',
    dailyStamCost: 25, // mais pesado
    techniques: [
      {
        day: 1,
        name: 'Pressão Demoníaca',
        id: 'pic_t1',
        icon: '👊',
        desc: '+8 Força e +5 Defesa permanentes. O peso do treinamento demônio.',
        effect: (G) => { G.forca += 8; G.defesa += 5; G.powerLevel = calcPowerLevel(); }
      },
      {
        day: 5,
        name: 'Makankosappo',
        id: 'pic_t2',
        icon: '🌀',
        desc: '+18% dano de Ki e chance de perfurar defesa (15% em combate).',
        effect: (G) => { G.kiAtk = Math.round(G.kiAtk * 1.18); G._piccPierce = 0.15; G.powerLevel = calcPowerLevel(); }
      },
      {
        day: 10,
        name: 'Treinamento com Cargas',
        id: 'pic_t3',
        icon: '⛓️',
        desc: '+10 Força, +8 Defesa, +6 Velocidade. Traje de 100kg por 10 dias.',
        effect: (G) => { G.forca += 10; G.defesa += 8; G.velocidade += 6; G.powerLevel = calcPowerLevel(); }
      },
      {
        day: 20,
        name: 'Sincronização Namek',
        id: 'pic_t4',
        icon: '🟢',
        desc: 'Regenera 8% HP no início de cada turno em combate. Legado Namekusei.',
        effect: (G) => { G._piccoloRegen = 0.08; }
      }
    ]
  },
  kaio: {
    id: 'kaio',
    name: 'Rei Kai',
    icon: '👴',
    title: 'Deus dos Planetas do Norte',
    portrait: '👴',
    alignment: 'good',
    alignThreshold: 10,
    location: 'Planeta do Rei Kai',
    desc: 'Treino no planeta com 10× a gravidade. Transforma mortais em algo próximo de lendas.',
    flavor: '"Hahaha! Você acha que 10G é pesado? Meu planeta ri da sua fraqueza!"',
    dailyStamCost: 30, // o mais caro
    techniques: [
      {
        day: 1,
        name: 'Treinamento 10G',
        id: 'kaio_t1',
        icon: '🌍',
        desc: '+6 em todos os atributos. A gravidade forja o corpo.',
        effect: (G) => { G.forca += 6; G.defesa += 6; G.velocidade += 6; G.kiAtk += 6; G.powerLevel = calcPowerLevel(); }
      },
      {
        day: 3,
        name: 'Kaioken × 2',
        id: 'kaio_t2',
        icon: '🔴',
        desc: 'Em combate, primeiro ataque causa 2× dano (uma vez por batalha).',
        effect: (G) => { G._kaioken = 2; }
      },
      {
        day: 7,
        name: 'Kaioken × 10',
        id: 'kaio_t3',
        icon: '🔴🔴',
        desc: 'Kaioken aprimorado: primeiro ataque 3× dano. Risco: -15% HP.',
        effect: (G) => { G._kaioken = 3; }
      },
      {
        day: 14,
        name: 'Espírito Bomba',
        id: 'kaio_t4',
        icon: '🔵',
        desc: 'Especial exclusivo: Espírito Bomba causa +45% dano extra (uma vez por combate).',
        effect: (G) => { G._spiritBomb = true; }
      }
    ]
  },
  freeza: {
    id: 'freeza',
    name: 'Lorde Freeza',
    icon: '🦀',
    title: 'Imperador do Mal',
    portrait: '🦀',
    alignment: 'evil',
    alignThreshold: 8,
    location: 'Nave de Freeza',
    desc: 'Treinamento cruel focado em dominação e eficiência brutal.',
    flavor: '"Vou te ensinar como governar com o medo. Preste atenção!"',
    dailyStamCost: 20,
    techniques: [
      {
        day: 1,
        name: 'Crueldade Fria',
        id: 'fz_t1',
        icon: '🔪',
        desc: '+10 KiAtk permanentes. Dano aumentado contra oponentes com HP baixo.',
        effect: (G) => { G.kiAtk += 10; G.powerLevel = calcPowerLevel(); G._freezaCruel = true; }
      },
      {
        day: 4,
        name: 'Death Beam Rápido',
        id: 'fz_t2',
        icon: '🔴',
        desc: 'Velocidade +8. Seu primeiro ataque do combate não pode ser esquivado.',
        effect: (G) => { G.velocidade += 8; G.powerLevel = calcPowerLevel(); G._freezaSureHit = true; }
      },
      {
        day: 8,
        name: 'Telecinésia de Asfixia',
        id: 'fz_t3',
        icon: '🤚',
        desc: '10% de chance de reduzir a defesa inimiga permanentemente no combate.',
        effect: (G) => { G._freezaChoke = 0.1; }
      },
      {
        day: 14,
        name: 'Sobrevivência Absoluta',
        id: 'fz_t4',
        icon: '💀',
        desc: 'Se o HP chegar a 0, sobrevive com 1 HP uma vez por combate.',
        effect: (G) => { G._survive1HP = true; }
      }
    ]
  },
  babidi: {
    id: 'babidi',
    name: 'Mago Babidi',
    icon: '🧙',
    title: 'Mestre da Magia Negra',
    portrait: '🧙',
    alignment: 'evil',
    alignThreshold: 15,
    location: 'Nave Oculta de Babidi',
    desc: 'Manipulação e magia. Ele extrai o pior de você para amplificar seu poder.',
    flavor: '"Vou liberar todo o seu potencial adormecido... pela dor!"',
    dailyStamCost: 18,
    techniques: [
      {
        day: 2,
        name: 'Escudo Mágico',
        id: 'bab_t1',
        icon: '🛡️',
        desc: '+12 Defesa permanentes. Reduz o dano de Ki recebido.',
        effect: (G) => { G.defesa += 12; G.powerLevel = calcPowerLevel(); G._babidiShield = true; }
      },
      {
        day: 5,
        name: 'Manipulação Mental',
        id: 'bab_t2',
        icon: '🧠',
        desc: 'Inimigo tem 15% de chance de perder o turno de ataque.',
        effect: (G) => { G._babidiMindControl = 0.15; }
      },
      {
        day: 12,
        name: 'Despertar Majin Básico',
        id: 'bab_t3',
        icon: '😈',
        desc: '+20 Força e +20 KiAtk permanentes. O custo é sua alma.',
        effect: (G) => { G.forca += 20; G.kiAtk += 20; G.powerLevel = calcPowerLevel(); }
      }
    ]
  }
};

// ─── MASTER STATE ──────────────────────────────────────
// G.masterTraining = { masterId: 'kame', consecutiveDays: 0, unlockedTechs: [], lastDay: 0 }

function initMasterState() {
  if (!G.masterTraining) {
    G.masterTraining = { masterId: null, consecutiveDays: 0, unlockedTechs: [], lastDay: 0 };
  }
}

function openMastersModal() {
  initMasterState();
  const modal = document.getElementById('masters-modal');
  if (!modal) return;
  renderMastersModal();
  modal.classList.add('show');
}

function closeMastersModal() {
  const modal = document.getElementById('masters-modal');
  if (modal) modal.classList.remove('show');
}

function renderMastersModal() {
  const container = document.getElementById('masters-list');
  if (!container) return;
  initMasterState();

  const mt = G.masterTraining;
  container.innerHTML = '';

  Object.values(MASTERS).forEach(master => {
    let meetsAlign = true;
    let lockMsg = '';
    if (master.alignment === 'good') {
      meetsAlign = G.alignmentGood >= master.alignThreshold;
      lockMsg = `🔒 Requer Bondade ≥ ${master.alignThreshold} (atual: ${G.alignmentGood || 0})`;
    } else if (master.alignment === 'evil') {
      meetsAlign = (G.alignmentEvil || 0) >= master.alignThreshold;
      lockMsg = `🔒 Requer Malignidade ≥ ${master.alignThreshold} (atual: ${G.alignmentEvil || 0})`;
    }

    const isActive = mt.masterId === master.id;
    const days = isActive ? mt.consecutiveDays : 0;

    // Técnicas
    const techsHtml = master.techniques.map(t => {
      const unlocked = mt.unlockedTechs.includes(t.id);
      const available = days >= t.day && !unlocked;
      return `<div class="master-tech ${unlocked ? 'unlocked' : ''} ${available ? 'available' : ''}">
        <span class="master-tech-icon">${t.icon}</span>
        <div class="master-tech-body">
          <div class="master-tech-name">${t.name} ${unlocked ? '<span class="tech-badge-ok">✓</span>' : ''}</div>
          <div class="master-tech-desc">${t.desc}</div>
          <div class="master-tech-req">Dia ${t.day} consecutivo${unlocked ? ' — Aprendida!' : ''}</div>
        </div>
        ${available && isActive ? `<button class="btn btn-gold btn-sm" onclick="learnMasterTech('${master.id}','${t.id}')">Aprender</button>` : ''}
      </div>`;
    }).join('');

    const card = document.createElement('div');
    card.className = `master-card ${isActive ? 'master-active' : ''} ${!meetsAlign ? 'master-locked' : ''}`;
    card.innerHTML = `
      <div class="master-header">
        <div class="master-portrait">${master.icon}</div>
        <div class="master-info">
          <div class="master-name">${master.name} <span class="master-title-tag">${master.title}</span></div>
          <div class="master-location">📍 ${master.location}</div>
          <div class="master-flavor">${master.flavor}</div>
          ${!meetsAlign ? `<div class="master-lock-msg">${lockMsg}</div>` : ''}
          ${isActive ? `<div class="master-days-badge">🗓️ Dia ${days} com este mestre · Stamina −${master.dailyStamCost}/dia</div>` : ''}
        </div>
      </div>
      <div class="master-desc">${master.desc}</div>
      <div class="master-techs">${techsHtml}</div>
      ${meetsAlign && !isActive ? `<button class="btn ${master.alignment === 'evil' ? 'btn-red' : 'btn-orange'}" onclick="chooseMaster('${master.id}')">🥋 Treinar com ${master.name}</button>` : ''}
      ${isActive ? `<button class="btn btn-ghost btn-sm" onclick="leaveMaster()">Abandonar Treino</button>` : ''}
    `;
    container.appendChild(card);
  });
}

function chooseMaster(masterId) {
  initMasterState();
  if (G.stamina < MASTERS[masterId].dailyStamCost) {
    log('warn', '⚠️ Stamina insuficiente para treinar com o mestre.');
    return;
  }
  const prev = G.masterTraining.masterId;
  if (prev && prev !== masterId) {
    if (!confirm(`Trocar de mestre reinicia seus dias consecutivos. Continuar?`)) return;
  }
  G.masterTraining = {
    masterId,
    consecutiveDays: prev === masterId ? G.masterTraining.consecutiveDays : 0,
    unlockedTechs: G.masterTraining.unlockedTechs || [],
    lastDay: G.day
  };
  doMasterTrainDay(masterId);
}

function doMasterTrainDay(masterId) {
  initMasterState();
  const master = MASTERS[masterId];
  if (!master) return;
  if (G.stamina < master.dailyStamCost) {
    log('warn', `⚠️ Sem stamina para treinar com ${master.name}.`);
    return;
  }

  const mt = G.masterTraining;

  // Verificar se já treinou hoje (mesmo dia do jogo)
  if (mt.lastDay === G.day && mt.consecutiveDays > 0) {
    log('info', `Já treinou com ${master.name} hoje (Dia ${G.day}).`);
    renderMastersModal();
    return;
  }

  // Verificar quebra de sequência
  if (mt.lastDay > 0 && G.day > mt.lastDay + 1) {
    log('warn', `⚠️ Sequência quebrada! Dias perdidos com ${master.name}. Reiniciando.`);
    mt.consecutiveDays = 0;
    showNotif('⚠️ Sequência Quebrada!');
  }

  mutate({ stamina: G.stamina - master.dailyStamCost });
  mt.consecutiveDays++;
  mt.lastDay = G.day;

  const xpGain = 20 + mt.consecutiveDays * 5;
  mutate({ xp: G.xp + xpGain });

  log('gain', `🥋 Dia ${mt.consecutiveDays} com ${master.name}! +${xpGain} XP`);
  showNotif(`🥋 ${master.name} — Dia ${mt.consecutiveDays}`);

  // Verificar técnicas disponíveis
  const newTechs = master.techniques.filter(t =>
    mt.consecutiveDays >= t.day && !mt.unlockedTechs.includes(t.id)
  );
  if (newTechs.length) {
    showNotif(`⚡ Nova técnica disponível!`);
    log('event', `🌟 Técnica disponível: ${newTechs[0].name}! Vá à aba de Mestres para aprender.`);
  }

  G.day++;
  G.totalDays++;
  G.powerLevel = calcPowerLevel();
  checkLevelUp();
  checkMissions();
  updateUI();
  renderMastersModal();
}

function learnMasterTech(masterId, techId) {
  initMasterState();
  const master = MASTERS[masterId];
  if (!master) return;
  const tech = master.techniques.find(t => t.id === techId);
  if (!tech) return;
  if (G.masterTraining.unlockedTechs.includes(techId)) return;

  tech.effect(G);
  G.masterTraining.unlockedTechs.push(techId);
  log('event', `✨ Técnica aprendida: ${tech.name}! ${tech.desc}`);
  showNotif(`✨ ${tech.name}`);
  checkAchievements();
  updateUI();
  renderMastersModal();
}

function leaveMaster() {
  if (!confirm('Abandonar o treino com este mestre? Os dias consecutivos serão perdidos.')) return;
  initMasterState();
  G.masterTraining.masterId = null;
  G.masterTraining.consecutiveDays = 0;
  G.masterTraining.lastDay = 0;
  log('info', '🥋 Treino com mestre encerrado.');
  renderMastersModal();
}

// Chamado pelo doAction('treinar-mestre') no main
function doMasterTrainingAction() {
  initMasterState();
  const mt = G.masterTraining;
  if (!mt.masterId) {
    openMastersModal();
    return;
  }
  doMasterTrainDay(mt.masterId);
}

// ─── MODAL HTML INJECTION ──────────────────────────────
// Injeta o modal na DOM se não existir
(function injectMastersModal() {
  if (document.getElementById('masters-modal')) return;
  const modal = document.createElement('div');
  modal.id = 'masters-modal';
  modal.className = 'modal-overlay';
  modal.innerHTML = `
    <div class="modal-box masters-modal-box">
      <div class="modal-header">
        <span>🥋 MESTRES LENDÁRIOS</span>
        <button class="btn btn-ghost btn-sm" onclick="closeMastersModal()">✕</button>
      </div>
      <div class="masters-modal-body">
        <p class="masters-subtitle">Treine dias consecutivos com um mestre para desbloquear técnicas únicas. Quebrar a sequência reinicia o contador!</p>
        <div id="masters-list"></div>
      </div>
    </div>`;
  document.body.appendChild(modal);
})();