import React from 'react';

export function ModeSelection({ onSelectPvP, onSelectAI }) {
  return (
    <section className="mode-selection-container" id="mode-selection-screen" aria-label="Choose Game Mode">
      <div className="mode-selection-header">
        <h1 className="mode-title">TIC-TAC-TOE</h1>
        <p className="mode-subtitle">Choose who you want to play with</p>
      </div>

      <div className="mode-cards-grid">
        <button
          id="btn-mode-ai"
          className="mode-card mode-card-ai"
          onClick={onSelectAI}
          type="button"
        >
          <div className="mode-card-icon-wrap ai-icon-wrap">
            <span className="mode-card-emoji" role="img" aria-label="Robot">🤖</span>
          </div>
          <div className="mode-card-content">
            <h2 className="mode-card-title">Play with AI</h2>
            <span className="mode-card-badge badge-ai">Human vs AI</span>
            <p className="mode-card-desc">Challenge the smart algorithmic AI with custom symbol selection.</p>
          </div>
          <div className="mode-card-arrow">➔</div>
        </button>

        <button
          id="btn-mode-pvp"
          className="mode-card mode-card-pvp"
          onClick={onSelectPvP}
          type="button"
        >
          <div className="mode-card-icon-wrap pvp-icon-wrap">
            <span className="mode-card-emoji" role="img" aria-label="Two People">👥</span>
          </div>
          <div className="mode-card-content">
            <h2 className="mode-card-title">Play with Friend</h2>
            <span className="mode-card-badge badge-pvp">Human vs Human</span>
            <p className="mode-card-desc">Compete turn-by-turn with a friend on the same device.</p>
          </div>
          <div className="mode-card-arrow">➔</div>
        </button>
      </div>
    </section>
  );
}
