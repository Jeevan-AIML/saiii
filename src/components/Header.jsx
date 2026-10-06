import React, { useState } from 'react';
import { setMuted, getMuted, playButtonSound } from '../utils/sound';

export function Header({ gameMode, humanSymbol, aiSymbol, onChangeMode }) {
  const [muted, setLocalMuted] = useState(getMuted());

  const toggleSound = () => {
    const nextState = !muted;
    setMuted(nextState);
    setLocalMuted(nextState);
    if (!nextState) {
      playButtonSound();
    }
  };

  let modeBadgeText = 'Human vs Human';
  if (gameMode === 'ai') {
    modeBadgeText = `Human (${humanSymbol}) vs AI (${aiSymbol})`;
  }

  return (
    <header className="header" id="app-header">
      <div className="header-top">
        <button
          id="btn-header-mode-badge"
          className="badge-pill clickable-pill"
          onClick={onChangeMode}
          title="Click to change game mode"
          type="button"
        >
          {gameMode === 'ai' ? '🤖 ' : '👥 '}
          {modeBadgeText}
        </button>

        <button
          id="sound-toggle-btn"
          className="sound-toggle-btn"
          onClick={toggleSound}
          aria-label={muted ? 'Unmute sound effects' : 'Mute sound effects'}
          title={muted ? 'Unmute sound effects' : 'Mute sound effects'}
          type="button"
        >
          {muted ? (
            <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <line x1="1" y1="1" x2="23" y2="23"></line>
              <path d="M9 9v3a3 3 0 0 0 5.12 2.12M15 9.34V4a3 3 0 0 0-5.94-.6"></path>
              <path d="M17 16.95A7 7 0 0 1 5 12v-2m14 0v2a7 7 0 0 1-.11 1.23"></path>
              <line x1="12" y1="19" x2="12" y2="23"></line>
              <line x1="8" y1="23" x2="16" y2="23"></line>
            </svg>
          ) : (
            <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5"></polygon>
              <path d="M19.07 4.93a10 10 0 0 1 0 14.14M15.54 8.46a5 5 0 0 1 0 7.07"></path>
            </svg>
          )}
          <span className="sound-toggle-text">{muted ? 'Muted' : 'Sound On'}</span>
        </button>
      </div>

      <h1 className="game-title" id="game-title">Tic-Tac-Toe</h1>
      <p className="game-subtitle" id="game-subtitle">
        {gameMode === 'ai' ? 'Human vs AI Match' : 'Player X vs Player O'}
      </p>
    </header>
  );
}
