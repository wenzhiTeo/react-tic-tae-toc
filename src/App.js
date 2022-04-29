import React from "react";

function Square(props) {
  return (
    <button
      className="square"
      onClick={() => {
        props.onClick();
      }}
      style={props.style}
    >
      {props.value}
    </button>
  );
}

class Board extends React.Component {
  //highlight the win line
  renderSquare(i) {
    const win_line_style = {
      color: "red",
    };

    let is_win_square = false;
    if (this.props.win_line) {
      is_win_square = this.props.win_line.includes(i);
    }

    return (
      <Square
        key={i}
        value={this.props.squares[i]}
        onClick={() => this.props.onClick(i)}
        style={is_win_square ? win_line_style : null}
      />
    );
  }

  renderBoard() {
    let render_board = [];
    for (let board_row = 0; board_row < 3; board_row++) {
      let render_board_row = [];
      for (let square = 0; square < 3; square++) {
        render_board_row.push(this.renderSquare(board_row * 3 + square));
      }
      render_board.push(
        <div key={board_row} className="board-row">
          {render_board_row}
        </div>
      );
    }
    return render_board;
  }

  render() {
    return <div>{this.renderBoard()}</div>;
  }
}

class Game extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      history: [
        {
          squares_record: Array(9).fill(null),
          x: null,
          y: null,
        },
      ],
      stepNumber: 0,
      xIsNext: true,
      orderIsASC: true,
    };
  }

  handleClick(i) {
    const history = this.state.history.slice(0, this.state.stepNumber + 1);
    const current = history[history.length - 1];
    const squares = current.squares_record.slice();

    if (calculateWinner(squares) || squares[i]) {
      return;
    }

    squares[i] = this.state.xIsNext ? "X" : "O";

    this.setState({
      history: history.concat([
        {
          squares_record: squares,
          x: (i % 3) + 1,
          y: Math.floor(i / 3) + 1,
        },
      ]),
      stepNumber: history.length,
      xIsNext: !this.state.xIsNext,
    });
  }

  jumpTo(step) {
    this.setState({
      stepNumber: step,
      xIsNext: step % 2 === 0,
    });
  }

  render() {
    const curent_style = {
      color: "red",
    };

    const history = this.state.history;
    const current = history[this.state.stepNumber];
    const winner = calculateWinner(current.squares_record);
    let player = this.state.xIsNext ? "X" : "O";

    // if move = 0 means false
    // highlight the current step
    const moves = history.map((step, move) => {
      const desc = move
        ? `Got to move #${move} location: ${step.x},${step.y}`
        : "Go to game start";
      return (
        <li key={move}>
          <button
            onClick={() => this.jumpTo(move)}
            style={this.state.stepNumber === move ? curent_style : null}
          >
            {desc}
          </button>
        </li>
      );
    });

    let status;
    if (winner) {
      status = "Winner: " + winner.winner;
    } else if (this.state.stepNumber == 9) {
      status = "No Winner !";
    } else {
      status = "Next player: " + player;
    }

    return (
      <div className="game">
        <div className="game-board">
          <Board
            squares={current.squares_record}
            win_line={winner ? winner.lines : null}
            onClick={(i) => this.handleClick(i)}
          />
        </div>
        <div className="game-info">
          <div>{status}</div>
          <ol>{this.state.orderIsASC ? moves : moves.reverse()}</ol>
        </div>
        <div className="game-info">
          <button onClick={() => this.setState({ orderIsASC: true })}>
            Order Ascending
          </button>
          <button onClick={() => this.setState({ orderIsASC: false })}>
            Order Descending
          </button>
        </div>
      </div>
    );
  }
}

function calculateWinner(squares) {
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
      return {
        winner: squares[a],
        lines: lines[i],
      };
    }
  }
  return null;
}

// ========================================

export default Game;
