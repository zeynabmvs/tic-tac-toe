import { useState } from "react";

function Square({ value, onSquareClick, index }) {

  return (
    <button
      className={value === 'X' ? "square color-dark" : "square color-light"}
      onClick={onSquareClick}>
      {value}
    </button>
  );
}

function Board({ xIsNext, squares, onPlay }) {
  function calculateWinner(squares) {
    const winLines = [
      [0, 1, 2],
      [3, 4, 5],
      [6, 7, 8],
      [0, 3, 6],
      [1, 4, 7],
      [2, 5, 8],
      [0, 4, 8],
      [2, 4, 6],
    ];
    for (let i = 0; i < winLines.length; i++) {
      const [a, b, c] = winLines[i];
      if (
        squares[a] &&
        squares[a] === squares[b] &&
        squares[b] === squares[c]
      ) {
        console.log(winLines[i]);
        return squares[a];
      }
    }

    return null;
  }

  function handleClick(i) {
    if (squares[i] || calculateWinner(squares)) {
      return;
    }

    const nextSquares = squares.slice();

    if (xIsNext) {
      nextSquares[i] = "X";
    } else {
      nextSquares[i] = "O";
    }

    onPlay(nextSquares);
  }

  const winner = calculateWinner(squares);
  let status;

  if (winner) {
    status = "Winner: " + winner;
  } else if (!squares.some((item) => item === null)) {
    status = "Game is over, No winner";
  } else {
    status = "Next player: " + (xIsNext ? "X" : "O");
  }

  const rows = [];
  for (let i = 0; i < 3; i++) {
    const row = [];
    for (let j = 0; j < 3; j++) {
      const index = i * 3 + j;
      row.push(
        <Square
          key={index}
          value={squares[index]}
          onSquareClick={() => handleClick(index)}
          index={index}
        />
      );
    }

    rows.push(
      <div key={i} className="board-row">
        {row}
      </div>
    );
  }

  return (
    <>
      <h2 className="status">{status}</h2>
      <div className="board-rows">{rows}</div>
    </>
  );
}

export default function Game() {
  const [history, setHistory] = useState([Array(9).fill(null)]);
  const [currentMove, setCurrentMove] = useState(0);
  const xIsNext = currentMove % 2 === 0;
  const currentSquares = history[currentMove];

  function handlePlay(nextSquares) {
    const nextHistory = [...history.slice(0, currentMove + 1), nextSquares];
    setHistory(nextHistory);
    setCurrentMove(nextHistory.length - 1);
  }

  function jumpToMove(nextMove) {
    setCurrentMove(nextMove);
  }

  const moves = history.map((squares, move) => {
    let description;

    if (move > 0) {
      if (move === currentMove) {
        description = "You are at move #" + move;
      } else {
        description = "Go to move #" + move;
      }
    } else {
      if (move === currentMove) {
        description = "You are at game start";
      } else {
        description = "Go to game start";
      }
    }

    const content =
      move === currentMove ? (
        <span className="history-item">{description}</span>
      ) : (
        <button
          className="history-item move-btn"
          onClick={() => jumpToMove(move)}
        >
          {description}
        </button>
      );

    return <li key={move}>{content}</li>;
  });

  return (
    <>
      <h1 className="game-title">
        <span className="h-word1">Tic</span>
        <span className="h-word2"> Tac</span>
        <span className="h-word3"> Toe</span>
      </h1>
      <div className="game">
        <div className="game-board">
          <Board
            xIsNext={xIsNext}
            squares={currentSquares}
            onPlay={handlePlay}
          />
        </div>
        <div className="game-info">
          <h2>History</h2>
          <ul className="history-list">{moves}</ul>
        </div>
      </div>
    </>
  );
}