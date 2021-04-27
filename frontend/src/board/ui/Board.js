import React from 'react'

import { Stage, Layer } from 'react-konva'
import useSound from 'use-sound'

import Bar from './Bar'
import Game from '../model/Game'
import moveSound from '../../assets/whoa.mp3'
import opponentMoveSound from '../../assets/ok.mp3'

const socket  = require('../../connection/socket').socket


class Board extends React.Component {
  // Common Game manager
  // Handle Bar displaying UI, board generation and call to API

  componentDidMount() {
    this.props.setGreyBars(this.states.game.blankBars)
    socket.on("error", statusUpdate => {
      console.log(statusUpdate)
      alert(statusUpdate)
    })
    socket.on("start game", statusUpdate => {
      this.props.setIsplayerTurn(true)
    })
    socket.on("opponent move", action => {
      const [success, message] = this.states.game.isValidMove(action.move, false)
      if(success){
        this.props.setError("")
        const scoredPoints = this.states.game.opponentPlay(action.move)
        if(scoredPoints){
          this.props.addOpponentScore(scoredPoints)
          // this.props.playOpponentMoveSound()
        }else{
          this.props.setIsplayerTurn(true)
        }
        this.updateBars()

      }else{
        this.props.setError(message)
      }
    })
  }

  states = {
    game: new Game(this.props.gridSize)
  }

  play = (position) => {
    const [success, message] = this.states.game.isValidMove(position, true)
    if (this.props.isPlayerTurn && success){
      this.props.setError("")
      const scoredPoints = this.states.game.play(position)
      if (scoredPoints){
        this.props.addScore(scoredPoints)
        // this.props.playMoveSound()
      }else{
        this.props.setIsplayerTurn(false)
      }
      this.updateBars()
      socket.emit("new move", {move: position, gameId: this.states.gameId})

    }else if(!success){
      this.props.setError(message)
    }
  }

  updateBars = () => {
    this.props.setGreyBars(this.states.game.blankBars)
    this.props.setGreenBars(this.states.game.myBars)
    this.props.setRedBars(this.states.game.opposantBars)
  }

  getOrientationForBar = (bar) => {
    return (bar % (2* this.props.gridSize + 1) < this.props.gridSize? "h" : "v")
  }

  getPositionForBar = (bar) => {
    // ------> x
    // |
    // y
    const orientation = this.getOrientationForBar(bar)
    const gr = this.props.gridSize
    let x = 0, y = 0
    if (orientation === "h"){
      x = (bar % ( 2 * gr + 1) * 60) + 35
      y = (Math.floor(bar / (2 * gr + 1)) * 60) + 5
    }else{
      x = ((bar % (2 * gr + 1) - gr) * 60) + 20
      y = (Math.floor(bar / (2 * gr + 1)) * 60) + 20
    }
    return [x, y]
  }

  render() {
    return (
      <div
        style={{
          backgroundColor: "#f39c12",
        }}
      >
        <Stage width = {720} height = {720}>
          <Layer>
            {this.props.greyBars.map(bar => {
              return (
                <Bar
                  key={bar}
                  index={bar}
                  orientation={this.getOrientationForBar(bar)}
                  position = {this.getPositionForBar(bar)}
                  color = "grey"
                  gridSize={this.props.gridSize}
                  // Only blank bars are clickable
                  callbackFunction={() => {this.play(bar)}}
                />
              )
            })}
            {this.props.greenBars.map(bar => {
              return (
                <Bar
                  key={bar}
                  index={bar}
                  orientation={this.getOrientationForBar(bar)}
                  position = {this.getPositionForBar(bar)}
                  color = "green"
                  gridSize={this.props.gridSize}
                  callbackFunction={() => {}}
                />
              )
            })}
            {this.props.redBars.map(bar => {
              return (
                <Bar
                  key={bar}
                  index={bar}
                  orientation={this.getOrientationForBar(bar)}
                  position = {this.getPositionForBar(bar)}
                  color = "red"
                  gridSize={this.props.gridSize}
                  callbackFunction={() => {}}
                />
              )
            })}
          </Layer>
        </Stage>
      </div>
    )
  }
}

const BoardWrapper = (props) => {

  const [playMoveSound] = useSound(moveSound)
  const [playOpponentMoveSound] = useSound(opponentMoveSound)

  const [greyBars, setGreyBars] = React.useState([])
  const [redBars, setRedBars] = React.useState([])
  const [greenBars, setGreenBars] = React.useState([])

  return <Board
    gameId={props.gameId}
    gridSize={props.gridSize}
    isPlayerTurn={props.isPlayerTurn}

    setIsplayerTurn={props.setIsplayerTurn}
    setError={props.setError}
    addScore={props.addScore}
    addOpponentScore={props.addOpponentScore}

    playMoveSound = {playMoveSound}
    playOpponentMoveSound = {playOpponentMoveSound}

    greyBars={greyBars}
    redBars ={redBars}
    greenBars={greenBars}
    setGreyBars={setGreyBars}
    setRedBars={setRedBars}
    setGreenBars={setGreenBars}
  />
}

export default BoardWrapper