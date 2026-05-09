# 🐉 DBZ Life RPG

> Um RPG de vida no universo de Dragon Ball Z — crie seu personagem, treine, batalhe, explore dungeons e reviva as grandes sagas da série.

**Versão:** 3.2.0 · **Engine:** Vanilla JS + Phaser 3 (arena visual) · **Plataforma:** Browser (cliente estático)

---

## Sumário

1. [Visão Geral](#visão-geral)
2. [Como Jogar](#como-jogar)
3. [Raças](#raças)
4. [Classes](#classes)
5. [Transformações](#transformações)
6. [Atributos](#atributos)
7. [Ações Diárias](#ações-diárias)
8. [Combate](#combate)
9. [Dungeons](#dungeons)
10. [Boss — Vegeta](#boss--vegeta)
11. [Modo História](#modo-história)
12. [Missões](#missões)
13. [Habilidades](#habilidades)
14. [Loja](#loja)
15. [Conquistas](#conquistas)
16. [Sistema de Save — 3 Slots](#sistema-de-save--3-slots)
17. [Atalhos de Teclado](#atalhos-de-teclado)
18. [Estrutura de Arquivos](#estrutura-de-arquivos)
19. [Como Rodar Localmente](#como-rodar-localmente)

---

## Visão Geral

DBZ Life RPG é um simulador de vida roguelite com temática de Dragon Ball Z. Cada dia in-game você decide como evoluir: treinar, explorar, batalhar, meditar ou descansar. Recursos como HP, Ki e Stamina se esgotam com o uso e devem ser gerenciados estrategicamente. O jogo cobre as sagas Saiyajin, Namek, Androids e Cell através do Modo História, com combate visual em arena 2D renderizado pelo Phaser 3.

---

## Como Jogar

1. **Crie seu personagem** — escolha raça, classe, nome e personalize a aparência
2. **Gerencie seus recursos diários** — HP, Ki e Stamina são consumidos por cada ação
3. **Ganhe XP** para subir de nível e aumentar seus atributos automaticamente
4. **Complete missões** para recompensas extras de Zeni, XP e itens
5. **Explore dungeons** por andares crescentes de dificuldade
6. **Reviva as sagas** no Modo História com cutscenes e escolhas narrativas
7. **Enfrente Vegeta** no modo Boss quando estiver pronto (Nível 4+)
8. **Salve o progresso** em até 3 slots independentes

---

## Raças

| Raça | Bônus Inicial | Passiva | Transformações |
|---|---|---|---|
| 🔥 **Saiyajin** | +5 Força, +20 HP máx | Zenkai: +XP após derrotas, +50% XP de batalha | SSJ, SSJ2, SSJ3, Oozaru |
| ⚡ **Meio-Saiyajin** | +6 KiAtk, +20 Ki máx, +3 Força | SSJ2 mais fácil, Ki natural elevado | SSJ, SSJ2 |
| 🟢 **Namekusei** | +5 Defesa, +20 Ki máx | Regeneração: +45% HP ao descansar, Fusão especial | Fusão Namek |
| 👊 **Humano** | +5 KiAtk, +10 Ki máx | Adaptação: +30% Ki, aprende habilidades mais rápido | — |
| 🤖 **Androide** | +3 Força, +5 Velocidade | Núcleo Energético: sem custo de Ki em combate | — |
| 🍬 **Majin** | +30 HP máx, +3 Defesa | Absorção: recupera 20% do dano causado como HP | SSJ |

> **Dica:** Saiyajins se beneficiam de derrotas controladas via Zenkai. Androids são ideais para jogadores que querem ignorar o gerenciamento de Ki.

---

## Classes

| Classe | Bônus | Passiva |
|---|---|---|
| ⚔️ **Guerreiro** | +5 Força, +3 Defesa | +30% dano físico em combate |
| 🌊 **Ki Mestre** | +8 KiAtk, +30 Ki máx | +40% dano de Ki e especiais |
| 💨 **Veloz** | +8 Velocidade, +2 Defesa | 15% de chance de esquivar ataques |

---

## Transformações

Transformações multiplicam o Nível de Poder e desbloqueiam visuais especiais na arena. Devem ser compradas na aba **Habilidades** e ativadas com custo de Ki.

| Transformação | Raças | Nível mín. | Custo Ki | Multiplicador de Poder |
|---|---|---|---|---|
| Super Saiyajin | Saiyajin, Meio-Saiyajin, Majin | 5 | 30 | ×10 |
| Super Saiyajin 2 | Saiyajin, Meio-Saiyajin | 12 | 50 | ×50 |
| Super Saiyajin 3 | Saiyajin | 20 | 80 | ×400 |
| Oozaru | Saiyajin | 6 | 40 | ×8 |
| Fusão Namek | Namekusei | 8 | 60 | ×5 |

> A transformação é revertida ao fim do combate. O visual de aura e sprite na arena Phaser reflete a transformação ativa.

---

## Atributos

| Atributo | Efeito |
|---|---|
| **Força** | Dano físico em combate e ataques de Investida |
| **Defesa** | Redução de dano recebido em combates e dungeons |
| **Velocidade** | Chance de esquiva (especialmente com classe Veloz) |
| **KiAtk** | Dano dos ataques de Ki, especiais e Kamehameha |
| **HP / HP máx** | Sobrevivência em batalha — chega a 0 e você perde |
| **Ki / Ki máx** | Combustível para ataques de Ki, especiais e transformações |
| **Stamina** | Recurso diário consumido por ações — repõe ao descansar |
| **Nível de Poder** | Calculado automaticamente: `(Força + Defesa + Vel + KiAtk) × 10 × Nível × Multiplicador` |

Ao subir de nível, HP máx e Ki máx crescem automaticamente. Atributos primários crescem conforme a raça e classe a cada 2–3 níveis.

---

## Ações Diárias

Cada ação consome 1 dia e recursos. Gerenciar o ritmo de descanso é essencial.

| Ação | Stamina | HP | Efeito |
|---|---|---|---|
| 💪 **Treinar** | −20 | −10 | +XP, chance de +Força |
| 🔥 **Treino Intenso** | −40 | −25 | +XP maior, chance de +Força e +Vel; risco de ferimento |
| 🧘 **Meditar** | −5 | — | Restaura 22% do Ki máx, +XP leve |
| 🗺️ **Explorar** | −10 | — | Evento aleatório (55%) ou +Zeni; chance de Esfera do Dragão (8%) |
| 💼 **Trabalhar** | −10 | — | +Zeni garantido |
| 💤 **Descansar** | Restaura tudo | Restaura HP | Repõe Stamina e Ki completamente |
| 🏆 **Torneio** | −30 | Risco −50% HP | Vitória: +Zeni e +XP · Derrota: −50% HP, +40 XP |
| 🫘 **Senzu Bean** | — | Restaura tudo | Consome 1 Senzu Bean do inventário |
| ⚡ **Transformar** | — | — | Ativa/desativa transformação desbloqueada |

### Eventos Aleatórios (Exploração)

Ao explorar, há 55% de chance de um evento aleatório surgir com escolhas:

- 🐉 **Shenlong?** — Presença misteriosa, sem efeito imediato
- 👽 **Nave Saiyajin** — Vender o destroço por 80 Zeni ou guardar
- 🥋 **Mestre Kame** — +15 XP grátis se aceitar as dicas

---

## Combate

A aba **Combate** apresenta uma arena visual em 2D renderizada pelo Phaser 3, com sprites pixel-art procedurais, parallax de fundo e efeitos de partículas.

### Inimigos Disponíveis

| Inimigo | Nível recomendado | Habilidades | Drops |
|---|---|---|---|
| 🌱 Saibaman | 1–5 | Ácido Explosivo, Mordida, Carga | Senzu (10%), +Força (5%) |
| 👽 Soldado Freeza | 2–8 | Tiro de Ki, Soco Duplo, Bloqueio | Zeni Extra (20%), +Vel (5%) |
| 🥷 Guerreiro Z Rival | 4–12 | Kamehameha Fraco, Contra-ataque, Rajada | Senzu (15%), +KiAtk (8%) |
| 💜 Ginyu Force | 7–18 | Pose Especial, Troca de Corpo, Tiro Máximo | Zeni ×2 (20%), +Defesa (8%) |
| 🦀 Freeza 1ª Forma | 12+ | Garras, Death Beam, Riso Maléfico | Senzu ×2 (20%), +Força×3 (10%) |

### Ações em Combate

- ⚔️ **Físico** — dano baseado em Força e Velocidade
- ⚡ **Ki** — dano baseado em KiAtk (custo de Ki)
- 🌊 **Especial** — dano alto com multiplicador de classe (custo de Ki elevado)
- 🛡️ **Defender** — reduz dano do próximo ataque inimigo
- 🫘 **Senzu** — cura total imediata (consome item)
- 🏃 **Fugir** — abandona o combate (sem XP, sem Zeni)

### Visuais da Arena (Phaser 3)

- **Background parallax** em 3 camadas: estrelas, nebulosa, chão iluminado
- **Sprites animados** gerados proceduralmente por raça e transformação
- **Partículas** douradas no Especial, azuis no Ki, vermelhas no Físico
- **Camera shake** proporcional ao tipo de ataque
- **Números de dano flutuantes** com cores por tipo de ataque

---

## Dungeons

Dungeons são masmorras com andares progressivos, acessíveis pela aba **Dungeon** ou pelo Mapa do Universo.

| Dungeon | Raça com bônus | Andares | Bônus racial |
|---|---|---|---|
| 🏝️ Ilha Tartaruga | Humano | 4 | +20% Zeni por andar |
| 🌋 Ruínas Saiyajin | Saiyajin | 5 | +25% XP de elites |
| 🌿 Floresta Namek | Namekusei | 4 | Regenera HP entre andares |
| 🔬 Laboratório Red | Androide | 5 | Sem custo de Ki nos elites |
| 👾 Zona Majin | Majin | 4 | Roubo de vida nos elites |

**Custo de entrada:** 15 Stamina · **Recompensa de conclusão:** Zeni, XP, chance de Senzu Bean (35%)

---

## Boss — Vegeta

O confronto definitivo da Saga Saiyajin. Acessado pelo botão **Boss** quando Nível ≥ 4.

**Requisitos:** Nível 4+, 20 Stamina disponível

### Fases de Vegeta

| Fase | HP base | Forma |
|---|---|---|
| 1 | 3400 + Nível×260 | Vegeta Normal |
| 2 | HP fase 1 × 1,35 | Super Saiyajin |
| 3 | HP fase 2 × 1,35 | Poder Máximo |

Cada fase muda o sprite na arena Phaser, dispara flash de câmera e aumenta o dano do contra-ataque progressivamente.

**Recompensa de vitória:** +500 XP (+ Nível×80), +2000 Zeni, +1 Esfera do Dragão, HP e Ki restaurados.

---

## Modo História

A aba **História** apresenta as grandes batalhas das sagas em ordem cronológica, com cutscenes narrativas antes e depois de cada confronto.

### Sagas e Missões

**Saga Saiyajin**
- 🌍 Raditz · 🌱 Saibamen · 🦍 Nappa · 👑 Vegeta

**Saga Namek**
- 🟢 Dodoria · 🐊 Zarbon · 💜 Ginyu Force · 🦀 Freeza

**Saga Androids**
- 🤖 Android 19 · 💚 Androids 17 & 18

**Saga Cell**
- 🪲 Cell Imperfeito · 💀 Cell Perfeito

Cada missão tem XP e Zeni próprios, e após a vitória pode apresentar escolhas narrativas que influenciam o alinhamento (Herói/Vilão) do personagem.

### Cutscenes

Cutscenes são sequências de texto estilizado com ícone, subtítulo e saga. Avance com clique ou Enter, pule tudo com Espaço.

---

## Missões

Missões são objetivos permanentes que recompensam ao serem completadas automaticamente.

| Missão | Objetivo | Recompensa |
|---|---|---|
| ⚔️ Primeiras Vitórias | Vença 3 batalhas | +200 Zeni, +40 XP |
| ⭐ Poder Crescente | Alcance Nível 5 | +1 Senzu Bean, +1 Ponto de Atributo |
| 💰 Colecionador | Acumule 1000 Zeni | +80 XP |
| 💪 Disciplina | Treine 10 dias | +3 Força permanente |
| 🏰 Explorador | Complete 1 dungeon | +350 Zeni |

---

## Habilidades

Compradas com Zeni na aba **Habilidades**, evoluem em níveis (máximo por habilidade).

| Habilidade | Efeito | Preço base | Nível máx | Restrição |
|---|---|---|---|---|
| 🌊 Kamehameha / Especial | Aumenta dano do ataque especial em combate | 400 Z | 5 | — |
| 🛡️ Barreira de Ki | Reduz dano recebido (passivo) | 350 Z | 4 | — |
| 💨 Teletransporte | Chance extra de esquivar | 500 Z | 3 | — |
| 💥 Zenkai | Aumenta ganho de atributos após derrotas | 600 Z | 3 | Saiyajin / Meio-Saiyajin |

---

## Loja

Itens consumíveis e permanentes comprados com Zeni.

| Item | Efeito | Preço |
|---|---|---|
| 🫘 Senzu Bean | Restaura HP e Ki completamente | 165 Z |
| 🧪 Poção de Ki | +5 Ki máx permanente e recupera Ki | 135 Z |
| 🏋️ Traje Pesado | +2 Força permanente | 920 Z |
| 💊 Cápsula Hoi-Poi | +150 Zeni imediato | 55 Z |

---

## Conquistas

| Conquista | Condição |
|---|---|
| 🩸 Primeiro Sangue | Vença sua primeira batalha |
| ⚡ Lendário | Transforme-se em Super Saiyajin |
| 💎 Magnata | Tenha 5000 Zeni simultaneamente |
| 🔥 Sobrevivente | Faça treino intenso com HP crítico (≤15%) |
| 👑 Orgulho Quebrado | Derrote Vegeta no modo Boss |
| 🧬 Jogo Perfeito | Conclua o Modo História até Cell Perfeito |

---

## Sistema de Save — 3 Slots

O jogo suporta 3 slots de save independentes, acessíveis pelo botão 💾 / 📂 no cabeçalho ou na tela de criação.

- **Slot ativo** é indicado em dourado no painel de saves
- **Autosave** ocorre a cada 2 minutos no slot ativo
- **Migração automática** de saves da versão anterior (chave legada `dbz_rpg_v3_save`) para o Slot 1 na primeira inicialização
- Saves armazenados no `localStorage` com as chaves `dbz_save_slot_0`, `dbz_save_slot_1`, `dbz_save_slot_2`

---

## Atalhos de Teclado

| Tecla | Ação |
|---|---|
| `1` | Aba Ação |
| `2` | Aba Combate |
| `3` | Aba Dungeon |
| `4` | Aba Missões |
| `5` | Aba História |
| `6` | Aba Habilidades |
| `7` | Aba Loja |
| `8` | Aba Conquistas |
| `Enter` / `Esc` | Avançar linha na cutscene |
| `Espaço` | Pular cutscene inteira |

---

## Estrutura de Arquivos

```
dbz-life-rpg/
├── index.html          # Estrutura HTML, modais, abas
├── style.css           # Tema escuro DBZ, animações, responsivo
├── engine.js           # Estado global (G), save/load 3 slots, mutate(), level up
├── main.js             # Loop de ações diárias, init, atalhos de teclado
├── ui.js               # Renderização de UI, loja, habilidades, conquistas, eventos
├── combate.js          # Sistema de combate por turnos, inimigos, lógica
├── phaser-combat.js    # Arena visual Phaser 3 (sprites, parallax, partículas)
├── dungeon.js          # Sistema de dungeons por andares
├── boss.js             # Boss fight Vegeta multi-fase
├── story.js            # Modo História, sagas, missões de história
├── cutscenes.js        # Cutscenes narrativas (intro + vitória por missão)
├── map.js              # Mapa do universo (canvas 2D), viagem entre planetas
├── package.json        # Scripts de dev (serve estático na porta 5173)
└── dbz.base            # Fonte de dados base do jogo
```

### Arquitetura

- **`G`** — objeto global de estado do personagem e do jogo
- **`mutate(patch)`** — toda alteração de estado passa por esta função, garantindo consistência e emissão de eventos (`state:change`)
- **`EventBus`** — barramento de eventos leve para comunicação entre módulos
- Sem framework de UI — DOM manipulado diretamente para máxima performance no browser

---

## Como Rodar Localmente

**Requisitos:** Node.js 18+ (apenas para o servidor de desenvolvimento)

```bash
# Instalar dependências (apenas npx serve)
npm install

# Iniciar servidor de desenvolvimento
npm run dev
# ou
npm start

# Acesse em:
# http://localhost:5173
```

Não há build step — todos os arquivos são servidos como estático. O jogo funciona offline após o primeiro carregamento, com dados salvos no `localStorage` do navegador.

---

*DBZ Life RPG é um projeto independente não afiliado à Toei Animation ou Shueisha. Dragon Ball Z é propriedade de seus respectivos detentores.*