// ═══════════════════════════════════════════════════════
// BOSS.JS — Vegeta multi-fase
// ═══════════════════════════════════════════════════════

let bossState = null;

function openBossFight() {
  if (G.bossDefeated.vegeta) {
    log('info', 'Vegeta já foi superado.');
    return;
  }
  if (G.level < 4) {
    log('warn', '⚠️ Nível 4+ recomendado para enfrentar Vegeta.');
    showNotif('Suba de nível!');
    return;
  }
  if (G.stamina < 20) {
    log('warn', 'Stamina baixa.');
    return;
  }
  if (!confirm('⚠️ Vegeta é extremamente perigoso. Gastará stamina e pode derrotá-lo. Entrar?')) return;
  mutate({ stamina: G.stamina - 20 });

  bossState = {
    phase: 0,
    vegetaHp: 3400 + G.level * 260,
    vegetaMax: 3400 + G.level * 260,
    playerHp: G.hp,
    playerKi: G.ki,
    done: false
  };

  document.getElementById('boss-modal').classList.add('show');
  document.getElementById('boss-phase-label').textContent = '1';
  document.getElementById('boss-phase-badge').textContent = 'FASE 1 — VEGETA NORMAL';
  drawPixelChar('player-canvas-boss', G.race, G.transform, 80, 106);
  drawVegeta('boss-canvas', 0, 80, 106);
  document.getElementById('boss-player-name').textContent = G.name;
  document.getElementById('boss-log').innerHTML = '';
  bossLog('💀 Vegeta ri: "Kakaroto... não, você não passa de lixo!"');
  renderBossUI();
  renderBossActions();
}

function renderBossUI() {
  const bs = bossState;
  if (!bs) return;
  const vPct = (bs.vegetaHp / bs.vegetaMax) * 100;
  const pPct = (bs.playerHp / G.maxHp) * 100;
  document.getElementById('boss-hp-fill').style.width = vPct + '%';
  document.getElementById('boss-hp-text').textContent = Math.round(bs.vegetaHp);
  document.getElementById('boss-player-hp-fill').style.width = pPct + '%';
  document.getElementById('boss-player-hp-text').textContent = Math.round(bs.playerHp);
  document.getElementById('boss-player-ki-text').textContent = Math.round(bs.playerKi);
}

function renderBossActions() {
  const box = document.getElementById('boss-actions');
  if (!bossState || bossState.done) return;
  const k = G.race === 'androide' ? 0 : 25;
  box.innerHTML = `
    <button class="btn btn-red" onclick="bossAct('rush')">💥 Investida</button>
    <button class="btn btn-blue" onclick="bossAct('beam')" ${bossState.playerKi < k && G.race !== 'androide' ? 'disabled' : ''}>⚡ Final Flash (sim.)</button>
    <button class="btn btn-green" onclick="bossAct('def')">🛡️ Defender</button>`;
}

function bossAct(type) {
  const bs = bossState;
  if (!bs || bs.done) return;

  let def = false;
  if (type === 'def') def = true;

  if (type === 'beam' && G.race !== 'androide') {
    if (bs.playerKi < 25) return;
    bs.playerKi -= 25;
  }

  let dmg = 0;
  if (!def) {
    if (type === 'rush') {
      dmg = Math.round((G.forca * 5 + G.velocidade * 3) * (1 + bs.phase * 0.15));
    } else {
      dmg = Math.round((G.kiAtk * 8 + G.forca * 2) * (G.cls === 'ki-mestre' ? 1.35 : 1));
    }
    bs.vegetaHp -= dmg;
    bossLog(`Você causa ${dmg} de dano!`);
    document.getElementById('boss-canvas').classList.add('boss-shake');
    setTimeout(() => document.getElementById('boss-canvas').classList.remove('boss-shake'), 300);
  } else {
    bossLog('🛡️ Você se prepara para o contra-ataque...');
  }

  if (bs.vegetaHp <= 0 && bs.phase < 2) {
    bs.phase++;
    bs.vegetaMax = Math.round(bs.vegetaMax * 1.35);
    bs.vegetaHp = bs.vegetaMax;
    bossLog(`⚡ Vegeta aumenta o Ki! FASE ${bs.phase + 1}!`);
    document.getElementById('boss-phase-label').textContent = String(bs.phase + 1);
    const labels = ['FASE 1 — VEGETA NORMAL', 'FASE 2 — SUPER SAIYAJIN', 'FASE 3 — PODER MÁXIMO'];
    document.getElementById('boss-phase-badge').textContent = labels[bs.phase] || labels[2];
    drawVegeta('boss-canvas', bs.phase, 80, 106);
    if (window.DBZCombatPhaser && DBZCombatPhaser.bossPhase) DBZCombatPhaser.bossPhase(bs.phase);
  } else if (bs.vegetaHp <= 0) {
    bossWin();
    return;
  }

  if (!def) vegetaCounter(bs);
  else vegetaCounter(bs, 0.45);

  if (bs.playerHp <= 0) {
    bossLose();
    return;
  }

  renderBossUI();
  renderBossActions();
}

function vegetaCounter(bs, mult = 1) {
  const base = [145, 265, 440][bs.phase] + G.level * 14;
  let dmg = Math.round(base * mult - G.defesa * 2.2);
  dmg = Math.max(10, dmg);
  if (G.cls === 'veloz' && Math.random() < 0.12) {
    bossLog('💨 Esquivou do Galick Gun!');
    return;
  }
  bs.playerHp = Math.max(0, bs.playerHp - dmg);
  bossLog(`🔥 Vegeta desfere um golpe brutal! -${dmg} HP`);
  document.getElementById('player-canvas-boss').classList.add('boss-shake');
  setTimeout(() => document.getElementById('player-canvas-boss').classList.remove('boss-shake'), 300);
}

function bossWin() {
  bossState.done = true;
  mutate({
    bossDefeated: { ...G.bossDefeated, vegeta: true },
    xp: G.xp + 500 + G.level * 80,
    zeni: G.zeni + 2000,
    inventory: { ...G.inventory, esferas: Math.min(7, G.inventory.esferas + 1) },
    hp: G.maxHp,
    ki: G.maxKi
  });
  bossLog('🏆 VEGETA CAÍDO! O orgulho Saiyajin se quebra!');
  log('boss', '🏆 Vitória épica contra Vegeta!');
  showNotif('🏆 LENDÁRIO!');
  checkLevelUp();
  checkAchievements();
  document.getElementById('boss-actions').innerHTML =
    '<button class="btn btn-gold btn-full" onclick="closeBoss()">CONTINUAR</button>';
  updateUI();
}

function bossLose() {
  bossState.done = true;
  bossLog('💀 Você não aguentou o poder do príncipe...');
  mutate({ hp: Math.max(1, Math.round(G.maxHp * 0.2)), ki: Math.round(G.maxKi * 0.3) });
  document.getElementById('boss-actions').innerHTML =
    '<button class="btn btn-ghost btn-full" onclick="closeBoss()">Recuar</button>';
  updateUI();
}

function closeBoss() {
  document.getElementById('boss-modal').classList.remove('show');
  bossState = null;
  updateUI();
}

function bossLog(msg) {
  const el = document.getElementById('boss-log');
  if (!el) return;
  const p = document.createElement('div');
  p.textContent = msg;
  el.appendChild(p);
  el.scrollTop = el.scrollHeight;
}