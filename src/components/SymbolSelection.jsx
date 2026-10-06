import React from 'react';

export function SymbolSelection({ onSelectSymbol, onBack }) {
  return (
    <section className="symbol-selection-container" id="symbol-selection-screen" aria-label="Choose Your Symbol">
      <div className="symbol-selection-header">
        <button
          id="btn-back-to-mode"
          className="btn-back"
          onClick={onBack}
          type="button"
          aria-label="Back to game mode selection"
        >
          ← Change Mode
        </button>
        <h2 className="symbol-title">Choose your symbol</h2>
        <p className="symbol-subtitle">Select who takes the first move</p>
      </div>

      <div className="symbol-cards-grid">
        <button
          id="btn-choose-x"
          className="symbol-card symbol-card-x"
          onClick={() => onSelectSymbol('X')}
          type="button"
        >
          <div className="symbol-mark-preview mark-x">✕</div>
          <h3 className="symbol-card-title">Play as X</h3>
          <span className="symbol-turn-note">You play first</span>
          <p className="symbol-desc">Human = X • AI = O</p>
        </button>

        <button
          id="btn-choose-o"
          className="symbol-card symbol-card-o"
          onClick={() => onSelectSymbol('O')}
          type="button"
        >
          <div className="symbol-mark-preview mark-o">◯</div>
          <h3 className="symbol-card-title">Play as O</h3>
          <span className="symbol-turn-note">AI plays first</span>
          <p className="symbol-desc">Human = O • AI = X</p>
        </button>
      </div>
    </section>
  );
}
