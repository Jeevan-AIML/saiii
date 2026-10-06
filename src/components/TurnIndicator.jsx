import React from 'react';

export function TurnIndicator({
  gameMode,
  humanSymbol,
  currentPlayer,
  isGameOver,
  isAiThinking,
}) {
  if (isGameOver) {
    return (
      <div className="turn-indicator game-over-indicator" id="turn-indicator" aria-live="polite">
        <span className="status-dot completed-dot"></span>
        <span className="turn-text">Round Finished</span>
      </div>
    );
  }

  const isPvp = gameMode === 'pvp';

  if (!isPvp && isAiThinking) {
    return (
      <div className="turn-indicator turn-indicator-thinking" id="turn-indicator" aria-live="polite">
        <span className="thinking-spinner"></span>
        <span className="turn-text text-thinking">AI is thinking...</span>
      </div>
    );
  }

  let turnText = '';
  let markColor = currentPlayer === 'X' ? 'x' : 'o';

  if (isPvp) {
    turnText = currentPlayer === 'X' ? "Player X's Turn" : "Player O's Turn";
  } else {
    turnText = currentPlayer === humanSymbol ? 'Your Turn' : "AI's Turn";
  }

  return (
    <div
      className={`turn-indicator turn-indicator-${markColor}`}
      id="turn-indicator"
      aria-live="polite"
      role="status"
    >
      <span className="pulse-indicator"></span>
      <span className="turn-text">{turnText}</span>
      <span className="turn-mark-badge">{currentPlayer}</span>
    </div>
  );
}
