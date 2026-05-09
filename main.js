// ═══════════════════════════════════════════════════════
// MAIN.JS — Loop do jogo, ações diárias, init
// ═══════════════════════════════════════════════════════

function initGame() {
  // ── Migração: save legado (chave antiga) → slot 0 ──
  const LEGACY_KEY = 'dbz_rpg_v3_save';
  const legacyRaw = localStorage.getItem(LEGACY_KEY);
  const slot0Raw  = localStorage.getItem('dbz_save_slot_0');
  if (legacyRaw && !slot0Raw) {
    localStorage.setItem('dbz_save_slot_0', legacyRaw);
    localStorage.removeItem(LEGACY_KEY);
    log('save', '📦 Save legado migrado para o Slot 1 automaticamente.');
  }
  updateArc();
  updateUI();
  initCombatTab();
  initDungeonTab();
  initWorldMap();
  renderMissions();
  renderStoryTab();
  renderSkills();
  renderShop();
  renderAchievements();
  initKeyboardShortcuts();

  if (!window._dbzAutosave) {
    window._dbzAutosave = setInterval(() => saveGame(false), 120000);
  }

  log('info', `Bem-vindo, ${G.name}! Sua jornada começa no dia ${G.day}.`);
}

function initKeyboardShortcuts() {
  if (window._dbzKeysBound) return;
  window._dbzKeysBound = true;
  document.addEventListener('keydown', (e) => {
    if (e.ctrlKey || e.altKey || e.metaKey) return;
    const t = e.target;
    if (t && (t.tagName === 'INPUT' || t.tagName === 'TEXTAREA' || t.isContentEditable)) return;
    const n = e.key;
    if (n >= '1' && n <= '8') {
      const idx = parseInt(n, 10) - 1;
      const tab = typeof DBZ_TAB_ORDER !== 'undefined' ? DBZ_TAB_ORDER[idx] : null;
      if (tab) {
        e.preventDefault();
        switchTab(tab);
      }
    }
  });
}

function requestTreinoIntenso() {
  if (!confirm('Treino intenso consome muito HP e stamina. Pode causar ferimentos. Continuar?')) return;
  doAction('treinar-intenso');
}

function requestTorneio() {
  if (!confirm('O Torneio consome 30 STM e 20 Ki. Você pode perder metade do HP. Competir mesmo assim?')) return;
  doAction('torneio');
}

function doAction(action) {
  if (!G.name) return;

  const passDay = () => {
    G.day++;
    G.totalDays++;
  };



  switch (action) {
    case 'treinar': {
      if (G.stamina < 20 || G.hp <= 12) return;
      G.stamina -= 20;
      G.hp = Math.max(1, G.hp - 10);
      G.daysTraining++;
      const xp = 18 + rand(0, 12) + Math.floor(G.level * 0.4);
      G.xp += xp;
      G.forca += Math.random() < 0.25 ? 1 : 0;
      G.powerLevel = calcPowerLevel();
      log('gain', `💪 Treino completo! +${xp} XP`);
      passDay();
      showNotif('💪 Treino!');
      break;
    }
    case 'treinar-intenso': {
      if (G.stamina < 40 || G.hp <= 28) return;
      G.stamina -= 40;
      G.hp = Math.max(1, G.hp - 25);
      G.daysTraining++;
      G.overtrainStreak++;
      const xp = 42 + rand(8, 28) + Math.floor(G.level * 0.85);
      G.xp += xp;
      if (Math.random() < 0.15) {
        G.hp = Math.max(1, G.hp - 20);
        log('warn', '🔥 Excesso de treino! Ferimento leve.');
      }
      if (G.hp <= G.maxHp * 0.15 && !G.achievements.survivor) {
        G.achievements.survivor = true;
        log('event', '🏆 Conquista: Sobrevivente!');
        showNotif('🏆 Sobrevivente');
      }
      G.forca += Math.random() < 0.35 ? 1 : 0;
      G.velocidade += Math.random() < 0.15 ? 1 : 0;
      G.powerLevel = calcPowerLevel();
      log('gain', `🔥 Treino intenso! +${xp} XP`);
      passDay();
      showNotif('🔥 Intenso!');
      break;
    }
    case 'meditar': {
      if (G.stamina < 5) return;
      G.stamina -= 5;
      G.ki = Math.min(G.maxKi, G.ki + Math.round(G.maxKi * 0.22));
      const xp = 12 + rand(0, 8);
      G.xp += xp;
      log('ki', `🧘 Meditação: Ki restaurado. +${xp} XP`);
      passDay();
      break;
    }
    case 'explorar': {
      if (G.stamina < 10) return;
      G.stamina -= 10;
      passDay();
      if (Math.random() < 0.55) {
        triggerRandomEvent();
      } else {
        const z = 30 + rand(0, 60) + G.level * 3;
        G.zeni += z;
        log('gain', `🗺️ Exploração: encontrou ${z} Zeni.`);
      }
      if (Math.random() < 0.08) G.inventory.esferas = Math.min(7, G.inventory.esferas + 1);
      break;
    }
    case 'trabalhar': {
      if (G.stamina < 10) return;
      G.stamina -= 10;
      const z = 40 + rand(10, 50) + G.level * 4;
      G.zeni += z;
      log('gain', `💼 Trabalho do dia: +${z} Zeni.`);
      passDay();
      break;
    }
    case 'descansar': {
      const hpMul = G.race === 'namekusei' ? 0.45 : 1;
      G.hp = Math.min(G.maxHp, G.hp + Math.round(G.maxHp * (0.35 + hpMul * 0.1)));
      G.ki = G.maxKi;
      G.stamina = G.maxStamina;
      G.overtrainStreak = 0;
      log('info', '💤 Descanso completo. HP, Ki e stamina restaurados.');
      passDay();
      showNotif('💤 Descansado');
      break;
    }
    case 'torneio': {
      if (G.stamina < 30 || (G.ki < 20 && G.race !== 'androide')) {
        log('warn', 'Recursos insuficientes para o torneio.');
        return;
      }
      G.stamina -= 30;
      if (G.race !== 'androide') G.ki -= 20;
      passDay();
      const win = Math.random() < 0.28 + G.level * 0.018 + (G.cls === 'guerreiro' ? 0.06 : 0);
      if (win) {
        G.torneiosVencidos++;
        const prize = 360 + G.level * 72;
        G.zeni += prize;
        G.xp += 95 + G.level * 9;
        log('event', `🏆 Vitória no torneio! +${prize} Zeni`);
        showNotif('🏆 Campeão!');
      } else {
        G.hp = Math.max(1, Math.round(G.hp * 0.5));
        G.xp += 40;
        log('warn', '🏆 Derrota no torneio, mas você aprendeu. +40 XP');
      }
      checkLevelUp();
      break;
    }
    case 'senzu': {
      if (!G.inventory.senzu) {
        log('warn', 'Sem Senzu Beans.');
        return;
      }
      G.inventory.senzu--;
      G.hp = G.maxHp;
      G.ki = G.maxKi;
      G.stamina = G.maxStamina;
      log('gain', '🫘 Senzu! Energia total restaurada.');
      break;
    }
    case 'transformar': {
      doTransform();
      return;
    }
    case 'treinar-mestre': {
  doMasterTrainingAction();
  return; // não passa pelo checkLevelUp etc., masters.js gerencia
}
  }

  G.powerLevel = calcPowerLevel();
  checkLevelUp();
  checkMissions();
  checkAchievements();
  updateUI();
}