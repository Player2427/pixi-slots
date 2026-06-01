import type { Application, Container } from 'pixi.js';
import { DESIGN_WIDTH, DESIGN_HEIGHT } from '../game/config/gameConfig';

export class ResizeManager {
  private onResize = () => this.resize();
  private app: Application;
  private world: Container;
  private host: HTMLElement;

  constructor(app: Application, world: Container, host: HTMLElement) {
    this.app = app;
    this.world = world;
    this.host = host;
    window.addEventListener('resize', this.onResize);
    window.addEventListener('orientationchange', this.onResize);
    this.resize();
  }

  resize(): void {
    const w = this.host.clientWidth;
    const h = this.host.clientHeight;
    if (w === 0 || h === 0) return;

    this.app.renderer.resize(w, h);

    const scale = Math.min(w / DESIGN_WIDTH, h / DESIGN_HEIGHT);
    this.world.scale.set(scale);
    this.world.x = (w - DESIGN_WIDTH * scale) / 2;
    this.world.y = (h - DESIGN_HEIGHT * scale) / 2;
  }

  destroy(): void {
    window.removeEventListener('resize', this.onResize);
    window.removeEventListener('orientationchange', this.onResize);
  }
}
