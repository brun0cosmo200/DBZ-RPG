// ═══════════════════════════════════════════════════════
// CUTSCENES.JS — Sequências narrativas (estilo DBRage / Block C)
// ═══════════════════════════════════════════════════════

const STORY_CUTSCENE_INTRO = {
  s_raditz: {
    saga: 'Saga Saiyajin',
    icon: '🌍',
    lines: [
      { text: 'O céu da Terra está azul demais para o que vem a seguir.', sub: 'KAME HOUSE — CALOR DO DIA' },
      { text: 'Bulma grita do laboratório: um poder desumano se aproxima.', sub: 'ALERTA' },
      { text: 'Uma nave aterriza. Sai do escuro um guerreiro de armadura e cauda.', sub: 'RADITZ' },
      { text: '"Kakaroto... você se esconde neste lixo chamado planeta Terra?"', sub: 'PRÓLOGO' }
    ]
  },
  s_saibamen: {
    saga: 'Saga Saiyajin',
    icon: '🌱',
    lines: [
      { text: 'O chão fede a terra revolvida. Sementes malignas brotam.', sub: 'CAMPO DE BATALHA' },
      { text: 'Pequenas formas verdes se contorcem — Saibamen.', sub: 'NAPPA RI' },
      { text: 'Cada passo seu ecoa como trovão. Não há volta.', sub: 'PREPARAR-SE' }
    ]
  },
  s_nappa: {
    saga: 'Saga Saiyajin',
    icon: '🦍',
    lines: [
      { text: 'A poeira sobe. Um colosso careca cruza os braços.', sub: 'GENERAL NAPPA' },
      { text: '"HA! Vou transformar esta cidade em cinzas antes do almoço."', sub: 'AMEAÇA' },
      { text: 'Sua aura treme. É agora ou nunca.', sub: 'DECISÃO' }
    ]
  },
  s_vegeta_saga: {
    saga: 'Saga Saiyajin',
    icon: '👑',
    lines: [
      { text: 'O príncipe pousa com elegância cruel. O ar fica pesado.', sub: 'VEGETA' },
      { text: '"Orgulho Saiyajin não perdoa fraqueza. Mostre-me seu valor!"', sub: 'DUELO DE HONRA' },
      { text: 'Luz e sombra se chocam no horizonte.', sub: 'CLÍMAX DA SAGA' }
    ]
  },
  s_dodoria: {
    saga: 'Saga Namek',
    icon: '🟢',
    lines: [
      { text: 'Namekusei brilha sob três sóis. E ainda assim há medo.', sub: 'PLANETA VERDE' },
      { text: 'Patrulheiros de armadura rosa varrem a vila.', sub: 'DODORIA' },
      { text: '"Freeza-sama não tolera fugitivos. Morram quietos."', sub: 'CAÇADA' }
    ]
  },
  s_zarbon: {
    saga: 'Saga Namek',
    icon: '🐊',
    lines: [
      { text: 'Beleza letal. Zarbon ajeita o cabelo como quem afia uma lâmina.', sub: 'ELITE' },
      { text: 'Algo monstruoso dorme sob essa pele humana.', sub: 'PREMONIÇÃO' },
      { text: 'O chão racha sob seus pés.', sub: 'TRANSFORMAÇÃO' }
    ]
  },
  s_ginyu: {
    saga: 'Saga Namek',
    icon: '💜',
    lines: [
      { text: 'Quatro silhuetas coloridas caem do céu em formação.', sub: 'GINYU FORCE' },
      { text: '"★ POSE! ★" — o chão explode em coreografia letal.', sub: 'ESPETÁCIO' },
      { text: 'O capitão sorri. O corpo é só tática.', sub: 'CAPITÃO GINYU' }
    ]
  },
  s_freeza: {
    saga: 'Saga Namek',
    icon: '🦀',
    lines: [
      { text: 'O gelo derrete onde ele pisa. O universo sussurra seu nome.', sub: 'IMPERADOR' },
      { text: '"Brinquemos de guerreiros... antes do fim."', sub: 'FREEZA' },
      { text: 'Sua espinha congela. O Ki dele não tem teto visível.', sub: 'TERROR' }
    ]
  },
  s_android19: {
    saga: 'Saga Androids',
    icon: '🤖',
    lines: [
      { text: 'A cidade acorda com sirenes. Um laboratório subterrâneo vaza fumaça.', sub: 'CIDADE DO SUL' },
      { text: 'Dr. Gero observa de longe. O Android 19 sorri com boca de boneca.', sub: 'ABSORÇÃO' },
      { text: 'Cada golpe seu alimenta o inimigo.', sub: 'ARMADILHA' }
    ]
  },
  s_android1718: {
    saga: 'Saga Androids',
    icon: '💚',
    lines: [
      { text: 'Duas figuras jovens destroem uma estrada inteira sem suar.', sub: '17 & 18' },
      { text: 'Indiferença é pior que ódio. Eles não precisam de motivo.', sub: 'FRIA CALMA' },
      { text: 'O futuro que você conhece desmorona em segundos.', sub: 'LINHA DO TEMPO' }
    ]
  },
  s_cell_imperfect: {
    saga: 'Saga Cell',
    icon: '🪲',
    lines: [
      { text: 'Borbulhas verdes escorrem de um casulo úmido.', sub: 'LABORATÓRIO' },
      { text: 'Algo incompleto — e por isso ainda mais faminto.', sub: 'CELL IMPERFEITO' },
      { text: '"Preciso... de energia... de vocês..."', sub: 'VOZ ÚMIDA' }
    ]
  },
  s_cell_perfect: {
    saga: 'Saga Cell',
    icon: '💀',
    lines: [
      { text: 'O ringue do torneio silencia. Até o vento para.', sub: 'ARENA' },
      { text: 'Cell desce com pele branca e sorriso de quem já venceu.', sub: 'PERFEIÇÃO' },
      { text: '"Agora... dancem para mim. Este é o jogo final."', sub: 'CELL GAMES' }
    ]
  },
  sm_babidi: {
    saga: 'Saga Majin Boo',
    icon: '🧙',
    lines: [
      { text: 'Anos se passaram. O torneio World Martial Arts Tournament recomeça — mas algo antigo acorda sob a Terra.', sub: 'SETE ANOS APÓS CELL' },
      { text: 'Uma nave estranha pousa. De dentro emerge um anão de manto estrelado com olhos sem fundo.', sub: 'BABIDI' },
      { text: '"Com minha magia... acordarei o que foi selado há 5 milhões de anos. Vocês não podem me deter."', sub: 'FEITIÇO DE RESSURREIÇÃO' },
      { text: 'Você sente o peso de uma presença que não deveria existir. Babidi sorri.', sub: 'DECISÃO' }
    ]
  },
  sm_dabura: {
    saga: 'Saga Majin Boo',
    icon: '😈',
    lines: [
      { text: 'A porta da nave de Babidi se abre em chamas. Do escuro emerge um ser com pele cinzenta e cornos negros.', sub: 'REI DO INFERNO' },
      { text: 'Dabura não fala. Apenas olha — e onde seu olhar toca, pedra e metal viram estátua.', sub: 'OLHAR DE PEDRA' },
      { text: '"Babidi-sama me enviou. Você morre aqui, ou eu me certifico de que preferia ter morrido."', sub: 'GENERAL DABURA' },
      { text: 'O Ki dele é diferente — não é do universo que você conhece.', sub: 'KI MÍSTICO' }
    ]
  },
  sm_fatboo: {
    saga: 'Saga Majin Boo',
    icon: '🍬',
    lines: [
      { text: 'O casulo rosa pulsa. Babidi chora de alegria. O chão racha sem que ninguém toque nele.', sub: 'RESSURREIÇÃO' },
      { text: 'Da névoa rosa sai uma criatura rechonchuda com olhos vazios — e um sorriso que não entende piedade.', sub: 'MAJIN BOO' },
      { text: 'Ele aponta para você e ri. O som ecoa sem razão. Sem ódio. Sem medo. Apenas caos.', sub: 'INOCÊNCIA ATERRORIZANTE' },
      { text: 'Não há negociação com o que não sabe o que é negociação.', sub: 'CONFRONTO' }
    ]
  },
  sm_evilboo: {
    saga: 'Saga Majin Boo',
    icon: '👿',
    lines: [
      { text: 'O que tinha de bondade foi expelido. O que resta é uma forma menor, mais enxuta — e infinitamente mais cruel.', sub: 'BOO PURO' },
      { text: 'Ele absorveu o próprio Boo Gordo. Os olhos brancos não piscam. Não há mais brincadeira.', sub: 'FORMA FINAL' },
      { text: '"Matar... matar tudo... até que não reste nada."', sub: 'SEM LIMITES' },
      { text: 'O universo inteiro segura a respiração. Esta é a batalha final.', sub: 'ESPÍRITO BOMBA' }
    ]
  }
};

const STORY_CUTSCENE_VICTORY = {
  s_raditz: { icon: '✨', lines: [{ text: 'Raditz cai. Mas o céu ainda guarda sombras maiores...', sub: 'VITÓRIA' }] },
  s_saibamen: { icon: '🔥', lines: [{ text: 'A horda some em cinza. Nappa ri ao longe — você ouviu?', sub: 'VITÓRIA' }] },
  s_nappa: { icon: '💥', lines: [{ text: 'O gigante vacila. A Terra ganha um fôlego — curto.', sub: 'VITÓRIA' }] },
  s_vegeta_saga: { icon: '⚡', lines: [{ text: 'O príncipe se arrasta. Orgulho ferido é chama perigosa.', sub: 'VITÓRIA' }] },
  s_dodoria: { icon: '🟢', lines: [{ text: 'Namek respira um pouco. Freeza ainda não.', sub: 'VITÓRIA' }] },
  s_zarbon: { icon: '🌊', lines: [{ text: 'A forma monstruosa se desfaz em pó e vergonha.', sub: 'VITÓRIA' }] },
  s_ginyu: { icon: '💜', lines: [{ text: 'A pose quebrou. A tropa recua — mas Namek arde.', sub: 'VITÓRIA' }] },
  s_freeza: { icon: '🦀', lines: [{ text: 'O tirano recua... por enquanto. Você sente que isso não acabou.', sub: 'VITÓRIA' }] },
  s_android19: { icon: '🤖', lines: [{ text: 'Circuitos falham. Gero recalcula — no escuro.', sub: 'VITÓRIA' }] },
  s_android1718: { icon: '💚', lines: [{ text: 'Eles somem na estrada. O silêncio pesa mais que a derrota.', sub: 'VITÓRIA' }] },
  s_cell_imperfect: { icon: '🪲', lines: [{ text: 'A casca racha. Algo pior está incubando.', sub: 'VITÓRIA' }] },
  s_cell_perfect: { icon: '🏆', lines: [{ text: 'O perfeito cai. O torneio termina — mas o mito, fica com você.', sub: 'LENDÁRIO' }] },
  sm_babidi:      { icon: '🧙', lines: [{ text: 'A magia some com o mago. Mas o ritual... já começou.', sub: 'VITÓRIA AMARGA' }] },
  sm_dabura:      { icon: '😈', lines: [{ text: 'O general do inferno cai. O trono de Babidi balança — mas Boo ainda dorme.', sub: 'VITÓRIA' }] },
  sm_fatboo:      { icon: '🍬', lines: [{ text: 'Boo recua, confuso. Mas o que não morre... transforma.', sub: 'FIM DO CAPÍTULO' }] },
  sm_evilboo:     { icon: '👿', lines: [{ text: 'O Ki de toda a humanidade se concentrou em suas mãos. O universo sobreviveu — desta vez.', sub: 'LENDÁRIO' }] }
};

(function () {
  let onCutsceneDone = null;
  let specStack = null;
  let lineIndex = 0;
  let keyHandler = null;

  function teardown() {
    const ov = document.getElementById('cutscene-overlay');
    if (ov) {
      ov.classList.remove('show');
      ov.onclick = null;
    }
    const skipBtn = document.getElementById('cutscene-skip');
    if (skipBtn) skipBtn.onclick = null;
    if (keyHandler) {
      document.removeEventListener('keydown', keyHandler);
      keyHandler = null;
    }
    onCutsceneDone = null;
    specStack = null;
    lineIndex = 0;
  }

  function finish() {
    const cb = onCutsceneDone;
    teardown();
    if (typeof cb === 'function') cb();
  }

  function renderLine() {
    if (!specStack || lineIndex >= specStack.lines.length) {
      finish();
      return;
    }
    const L = specStack.lines[lineIndex];
    const sagaEl = document.getElementById('cutscene-saga');
    const iconEl = document.getElementById('cutscene-icon');
    const lineEl = document.getElementById('cutscene-line');
    const subEl = document.getElementById('cutscene-sub');
    if (sagaEl) {
      sagaEl.textContent = specStack.saga || '';
      sagaEl.style.display = specStack.saga ? 'block' : 'none';
    }
    if (iconEl) iconEl.textContent = specStack.icon || '⚡';
    if (lineEl) lineEl.textContent = L.text || '';
    if (subEl) subEl.textContent = L.sub || '';
  }

  function advance() {
    lineIndex++;
    renderLine();
  }

  function skipAll() {
    finish();
  }

  function playCutscene(spec, onDone) {
    if (!spec || !spec.lines || spec.lines.length === 0) {
      if (typeof onDone === 'function') onDone();
      return;
    }
    const ov = document.getElementById('cutscene-overlay');
    if (!ov) {
      if (typeof onDone === 'function') onDone();
      return;
    }

    teardown();
    onCutsceneDone = onDone;
    specStack = spec;
    lineIndex = 0;

    keyHandler = (e) => {
      if (e.code === 'Space') {
        e.preventDefault();
        skipAll();
      } else if (e.code === 'Enter' || e.code === 'Escape') {
        e.preventDefault();
        advance();
      }
    };
    document.addEventListener('keydown', keyHandler);

    ov.onclick = (ev) => {
      if (ev.target && ev.target.id === 'cutscene-skip') return;
      advance();
    };

    const skipBtn = document.getElementById('cutscene-skip');
    if (skipBtn) {
      skipBtn.onclick = (e) => {
        e.stopPropagation();
        skipAll();
      };
    }

    ov.classList.add('show');
    renderLine();
  }

  window.playStoryIntroCutscene = function (missionId, onDone) {
    const spec = STORY_CUTSCENE_INTRO[missionId];
    playCutscene(spec, onDone);
  };

  window.playStoryVictoryCutscene = function (missionId, onDone) {
    const raw = STORY_CUTSCENE_VICTORY[missionId];
    const spec = raw && !raw.saga ? { ...raw, saga: 'EPÍLOGO' } : raw;
    playCutscene(spec, onDone);
  };
})();