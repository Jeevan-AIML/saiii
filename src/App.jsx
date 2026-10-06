import React, { useEffect, useRef } from 'react';
import { Header } from './components/Header';
import { ScoreBoard } from './components/ScoreBoard';
import { TurnIndicator } from './components/TurnIndicator';
import { GameBoard } from './components/GameBoard';
import { GameResult } from './components/GameResult';
import { GameControls } from './components/GameControls';
import { ModeSelection } from './components/ModeSelection';
import { SymbolSelection } from './components/SymbolSelection';
import { useTicTacToe } from './hooks/useTicTacToe';
import { fireConfetti } from './utils/confetti';
import './App.css';

export default function App() {
  const {
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
  } = useTicTacToe();

  const canvasRef = useRef(null);

  // Trigger celebratory confetti on victory
  useEffect(() => {
    if (winner) {
      const cleanup = fireConfetti(canvasRef);
      return cleanup;
    }
  }, [winner]);

  // Keyboard navigation & quick shortcuts (1-9 for board cells, R for restart)
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.target.tagName === 'INPUT' || e.target.tagName === 'TEXTAREA') return;

      if ((e.key === 'r' || e.key === 'R') && !e.ctrlKey && !e.metaKey) {
        if (screen === 'pvp' || screen === 'ai') {
          restartGame();
          return;
        }
      }

      // Numbers 1-9 for cells
      if (screen === 'pvp' || screen === 'ai') {
        const num = parseInt(e.key, 10);
        if (!isNaN(num) && num >= 1 && num <= 9) {
          makeMove(num - 1);
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [screen, makeMove, restartGame]);

  return (
    <div className="app-wrapper">
      {/* Ambient background lighting */}
      <div className="ambient-glow glow-cyan" aria-hidden="true" />
      <div className="ambient-glow glow-rose" aria-hidden="true" />

      {/* Confetti canvas */}
      <canvas ref={canvasRef} className="confetti-canvas" aria-hidden="true" />

      <div className="app-container">
        {screen === 'select' && (
          <ModeSelection
            onSelectPvP={startPvpMode}
            onSelectAI={enterAiSetup}
          />
        )}

        {screen === 'setup_ai' && (
          <SymbolSelection
            onSelectSymbol={startAiModeWithSymbol}
            onBack={changeMode}
          />
        )}

        {(screen === 'pvp' || screen === 'ai') && (
          <>
            <Header
              gameMode={gameMode}
              humanSymbol={humanSymbol}
              aiSymbol={aiSymbol}
              onChangeMode={changeMode}
            />

            <ScoreBoard
              scores={scores}
              gameMode={gameMode}
              humanSymbol={humanSymbol}
              currentPlayer={currentPlayer}
              isGameOver={isGameOver}
              winner={winner}
            />

            <TurnIndicator
              gameMode={gameMode}
              humanSymbol={humanSymbol}
              currentPlayer={currentPlayer}
              isGameOver={isGameOver}
              isAiThinking={isAiThinking}
            />

            <GameBoard
              board={board}
              winningLine={winningLine}
              isGameOver={isGameOver}
              isAiThinking={isAiThinking}
              onSelectCell={makeMove}
              lastMoveIndex={lastMoveIndex}
            />

            <GameResult
              gameMode={gameMode}
              humanSymbol={humanSymbol}
              winner={winner}
              isDraw={isDraw}
              onPlayAgain={restartGame}
            />

            <GameControls
              onRestart={restartGame}
              onChangeMode={changeMode}
              onResetScore={resetScore}
            />

            <footer className="app-footer">
              <p>
                {gameMode === 'ai'
                  ? `You: ${humanSymbol} • AI: ${aiSymbol}`
                  : 'Local 2-Player Match'}
                {' • Use mouse or keys '}
                <kbd>1</kbd>–<kbd>9</kbd>
              </p>
            </footer>
          </>
        )}
      </div>
    </div>
  );
}
