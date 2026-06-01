import type { SymbolId } from '../game/config/gameConfig';
import type { WinLine } from '../game/win/WinEvaluator';

export interface SpinResult {
  grid: SymbolId[][];
  wins: WinLine[];
  totalWin: number;
}

// Source of the spin outcome. The client only renders what this returns —
// in production this is backed by the real game API.
export interface OutcomeProvider {
  getSpinResult(bet: number): Promise<SpinResult>;
}
