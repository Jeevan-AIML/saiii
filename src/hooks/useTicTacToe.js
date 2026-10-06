import { useState, useCallback, useEffect, useRef } from 'react';
import { playMoveSound, playWinSound, playDrawSound, playButtonSound } from '../utils/sound';
import { getBestMove } from '../utils/ai';

export const WINNING_COMBINATIONS = [
  [0, 1, 2], // Row 1
  [3, 4, 5], // Row 2
  [6, 7, 8], // Row 3
  [0, 3, 6], // Column 1
  [1, 4, 7], // Column 2
  [2, 5, 8], // Column 3
  [0, 4, 8], // Diagonal 1
  [2, 4, 6], // Diagonal 2
];

const INITIAL_BOARD = Array(9).fill(null);
const INITIAL_PVP_SCORES = { x: 0, o: 0, draws: 0 };
const INITIAL_AI_SCORES = { human: 0, ai: 0, draws: 0 };

const PVP_STORAGE_KEY = 'tictactoe_scores_pvp_v2';
const AI_STORAGE_KEY = 'tictactoe_scores_ai_v2';

export function checkWinner(board) {
  for (const combo of WINNING_COMBINATIONS) {
    const [a, b, c] = combo;
    if (board[a] && board[a] === board[b] && board[a] === board[c]) {
      return { winner: board[a], winningLine: combo };
    }
  }
  return null;
}

export function useTicTacToe() {
  // Screen state: 'select' (choose mode), 'setup_ai' (choose symbol), 'pvp' (in game), 'ai' (in game)
  const [screen, setScreen] = useState('select');
  const [gameMode, setGameMode] = useState('pvp'); // 'pvp' | 'ai'
  const [humanSymbol, setHumanSymbol] = useState('X'); // 'X' | 'O'
  const aiSymbol = humanSymbol === 'X' ? 'O' : 'X';

  const [board, setBoard] = useState(INITIAL_BOARD);
  const [currentPlayer, setCurrentPlayer] = useState('X');
  const [winner, setWinner] = useState(null);
  const [winningLine, setWinningLine] = useState(null);
  const [isDraw, setIsDraw] = useState(false);
  const [lastMoveIndex, setLastMoveIndex] = useState(null);
  const [isAiThinking, setIsAiThinking] = useState(false);

  // Scores for PvP
  const [pvpScores, setPvpScores] = useState(() => {
    try {
      const saved = localStorage.getItem(PVP_STORAGE_KEY);
      if (saved) return JSON.parse(saved);
    } catch {
      // Ignore
    }
    return INITIAL_PVP_SCORES;
  });

  // Scores for AI
  const [aiScores, setAiScores] = useState(() => {
    try {
      const saved = localStorage.getItem(AI_STORAGE_KEY);
      if (saved) return JSON.parse(saved);
    } catch {
      // Ignore
    }
    return INITIAL_AI_SCORES;
  });

  // Persist scores
  useEffect(() => {
    try {
      localStorage.setItem(PVP_STORAGE_KEY, JSON.stringify(pvpScores));
    } catch {
      // Ignore
    }
  }, [pvpScores]);

  useEffect(() => {
    try {
      localStorage.setItem(AI_STORAGE_KEY, JSON.stringify(aiScores));
    } catch {
      // Ignore
    }
  }, [aiScores]);

  const isGameOver = Boolean(winner || isDraw);
  const scores = gameMode === 'pvp' ? pvpScores : aiScores;

  // Process a move at index
  const processMove = useCallback(
    (index, playerSymbol) => {
      setBoard((prevBoard) => {
        if (prevBoard[index] !== null) return prevBoard;
        const newBoard = [...prevBoard];
        newBoard[index] = playerSymbol;

        setLastMoveIndex(index);

        const winResult = checkWinner(newBoard);
        if (winResult) {
          setWinner(winResult.winner);
          setWinningLine(winResult.winningLine);

          if (gameMode === 'pvp') {
            setPvpScores((prev) => ({
              ...prev,
              [winResult.winner.toLowerCase()]: prev[winResult.winner.toLowerCase()] + 1,
            }));
          } else {
            const isHumanWinner = winResult.winner === humanSymbol;
            setAiScores((prev) => ({
              ...prev,
              human: isHumanWinner ? prev.human + 1 : prev.human,
              ai: !isHumanWinner ? prev.ai + 1 : prev.ai,
            }));
          }
          playWinSound();
          return newBoard;
        }

        const isFull = newBoard.every((cell) => cell !== null);
        if (isFull) {
          setIsDraw(true);
          if (gameMode === 'pvp') {
            setPvpScores((prev) => ({ ...prev, draws: prev.draws + 1 }));
          } else {
            setAiScores((prev) => ({ ...prev, draws: prev.draws + 1 }));
          }
          playDrawSound();
          return newBoard;
        }

        playMoveSound(playerSymbol);
        setCurrentPlayer(playerSymbol === 'X' ? 'O' : 'X');
        return newBoard;
      });
    },
    [gameMode, humanSymbol]
  );

  // Human click on a cell
  const makeMove = useCallback(
    (index) => {
      if (isGameOver || board[index] !== null || isAiThinking) {
        return false;
      }

      // If in AI mode, ensure it's human's turn
      if (gameMode === 'ai' && currentPlayer !== humanSymbol) {
        return false;
      }

      processMove(index, currentPlayer);
      return true;
    },
    [isGameOver, board, isAiThinking, gameMode, currentPlayer, humanSymbol, processMove]
  );

  // AI Turn Trigger
  const aiTimeoutRef = useRef(null);

  useEffect(() => {
    if (
      screen === 'ai' &&
      gameMode === 'ai' &&
      currentPlayer === aiSymbol &&
      !isGameOver
    ) {
      setIsAiThinking(true);
      if (aiTimeoutRef.current) clearTimeout(aiTimeoutRef.current);

      aiTimeoutRef.current = setTimeout(() => {
        setBoard((latestBoard) => {
          // Re-check game state
          if (checkWinner(latestBoard) || latestBoard.every((c) => c !== null)) {
            setIsAiThinking(false);
            return latestBoard;
          }

          const move = getBestMove(latestBoard, aiSymbol, humanSymbol);
          if (move !== -1 && move !== undefined && latestBoard[move] === null) {
            processMove(move, aiSymbol);
          }
          setIsAiThinking(false);
          return latestBoard;
        });
      }, 450); // Natural thinking delay
    }

    return () => {
      if (aiTimeoutRef.current) clearTimeout(aiTimeoutRef.current);
    };
  }, [screen, gameMode, currentPlayer, aiSymbol, humanSymbol, isGameOver, processMove]);

  // Start PvP Mode
  const startPvpMode = useCallback(() => {
    playButtonSound();
    setGameMode('pvp');
    setBoard(INITIAL_BOARD);
    setWinner(null);
    setWinningLine(null);
    setIsDraw(false);
    setLastMoveIndex(null);
    setCurrentPlayer('X');
    setIsAiThinking(false);
    setScreen('pvp');
  }, []);

  // Enter Setup for AI Mode
  const enterAiSetup = useCallback(() => {
    playButtonSound();
    setGameMode('ai');
    setScreen('setup_ai');
  }, []);

  // Start AI Mode with selected symbol
  const startAiModeWithSymbol = useCallback((symbol) => {
    playButtonSound();
    setHumanSymbol(symbol);
    setBoard(INITIAL_BOARD);
    setWinner(null);
    setWinningLine(null);
    setIsDraw(false);
    setLastMoveIndex(null);
    setIsAiThinking(false);
    setCurrentPlayer('X'); // X always goes first in Tic-Tac-Toe
    setScreen('ai');
    // If Human chose 'O', AI is 'X' and AI will trigger automatically via useEffect!
  }, []);

  // Restart current round
  const restartGame = useCallback(() => {
    playButtonSound();
    if (aiTimeoutRef.current) clearTimeout(aiTimeoutRef.current);
    setBoard(INITIAL_BOARD);
    setWinner(null);
    setWinningLine(null);
    setIsDraw(false);
    setLastMoveIndex(null);
    setIsAiThinking(false);
    setCurrentPlayer('X');
  }, []);

  // Return to mode selection
  const changeMode = useCallback(() => {
    playButtonSound();
    if (aiTimeoutRef.current) clearTimeout(aiTimeoutRef.current);
    setBoard(INITIAL_BOARD);
    setWinner(null);
    setWinningLine(null);
    setIsDraw(false);
    setLastMoveIndex(null);
    setIsAiThinking(false);
    setScreen('select');
  }, []);

  // Reset scores
  const resetScore = useCallback(() => {
    playButtonSound();
    if (gameMode === 'pvp') {
      setPvpScores(INITIAL_PVP_SCORES);
      try {
        localStorage.removeItem(PVP_STORAGE_KEY);
      } catch {
        // Ignore
      }
    } else {
      setAiScores(INITIAL_AI_SCORES);
      try {
        localStorage.removeItem(AI_STORAGE_KEY);
      } catch {
        // Ignore
      }
    }
  }, [gameMode]);

  return {
    screen,
    gameMode,
    humanSymbol,
    aiSymbol,
    board,
    currentPlayer,
    winner,
    winningLine,
    isDraw,
    isGameOver,
    isAiThinking,
    scores,
    lastMoveIndex,
    makeMove,
    restartGame,
    changeMode,
    resetScore,
    startPvpMode,
    enterAiSetup,
    startAiModeWithSymbol,
  };
}
