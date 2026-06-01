# Casino Slots

A 5×3 slot machine built with PixiJS v8, React 19 and GSAP.

The spin outcome comes from an `OutcomeProvider` (mocked locally), and the client
only renders a result it already knows — the same boundary a real game client has
against its server.

## Stack

- **PixiJS v8** — rendering
- **React 19** — HUD over the canvas (balance, bet, spin, win overlay)
- **GSAP** — win presentation timeline
- **TypeScript** + **Vite**
- **zustand** — state bridge between the game and React
- **howler.js** — sound
- **i18next** — localization (en/ru)
- **Vitest** — unit tests for `WinEvaluator`
- **ESLint + Prettier**

## Getting started

```bash
npm install
npm run dev        # dev server (http://localhost:5173)
npm run test       # unit tests
npm run lint       # eslint
npm run format     # prettier --write
npm run build      # production build to dist/
npm run preview    # preview the build
```

Requires Node 18+.

## Architecture

The Pixi game is a set of framework-agnostic TypeScript classes. React only hosts
the canvas and renders the HUD on top; it never touches Pixi objects directly —
they communicate through a small zustand store.

```
src/
├── game/
│   ├── Game.ts                   # Pixi Application + scene + game loop
│   ├── state/GameStateMachine.ts # finite state machine for the spin flow
│   ├── reels/                    # ReelSet, Reel, Symbol
│   ├── win/                      # WinEvaluator (+ tests), WinPresenter
│   └── config/gameConfig.ts      # symbols, paylines, paytable, timings
├── server/                       # OutcomeProvider interface + MockServer
├── services/                     # AssetLoader, SoundManager, ResizeManager
├── store/gameStore.ts            # zustand bridge
├── ui/                           # React HUD
├── i18n/
└── main.tsx
```

### Spin flow

```
IDLE → SPIN_REQUESTED → SPINNING → STOPPING → EVALUATING → WIN_PRESENTATION → IDLE
```

The state machine is the single source of truth for game state and blocks invalid
transitions (e.g. starting a spin while one is already running).
