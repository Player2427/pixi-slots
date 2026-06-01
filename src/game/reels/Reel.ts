import { Container, Graphics } from 'pixi.js';
import { SlotSymbol } from './Symbol';
import type { SymbolTextures } from '../../services/AssetLoader';
import {
  ROWS,
  SYMBOL_SIZE,
  SYMBOL_IDS,
  SPIN_SPEED,
  STOP_EXTRA_SYMBOLS,
  STOP_DURATION,
  type SymbolId,
} from '../config/gameConfig';

type ReelState = 'idle' | 'spinning' | 'stopping';

// Visible rows plus one buffer symbol above and below.
const SPRITE_COUNT = ROWS + 2;
const H = SYMBOL_SIZE;
const CYCLE = SPRITE_COUNT * H;

function randomSymbol(): SymbolId {
  return SYMBOL_IDS[(Math.random() * SYMBOL_IDS.length) | 0];
}

export class Reel {
  readonly view = new Container();

  private symbols: SlotSymbol[] = [];
  private state: ReelState = 'idle';

  private position = 0;
  private rendered = 0;

  private stopTarget = 0;
  private stopStartPos = 0;
  private stopElapsed = 0;
  private targets: SymbolId[] | null = null;
  private stopResolve: (() => void) | null = null;

  constructor(textures: SymbolTextures) {
    const mask = new Graphics()
      .rect(0, 0, SYMBOL_SIZE, ROWS * SYMBOL_SIZE)
      .fill(0xffffff);
    this.view.addChild(mask);
    this.view.mask = mask;

    for (let i = 0; i < SPRITE_COUNT; i++) {
      const s = new SlotSymbol(textures);
      s.x = 0;
      s.y = (i - 1) * H;
      s.setSymbol(randomSymbol());
      this.symbols.push(s);
      this.view.addChild(s);
    }
  }

  getVisibleSprites(): SlotSymbol[] {
    return this.symbols
      .filter((s) => s.y > -H / 2 && s.y < ROWS * H - H / 2)
      .sort((a, b) => a.y - b.y);
  }

  getVisibleSymbols(): SymbolId[] {
    return this.getVisibleSprites().map((s) => s.symbolId);
  }

  spin(): void {
    this.state = 'spinning';
  }

  requestStop(targets: SymbolId[]): Promise<void> {
    this.targets = targets;
    const nextAligned = Math.ceil(this.position / H);
    this.stopTarget = (nextAligned + STOP_EXTRA_SYMBOLS) * H;
    this.stopStartPos = this.position;
    this.stopElapsed = 0;
    this.state = 'stopping';
    return new Promise((resolve) => {
      this.stopResolve = resolve;
    });
  }

  update(dt: number): void {
    if (this.state === 'spinning') {
      this.position += SPIN_SPEED * dt;
    } else if (this.state === 'stopping') {
      this.stopElapsed += dt;
      const k = Math.min(this.stopElapsed / STOP_DURATION, 1);
      const eased = 1 - Math.pow(1 - k, 3);
      this.position =
        this.stopStartPos + (this.stopTarget - this.stopStartPos) * eased;

      if (k >= 1) {
        this.position = this.stopTarget;
        this.applyMovement();
        this.finishStop();
        return;
      }
    } else {
      return;
    }

    this.applyMovement();
  }

  private applyMovement(): void {
    const delta = this.position - this.rendered;
    this.rendered = this.position;
    if (delta === 0) return;

    for (const s of this.symbols) {
      s.y += delta;
      while (s.y >= (SPRITE_COUNT - 1) * H) {
        s.y -= CYCLE;
        s.setSymbol(this.pickWrapSymbol(s.y));
      }
    }
  }

  // While stopping, the last ROWS symbols entering the top get the target
  // symbols so the reel lands on the requested result.
  private pickWrapSymbol(yAfterWrap: number): SymbolId {
    if (this.state === 'stopping' && this.targets) {
      const finalY = yAfterWrap + (this.stopTarget - this.position);
      const row = Math.round(finalY / H);
      if (row >= 0 && row < ROWS) {
        return this.targets[row];
      }
    }
    return randomSymbol();
  }

  private finishStop(): void {
    for (const s of this.symbols) {
      s.y = Math.round(s.y / H) * H;
    }
    this.state = 'idle';
    this.targets = null;
    const resolve = this.stopResolve;
    this.stopResolve = null;
    resolve?.();
  }
}
