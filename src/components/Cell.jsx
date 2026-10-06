import React from 'react';

export function Cell({
  index,
  value,
  isWinning,
  isGameOver,
  isAiThinking,
  onSelect,
  isLastMove,
}) {
  const handleClick = () => {
    if (!value && !isGameOver && !isAiThinking) {
      onSelect(index);
    }
  };

  const ariaLabel = value
    ? `Cell ${index + 1}, Player ${value}`
    : `Cell ${index + 1}, empty`;

  return (
    <button
      id={`cell-${index}`}
      className={`cell ${value ? `cell-${value.toLowerCase()}` : 'cell-empty'} ${
        isWinning ? 'cell-winning' : ''
      } ${isLastMove ? 'cell-last-move' : ''}`}
      onClick={handleClick}
      disabled={isGameOver || Boolean(value) || isAiThinking}
      aria-label={ariaLabel}
      type="button"
    >
      {value === 'X' && (
        <span className="mark mark-x" aria-hidden="true">
          <svg viewBox="0 0 50 50" className="mark-svg">
            <line x1="12" y1="12" x2="38" y2="38" stroke="currentColor" strokeWidth="6" strokeLinecap="round" />
            <line x1="38" y1="12" x2="12" y2="38" stroke="currentColor" strokeWidth="6" strokeLinecap="round" />
          </svg>
        </span>
      )}
      {value === 'O' && (
        <span className="mark mark-o" aria-hidden="true">
          <svg viewBox="0 0 50 50" className="mark-svg">
            <circle cx="25" cy="25" r="16" stroke="currentColor" strokeWidth="6" fill="none" strokeLinecap="round" />
          </svg>
        </span>
      )}
    </button>
  );
}
