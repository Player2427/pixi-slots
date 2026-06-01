import { Container, Graphics, Sprite, Text } from 'pixi.js';
import { GlowFilter } from 'pixi-filters';
import gsap from 'gsap';
import type { ReelSet } from '../reels/ReelSet';
import type { WinLine } from './WinEvaluator';
import { DESIGN_WIDTH, DESIGN_HEIGHT, SYMBOL_SIZE } from '../config/gameConfig';

export class WinPresenter {
  private world: Container;
  private reelSet: ReelSet;
  private layer = new Container();

  constructor(world: Container, reelSet: ReelSet) {
    this.world = world;
    this.reelSet = reelSet;
    this.world.addChild(this.layer);
  }

  present(wins: WinLine[], totalWin: number): Promise<void> {
    return new Promise((resolve) => {
      const dim = new Graphics()
        .rect(0, 0, DESIGN_WIDTH, DESIGN_HEIGHT)
        .fill({ color: 0x000000, alpha: 1 });
      dim.alpha = 0;
      this.layer.addChild(dim);

      const seen = new Set<string>();
      const glow = new GlowFilter({
        color: 0xffd166,
        outerStrength: 0,
        innerStrength: 0,
        distance: 14,
      });
      const clones: Sprite[] = [];

      for (const win of wins) {
        for (const [reel, row] of win.cells) {
          const key = `${reel}:${row}`;
          if (seen.has(key)) continue;
          seen.add(key);

          const original = this.reelSet.getSymbolAt(reel, row);
          if (!original) continue;

          const clone = new Sprite(original.texture);
          clone.anchor.set(0, 0);
          clone.setSize(SYMBOL_SIZE, SYMBOL_SIZE);
          const pos = this.layer.toLocal(original.getGlobalPosition());
          clone.position.set(pos.x, pos.y);
          clone.filters = [glow];
          clones.push(clone);
          this.layer.addChild(clone);
        }
      }

      const winText = new Text({
        text: 'WIN  0',
        style: {
          fontFamily: 'Arial, sans-serif',
          fontSize: 64,
          fontWeight: '800',
          fill: 0xffd166,
          stroke: { color: 0x000000, width: 6 },
        },
      });
      winText.anchor.set(0.5);
      winText.position.set(DESIGN_WIDTH / 2, DESIGN_HEIGHT / 2);
      winText.scale.set(0.6);
      winText.alpha = 0;
      this.layer.addChild(winText);

      const counter = { value: 0 };
      const tl = gsap.timeline({
        onComplete: () => {
          this.cleanup();
          resolve();
        },
      });

      tl.to(dim, { alpha: 0.55, duration: 0.25 })
        .to(
          glow,
          {
            outerStrength: 6,
            duration: 0.5,
            repeat: 2,
            yoyo: true,
            ease: 'sine.inOut',
          },
          '<',
        )
        .to(
          clones.map((c) => c.scale),
          {
            x: 1.12,
            y: 1.12,
            duration: 0.5,
            repeat: 2,
            yoyo: true,
            ease: 'sine.inOut',
          },
          '<',
        )
        .to(winText, { alpha: 1, duration: 0.2 }, '<')
        .to(winText.scale, { x: 1, y: 1, duration: 0.4, ease: 'back.out(2)' }, '<')
        .to(
          counter,
          {
            value: totalWin,
            duration: 0.8,
            ease: 'power1.out',
            onUpdate: () => {
              const value = Math.round(counter.value);
              if (value%69 === 0) {
                winText.text = '😍👉👈😊❤️😘💕🥰✨🌙💞😴❤️🌃';
              } else {
                winText.text = `WIN  ${value}`;
              }
              // winText.text = `WIN  ${Math.round(counter.value)}`;
            },
          },
          '<',
        )
        .to({}, { duration: 0.6 })
        .to([dim, winText], { alpha: 0, duration: 0.3 });
    });
  }

  private cleanup(): void {
    this.layer.removeChildren().forEach((c) => c.destroy());
  }
}
