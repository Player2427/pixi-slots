import type { OutcomeProvider, SpinResult } from './OutcomeProvider';
import { evaluate } from '../game/win/WinEvaluator';
import {
  REELS,
  ROWS,
  SYMBOL_IDS,
  type SymbolId,
} from '../game/config/gameConfig';

export class MockServer implements OutcomeProvider {
  private latencyMs: number;

  constructor(latencyMs = 250) {
    this.latencyMs = latencyMs;
  }

  async getSpinResult(bet: number): Promise<SpinResult> {
    await this.delay(this.latencyMs);
    const grid = this.randomGrid();
    // grid.forEach((col) => (col[1] = 'lemon')); // центр всегда lemon → линия 0 всегда выигрывает
    const { wins, totalWin } = evaluate(grid, bet);

    return { grid, wins, totalWin };
  }

  private randomGrid(): SymbolId[][] {
    const grid: SymbolId[][] = [];
    for (let reel = 0; reel < REELS; reel++) {
      const col: SymbolId[] = [];
      for (let row = 0; row < ROWS; row++) {
        col.push(SYMBOL_IDS[(Math.random() * SYMBOL_IDS.length) | 0]);
      }
      grid.push(col);
    }
    return grid;
  }

  private delay(ms: number): Promise<void> {
    return new Promise((r) => setTimeout(r, ms));
  }
}
