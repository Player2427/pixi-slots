import {
  PAYLINES,
  PAYTABLE,
  MIN_MATCH,
  type SymbolId,
} from '../config/gameConfig';

export type Cell = [reel: number, row: number];

export interface WinLine {
  lineIndex: number;
  symbolId: SymbolId;
  count: number;
  amount: number;
  cells: Cell[];
}

export interface EvaluationResult {
  wins: WinLine[];
  totalWin: number;
}

export function evaluate(grid: SymbolId[][], bet: number): EvaluationResult {
  const wins: WinLine[] = [];

  PAYLINES.forEach((line, lineIndex) => {
    const firstSymbol = grid[0][line[0]];

    let count = 1;
    const cells: Cell[] = [[0, line[0]]];
    for (let reel = 1; reel < line.length; reel++) {
      const row = line[reel];
      if (grid[reel][row] === firstSymbol) {
        count++;
        cells.push([reel, row]);
      } else {
        break;
      }
    }

    if (count >= MIN_MATCH) {
      const multiplier = PAYTABLE[firstSymbol][count - MIN_MATCH];
      wins.push({
        lineIndex,
        symbolId: firstSymbol,
        count,
        amount: multiplier * bet,
        cells: cells.slice(0, count),
      });
    }
  });

  const totalWin = wins.reduce((sum, w) => sum + w.amount, 0);
  return { wins, totalWin };
}
