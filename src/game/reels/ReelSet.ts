import { Container } from 'pixi.js';
import { Reel } from './Reel';
import type { SymbolTextures } from '../../services/AssetLoader';
import {
  REELS,
  SYMBOL_SIZE,
  REEL_GAP,
  REEL_STOP_DELAY,
  type SymbolId,
} from '../config/gameConfig';

const delay = (ms: number) => new Promise((r) => setTimeout(r, ms));

export type ResultGrid = SymbolId[][];

export class ReelSet {
  readonly view = new Container();
  private reels: Reel[] = [];

  constructor(textures: SymbolTextures) {
    for (let i = 0; i < REELS; i++) {
      const reel = new Reel(textures);
      reel.view.x = i * (SYMBOL_SIZE + REEL_GAP);
      reel.view.y = 0;
      this.reels.push(reel);
      this.view.addChild(reel.view);
    }
  }

  update(dt: number): void {
    for (const reel of this.reels) reel.update(dt);
  }

  spin(): void {
    for (const reel of this.reels) reel.spin();
  }

  async stop(
    grid: ResultGrid,
    onReelStop?: (index: number) => void,
  ): Promise<void> {
    const stops: Promise<void>[] = [];
    for (let i = 0; i < this.reels.length; i++) {
      if (i > 0) await delay(REEL_STOP_DELAY);
      const index = i;
      const p = this.reels[index].requestStop(grid[index]).then(() => {
        onReelStop?.(index);
      });
      stops.push(p);
    }
    await Promise.all(stops);
  }

  getResult(): ResultGrid {
    return this.reels.map((r) => r.getVisibleSymbols());
  }

  getSymbolAt(reel: number, row: number) {
    return this.reels[reel].getVisibleSprites()[row];
  }
}
