import React from 'react'

import { Label } from 'semantic-ui-react'

import grid4 from '../assets/4x4.png'
import grid6 from '../assets/6x6.png'
import grid9 from '../assets/9x9.png'

const socket  = require('../connection/socket').socket


class HomePage extends React.Component{
  // Main page to create a game

  createGame = () => {
    const gameId = `${Math.floor(100000 + Math.random() * 900000)}`
    this.props.setGameId(gameId)
    this.props.setDoesPlayerStarted(true)
    socket.emit('createNewGame', {gameId: gameId, gridSize: this.props.gridSize})
  }

  states = {
    grid : {"4": grid4, "6": grid6, "9": grid9}
  }

  render(){
    return (
      <div>
        <h1 className={"hover_effect typing-demo"}>Game creator</h1>
        <p>Select your grid size</p>
        {[4, 6, 9].map(size => {
          return (
            <React.Fragment key={size}>
              <Label
                as='a'
                color={size === 4? "green" : size === 6? "teal" : "blue"}
                ribbon
                className={`${this.props.gridSize === size? "" : "ribbon-unselected"}`}
              >
                {size}
              </Label>
              <img
                value={size}
                src={this.states.grid[size]}
                className={`radio-box ${this.props.gridSize === size? "box-selected" : ""}`}
                onClick={() => this.props.setGridSize(size)}
                alt={size}
              />
            </React.Fragment>
          )
        })}
        <br/>
        <button
          className="btn create-btn"
          onClick={() => {this.createGame()}}
        >
          Create new {this.props.gridSize +"x"+this.props.gridSize} game
        </button>
      </div>
    )
  }
}

export default HomePage