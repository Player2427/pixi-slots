import { useTranslation } from 'react-i18next';
import { useGameStore } from '../store/gameStore';
import { GameState } from '../game/state/GameStateMachine';

export function WinOverlay() {
  const { t } = useTranslation();
  const lastWin = useGameStore((s) => s.lastWin);
  const gameState = useGameStore((s) => s.gameState);

  const visible = gameState === GameState.WIN_PRESENTATION && lastWin > 0;
  if (!visible) return null;

  return (
    <div className="win-overlay">
      {lastWin%69 === 0 ? '😍👉👈😊❤️😘💕🥰✨🌙💞😴❤️🌃' :
      <>
        {t('win')}: <strong>{lastWin}</strong>
      </>}
    </div>
  );
}
