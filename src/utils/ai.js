/**
 * Minimax algorithm implementation for Tic-Tac-Toe.
 * Guarantees optimal or near-optimal decision making:
 * - Takes immediate win
 * - Blocks opponent immediate win
 * - Prefers center and corners
 * - Never makes an invalid or occupied move
 */

const WINNING_LINES = [
  [0, 1, 2],
  [3, 4, 5],
  [6, 7, 8],
  [0, 3, 6],
  [1, 4, 7],
  [2, 5, 8],
  [0, 4, 8],
  [2, 4, 6],
];

function checkWinnerOnBoard(board) {
  for (const combo of WINNING_LINES) {
    const [a, b, c] = combo;
    if (board[a] && board[a] === board[b] && board[a] === board[c]) {
      return board[a];
    }
  }
  return null;
}

export function getBestMove(board, aiSymbol, humanSymbol) {
  // 1. Immediate Win Check: Can AI win in one move?
  for (let i = 0; i < 9; i++) {
    if (board[i] === null) {
      const tempBoard = [...board];
      tempBoard[i] = aiSymbol;
      if (checkWinnerOnBoard(tempBoard) === aiSymbol) {
        return i;
      }
    }
  }

  // 2. Immediate Block Check: Can opponent win in one move?
  for (let i = 0; i < 9; i++) {
    if (board[i] === null) {
      const tempBoard = [...board];
      tempBoard[i] = humanSymbol;
      if (checkWinnerOnBoard(tempBoard) === humanSymbol) {
        return i;
      }
    }
  }

  // 3. Minimax with depth limit and Alpha-Beta pruning for fast optimal play
  function minimax(currentBoard, depth, isMaximizing, alpha, beta) {
    const winner = checkWinnerOnBoard(currentBoard);
    if (winner === aiSymbol) return 10 - depth;
    if (winner === humanSymbol) return depth - 10;

    const isFull = currentBoard.every((cell) => cell !== null);
    if (isFull) return 0;

    if (isMaximizing) {
      let maxEval = -Infinity;
      for (let i = 0; i < 9; i++) {
        if (currentBoard[i] === null) {
          currentBoard[i] = aiSymbol;
          const evaluation = minimax(currentBoard, depth + 1, false, alpha, beta);
          currentBoard[i] = null;
          maxEval = Math.max(maxEval, evaluation);
          alpha = Math.max(alpha, evaluation);
          if (beta <= alpha) break;
        }
      }
      return maxEval;
    } else {
      let minEval = Infinity;
      for (let i = 0; i < 9; i++) {
        if (currentBoard[i] === null) {
          currentBoard[i] = humanSymbol;
          const evaluation = minimax(currentBoard, depth + 1, true, alpha, beta);
          currentBoard[i] = null;
          minEval = Math.min(minEval, evaluation);
          beta = Math.min(beta, evaluation);
          if (beta <= alpha) break;
        }
      }
      return minEval;
    }
  }

  // Find the move with the best score from minimax
  let bestScore = -Infinity;
  let bestMove = -1;

  // Order moves strategically: center (4), corners (0, 2, 6, 8), edges (1, 3, 5, 7)
  const strategicOrder = [4, 0, 2, 6, 8, 1, 3, 5, 7];

  for (const i of strategicOrder) {
    if (board[i] === null) {
      const tempBoard = [...board];
      tempBoard[i] = aiSymbol;
      const score = minimax(tempBoard, 0, false, -Infinity, Infinity);
      if (score > bestScore) {
        bestScore = score;
        bestMove = i;
      }
    }
  }

  if (bestMove !== -1) {
    return bestMove;
  }

  return board.findIndex((cell) => cell === null);
}
