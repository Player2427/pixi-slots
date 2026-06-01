import { Container, Graphics, Text, Texture, type Renderer } from 'pixi.js';
import { SYMBOLS, SYMBOL_SIZE, type SymbolId } from '../game/config/gameConfig';

export type SymbolTextures = Record<SymbolId, Texture>;

// Placeholder textures generated at runtime. In production these would be
// loaded from a sprite atlas via Assets.load — the return shape stays the same.
export class AssetLoader {
  static createSymbolTextures(renderer: Renderer): SymbolTextures {
    const textures = {} as SymbolTextures;
    const pad = 6;

    for (const def of SYMBOLS) {
      const node = new Container();

      const bg = new Graphics()
        .roundRect(pad, pad, SYMBOL_SIZE - pad * 2, SYMBOL_SIZE - pad * 2, 16)
        .fill(def.color)
        .stroke({ width: 2, color: 0xffffff, alpha: 0.08 });
      node.addChild(bg);

      const label = new Text({
        text: def.label,
        style: {
          fontFamily: 'Arial, sans-serif',
          fontSize: 56,
          fontWeight: '700',
          fill: def.text,
          align: 'center',
        },
      });
      label.anchor.set(0.5);
      label.position.set(SYMBOL_SIZE / 2, SYMBOL_SIZE / 2);
      node.addChild(label);

      textures[def.id] = renderer.generateTexture(node);
      node.destroy({ children: true });
    }

    return textures;
  }
}
