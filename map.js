// ═══════════════════════════════════════════════════════
// MAP.JS — Mapa do universo (canvas 2D)
// ═══════════════════════════════════════════════════════

const LOCATIONS = [
  { id: 'terra', name: 'Terra', x: 0.22, y: 0.42, r: 28, color: '#3388ff', desc: 'Planeta natal dos humanos. Lar do Torneio e da Kame House.', dungeon: 'Ilha Tartaruga' },
  { id: 'namek', name: 'Namekusei', x: 0.48, y: 0.35, r: 26, color: '#44aa44', desc: 'Planeta verde. As Esferas do Dragão originais foram criadas aqui.', dungeon: 'Vila Namek' },
  { id: 'vegeta', name: 'Planeta Vegeta', x: 0.72, y: 0.28, r: 22, color: '#cc6600', desc: 'Antigo mundo Saiyajin. Ruínas e energia de batalha.', dungeon: 'Ruínas Saiyajin' },
  { id: 'freeza', name: 'Base Freeza', x: 0.65, y: 0.62, r: 20, color: '#9966cc', desc: 'Posto militar do império. Inimigos poderosos patrulham a área.', dungeon: 'Nave de Assalto' },
  { id: 'yardrat', name: 'Yardrat', x: 0.38, y: 0.68, r: 18, color: '#00cccc', desc: 'Mundo do Teletransporte. Boa para aprender técnicas.', dungeon: 'Templo Yardrat' }
];

let mapSelected = null;
let mapCanvas = null;
let mapCtx = null;

function initWorldMap() {
  mapCanvas = document.getElementById('world-map-canvas');
  if (!mapCanvas) return;
  mapCtx = mapCanvas.getContext('2d');
  mapCanvas.addEventListener('click', onMapClick);
  drawWorldMap();
}

function drawWorldMap() {
  if (!mapCtx) return;
  const cv = mapCanvas;
  const w = cv.width;
  const h = cv.height;
  const ctx = mapCtx;

  ctx.fillStyle = '#030308';
  ctx.fillRect(0, 0, w, h);

  for (let i = 0; i < 120; i++) {
    const sx = (i * 9973) % w;
    const sy = (i * 7919) % h;
    ctx.fillStyle = `rgba(200,220,255,${0.15 + (i % 5) * 0.04})`;
    ctx.fillRect(sx, sy, 1, 1);
  }

  LOCATIONS.forEach(loc => {
    const cx = loc.x * w;
    const cy = loc.y * h;
    const g = ctx.createRadialGradient(cx, cy, 2, cx, cy, loc.r * 1.8);
    g.addColorStop(0, loc.color);
    g.addColorStop(1, loc.color + '11');
    ctx.fillStyle = g;
    ctx.beginPath();
    ctx.arc(cx, cy, loc.r * 1.4, 0, Math.PI * 2);
    ctx.fill();

    ctx.strokeStyle = mapSelected && mapSelected.id === loc.id ? '#ffd700' : '#4466aa';
    ctx.lineWidth = mapSelected && mapSelected.id === loc.id ? 3 : 1;
    ctx.fillStyle = loc.color;
    ctx.beginPath();
    ctx.arc(cx, cy, loc.r * 0.5, 0, Math.PI * 2);
    ctx.fill();
    ctx.stroke();

    ctx.fillStyle = '#dde0ff';
    ctx.font = 'bold 11px Rajdhani, sans-serif';
    ctx.textAlign = 'center';
    ctx.fillText(loc.name, cx, cy + loc.r * 0.5 + 14);
  });
}

function onMapClick(ev) {
  if (!mapCanvas) return;
  const rect = mapCanvas.getBoundingClientRect();
  const mx = (ev.clientX - rect.left) * (mapCanvas.width / rect.width);
  const my = (ev.clientY - rect.top) * (mapCanvas.height / rect.height);
  const w = mapCanvas.width;
  const h = mapCanvas.height;

  mapSelected = null;
  for (const loc of LOCATIONS) {
    const cx = loc.x * w;
    const cy = loc.y * h;
    const dist = Math.hypot(mx - cx, my - cy);
    if (dist < loc.r * 1.2) {
      mapSelected = loc;
      break;
    }
  }

  const nameEl = document.getElementById('map-loc-name');
  const descEl = document.getElementById('map-loc-desc');
  const travelBtn = document.getElementById('map-travel-btn');
  const dunBtn = document.getElementById('map-dungeon-btn');

  if (mapSelected && nameEl && descEl && travelBtn && dunBtn) {
    nameEl.textContent = mapSelected.name;
    descEl.textContent = mapSelected.desc;
    travelBtn.style.display = 'inline-flex';
    dunBtn.style.display = 'inline-flex';
  } else if (nameEl && descEl && travelBtn && dunBtn) {
    nameEl.textContent = 'Espaço profundo';
    descEl.textContent = 'Clique em um planeta marcado.';
    travelBtn.style.display = 'none';
    dunBtn.style.display = 'none';
  }
  drawWorldMap();
}

function openMap() {
  document.getElementById('map-modal').classList.add('show');
  mapSelected = null;
  drawWorldMap();
}

function closeMap() {
  document.getElementById('map-modal').classList.remove('show');
}

function travelToLocation() {
  if (!mapSelected) return;
  G.currentLocation = `${mapSelected.name} — ${mapSelected.dungeon}`;
  log('info', `✈️ Você viajou até ${mapSelected.name}.`);
  showNotif('✈️ ' + mapSelected.name);
  closeMap();
  updateUI();
}

function enterLocationDungeon() {
  if (!mapSelected) return;
  closeMap();
  switchTab('dungeon');
  startDungeonByTheme(mapSelected.id);
}