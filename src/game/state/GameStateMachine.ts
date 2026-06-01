export const GameState = {
  IDLE: 'IDLE',
  SPIN_REQUESTED: 'SPIN_REQUESTED',
  SPINNING: 'SPINNING',
  STOPPING: 'STOPPING',
  EVALUATING: 'EVALUATING',
  WIN_PRESENTATION: 'WIN_PRESENTATION',
} as const;

export type GameState = (typeof GameState)[keyof typeof GameState];

const TRANSITIONS: Record<GameState, GameState[]> = {
  [GameState.IDLE]: [GameState.SPIN_REQUESTED],
  [GameState.SPIN_REQUESTED]: [GameState.SPINNING],
  [GameState.SPINNING]: [GameState.STOPPING],
  [GameState.STOPPING]: [GameState.EVALUATING],
  [GameState.EVALUATING]: [GameState.WIN_PRESENTATION, GameState.IDLE],
  [GameState.WIN_PRESENTATION]: [GameState.IDLE],
};

export class GameStateMachine {
  private current: GameState = GameState.IDLE;
  onChange?: (state: GameState, prev: GameState) => void;

  get state(): GameState {
    return this.current;
  }

  is(state: GameState): boolean {
    return this.current === state;
  }

  canTransition(to: GameState): boolean {
    return TRANSITIONS[this.current].includes(to);
  }

  transition(to: GameState): void {
    if (!this.canTransition(to)) {
      throw new Error(`Illegal transition: ${this.current} → ${to}`);
    }
    const prev = this.current;
    this.current = to;
    this.onChange?.(to, prev);
  }
}
