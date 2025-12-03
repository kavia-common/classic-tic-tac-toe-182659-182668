import React, { useMemo, useState } from 'react';
import './App.css';

/**
 * PUBLIC_INTERFACE
 * App is the main entry for the Tic Tac Toe game and composes the Board, StatusBar, and Controls.
 * It centers the content and applies the Ocean Professional theme styling.
 */
function App() {
  return (
    <div className="ttt-app">
      <main className="ttt-center">
        <header className="ttt-header">
          <h1 className="ttt-title">Tic Tac Toe</h1>
          <p className="ttt-subtitle">Classic 3×3 • Two Players</p>
        </header>
        <Game />
        <footer className="ttt-footer">
          <p className="ttt-credit" aria-label="theme note">
            Ocean Professional theme • Primary #2563EB • Secondary #F59E0B
          </p>
        </footer>
      </main>
    </div>
  );
}

/**
 * PUBLIC_INTERFACE
 * Game manages the core state: board (9 cells), current player, winner, and draw detection.
 * It renders the StatusBar, Board, and Controls. Also provides a reset action.
 */
function Game() {
  const [squares, setSquares] = useState(Array(9).fill(null));
  const [xIsNext, setXIsNext] = useState(true);

  const winner = useMemo(() => calculateWinner(squares), [squares]);
  const isDraw = useMemo(() => !winner && squares.every((c) => c !== null), [winner, squares]);
  const currentPlayer = xIsNext ? 'X' : 'O';

  const handleSquareClick = (index) => {
    if (squares[index] || winner) return; // ignore moves if filled or game over
    const next = squares.slice();
    next[index] = currentPlayer;
    setSquares(next);
    setXIsNext(!xIsNext);
  };

  const handleReset = () => {
    setSquares(Array(9).fill(null));
    setXIsNext(true);
  };

  return (
    <div className="ttt-card" role="region" aria-label="Tic Tac Toe game area">
      <StatusBar
        currentPlayer={currentPlayer}
        winner={winner}
        isDraw={isDraw}
      />
      <Board
        squares={squares}
        onSquareClick={handleSquareClick}
        gameOver={Boolean(winner) || isDraw}
      />
      <Controls onReset={handleReset} disabled={squares.every((c) => c === null)} />
    </div>
  );
}

/**
 * PUBLIC_INTERFACE
 * Board renders a 3×3 grid of Square components.
 */
function Board({ squares, onSquareClick, gameOver }) {
  return (
    <div
      className="ttt-board"
      role="grid"
      aria-label="3 by 3 game board"
      aria-readonly={gameOver ? 'true' : 'false'}
    >
      {squares.map((value, idx) => (
        <Square
          key={idx}
          value={value}
          onClick={() => onSquareClick(idx)}
          disabled={Boolean(value) || gameOver}
          index={idx}
        />
      ))}
    </div>
  );
}

/**
 * PUBLIC_INTERFACE
 * Square renders a single cell button with subtle animations and hover effects.
 */
function Square({ value, onClick, disabled, index }) {
  const label = value ? `Cell ${index + 1}, ${value}` : `Cell ${index + 1}, empty`;
  return (
    <button
      type="button"
      className={`ttt-square ${value ? 'filled' : ''}`}
      onClick={onClick}
      disabled={disabled}
      aria-label={label}
    >
      <span className="ttt-mark" data-mark={value || ''}>
        {value}
      </span>
    </button>
  );
}

/**
 * PUBLIC_INTERFACE
 * StatusBar shows current status: Next player, Winner, or Draw.
 */
function StatusBar({ currentPlayer, winner, isDraw }) {
  let text = `Next: ${currentPlayer}`;
  let tone = 'info';
  if (winner) {
    text = `Winner: ${winner}`;
    tone = 'success';
  } else if (isDraw) {
    text = 'Draw';
    tone = 'warning';
  }
  return (
    <div className={`ttt-status ttt-status-${tone}`} role="status" aria-live="polite">
      {text}
    </div>
  );
}

/**
 * PUBLIC_INTERFACE
 * Controls provide actions like Reset / New Game.
 */
function Controls({ onReset, disabled }) {
  return (
    <div className="ttt-controls">
      <button
        type="button"
        className="ttt-btn"
        onClick={onReset}
        disabled={!disabled ? false : false /* allow reset anytime a move was made */}
        aria-label="Reset or start a new game"
      >
        New Game
      </button>
    </div>
  );
}

/**
 * PUBLIC_INTERFACE
 * calculateWinner checks all lines for a winner. Returns "X", "O", or null.
 */
function calculateWinner(sq) {
  const lines = [
    [0,1,2],[3,4,5],[6,7,8], // rows
    [0,3,6],[1,4,7],[2,5,8], // cols
    [0,4,8],[2,4,6],         // diagonals
  ];
  for (const [a,b,c] of lines) {
    if (sq[a] && sq[a] === sq[b] && sq[a] === sq[c]) {
      return sq[a];
    }
  }
  return null;
}

export default App;
