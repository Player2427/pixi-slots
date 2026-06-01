import { describe, it, expect } from 'vitest';
import { evaluate } from './WinEvaluator';
import { PAYTABLE, type SymbolId } from '../config/gameConfig';

// rows are written as [row][reel] for readability; evaluate expects [reel][row].
function gridFromRows(rows: SymbolId[][]): SymbolId[][] {
  const reels = rows[0].length;
  const grid: SymbolId[][] = [];
  for (let reel = 0; reel < reels; reel++) {
    grid.push(rows.map((row) => row[reel]));
  }
  return grid;
}

const C: SymbolId = 'cherry';
const L: SymbolId = 'lemon';
const D: SymbolId = 'diamond';
const S: SymbolId = 'seven';

describe('WinEvaluator.evaluate', () => {
  it('no win when every line breaks on the second reel', () => {
    const grid: SymbolId[][] = [
      [C, L, D],
      [L, S, C],
      [C, L, D],
      [L, S, C],
      [C, L, D],
    ];
    const { wins, totalWin } = evaluate(grid, 10);
    expect(wins).toHaveLength(0);
    expect(totalWin).toBe(0);
  });

  it('three from the left on the center line pays from the paytable', () => {
    const grid = gridFromRows([
      [L, L, C, L, L],
      [C, C, C, L, L],
      [D, D, D, D, D],
    ]);
    const bet = 10;
    const { wins, totalWin } = evaluate(grid, bet);

    const centerWin = wins.find((w) => w.lineIndex === 0);
    expect(centerWin).toBeDefined();
    expect(centerWin!.symbolId).toBe(C);
    expect(centerWin!.count).toBe(3);
    expect(centerWin!.amount).toBe(PAYTABLE[C][0] * bet);
    expect(centerWin!.cells).toEqual([
      [0, 1],
      [1, 1],
      [2, 1],
    ]);
    expect(totalWin).toBe(PAYTABLE[C][0] * bet + PAYTABLE[D][2] * bet);
  });

  it('five in a row uses the highest multiplier', () => {
    const grid = gridFromRows([
      [S, S, S, S, S],
      [C, L, C, L, C],
      [L, C, L, C, L],
    ]);
    const bet = 5;
    const { wins } = evaluate(grid, bet);
    const topWin = wins.find((w) => w.lineIndex === 1);
    expect(topWin!.count).toBe(5);
    expect(topWin!.amount).toBe(PAYTABLE[S][2] * bet);
  });

  it('a break on the second reel pays nothing (needs >= 3)', () => {
    const grid = gridFromRows([
      [C, L, L, L, L],
      [L, L, L, L, L],
      [D, C, C, C, C],
    ]);
    const { wins } = evaluate(grid, 10);
    expect(wins.find((w) => w.lineIndex === 0)?.count).toBe(5);
    expect(wins.find((w) => w.lineIndex === 1)).toBeUndefined();
    expect(wins.find((w) => w.lineIndex === 2)).toBeUndefined();
  });

  it('the V-shaped line (index 3) is scored on its own cells', () => {
    const grid: SymbolId[][] = [
      [C, L, L],
      [L, C, L],
      [L, L, C],
      [L, C, L],
      [D, D, D],
    ];
    const { wins } = evaluate(grid, 2);
    const vWin = wins.find((w) => w.lineIndex === 3);
    expect(vWin).toBeDefined();
    expect(vWin!.count).toBe(4);
    expect(vWin!.symbolId).toBe(C);
    expect(vWin!.cells).toEqual([
      [0, 0],
      [1, 1],
      [2, 2],
      [3, 1],
    ]);
  });
});
