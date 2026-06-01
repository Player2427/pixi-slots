import { useTranslation } from 'react-i18next';
import { useGameStore } from '../store/gameStore';
import { GameState } from '../game/state/GameStateMachine';

export function BalanceBar() {
  const { t } = useTranslation();
  const balance = useGameStore((s) => s.balance);
  const bet = useGameStore((s) => s.bet);
  const gameState = useGameStore((s) => s.gameState);
  const increaseBet = useGameStore((s) => s.increaseBet);
  const decreaseBet = useGameStore((s) => s.decreaseBet);

  const idle = gameState === GameState.IDLE;

  return (
    <div className="balance-bar">
      <div className="stat">
        <span className="stat-label">{t('balance')}</span>
        <span className="stat-value">{balance}</span>
      </div>

      <div className="stat bet">
        <span className="stat-label">{t('bet')}</span>
        <div className="bet-controls">
          <button
            className="bet-btn"
            onClick={decreaseBet}
            disabled={!idle}
            aria-label="decrease bet"
          >
            −
          </button>
          <span className="stat-value">{bet}</span>
          <button
            className="bet-btn"
            onClick={increaseBet}
            disabled={!idle}
            aria-label="increase bet"
          >
            +
          </button>
        </div>
      </div>
    </div>
  );
}
