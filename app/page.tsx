"use client";
import { useState } from 'react';

type Cell = 'X' | 'O' | null;
type Squares = Cell[];

function PlayerIcon({ value, size = 48 }: { value: Cell; size?: number }) {
  if (value !== 'X' && value !== 'O') return null;
  const src = value === 'X' ? '/mikhail.png' : '/andi.png';
  const alt = value === 'X' ? 'Mikhail' : 'Andi';
  return (
    <img src={src} alt={alt} width={size} height={size} className="object-contain" style={{ width: size, height: size }} />
  );
}

function Square({ value, onSquareClick }: { value: Cell; onSquareClick: () => void }) {
  return (
    <button
      className="square bg-white border border-gray-300 hover:bg-indigo-200 w-20 h-20 aspect-square flex items-center justify-center rounded-md transition-colors"
      onClick={onSquareClick}
    >
      <PlayerIcon value={value} size={56} />
    </button>
  );
}

function Board({
  xIsNext,
  squares,
  onPlay,
}: {
  xIsNext: boolean;
  squares: Squares;
  onPlay: (next: Squares) => void;
}) {
  function handleClick(i: number) {
    if (calculateWinner(squares) || squares[i]) {
      return;
    }
    const nextSquares = squares.slice();
    if (xIsNext) {
      nextSquares[i] = 'X';
    } else {
      nextSquares[i] = 'O';
    }
    onPlay(nextSquares);
  }

  const winner = calculateWinner(squares);
  const isDraw = !winner && squares.every((s) => s !== null);
  const nextPlayer: Cell = xIsNext ? 'X' : 'O';
  let statusLabel: string;
  let statusIconValue: Cell;
  if (winner) {
    statusLabel = 'Winner:';
    statusIconValue = winner;
  } else if (isDraw) {
    statusLabel = "It's a draw!";
    statusIconValue = null;
  } else {
    statusLabel = 'Next player:';
    statusIconValue = nextPlayer;
  }

  return (
    <div className="bg-indigo-300 p-6 rounded-xl shadow-lg gap-6 flex flex-col items-center">
      <div className="status flex text-3xl font-semibold flex-row items-center gap-3 text-indigo-900">
        <span>{statusLabel}</span>
        {statusIconValue && <PlayerIcon value={statusIconValue} size={40} />}
      </div>
      <div className="board grid grid-cols-3 gap-2 bg-indigo-400 p-2 rounded-lg">
        {squares.map((value, i) => (
          <Square key={i} value={value} onSquareClick={() => handleClick(i)} />
        ))}
      </div>
    </div>
  );
}

export default function Game() {
  const [history, setHistory] = useState<Squares[]>([Array(9).fill(null)]);
  const [currentMove, setCurrentMove] = useState(0);
  const xIsNext = currentMove % 2 === 0;
  const currentSquares = history[currentMove];

  function handlePlay(nextSquares: Squares) {
    const nextHistory = [...history.slice(0, currentMove + 1), nextSquares];
    setHistory(nextHistory);
    setCurrentMove(nextHistory.length - 1);
  }

  function jumpTo(nextMove: number) {
    setCurrentMove(nextMove);
  }

  function restart() {
    setHistory([Array(9).fill(null)]);
    setCurrentMove(0);
  }

  const moves = history.map((squares, move) => {
    let description;
    if (move > 0) {
      description = 'Go to move #' + move;
    } else {
      description = 'Go to game start';
    }
    return (
      <li key={move}>
        <button onClick={() => jumpTo(move)}>{description}</button>
      </li>
    );
  });

  return (
    <div className="game min-h-screen flex flex-row items-center justify-center gap-8 p-8 bg-indigo-50">
      <div className="game-board">
        <Board xIsNext={xIsNext} squares={currentSquares} onPlay={handlePlay} />
      </div>
      <div className="game-info bg-white rounded-lg shadow p-4 w-[220px] h-[400px] flex flex-col gap-3">
        <button
          onClick={restart}
          className="flex items-center justify-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold py-2 px-3 rounded-md transition-colors"
          aria-label="Restart game"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="w-5 h-5"
          >
            <path d="M21 12a9 9 0 1 1-3-6.7" />
            <polyline points="21 3 21 9 15 9" />
          </svg>
          <span>Restart</span>
        </button>
        <ol className="flex flex-col gap-1 list-decimal list-inside text-indigo-800 overflow-y-auto">{moves}</ol>
      </div>
    </div>
  );
}

function calculateWinner(squares: Squares): Cell {
  const lines = [
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8],
    [0, 4, 8],
    [2, 4, 6],
  ];
  for (let i = 0; i < lines.length; i++) {
    const [a, b, c] = lines[i];
    if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c]) {
      return squares[a];
    }
  }
  return null;
}
