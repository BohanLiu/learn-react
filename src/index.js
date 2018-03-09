import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';

// this is a controlled component
// Square no longer keeps its own state; 
// it receives its value from its parent Board and informs its parent when it’s clicked.
// class Square extends React.Component {
//   render() {
//     console.log('render square');

//     return (
//       <button className="square" onClick={this.props.onClick}>
//         {this.props.value}
//       </button>
//     );
//   }
// }

// functional component
function Square(props) {
  return (
    <button className="square" onClick={props.onClick}>
      {props.value}
    </button>
  );
}

class Board extends React.Component {
  /**
  * When you want to aggregate data from multiple children or to have two child components
  * communicate with each other, move the state upwards so that it lives in the parent component.
  * The parent can then pass the state back down to the children via props, so that the child
  * components are always in sync with each other and with the parent.
  */
  // constructor(props) {
  //   super(props);
  //   this.state = {
  //     squares: Array(9).fill(null),
  //     xIsNext: true,
  //   };
  // }
  /** 
  * Why Immutability Is Important
  * 1. Easier Undo/Redo and Time Travel
  * 2. Tracking Changes
  * 3. Determining When to Re-render in React
  */

  renderSquare(i) {
    return (
      <Square
        key={i}
        value={this.props.squares[i]}
        onClick={() => this.props.onClick(i)}
      />
    );
  }

  render() {
    console.log('render board');

    let boardRows = [];
    for (let row = 0; row < 3; row++) {
      let squares = [];
      for (let col = 0; col < 3; col++) {
        squares.push(this.renderSquare(row * 3 + col));
      }
      let boardRow = (<div key={row} className="board-row">{squares}</div>);
      boardRows.push(boardRow);
    }
    return <div>{boardRows}</div>;

    // return (
    //   <div>
    //     {Array(3).fill(null).map((_, row) => {
    //       return (
    //         <div key={row} className="board-row">
    //           {Array(3).fill(row).map((_, col) => {
    //             let num = row * 3 + col;
    //             return this.renderSquare(num);
    //           })}
    //         </div>
    //       );
    //     })}
    //   </div>
    // );

    // return (
    //   <div>
    //     <div className="board-row">
    //       {this.renderSquare(0)}
    //       {this.renderSquare(1)}
    //       {this.renderSquare(2)}
    //     </div>
    //     <div className="board-row">
    //       {this.renderSquare(3)}
    //       {this.renderSquare(4)}
    //       {this.renderSquare(5)}
    //     </div>
    //     <div className="board-row">
    //       {this.renderSquare(6)}
    //       {this.renderSquare(7)}
    //       {this.renderSquare(8)}
    //     </div>
    //   </div>
    // );
  }
}

class Game extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      history: [{
        squares: Array(9).fill(null),
        move: [/*row, col, player*/],
      }],
      stepNumber: 0,
      xIsNext: true,
    }
  }

  handleClick(i) {
    const history = this.state.history.slice(0, this.state.stepNumber + 1);
    const current = history[history.length - 1];
    const squares = current.squares.slice();

    if (calculateWinner(squares) || squares[i]) {
      return;
    }
    squares[i] = this.state.xIsNext ? 'X' : 'O';
    
    let move = [];
    // row
    move[0] = Math.floor(i / 3) + 1;
    // col
    move[1] = i % 3 + 1;
    // player
    move[2] = squares[i];

    this.setState({
      history: history.concat([{
        squares: squares,
        move: move,
      }]),
      stepNumber: history.length,
      xIsNext: !this.state.xIsNext,
    });
  }

  jumpTo(step) {
    // reduce rerendering
    if (step === this.state.stepNumber) {
      return;
    }

    if (step !== this.state.stepNumber) {
      removeHighlighting();
    }

    this.setState({
      stepNumber: step,
      xIsNext: (step % 2) === 0,
    });
  }

  render() {
    console.log('render game');

    const history = this.state.history;
    const current = history[this.state.stepNumber];
    const winner = calculateWinner(current.squares);

    const moves = history.map((step, move) => {
      let desc, moveDesc;
      if (move) {
        desc = 'Go to move #' + move;
        moveDesc = (<span>({step.move[0]}, {step.move[1]}, {step.move[2]})</span>);
      } else {
        desc = 'Go to game start';
        moveDesc = null;
      }
      return (
        <li key={move}>
          <button className="jump-history-button" onClick={() => this.jumpTo(move)}>{desc}</button>
          {moveDesc}
        </li>
      );
    });

    let status;
    if (winner) {
      if (winner === 'tie') {
        status = 'Tie!';
      } else {
        status = 'Winner: ' + winner;
      }
    } else {
      status = 'Next player: ' + (this.state.xIsNext ? 'X' : 'O');
    }

    return (
      <div className="game">
        <div className="game-board">
          <Board 
            squares={current.squares}
            onClick={(i) => this.handleClick(i)}
          />
        </div>
        <div className="game-info">
          <div>{status}</div>
          <ol>{moves}</ol>
        </div>
      </div>
    );
  }
}

// ========================================

ReactDOM.render(
  <Game />,
  document.getElementById('root')
);

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
      highlightWinningSquares(lines[i]);
      return squares[a];
    }
  }

  // tie game?
  for (let i = 0, count = 0; i < squares.length; i++) {
    if (squares[i]) {
      count++;
    }
    if (count === squares.length) {
      return 'tie';
    }
  }

  return null;
}

function highlightWinningSquares(line) {
  let squareElements = document.querySelectorAll('.square');
  for (let i = 0; i < line.length; i++) {
    squareElements[line[i]].style.backgroundColor = 'lightgreen';
  }
}

function removeHighlighting() {
  let squareElements = document.querySelectorAll('.square');
  squareElements.forEach((square) => {
    square.style.backgroundColor = '';
  });
}
