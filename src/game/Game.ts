import { Application, Container, Graphics } from 'pixi.js';
import { AssetLoader } from '../services/AssetLoader';
import { ResizeManager } from '../services/ResizeManager';
import { SoundManager } from '../services/SoundManager';
import { ReelSet } from './reels/ReelSet';
import { WinPresenter } from './win/WinPresenter';
import { GameState, GameStateMachine } from './state/GameStateMachine';
import { MockServer } from '../server/MockServer';
import type { OutcomeProvider } from '../server/OutcomeProvider';
import { useGameStore } from '../store/gameStore';
import {
  BG_COLOR,
  BOARD_BG_COLOR,
  BOARD_WIDTH,
  BOARD_HEIGHT,
  BOARD_PADDING,
  DESIGN_WIDTH,
  DESIGN_HEIGHT,
  MIN_SPIN_TIME,
} from './config/gameConfig';

const delay = (ms: number) => new Promise((r) => setTimeout(r, ms));

export class Game {
  private app = new Application();
  private world = new Container();
  private reelSet!: ReelSet;
  private winPresenter!: WinPresenter;
  private resizeManager!: ResizeManager;
  private sound = new SoundManager();
  private fsm = new GameStateMachine();
  private outcome: OutcomeProvider = new MockServer();

  async init(host: HTMLElement): Promise<void> {
    await this.app.init({
      background: BG_COLOR,
      antialias: true,
      resolution: window.devicePixelRatio || 1,
      autoDensity: true,
    });
    host.appendChild(this.app.canvas);
    this.app.stage.addChild(this.world);

    const textures = AssetLoader.createSymbolTextures(this.app.renderer);

    const board = new Container();
    board.x = (DESIGN_WIDTH - BOARD_WIDTH) / 2;
    board.y = (DESIGN_HEIGHT - BOARD_HEIGHT) / 2;
    this.world.addChild(board);

    const boardBg = new Graphics()
      .roundRect(0, 0, BOARD_WIDTH, BOARD_HEIGHT, 18)
      .fill(BOARD_BG_COLOR)
      .stroke({ width: 2, color: 0xffffff, alpha: 0.06 });
    board.addChild(boardBg);

    this.reelSet = new ReelSet(textures);
    this.reelSet.view.x = BOARD_PADDING;
    this.reelSet.view.y = BOARD_PADDING;
    board.addChild(this.reelSet.view);

    this.winPresenter = new WinPresenter(this.world, this.reelSet);

    this.fsm.onChange = (state) => {
      useGameStore.getState().setGameState(state);
    };

    this.app.ticker.add((ticker) => {
      this.reelSet.update(ticker.deltaMS / 1000);
    });

    this.resizeManager = new ResizeManager(this.app, this.world, host);
  }

  async spin(): Promise<void> {
    const store = useGameStore.getState();
    if (!this.fsm.is(GameState.IDLE)) return;
    if (store.balance < store.bet) return;

    const bet = store.bet;

    this.fsm.transition(GameState.SPIN_REQUESTED);
    store.addBalance(-bet);
    store.setLastWin(0);

    // Start spinning immediately and fetch the outcome in parallel so the
    // click feels instant; the reels can't stop before both resolve.
    this.fsm.transition(GameState.SPINNING);
    this.reelSet.spin();
    this.sound.play('spin');

    const [result] = await Promise.all([
      this.outcome.getSpinResult(bet),
      delay(MIN_SPIN_TIME),
    ]);

    this.fsm.transition(GameState.STOPPING);
    await this.reelSet.stop(result.grid, () => this.sound.play('reelStop'));
    // console.log('server :', result.grid.map((c) => c[1])); // центр по серверу
    // console.log('display:', this.reelSet.getResult().map((c) => c[1])); // что реально легло

    this.fsm.transition(GameState.EVALUATING);

    if (result.totalWin > 0) {
      this.fsm.transition(GameState.WIN_PRESENTATION);
      store.addBalance(result.totalWin);
      store.setLastWin(result.totalWin);
      this.sound.play('win');
      await this.winPresenter.present(result.wins, result.totalWin);
      this.fsm.transition(GameState.IDLE);
    } else {
      this.fsm.transition(GameState.IDLE);
    }
  }

  setMuted(muted: boolean): void {
    this.sound.setMuted(muted);
  }

  destroy(): void {
    this.resizeManager?.destroy();
    this.app.destroy(true, { children: true, texture: true });
  }
}
