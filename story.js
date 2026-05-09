// ═══════════════════════════════════════════════════════
// STORY.JS — Modo história até a saga Cell + escolhas moral
// ═══════════════════════════════════════════════════════

const STORY_MISSIONS = [
  {
    id: 's_raditz',
    saga: 'Saga Saiyajin',
    icon: '👽',
    title: 'O Saiyajin invasor',
    desc: 'Um guerreiro de cauda invade a Terra exigindo um tal de Kakaroto.',
    minLevel: 2,
    stamCost: 18,
    xpReward: 45,
    zeniReward: 120,
    enemy: {
      id: 'raditz',
      name: 'Raditz',
      icon: '👽',
      baseHp: 95, baseAtk: 22, baseDef: 9,
      xpReward: 0, zeniReward: 0,
      moves: ['Soco Saiyajin', 'Explosão de Ki', 'Cauda'],
      storyScale: 1.15
    },
    choiceGood: {
      label: 'Bem: poupar reflexão — jurar proteger a Terra',
      blurb: 'Você canaliza a raiva em disciplina. Comerciantes confiam em você.',
      good: 2, discountAdd: 0.02
    },
    choiceEvil: {
      label: 'Mal: eliminar sem piedade — medo é poder',
      blurb: 'Rumores de crueldade abrem portas sombrias no mercado negro.',
      evil: 2, unlockVillain: 'death_beam'
    }
  },
  {
    id: 's_saibamen',
    saga: 'Saga Saiyajin',
    icon: '🌱',
    title: 'Campo de Saibamen',
    desc: 'Criaturas plantadas pelo inimigo cercam a área de batalha.',
    minLevel: 3,
    stamCost: 18,
    xpReward: 55,
    zeniReward: 140,
    enemy: {
      id: 'saibamen_swarm',
      name: 'Horda Saibamen',
      icon: '🌱',
      baseHp: 110, baseAtk: 26, baseDef: 10,
      xpReward: 0, zeniReward: 0,
      moves: ['Ácido', 'Explosão suicida', 'Investida'],
      storyScale: 1.18
    },
    choiceGood: { label: 'Bem: salvar civis primeiro', blurb: 'Sua reputação heroica cresce.', good: 2, discountAdd: 0.02 },
    choiceEvil: { label: 'Mal: usar civis como distração', blurb: 'Técnicas proibidas aparecem à venda.', evil: 2, unlockVillain: 'crusher_ball' }
  },
  {
    id: 's_nappa',
    saga: 'Saga Saiyajin',
    icon: '🦍',
    title: 'Nappa, o devastador',
    desc: 'O general Saiyajin esmaga tudo em seu caminho.',
    minLevel: 4,
    stamCost: 20,
    xpReward: 70,
    zeniReward: 180,
    enemy: {
      id: 'nappa',
      name: 'Nappa',
      icon: '🦍',
      baseHp: 165, baseAtk: 32, baseDef: 16,
      xpReward: 0, zeniReward: 0,
      moves: ['Bomba Volante', 'Soco esmagador', 'Onda de Ki'],
      storyScale: 1.22
    },
    choiceGood: { label: 'Bem: honrar os caídos — treino conjunto', blurb: 'Aliados oferecem melhores preços.', good: 2, discountAdd: 0.025 },
    choiceEvil: { label: 'Mal: pisar nos derrotados', blurb: 'Vilões vendem o Galick Gun.', evil: 2, unlockVillain: 'galick_gun' }
  },
  {
    id: 's_vegeta_saga',
    saga: 'Saga Saiyajin',
    icon: '👑',
    title: 'Vegeta — Príncipe Saiyajin',
    desc: 'O ápice da saga: enfrente o orgulho do planeta Vegeta.',
    minLevel: 5,
    stamCost: 22,
    xpReward: 95,
    zeniReward: 260,
    enemy: {
      id: 'vegeta_saga',
      name: 'Vegeta (Saga)',
      icon: '👑',
      baseHp: 220, baseAtk: 40, baseDef: 20,
      xpReward: 0, zeniReward: 0,
      moves: ['Garlick Ho', 'Rajada final', 'Soco do príncipe'],
      storyScale: 1.25
    },
    choiceGood: { label: 'Bem: poupar o orgulho ferido', blurb: 'O caminho do herói endurece sua defesa interior.', good: 3, discountAdd: 0.03 },
    choiceEvil: { label: 'Mal: humilhar o príncipe', blurb: 'Energia sombria amplia o Big Bang.', evil: 3, unlockVillain: 'big_bang' }
  },
  {
    id: 's_dodoria',
    saga: 'Saga Namek',
    icon: '🐷',
    title: 'Patrulha Dodoria',
    desc: 'Um brutamontes do exército de Freeza caça Namekuseijin.',
    minLevel: 6,
    stamCost: 18,
    xpReward: 72,
    zeniReward: 200,
    enemy: {
      id: 'dodoria',
      name: 'Dodoria',
      icon: '🐷',
      baseHp: 200, baseAtk: 38, baseDef: 18,
      xpReward: 0, zeniReward: 0,
      moves: ['Soco brutal', 'Rajada circular', 'Fuga covarde'],
      storyScale: 1.2
    },
    choiceGood: { label: 'Bem: proteger inocentes Namek', blurb: 'Desconto em itens de suporte.', good: 2, discountAdd: 0.02 },
    choiceEvil: { label: 'Mal: negociar com Freeza', blurb: 'Técnicas de extermínio em catálogo.', evil: 2, unlockVillain: 'death_beam' }
  },
  {
    id: 's_zarbon',
    saga: 'Saga Namek',
    icon: '🐊',
    title: 'Zarbon, o belo guerreiro',
    desc: 'Um oponente que esconde uma forma monstruosa.',
    minLevel: 7,
    stamCost: 20,
    xpReward: 85,
    zeniReward: 240,
    enemy: {
      id: 'zarbon',
      name: 'Zarbon',
      icon: '🐊',
      baseHp: 235, baseAtk: 44, baseDef: 22,
      xpReward: 0, zeniReward: 0,
      moves: ['Chute elegante', 'Transformação', 'Golpe cruel'],
      storyScale: 1.24
    },
    choiceGood: { label: 'Bem: combate limpo', blurb: 'Ki mais estável.', good: 2, discountAdd: 0.02 },
    choiceEvil: { label: 'Mal: provocar a fera', blurb: 'Absorção de energia — estilo vilão.', evil: 2, unlockVillain: 'energy_drain' }
  },
  {
    id: 's_ginyu',
    saga: 'Saga Namek',
    icon: '💜',
    title: 'Força Ginyu',
    desc: 'A tropa de elite mais teatral da galáxia.',
    minLevel: 8,
    stamCost: 22,
    xpReward: 100,
    zeniReward: 320,
    enemy: {
      id: 'ginyu_story',
      name: 'Capitão Ginyu',
      icon: '💜',
      baseHp: 290, baseAtk: 48, baseDef: 26,
      xpReward: 0, zeniReward: 0,
      moves: ['Pose mortal', 'Troca de corpo', 'Canhão Ki'],
      storyScale: 1.26
    },
    choiceGood: { label: 'Bem: respeitar o espetáculo', blurb: 'Torneios pagam melhor.', good: 2, discountAdd: 0.025 },
    choiceEvil: { label: 'Mal: sabotar a pose', blurb: 'Crusher Ball aprimorado à venda.', evil: 2, unlockVillain: 'crusher_ball' }
  },
  {
    id: 's_freeza',
    saga: 'Saga Namek',
    icon: '🦀',
    title: 'Freeza — tirano galáctico',
    desc: 'O imperador revela sua força aterrorizante.',
    minLevel: 10,
    stamCost: 25,
    xpReward: 140,
    zeniReward: 500,
    enemy: {
      id: 'freeza_story',
      name: 'Freeza (1ª forma)',
      icon: '🦀',
      baseHp: 420, baseAtk: 58, baseDef: 34,
      xpReward: 0, zeniReward: 0,
      moves: ['Death Beam', 'Telecinésia', 'Risada cruel'],
      storyScale: 1.3
    },
    choiceGood: { label: 'Bem: jurar nunca repetir tal horror', blurb: 'Comerciantes heróicos confiam em você.', good: 3, discountAdd: 0.035 },
    choiceEvil: { label: 'Mal: admirar a crueldade eficiente', blurb: 'Death Beam militar disponível.', evil: 3, unlockVillain: 'death_beam' }
  },
  {
    id: 's_android19',
    saga: 'Saga Androids',
    icon: '🤖',
    title: 'Dr. Gero e Android 19',
    desc: 'Máquinas absorvedoras de energia.',
    minLevel: 12,
    stamCost: 22,
    xpReward: 110,
    zeniReward: 380,
    enemy: {
      id: 'android19',
      name: 'Android 19',
      icon: '🤖',
      baseHp: 380, baseAtk: 52, baseDef: 30,
      xpReward: 0, zeniReward: 0,
      moves: ['Absorção', 'Olhos laser', 'Soco pesado'],
      storyScale: 1.28
    },
    choiceGood: { label: 'Bem: preservar vida humana', blurb: 'Desconto em Senzu.', good: 2, discountAdd: 0.03 },
    choiceEvil: { label: 'Mal: estudar a absorção', blurb: 'Dreno de Ki vil à venda.', evil: 3, unlockVillain: 'energy_drain' }
  },
  {
    id: 's_android1718',
    saga: 'Saga Androids',
    icon: '💚',
    title: 'Androids 17 e 18',
    desc: 'Gêmeos imparáveis de frieza e estilo.',
    minLevel: 14,
    stamCost: 24,
    xpReward: 130,
    zeniReward: 450,
    enemy: {
      id: 'android1718',
      name: 'Android 17 & 18',
      icon: '💚',
      baseHp: 440, baseAtk: 62, baseDef: 32,
      xpReward: 0, zeniReward: 0,
      moves: ['Barreira infinita', 'Photon Strike', 'Sincronia'],
      storyScale: 1.32
    },
    choiceGood: { label: 'Bem: buscar coexistência', blurb: 'Loja heróica amplia catálogo.', good: 3, discountAdd: 0.03 },
    choiceEvil: { label: 'Mal: caçar sem trégua', blurb: 'Técnicas de dupla execução negra.', evil: 3, unlockVillain: 'big_bang' }
  },
  {
    id: 's_cell_imperfect',
    saga: 'Saga Cell',
    icon: '🪲',
    title: 'Cell imperfeito',
    desc: 'A abominação absorve para evoluir.',
    minLevel: 16,
    stamCost: 24,
    xpReward: 155,
    zeniReward: 520,
    enemy: {
      id: 'cell_imp',
      name: 'Cell (Imperfeito)',
      icon: '🪲',
      baseHp: 520, baseAtk: 68, baseDef: 36,
      xpReward: 0, zeniReward: 0,
      moves: ['Cauda absorvedora', 'Kamehameha roubado', 'Regeneração'],
      storyScale: 1.34
    },
    choiceGood: { label: 'Bem: salvar as vítimas primeiro', blurb: 'Bênção de cura na loja.', good: 3, discountAdd: 0.035 },
    choiceEvil: { label: 'Mal: deixar evoluir — observar', blurb: 'Bio-armas de Ki liberadas.', evil: 3, unlockVillain: 'absorption_dark' }
  },
  {
    id: 's_cell_perfect',
    saga: 'Saga Cell',
    icon: '💀',
    title: 'Cell perfeito',
    desc: 'O torneio do destino: o ser perfeito contra você.',
    minLevel: 18,
    stamCost: 28,
    xpReward: 220,
    zeniReward: 800,
    enemy: {
      id: 'cell_perfect',
      name: 'Cell Perfeito',
      icon: '💀',
      baseHp: 720, baseAtk: 78, baseDef: 42,
      xpReward: 0, zeniReward: 0,
      moves: ['Perfect Kamehameha', 'Teleporte', 'Explosão solar'],
      storyScale: 1.38
    },
    choiceGood: { label: 'Bem: lutar pelo futuro de todos', blurb: 'Herói lendário: desconto máximo acumulado.', good: 4, discountAdd: 0.04 },
    choiceEvil: { label: 'Mal: desejar o poder absoluto', blurb: 'Arsenal completo de vilões desbloqueado.', evil: 4, unlockVillain: 'perfect_evil' }
  }
];

function isStoryMissionUnlocked(mission, idx) {
  if (idx === 0) return true;
  const prev = STORY_MISSIONS[idx - 1];
  return G.storyCompleted.includes(prev.id);
}

function isStoryMissionDone(id) {
  return G.storyCompleted.includes(id);
}

function getStoryMissionIndex(id) {
  return STORY_MISSIONS.findIndex(m => m.id === id);
}

function renderStoryTab() {
  const host = document.getElementById('story-list');
  if (!host) return;
  host.innerHTML = '';

  const bar = document.createElement('div');
  bar.className = 'story-alignment-bar';
  bar.innerHTML = `
    <span class="align-good">☀️ Bem: <strong>${G.alignmentGood}</strong></span>
    <span class="align-evil">🌑 Mal: <strong>${G.alignmentEvil}</strong></span>
    <span class="align-shop">🏪 Desconto herói: <strong>${Math.round((G.shopHeroDiscount || 0) * 100)}%</strong></span>`;
  host.appendChild(bar);

  STORY_MISSIONS.forEach((m, idx) => {
    const unlocked = isStoryMissionUnlocked(m, idx);
    const done = isStoryMissionDone(m.id);
    const row = document.createElement('div');
    row.className = 'story-entry' + (done ? ' done' : '') + (!unlocked ? ' locked' : '');
    row.innerHTML = `
      <div class="story-saga-tag">${m.saga}</div>
      <div class="story-icon">${m.icon}</div>
      <div class="story-body">
        <div class="story-title">${m.title}</div>
        <div class="story-desc">${m.desc}</div>
        <div class="story-meta">Nv. mín. ${m.minLevel} · −${m.stamCost} STM · +${m.xpReward} XP · +${m.zeniReward} Z</div>
      </div>
      <div class="story-action-col">
        ${done ? '<span class="story-done-badge">✓ Concluída</span>' :
          !unlocked ? '<span class="story-lock">🔒</span>' :
          G.level < m.minLevel ? '<span class="story-lock">Nv. ' + m.minLevel + '</span>' :
          `<button class="btn btn-gold btn-sm" type="button">Lutar</button>`}
      </div>`;
    const btn = row.querySelector('button');
    if (btn) btn.onclick = () => beginStoryCombat(m);
    host.appendChild(row);
  });

  // Saga Majin Boo (Prestígio 1+)
  if (typeof hasMajinSagaUnlocked === 'function' && hasMajinSagaUnlocked()) {
    const majinHeader = document.createElement('div');
    majinHeader.className = 'story-saga-divider';
    majinHeader.innerHTML = '<span>🍬 SAGA MAJIN BOO — Prestígio desbloqueado</span>';
    host.appendChild(majinHeader);

    const majinMissions = typeof getMajinSagaMissions === 'function' ? getMajinSagaMissions() : [];
    majinMissions.forEach((m) => {
      const done = isStoryMissionDone(m.id);
      const meetsPrestige = (G.prestigeRank || 0) >= (m.prestigeRequired || 1);
      // Unlock sequencial dentro da Saga Majin: verifica se a anterior foi concluída
      const majinIdx = majinMissions.indexOf(m);
      const majinUnlocked = majinIdx === 0
        ? G.storyCompleted.includes('s_cell_perfect')
        : G.storyCompleted.includes(majinMissions[majinIdx - 1].id);
      const row = document.createElement('div');
      row.className = 'story-entry' + (done ? ' done' : '') + (!majinUnlocked ? ' locked' : '');
      row.innerHTML = `
        <div class="story-saga-tag">${m.saga}</div>
        <div class="story-icon">${m.icon}</div>
        <div class="story-body">
          <div class="story-title">${m.title}</div>
          <div class="story-desc">${m.desc}</div>
          <div class="story-meta">Nv. mín. ${m.minLevel} · −${m.stamCost} STM · +${m.xpReward} XP · +${m.zeniReward} Z</div>
        </div>
        <div class="story-action-col">
          ${done ? '<span class="story-done-badge">✓ Concluída</span>' :
            !majinUnlocked ? '<span class="story-lock">🔒</span>' :
            G.level < m.minLevel ? '<span class="story-lock">Nv. ' + m.minLevel + '</span>' :
            `<button class="btn btn-gold btn-sm" type="button">Lutar</button>`}
        </div>`;
      const btn = row.querySelector('button');
      if (btn) btn.onclick = () => beginStoryCombat(m);
      host.appendChild(row);
    });
  }
}

function beginStoryCombat(mission) {
  if (isStoryMissionDone(mission.id)) return;

  let isUnlocked = false;
  let isMajin = false;
  let majinIdx = -1;

  if (typeof getMajinSagaMissions === 'function') {
    const majinMissions = getMajinSagaMissions();
    majinIdx = majinMissions.findIndex(m => m.id === mission.id);
    if (majinIdx !== -1) {
      isMajin = true;
      isUnlocked = majinIdx === 0
        ? G.storyCompleted.includes('s_cell_perfect')
        : G.storyCompleted.includes(majinMissions[majinIdx - 1].id);
    }
  }

  if (!isMajin) {
    const idx = getStoryMissionIndex(mission.id);
    isUnlocked = isStoryMissionUnlocked(mission, idx);
  }

  if (!isUnlocked) return;

  if (G.level < mission.minLevel) {
    showNotif('Suba de nível!');
    return;
  }
  if (G.stamina < mission.stamCost) {
    log('warn', 'Stamina insuficiente para esta missão da história.');
    showNotif('STM baixa');
    return;
  }
  if (G.ki < 12 && G.race !== 'androide') {
    log('warn', 'Ki muito baixo para encarar este capítulo.');
    return;
  }

  const tpl = { ...mission.enemy };
  const startFight = () => {
    switchTab('combate');
    window.storyCombatContext = { mission };
    startCombat(tpl, { storyMode: true, stamOverride: mission.stamCost });
  };
  if (typeof playStoryIntroCutscene === 'function') {
    playStoryIntroCutscene(mission.id, startFight);
  } else {
    startFight();
  }
  try {
    if (!combatState) window.storyCombatContext = null;
  } catch (err) {
    window.storyCombatContext = null;
  }
}

function applyStoryChoice(align) {
  const modal = document.getElementById('story-choice-modal');
  const pending = window._storyPendingMission;
  if (!pending) return;
  window._storyPendingMission = null;
  if (modal) modal.classList.remove('show');
  const gb = document.getElementById('story-choice-good-btn');
  const eb = document.getElementById('story-choice-evil-btn');
  if (gb) gb.disabled = true;
  if (eb) eb.disabled = true;

  const m = pending;
  if (align === 'good') {
    const c = m.choiceGood;
    G.alignmentGood += c.good || 0;
    G.shopHeroDiscount = Math.min(0.22, (G.shopHeroDiscount || 0) + (c.discountAdd || 0));
    G.storyChoices[m.id] = 'good';
    log('event', `📖 História: caminho do bem — ${m.title}`);
    showNotif('☀️ Caminho do bem');
  } else {
    const c = m.choiceEvil;
    G.alignmentEvil += c.evil || 0;
    if (c.unlockVillain) unlockVillainSkill(c.unlockVillain);
    G.storyChoices[m.id] = 'evil';
    log('event', `📖 História: caminho das trevas — ${m.title}`);
    showNotif('🌑 Poder sombrio');
  }
  saveGame(false);
  updateUI();
  renderStoryTab();

  // Checar se Saga Majin está desbloqueada (Prestígio 1+)
  // A renderização é feita por renderStoryTab — basta chamar
  renderStoryTab();
  if (gb) gb.disabled = false;
  if (eb) eb.disabled = false;
}

function unlockVillainSkill(key) {
  if (!G.shopVillainAccess) G.shopVillainAccess = [];
  if (key === 'perfect_evil') {
    ['death_beam', 'galick_gun', 'big_bang', 'crusher_ball', 'energy_drain', 'absorption_dark'].forEach(k => {
      if (!G.shopVillainAccess.includes(k)) G.shopVillainAccess.push(k);
    });
    return;
  }
  if (!G.shopVillainAccess.includes(key)) G.shopVillainAccess.push(key);
}

function openStoryChoiceModal(mission) {
  window._storyPendingMission = mission;
  document.getElementById('story-choice-icon').textContent = mission.icon;
  document.getElementById('story-choice-heading').textContent = 'Capítulo concluído';
  document.getElementById('story-choice-title').textContent = mission.title;
  document.getElementById('story-choice-prompt').textContent =
    'Sua decisão molda o mundo: comerciantes e o mercado negro reagem ao seu mito.';

  const g = document.getElementById('story-choice-good-btn');
  const e = document.getElementById('story-choice-evil-btn');
  g.textContent = mission.choiceGood.label;
  e.textContent = mission.choiceEvil.label;
  document.getElementById('story-choice-good-blurb').textContent = mission.choiceGood.blurb;
  document.getElementById('story-choice-evil-blurb').textContent = mission.choiceEvil.blurb;

  if (g) g.disabled = false;
  if (e) e.disabled = false;
  g.onclick = () => applyStoryChoice('good');
  e.onclick = () => applyStoryChoice('evil');

  document.getElementById('story-choice-modal').classList.add('show');
}