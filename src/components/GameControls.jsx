import React from 'react';

export function GameControls({ onRestart, onChangeMode, onResetScore }) {
  return (
    <section className="game-controls" id="game-controls" aria-label="Game Controls">
      <button
        id="btn-restart"
        className="ctrl-btn btn-restart"
        onClick={onRestart}
        type="button"
        title="Clear board and play next round"
      >
        <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
          <polyline points="1 4 1 10 7 10"></polyline>
          <path d="M3.51 15a9 9 0 1 0 2.13-9.36L1 10"></path>
        </svg>
        <span>Restart Game</span>
      </button>

      <button
        id="btn-change-mode"
        className="ctrl-btn btn-change-mode"
        onClick={onChangeMode}
        type="button"
        title="Return to mode selection screen"
      >
        <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"></path>
          <circle cx="9" cy="7" r="4"></circle>
          <path d="M22 21v-2a4 4 0 0 0-3-3.87"></path>
          <path d="M16 3.13a4 4 0 0 1 0 7.75"></path>
        </svg>
        <span>Change Mode</span>
      </button>

      <button
        id="btn-reset-score"
        className="ctrl-btn btn-reset-score"
        onClick={onResetScore}
        type="button"
        title="Reset scores to zero"
      >
        <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M3 6h18"></path>
          <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path>
          <line x1="10" y1="11" x2="10" y2="17"></line>
          <line x1="14" y1="11" x2="14" y2="17"></line>
        </svg>
        <span>Reset Score</span>
      </button>
    </section>
  );
}
