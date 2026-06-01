import { Sprite } from 'pixi.js';
import { SYMBOL_SIZE, type SymbolId } from '../config/gameConfig';
import type { SymbolTextures } from '../../services/AssetLoader';

export class SlotSymbol extends Sprite {
  symbolId!: SymbolId;
  private textures: SymbolTextures;

  constructor(textures: SymbolTextures) {
    super();
    this.textures = textures;
    this.anchor.set(0, 0);
  }

  setSymbol(id: SymbolId): void {
    this.symbolId = id;
    this.texture = this.textures[id];
    this.setSize(SYMBOL_SIZE, SYMBOL_SIZE);
  }
}
