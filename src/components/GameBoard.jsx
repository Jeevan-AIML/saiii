import React from 'react';
import { Cell } from './Cell';

export function GameBoard({
  board,
  winningLine,
  isGameOver,
  isAiThinking,
  onSelectCell,
  lastMoveIndex,
}) {
  return (
    <main
      className={`game-board-container ${isGameOver ? 'board-disabled' : ''} ${
        isAiThinking ? 'board-ai-thinking' : ''
      }`}
      aria-label="Tic-Tac-Toe Game Board"
    >
      <div className="game-board" id="game-board" role="grid" aria-label="3 by 3 Tic-Tac-Toe Grid">
        {board.map((cellValue, idx) => {
          const isWinning = Boolean(winningLine && winningLine.includes(idx));
          const isLastMove = lastMoveIndex === idx;

          return (
            <Cell
              key={idx}
              index={idx}
              value={cellValue}
              isWinning={isWinning}
              isGameOver={isGameOver}
              isAiThinking={isAiThinking}
              isLastMove={isLastMove}
              onSelect={onSelectCell}
            />
          );
        })}
      </div>
    </main>
  );
}
