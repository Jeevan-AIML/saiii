import React from 'react';

export function GameResult({ gameMode, humanSymbol, winner, isDraw, onPlayAgain }) {
  if (!winner && !isDraw) {
    return null;
  }

  const isPvp = gameMode === 'pvp';
  let resultTitle = '';
  let resultSubtitle = '';
  let badgeColorClass = '';
  let icon = null;

  if (winner) {
    if (isPvp) {
      if (winner === 'X') {
        resultTitle = '🎉 Player X Wins!';
        resultSubtitle = 'Victory for Player 1';
        badgeColorClass = 'result-x';
        icon = <span className="result-mark mark-x">✕</span>;
      } else {
        resultTitle = '🎉 Player O Wins!';
        resultSubtitle = 'Victory for Player 2';
        badgeColorClass = 'result-o';
        icon = <span className="result-mark mark-o">◯</span>;
      }
    } else {
      // AI Mode
      const isHumanWinner = winner === humanSymbol;
      if (isHumanWinner) {
        resultTitle = '🎉 You Win!';
        resultSubtitle = 'Incredible strategy! You defeated the AI.';
        badgeColorClass = winner === 'X' ? 'result-x' : 'result-o';
        icon = <span className="result-mark">{winner === 'X' ? '✕' : '◯'}</span>;
      } else {
        resultTitle = '🤖 AI Wins!';
        resultSubtitle = 'The AI calculated the winning sequence.';
        badgeColorClass = winner === 'X' ? 'result-x' : 'result-o';
        icon = <span className="result-mark">🤖</span>;
      }
    }
  } else if (isDraw) {
    resultTitle = "It's a Draw!";
    resultSubtitle = 'Evenly matched game! Nobody conceded.';
    badgeColorClass = 'result-draw';
    icon = <span className="result-mark mark-draw">🤝</span>;
  }

  return (
    <div
      className={`game-result-card ${badgeColorClass}`}
      id="game-result-container"
      role="alert"
      aria-live="polite"
    >
      <div className="result-icon-wrapper">
        {icon}
      </div>

      <div className="result-content">
        <h2 className="result-title" id="game-result-message">{resultTitle}</h2>
        <p className="result-subtitle">{resultSubtitle}</p>
      </div>

      <button
        id="btn-play-again"
        className="btn-play-again"
        onClick={onPlayAgain}
        type="button"
      >
        Play Again ➔
      </button>
    </div>
  );
}
