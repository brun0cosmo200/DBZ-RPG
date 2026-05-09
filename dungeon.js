// ═══════════════════════════════════════════════════════
// DUNGEON.JS — Andares, encontros, recompensas
// ═══════════════════════════════════════════════════════

const DUNGEONS = [
  { id: 'kame', icon: '🏝️', name: 'Ilha Tartaruga', raceBonus: 'humano', ability: 'Humano: +20% Zeni nos andares.', floors: 4 },
  { id: 'ruins', icon: '🌋', name: 'Ruínas Saiyajin', raceBonus: 'saiyajin', ability: 'Saiyajin: +25% XP de elite.', floors: 5 },
  { id: 'nf', icon: '🌿', name: 'Floresta Namek', raceBonus: 'namekusei', ability: 'Namekusei: cura entre andares.', floors: 4 },
  { id: 'lab', icon: '🔬', name: 'Laboratório Red', raceBonus: 'androide', ability: 'Androide: sem custo de Ki nos elites.', floors: 5 },
  { id: 'majin', icon: '👾', name: 'Zona Majin', raceBonus: 'majin', ability: 'Majin: roubo de vida em elites.', floors: 4 }
];

let dungeonRun = null;

function initDungeonTab() {
  const list = document.getElementById('dungeon-list');
  if (!list) return;
  list.innerHTML = '';
  DUNGEONS.forEach(d => {
    const my = G.race === d.raceBonus;
    const el = document.createElement('div');
    el.className = 'dungeon-entry' + (my ? ' my-race' : '');
    el.innerHTML = `
      <div class="dungeon-icon">${d.icon}</div>
      <div class="dungeon-info">
        <div class="dungeon-name">${d.name}</div>
        <div class="dungeon-ability">${d.ability}</div>
        <div class="dungeon-meta">${d.floors} andares · Nível recomendado ${d.floors + G.level > 15 ? G.level : d.floors + 3}+</div>
      </div>
      <button class="btn btn-orange btn-sm">Entrar</button>`;
    el.querySelector('button').onclick = () => openDungeonModal(d);
    list.appendChild(el);
  });
}

function startDungeonByTheme(mapLocId) {
  const mapToDungeon = {
    terra: DUNGEONS[0],
    namek: DUNGEONS[2],
    vegeta: DUNGEONS[1],
    freeza: DUNGEONS[3],
    yardrat: DUNGEONS[0]
  };
  const d = mapToDungeon[mapLocId] || DUNGEONS[0];
  openDungeonModal(d);
}

function openDungeonModal(dungeon) {
  if (G.stamina < 25) {
    log('warn', 'Stamina insuficiente para dungeon (mín. 25).');
    showNotif('😓 Descanse');
    return;
  }
  if (!confirm(`Entrar em "${dungeon.name}"? Consome stamina e inimigos são perigosos.`)) return;
  mutate({ stamina: G.stamina - 15 });
  dungeonRun = {
    dungeon,
    floor: 1,
    enemyHp: 0,
    enemyMax: 0
  };
  document.getElementById('dungeon-title').textContent = dungeon.icon + ' ' + dungeon.name;
  document.getElementById('dungeon-modal').classList.add('show');
  dungeonNextFloor();
}

function dungeonNextFloor() {
  const dr = dungeonRun;
  if (!dr) return;
  const d = dr.dungeon;
  if (dr.floor > d.floors) {
    dungeonComplete();
    return;
  }

  const base = 40 + dr.floor * 35 + G.level * 12;
  dr.enemyMax = Math.round(base * (1 + (G.race === d.raceBonus ? 0.15 : 0)));
  dr.enemyHp = dr.enemyMax;

  document.getElementById('dungeon-floor').textContent = `ANDAR ${dr.floor}/${d.floors}`;
  const scene = document.getElementById('dungeon-scene');
  scene.textContent = `Andar ${dr.floor}: energia hostil detectada. Um guardião bloqueia o caminho!`;

  const enemyArea = document.getElementById('dungeon-enemy-area');
  enemyArea.innerHTML = `
    <div class="dungeon-enemy-box">
      <div>
        <div class="d-enemy-name">ELITE ${dr.floor}</div>
        <div class="d-enemy-stats">HP ${dr.enemyHp} · ATK ~${20 + dr.floor * 8 + G.level}</div>
        <div class="d-enemy-hp-track"><div class="d-enemy-hp-fill" id="dungeon-enemy-hp-fill" style="width:100%"></div></div>
      </div>
    </div>`;

  const actions = document.getElementById('dungeon-actions');
  actions.innerHTML = `
    <button class="btn btn-red" id="d-atk">⚔️ Atacar</button>
    <button class="btn btn-blue" id="d-ki">⚡ Ki (${G.race === 'androide' ? 0 : 12})</button>
    <button class="btn btn-green" id="d-heal">💊 Curar</button>`;

  document.getElementById('d-atk').onclick = () => dungeonPlayerTurn('phys');
  document.getElementById('d-ki').onclick = () => dungeonPlayerTurn('ki');
  document.getElementById('d-heal').onclick = () => dungeonPlayerTurn('heal');

  if (G.race === 'namekusei' && d.raceBonus === 'namekusei') {
    mutate({ hp: Math.min(G.maxHp, G.hp + Math.round(G.maxHp * 0.12)) });
    log('dungeon', '🟢 Regeneração Namek entre andares.');
  }
}

function dungeonPlayerTurn(type) {
  const dr = dungeonRun;
  if (!dr) return;

  if (type === 'heal') {
    if (G.race !== 'androide' && G.ki < 10) return;
    if (G.race !== 'androide') mutate({ ki: G.ki - 10 });
    mutate({ hp: Math.min(G.maxHp, G.hp + Math.round(G.maxHp * 0.2)) });
    dungeonEnemyTurn();
    return;
  }

  if (type === 'ki' && G.race !== 'androide') {
    if (G.ki < 12) return;
    mutate({ ki: G.ki - 12 });
  }

  let dmg = type === 'phys'
    ? Math.round(G.forca * 3.5 + rand(5, 20))
    : Math.round(G.kiAtk * 4.5 + rand(5, 25));

  if (G.race === dr.dungeon.raceBonus) dmg = Math.round(dmg * 1.12);
  dr.enemyHp -= dmg;
  if (dr.enemyHp < 0) dr.enemyHp = 0;

  const fill = document.getElementById('dungeon-enemy-hp-fill');
  if (fill) fill.style.width = (dr.enemyHp / dr.enemyMax * 100) + '%';

  if (dr.enemyHp <= 0) {
    mutate({ xp: G.xp + 35 + dr.floor * 15, zeni: G.zeni + 60 + dr.floor * 25 });
    dr.floor++;
    checkLevelUp();
    dungeonNextFloor();
    return;
  }

  dungeonEnemyTurn();
}

function dungeonEnemyTurn() {
  const dr = dungeonRun;
  if (!dr) return;
  const atk = Math.round((18 + dr.floor * 12 + rand(0, 18)) * 1.1);
  let dmg = Math.max(4, atk - Math.floor(G.defesa * 1.35));
  if (G.skills.barreira) dmg = Math.round(dmg * (1 - 0.04 * G.skills.barreira));
  let newHp = Math.max(0, G.hp - dmg);

  if (G.race === 'majin' && dr.dungeon.raceBonus === 'majin') {
    const steal = Math.round(dmg * 0.15);
    newHp = Math.min(G.maxHp, newHp + steal);
  }

  mutate({ hp: newHp });

  if (G.hp <= 0) {
    mutate({ hp: 1 });
    log('dungeon', '💀 Você foi expulso da dungeon.');
    closeDungeonModal();
  }
  updateUI();
}

function dungeonComplete() {
  const senzuGain = Math.random() < 0.35 ? 1 : 0;
  mutate({
    dungeonClears: G.dungeonClears + 1,
    xp: G.xp + 100 + G.level * 20,
    zeni: G.zeni + 300 + G.level * 40,
    inventory: { ...G.inventory, senzu: G.inventory.senzu + senzuGain }
  });
  log('dungeon', `🏰 Dungeon completa! Recompensa generosa.`);
  showNotif('🏰 Dungeon OK!');
  checkLevelUp();
  checkMissions();
  closeDungeonModal();
  updateUI();
}

function closeDungeonModal() {
  document.getElementById('dungeon-modal').classList.remove('show');
  dungeonRun = null;
}