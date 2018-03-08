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
  constructor(props) {
    super(props);
    this.state = {
      squares: Array(9).fill(null),
    };
  }
  /** 
  * Why Immutability Is Important
  * 1. Easier Undo/Redo and Time Travel
  * 2. Tracking Changes
  * 3. Determining When to Re-render in React
  */

  handleClick(i) {
    // alert(i);
    const squares = this.state.squares.slice();
    squares[i] = 'X';
    this.setState({squares: squares});
  }

  renderSquare(i) {
    return (
      <Square 
        value={this.state.squares[i]}
        onClick={() => this.handleClick(i)}
      />
    );
  }

  render() {
    console.log('render board');
    const status = 'Next player: X';

    return (
      <div>
        <div className="status">{status}</div>
        <div className="board-row">
          {this.renderSquare(0)}
          {this.renderSquare(1)}
          {this.renderSquare(2)}
        </div>
        <div className="board-row">
          {this.renderSquare(3)}
          {this.renderSquare(4)}
          {this.renderSquare(5)}
        </div>
        <div className="board-row">
          {this.renderSquare(6)}
          {this.renderSquare(7)}
          {this.renderSquare(8)}
        </div>
      </div>
    );
  }
}

class Game extends React.Component {
  render() {
    console.log('render game');

    return (
      <div className="game">
        <div className="game-board">
          <Board />
        </div>
        <div className="game-info">
          <div>{/* status */}</div>
          <ol>{/* TODO */}</ol>
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

