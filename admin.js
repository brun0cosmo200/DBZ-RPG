// ═══════════════════════════════════════════════════════
// ADMIN.JS — Painel de Desenvolvedor
// Ativado com a sequência de teclas: A → D → M
// Visível apenas após criar o personagem (game-screen ativo)
// ═══════════════════════════════════════════════════════

(function () {
  'use strict';

  const SECRET = ['a', 'd', 'm'];
  let keyBuffer = [];

  // ─── Detectar sequência secreta ───────────────────────
  document.addEventListener('keydown', (e) => {
    const t = e.target;
    if (t && (t.tagName === 'INPUT' || t.tagName === 'TEXTAREA' || t.isContentEditable)) return;

    keyBuffer.push(e.key.toLowerCase());
    if (keyBuffer.length > SECRET.length) keyBuffer.shift();

    if (keyBuffer.join('') === SECRET.join('')) {
      keyBuffer = [];
      toggleAdminPanel();
    }
  });

  // ─── Toggle visibilidade ──────────────────────────────
  function toggleAdminPanel() {
    const gameScreen = document.getElementById('game-screen');
    if (!gameScreen || gameScreen.style.display === 'none') return; // só após criar personagem

    let panel = document.getElementById('admin-panel');
    if (!panel) {
      panel = buildPanel();
      document.body.appendChild(panel);
    }

    const visible = panel.classList.toggle('adm-open');
    if (visible) refreshAdminPanel();
  }

  // ─── Construir o painel ───────────────────────────────
  function buildPanel() {
    const panel = document.createElement('div');
    panel.id = 'admin-panel';
    panel.innerHTML = `
      <div class="adm-header">
        <span>⚙️ ADMIN MODE</span>
        <button class="adm-close" onclick="document.getElementById('admin-panel').classList.remove('adm-open')">✕</button>
      </div>
      <div class="adm-body" id="adm-body"></div>`;
    return panel;
  }

  // ─── Renderizar conteúdo do painel ───────────────────
  function refreshAdminPanel() {
    const body = document.getElementById('adm-body');
    if (!body || typeof G === 'undefined') return;

    body.innerHTML = `

      <!-- RECURSOS -->
      <div class="adm-section-title">💰 Recursos</div>

      <div class="adm-row">
        <label>Zeni</label>
        <div class="adm-controls">
          <button onclick="admAdd('zeni', 1000)">+1K</button>
          <button onclick="admAdd('zeni', 10000)">+10K</button>
          <button onclick="admSet('zeni', 999999)">MAX</button>
          <button class="adm-danger" onclick="admSet('zeni', 0)">ZERO</button>
        </div>
      </div>

      <div class="adm-row">
        <label>HP</label>
        <div class="adm-controls">
          <button onclick="admSet('hp', G.maxHp)">FULL</button>
          <button onclick="admSet('maxHp', G.maxHp + 500); admSet('hp', G.maxHp)">+500 MAX</button>
          <button onclick="admSet('hp', 1)">1</button>
        </div>
      </div>

      <div class="adm-row">
        <label>Ki</label>
        <div class="adm-controls">
          <button onclick="admSet('ki', G.maxKi)">FULL</button>
          <button onclick="admSet('maxKi', G.maxKi + 200); admSet('ki', G.maxKi)">+200 MAX</button>
        </div>
      </div>

      <div class="adm-row">
        <label>Stamina</label>
        <div class="adm-controls">
          <button onclick="admSet('stamina', G.maxStamina)">FULL</button>
          <button onclick="admSet('maxStamina', G.maxStamina + 50); admSet('stamina', G.maxStamina)">+50 MAX</button>
        </div>
      </div>

      <!-- PROGRESSÃO -->
      <div class="adm-section-title">📈 Progressão</div>

      <div class="adm-row">
        <label>Nível (atual: <strong id="adm-lv">${G.level}</strong>)</label>
        <div class="adm-controls">
          <button onclick="admLevelUp(1)">+1</button>
          <button onclick="admLevelUp(5)">+5</button>
          <button onclick="admLevelUp(10)">+10</button>
          <button onclick="admSetLevel(50)">→ 50</button>
        </div>
      </div>

      <div class="adm-row">
        <label>XP</label>
        <div class="adm-controls">
          <button onclick="admAdd('xp', G.xpNext); checkLevelUp(); refreshAdminPanel()">+1 LvUp</button>
          <button onclick="admAdd('xp', G.xpNext * 10); checkLevelUp(); refreshAdminPanel()">+10 LvUp</button>
        </div>
      </div>

      <div class="adm-row">
        <label>Attr Pts (atual: <strong>${G.attrPts}</strong>)</label>
        <div class="adm-controls">
          <button onclick="admAdd('attrPts', 10)">+10</button>
          <button onclick="admAdd('attrPts', 50)">+50</button>
          <button onclick="admSet('attrPts', 0)">ZERO</button>
        </div>
      </div>

      <!-- ATRIBUTOS -->
      <div class="adm-section-title">⚔️ Atributos</div>

      ${['forca','defesa','velocidade','kiAtk'].map(s => `
      <div class="adm-row">
        <label>${s} (<strong>${G[s]}</strong>)</label>
        <div class="adm-controls">
          <button onclick="admAdd('${s}', 10); updateUI()">+10</button>
          <button onclick="admAdd('${s}', 50); updateUI()">+50</button>
          <button onclick="admSet('${s}', 999); updateUI()">MAX</button>
        </div>
      </div>`).join('')}

      <div class="adm-row adm-row-full">
        <button class="adm-btn-wide" onclick="admMaxAllStats()">⚡ MAX TODOS OS STATS</button>
      </div>

      <!-- TRANSFORMAÇÕES -->
      <div class="adm-section-title">⚡ Transformações</div>

      <div class="adm-row adm-row-full">
        <button class="adm-btn-wide" onclick="admUnlockAllTransforms()">🔱 Desbloquear Todas</button>
      </div>

      <!-- INVENTÁRIO -->
      <div class="adm-section-title">🎒 Inventário</div>

      <div class="adm-row">
        <label>Senzu Beans</label>
        <div class="adm-controls">
          <button onclick="admAddInventory('senzu', 5)">+5</button>
          <button onclick="admAddInventory('senzu', 99)">+99</button>
        </div>
      </div>

      <div class="adm-row">
        <label>Esferas do Dragão</label>
        <div class="adm-controls">
          <button onclick="admSet('inventory', {...G.inventory, esferas: 7}); updateUI()">→ 7</button>
        </div>
      </div>

      <!-- HISTÓRIA E PRESTÍGIO -->
      <div class="adm-section-title">📖 História & Prestígio</div>

      <div class="adm-row adm-row-full">
        <button class="adm-btn-wide" onclick="admCompleteAllStory()">✓ Completar Toda a História</button>
      </div>

      <div class="adm-row">
        <label>Prestígio (atual: <strong>${G.prestigeRank}</strong>)</label>
        <div class="adm-controls">
          <button onclick="admSetPrestige(1)">→ 1</button>
          <button onclick="admSetPrestige(2)">→ 2</button>
          <button onclick="admSetPrestige(3)">→ 3</button>
          <button onclick="admSetPrestige(0)">RESET</button>
        </div>
      </div>

      <div class="adm-row">
        <label>Boss Vegeta</label>
        <div class="adm-controls">
          <button onclick="admSet('bossDefeated', {...G.bossDefeated, vegeta: true}); updateUI()">✓ Vencido</button>
          <button onclick="admSet('bossDefeated', {...G.bossDefeated, vegeta: false}); updateUI()">RESET</button>
        </div>
      </div>

      <!-- ALINHAMENTO -->
      <div class="adm-section-title">⚖️ Alinhamento</div>

      <div class="adm-row">
        <label>Bem (atual: <strong>${G.alignmentGood}</strong>)</label>
        <div class="adm-controls">
          <button onclick="admAdd('alignmentGood', 10); updateUI()">+10</button>
          <button onclick="admSet('alignmentGood', 0); updateUI()">ZERO</button>
        </div>
      </div>

      <div class="adm-row">
        <label>Mal (atual: <strong>${G.alignmentEvil}</strong>)</label>
        <div class="adm-controls">
          <button onclick="admAdd('alignmentEvil', 10); updateUI()">+10</button>
          <button onclick="admSet('alignmentEvil', 50); updateUI()">MAX</button>
          <button onclick="admSet('alignmentEvil', 0); updateUI()">ZERO</button>
        </div>
      </div>

      <!-- MISC -->
      <div class="adm-section-title">🛠️ Misc</div>

      <div class="adm-row">
        <label>Dia</label>
        <div class="adm-controls">
          <button onclick="admAdd('day', 10); admAdd('totalDays', 10); updateUI()">+10 dias</button>
          <button onclick="admSet('day', 1); updateUI()">RESET</button>
        </div>
      </div>

      <div class="adm-row adm-row-full">
        <button class="adm-btn-wide adm-danger" onclick="admGodMode()">🔱 GOD MODE COMPLETO</button>
      </div>

      <div class="adm-hint">Fechar: pressione ADM novamente ou clique ✕</div>
    `;
  }

  // ─── Funções de manipulação ───────────────────────────
  window.admAdd = function (field, amount) {
    if (typeof G === 'undefined') return;
    G[field] = (G[field] || 0) + amount;
    G.powerLevel = calcPowerLevel();
    updateUI();
    refreshAdminPanel();
  };

  window.admSet = function (field, value) {
    if (typeof G === 'undefined') return;
    G[field] = value;
    G.powerLevel = calcPowerLevel();
    updateUI();
    refreshAdminPanel();
  };

  window.admAddInventory = function (item, amount) {
    if (typeof G === 'undefined') return;
    G.inventory[item] = (G.inventory[item] || 0) + amount;
    updateUI();
    refreshAdminPanel();
  };

  window.admLevelUp = function (times) {
    if (typeof G === 'undefined') return;
    for (let i = 0; i < times; i++) {
      G.xp = G.xpNext;
      checkLevelUp();
    }
    G.powerLevel = calcPowerLevel();
    updateUI();
    refreshAdminPanel();
  };

  window.admSetLevel = function (target) {
    if (typeof G === 'undefined') return;
    while (G.level < target) {
      G.xp = G.xpNext;
      checkLevelUp();
    }
    G.powerLevel = calcPowerLevel();
    updateUI();
    refreshAdminPanel();
  };

  window.admMaxAllStats = function () {
    if (typeof G === 'undefined') return;
    G.forca = 999; G.defesa = 999; G.velocidade = 999; G.kiAtk = 999;
    G.maxHp = 9999; G.hp = 9999;
    G.maxKi = 9999; G.ki = 9999;
    G.maxStamina = 999; G.stamina = 999;
    G.attrPts += 100;
    G.powerLevel = calcPowerLevel();
    updateUI();
    refreshAdminPanel();
  };

  window.admUnlockAllTransforms = function () {
    if (typeof G === 'undefined') return;
    const ALL = ['ssj','ssj2','ssj3','oozaru','namefusion','majinized','dark_ssj','majin_ssj2','dark_namek','majin_android'];
    G.unlockedTransforms = G.unlockedTransforms || [];
    ALL.forEach(t => { if (!G.unlockedTransforms.includes(t)) G.unlockedTransforms.push(t); });
    // Marca Majin necessária para as vilão
    G.customization = G.customization || {};
    G.customization.majinMark = true;
    G.powerLevel = calcPowerLevel();
    updateUI();
    refreshAdminPanel();
  };

  window.admCompleteAllStory = function () {
    if (typeof G === 'undefined') return;
    const MAIN = [
      's_raditz','s_saibamen','s_nappa','s_vegeta_saga',
      's_dodoria','s_zarbon','s_ginyu','s_freeza',
      's_android19','s_android1718','s_cell_imperfect','s_cell_perfect'
    ];
    const MAJIN = ['sm_babidi','sm_dabura','sm_fatboo','sm_evilboo'];
    const all = [...MAIN, ...MAJIN];
    all.forEach(id => { if (!G.storyCompleted.includes(id)) G.storyCompleted.push(id); });
    G.bossDefeated = { ...G.bossDefeated, vegeta: true };
    updateUI();
    if (typeof renderStoryTab === 'function') renderStoryTab();
    refreshAdminPanel();
  };

  window.admSetPrestige = function (rank) {
    if (typeof G === 'undefined') return;
    G.prestigeRank = rank;
    if (rank >= 1) {
      G.prestigeUnlocks = ['saga_majin','loja_maldita','transform_majin_villain'];
    }
    if (rank >= 2) G.prestigeUnlocks.push('ssj_god');
    if (rank >= 3) G.prestigeUnlocks.push('ultra_instinct');
    updateUI();
    if (typeof renderStoryTab === 'function') renderStoryTab();
    refreshAdminPanel();
  };

  window.admGodMode = function () {
    if (typeof G === 'undefined') return;
    // Recursos
    G.zeni = 999999;
    G.forca = 999; G.defesa = 999; G.velocidade = 999; G.kiAtk = 999;
    G.maxHp = 9999; G.hp = 9999;
    G.maxKi = 9999; G.ki = 9999;
    G.maxStamina = 999; G.stamina = 999;
    G.attrPts = 999;
    // Inventário
    G.inventory.senzu = 99;
    G.inventory.esferas = 7;
    // Transformações
    const ALL = ['ssj','ssj2','ssj3','oozaru','namefusion','majinized','dark_ssj','majin_ssj2','dark_namek','majin_android'];
    G.unlockedTransforms = G.unlockedTransforms || [];
    ALL.forEach(t => { if (!G.unlockedTransforms.includes(t)) G.unlockedTransforms.push(t); });
    G.customization = G.customization || {};
    G.customization.majinMark = true;
    // História completa
    const all = [
      's_raditz','s_saibamen','s_nappa','s_vegeta_saga',
      's_dodoria','s_zarbon','s_ginyu','s_freeza',
      's_android19','s_android1718','s_cell_imperfect','s_cell_perfect',
      'sm_babidi','sm_dabura','sm_fatboo','sm_evilboo'
    ];
    all.forEach(id => { if (!G.storyCompleted.includes(id)) G.storyCompleted.push(id); });
    G.bossDefeated = { vegeta: true };
    // Alinhamento máximo (vilão)
    G.alignmentEvil = 50;
    G.alignmentGood = 50;
    // Prestígio 3
    admSetPrestige(3);
    // Habilidades
    G.skills = { kamehameha: 5, barreira: 4, teletransporte: 3, zenkai: 3, especial: 5 };
    G.skillsVillain = { death_beam: 5, galick_gun: 4, big_bang: 4, crusher_ball: 5, energy_drain: 4, absorption_dark: 3 };
    // Level
    admSetLevel(50);
    G.powerLevel = calcPowerLevel();
    log('event', '🔱 GOD MODE ativado. Nenhum limite resta.');
    showNotif('🔱 GOD MODE');
    updateUI();
    if (typeof renderStoryTab === 'function') renderStoryTab();
    if (typeof renderSkills === 'function') renderSkills();
    refreshAdminPanel();
  };

  // ─── Estilos injetados ────────────────────────────────
  const style = document.createElement('style');
  style.textContent = `
    #admin-panel {
      position: fixed;
      top: 0; right: -380px;
      width: 360px; height: 100vh;
      background: #0a0a14;
      border-left: 2px solid #ff4400;
      z-index: 99999;
      display: flex; flex-direction: column;
      font-family: 'Rajdhani', monospace;
      transition: right 0.25s cubic-bezier(.4,0,.2,1);
      box-shadow: -4px 0 24px rgba(255,68,0,0.25);
    }
    #admin-panel.adm-open { right: 0; }

    .adm-header {
      display: flex; align-items: center; justify-content: space-between;
      padding: 12px 16px;
      background: #ff440022;
      border-bottom: 1px solid #ff440066;
      font-size: 1rem; font-weight: 700; color: #ff6622;
      letter-spacing: 0.1em; flex-shrink: 0;
    }
    .adm-close {
      background: none; border: 1px solid #ff440066; color: #ff6622;
      padding: 2px 8px; border-radius: 4px; cursor: pointer; font-size: 0.9rem;
    }
    .adm-close:hover { background: #ff440033; }

    .adm-body {
      flex: 1; overflow-y: auto; padding: 10px 14px;
      display: flex; flex-direction: column; gap: 4px;
    }
    .adm-body::-webkit-scrollbar { width: 4px; }
    .adm-body::-webkit-scrollbar-track { background: #0a0a14; }
    .adm-body::-webkit-scrollbar-thumb { background: #ff440044; border-radius: 2px; }

    .adm-section-title {
      color: #ff6622; font-size: 0.75rem; font-weight: 700;
      letter-spacing: 0.12em; text-transform: uppercase;
      border-bottom: 1px solid #ff440033;
      padding: 8px 0 3px; margin-top: 6px;
    }

    .adm-row {
      display: flex; align-items: center; justify-content: space-between;
      gap: 8px; padding: 4px 0;
      font-size: 0.82rem; color: #aabbcc;
    }
    .adm-row label { flex: 1; min-width: 0; }
    .adm-row label strong { color: #eef; }
    .adm-row-full { flex-direction: column; align-items: stretch; }

    .adm-controls { display: flex; gap: 4px; flex-wrap: wrap; justify-content: flex-end; }
    .adm-controls button {
      background: #ffffff0d; border: 1px solid #ffffff22;
      color: #ccdde8; font-family: inherit; font-size: 0.78rem;
      padding: 3px 8px; border-radius: 4px; cursor: pointer;
      transition: background 0.1s;
    }
    .adm-controls button:hover { background: #ffffff22; color: #fff; }
    .adm-controls button.adm-danger { border-color: #ff444466; color: #ff8888; }
    .adm-controls button.adm-danger:hover { background: #ff444422; }

    .adm-btn-wide {
      width: 100%; padding: 7px; border-radius: 6px;
      border: 1px solid #ff440066; background: #ff44000f;
      color: #ff7744; font-family: inherit; font-size: 0.85rem;
      font-weight: 700; cursor: pointer; letter-spacing: 0.05em;
      transition: background 0.15s;
    }
    .adm-btn-wide:hover { background: #ff440025; }
    .adm-btn-wide.adm-danger { border-color: #ff000066; color: #ff5555; }
    .adm-btn-wide.adm-danger:hover { background: #ff000020; }

    .adm-hint {
      font-size: 0.72rem; color: #556677; text-align: center;
      padding: 10px 0 6px; border-top: 1px solid #ffffff0a; margin-top: 6px;
    }
  `;
  document.head.appendChild(style);

  window.refreshAdminPanel = refreshAdminPanel;
})();