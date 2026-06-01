import { useTranslation } from 'react-i18next';
import { useGameStore } from '../store/gameStore';
import { GameState } from '../game/state/GameStateMachine';

export function SpinButton({ onSpin }: { onSpin: () => void }) {
  const { t } = useTranslation();
  const gameState = useGameStore((s) => s.gameState);
  const balance = useGameStore((s) => s.balance);
  const bet = useGameStore((s) => s.bet);

  const disabled = gameState !== GameState.IDLE || balance < bet;

  return (
    <button className="spin-btn" disabled={disabled} onClick={onSpin}>
      {gameState === GameState.IDLE ? t('spin') : '…'}
    </button>
  );
}
