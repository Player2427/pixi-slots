import { create } from 'zustand';
import { GameState } from '../game/state/GameStateMachine';
import {
  BET_STEPS,
  DEFAULT_BET,
  START_BALANCE,
} from '../game/config/gameConfig';

interface GameStore {
  balance: number;
  bet: number;
  gameState: GameState;
  lastWin: number;

  setGameState: (s: GameState) => void;
  setBalance: (n: number) => void;
  addBalance: (n: number) => void;
  setLastWin: (n: number) => void;
  increaseBet: () => void;
  decreaseBet: () => void;
}

const defaultIndex = Math.max(0, BET_STEPS.indexOf(DEFAULT_BET));

export const useGameStore = create<GameStore>((set) => ({
  balance: START_BALANCE,
  bet: BET_STEPS[defaultIndex],
  gameState: GameState.IDLE,
  lastWin: 0,

  setGameState: (s) => set({ gameState: s }),
  setBalance: (n) => set({ balance: n }),
  addBalance: (n) => set((st) => ({ balance: st.balance + n })),
  setLastWin: (n) => set({ lastWin: n }),

  increaseBet: () =>
    set((st) => {
      if (st.gameState !== GameState.IDLE) return st;
      const i = BET_STEPS.indexOf(st.bet);
      const next = Math.min(i + 1, BET_STEPS.length - 1);
      return { bet: BET_STEPS[next] };
    }),
  decreaseBet: () =>
    set((st) => {
      if (st.gameState !== GameState.IDLE) return st;
      const i = BET_STEPS.indexOf(st.bet);
      const prev = Math.max(i - 1, 0);
      return { bet: BET_STEPS[prev] };
    }),
}));
