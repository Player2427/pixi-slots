import { useEffect, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Game } from '../game/Game';
import { BalanceBar } from './BalanceBar';
import { SpinButton } from './SpinButton';
// import { WinOverlay } from './WinOverlay';

export default function App() {
  const hostRef = useRef<HTMLDivElement>(null);
  const gameRef = useRef<Game | null>(null);
  const [muted, setMuted] = useState(false);
  const { i18n } = useTranslation();

  useEffect(() => {
    const host = hostRef.current!;
    const game = new Game();

    let cancelled = false;
    game.init(host).then(() => {
      if (cancelled) game.destroy();
      else gameRef.current = game;
    });

    return () => {
      cancelled = true;
      gameRef.current?.destroy();
      gameRef.current = null;
    };
  }, []);

  const toggleMute = () => {
    const next = !muted;
    setMuted(next);
    gameRef.current?.setMuted(next);
  };

  const toggleLang = () =>
    i18n.changeLanguage(i18n.language === 'en' ? 'ru' : 'en');

  return (
    <div className="app">
      <div className="stage" ref={hostRef} />

      <div className="hud">
        <div className="hud-top">
          <BalanceBar />
          <div className="hud-controls">
            <button className="ctrl-btn" onClick={toggleLang}>
              {i18n.language.toUpperCase()}
            </button>
            <button className="ctrl-btn" onClick={toggleMute}>
              {muted ? '🔇' : '🔊'}
            </button>
          </div>
        </div>

        {/* <WinOverlay /> */}

        <div className="hud-bottom">
          <SpinButton onSpin={() => gameRef.current?.spin()} />
        </div>
      </div>
    </div>
  );
}
