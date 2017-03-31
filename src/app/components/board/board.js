import React, { Component } from 'react';
import R from 'ramda';

import seedRandom from 'seedrandom';

import './board.scss';

import Tile from '../tile/tile';
import TileRow from 'Components/tile-row/TileRow';

export default class Board extends Component {
  constructor (props) {
    super(props);

    this.state = {
      seed: Math.ceil(999999999 * Math.random()),
      possibleSeed: null,
      tableHeader: ['', 'COL 1', 'COL 2', 'COL 3', 'COL 4', 'COL 5'],
      board: this.props.tiles,
      cardType: 'normal'
    };
  }

  componentDidMount() {
    this.populate(this.state.seed);
  }

  populate(seed) {
    if (seed === null) {
      seed = Math.ceil(9999999 * Math.random());
    }
    let rng = seedRandom(seed);
    let template = this.props.tiles;
    let newBoard = [];
    let selectedMilestone;

    template.map(() => {
      selectedMilestone = template[Math.floor(template.length * rng())];
      selectedMilestone.complete = false;
      newBoard.push(selectedMilestone);
      template = template.filter((elem) => {
        if (template.length > 1) {
          return elem !== selectedMilestone;
        } else {
          return elem;
        }
      });
    });

    this.setState({board: newBoard, seed: seed});
  }

  handleChange(e) {
    this.setState({possibleSeed: parseInt(e.target.value)});
  }

  generateNewSeed() {
    if (this.state.possibleSeed === '') {
      this.setState({seed: null});
      this.setState(this.state.seed)
    } else {
      this.setState({seed: this.state.possibleSeed});
      this.populate(this.state.possibleSeed);
    }
  }

  createHeader() {
    return this.state.tableHeader.map((col, index) => {
      return (
        <Tile title={col} key={index}/>
      );
    });
  }

  updateTile(e) {
    // REALLY HACKY WAY TO GET THIS WORKING.
    // Look into Redux to handle state changes better.
    if (e.target.className === 'complete') {
      e.target.className = '';
    } else {
      e.target.className='complete';
    }
  }

  createRows() {
    return R.splitEvery(5, this.state.board).map((row, rowIndex) => {
      return (
        <TileRow rowIndex={rowIndex} tiles={row} key={rowIndex} update={this.updateTile.bind(this)}/>
      );
    });
  }

  render () {
    return (
      <div className="container">
          <div className="bingoPage">
              <div className="about">
                  <h2 className="title is-3">Generate a new card</h2>
                  <div className="content">
                      <p>
                          Create a new card based on seed.
                      </p>
                      <p>
                          The seed is used to generate the board. Changing the seed will make a new board.
                      </p>
                  </div>
                  <div className="field">
                      <label className="label">Seed</label>
                      <p className="control">
                          <input className="input" type="number" name="seed" placeholder="Leave blank for random seed" onChange={this.handleChange.bind(this)}/>
                      </p>
                  </div>
                  <div className="field">
                      <p className="control">
                          <button className="button is-dark" name="generate" onClick={this.generateNewSeed.bind(this)}>Generate</button>
                      </p>
                  </div>
                  <h2 className="title is-3">About Bingo</h2>
                  <div className="content">
                      <p>
                          To win Bingo, you must complete 5 tasks in a row horizontally, vertically, or diagonally.
                      </p>
                      <p>
                          You can click on the squares to turn them green when you have performed tasks successfully.
                      </p>
                  </div>
                  <h2 className="title is-3">Bingo Rules</h2>
                  <div className="content">
                    <p>
                      There are some specific rules in place:
                    </p>
                    <ul>
                      <li>If it says to have an item, you must actually keep it. For example, if it says to have '<strong>20 arrows</strong>', you must still have it in your inventory at the time you finish getting all 5 objectives.</li>
                      <li>To beat a shrine, you are 'finished' when you recieve a spirit orb at end of the trial. </li>
                      <li>To beat a divine beast, you are 'finished' when you interact with main control unit.</li>
                      <li>For collection goals such as '<strong>8 hearts</strong>', '<strong>2 wheels of stamina</strong>', etc, you're allowed to exceed the required amount.</li>
                    </ul>
                  </div>
              </div>
              <div className="results">
                  <table className="bingo">
                    <thead>
                      <tr>
                        {this.createHeader()}
                      </tr>
                    </thead>
                      <tbody>
                          {this.createRows()}
                          <tr>
                              <Tile title="BL-TR" />
                          </tr>
                      </tbody>
                  </table>
                  <p>Seed: <strong>{this.state.seed}</strong>&emsp;Card Type: <strong>{this.state.cardType}</strong></p>
              </div>
          </div>
      </div>
    );
  }
}
