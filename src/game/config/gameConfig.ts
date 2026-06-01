export type SymbolId =
  | 'cherry'
  | 'lemon'
  | 'love'
  | 'star'
  | 'seven'
  | 'bar'
  | 'diamond';

export interface SymbolDef {
  id: SymbolId;
  label: string;
  color: number;
  text: number;
}

export const SYMBOLS: SymbolDef[] = [
  { id: 'cherry', label: '🍒', color: 0x2b2d42, text: 0xffffff },
  { id: 'lemon', label: '🍋', color: 0x2b2d42, text: 0xffffff },
  { id: 'love', label: '🍓', color: 0x2b2d42, text: 0xffffff },
  { id: 'star', label: '⭐', color: 0x3a2d52, text: 0xffffff },
  { id: 'seven', label: '7', color: 0x52213a, text: 0xffd166 },
  { id: 'bar', label: 'BAR', color: 0x213a52, text: 0x8ecae6 },
  { id: 'diamond', label: '💎', color: 0x1d3a3a, text: 0xffffff },
];

export const SYMBOL_IDS: SymbolId[] = SYMBOLS.map((s) => s.id);

export const REELS = 5;
export const ROWS = 3;
export const SYMBOL_SIZE = 120;
export const REEL_GAP = 8;
export const BOARD_PADDING = 16;

export const BOARD_WIDTH =
  REELS * SYMBOL_SIZE + (REELS - 1) * REEL_GAP + 2 * BOARD_PADDING;
export const BOARD_HEIGHT = ROWS * SYMBOL_SIZE + 2 * BOARD_PADDING;

// Fixed design resolution; the whole scene is scaled to fit the viewport.
export const DESIGN_WIDTH = 760;
export const DESIGN_HEIGHT = 600;

export const SPIN_SPEED = 2800;
export const STOP_EXTRA_SYMBOLS = 6;
export const STOP_DURATION = 0.2;
export const REEL_STOP_DELAY = 200;
export const MIN_SPIN_TIME = 600;

export const BG_COLOR = 0x14151f;
export const BOARD_BG_COLOR = 0x0e0f17;

export const START_BALANCE = 1000;
export const BET_STEPS = [1, 2, 5, 10, 20, 50];
export const DEFAULT_BET = 5;

// Row index per reel for each of the 5 fixed paylines.
export const PAYLINES: number[][] = [
  [1, 1, 1, 1, 1],
  [0, 0, 0, 0, 0],
  [2, 2, 2, 2, 2],
  [0, 1, 2, 1, 0],
  [2, 1, 0, 1, 2],
];

// Multiplier vs bet for 3 / 4 / 5 matching symbols from the left.
export const PAYTABLE: Record<SymbolId, [number, number, number]> = {
  cherry: [1, 2, 5],
  lemon: [1, 3, 8],
  love: [69, 69, 69],
  star: [3, 8, 25],
  seven: [5, 15, 50],
  bar: [4, 12, 40],
  diamond: [10, 25, 100],
};

export const MIN_MATCH = 3;
