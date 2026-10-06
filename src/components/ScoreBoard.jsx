import React from 'react';

export function ScoreBoard({ scores, gameMode, humanSymbol, currentPlayer, isGameOver, winner }) {
  const isPvp = gameMode === 'pvp';

  // Label names
  const leftLabel = isPvp ? 'Player X' : 'You';
  const rightLabel = isPvp ? 'Player O' : 'AI';

  // Score values
  const leftScore = isPvp ? scores.x : scores.human;
  const rightScore = isPvp ? scores.o : scores.ai;
  const drawScore = scores.draws;

  // Active state determination
  let leftIsActive = false;
  let rightIsActive = false;

  if (isPvp) {
    leftIsActive = !isGameOver && currentPlayer === 'X';
    rightIsActive = !isGameOver && currentPlayer === 'O';
  } else {
    leftIsActive = !isGameOver && currentPlayer === humanSymbol;
    rightIsActive = !isGameOver && currentPlayer !== humanSymbol;
  }

  // Winning card determination
  let leftIsWinner = false;
  let rightIsWinner = false;

  if (isPvp) {
    leftIsWinner = winner === 'X';
    rightIsWinner = winner === 'O';
  } else {
    leftIsWinner = winner === humanSymbol;
    rightIsWinner = winner !== null && winner !== humanSymbol;
  }

  return (
    <section className="scoreboard" id="scoreboard-container" aria-label="Game Scoreboard">
      <div
        className={`score-card score-card-left ${leftIsActive ? 'active-player' : ''} ${leftIsWinner ? 'winner-card' : ''}`}
        id="score-card-player1"
      >
        <div className="score-card-header">
          <span className="player-badge badge-x">
            {isPvp ? 'X' : humanSymbol}
          </span>
          <span className="player-name" id="label-player1">{leftLabel}</span>
        </div>
        <div className="score-value" id="score-player1" aria-label={`${leftLabel} score: ${leftScore}`}>
          {leftScore}
        </div>
        <div className="score-label">Wins</div>
      </div>

      <div
        className={`score-card score-card-draw ${isGameOver && !winner ? 'draw-card' : ''}`}
        id="score-card-draw"
      >
        <div className="score-card-header">
          <span className="player-badge badge-draw">🤝</span>
          <span className="player-name">Draws</span>
        </div>
        <div className="score-value" id="score-draws" aria-label={`Draws count: ${drawScore}`}>
          {drawScore}
        </div>
        <div className="score-label">Ties</div>
      </div>

      <div
        className={`score-card score-card-right ${rightIsActive ? 'active-player' : ''} ${rightIsWinner ? 'winner-card' : ''}`}
        id="score-card-player2"
      >
        <div className="score-card-header">
          <span className="player-badge badge-o">
            {isPvp ? 'O' : (humanSymbol === 'X' ? 'O' : 'X')}
          </span>
          <span className="player-name" id="label-player2">{rightLabel}</span>
        </div>
        <div className="score-value" id="score-player2" aria-label={`${rightLabel} score: ${rightScore}`}>
          {rightScore}
        </div>
        <div className="score-label">Wins</div>
      </div>
    </section>
  );
}
