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
        // this.props.playOpponentMoveSound()
        this.props.setIsplayerTurn(true)

        const scoredPoints = this.states.game.opponentPlay(action.move)
        this.props.addOpponentScore(scoredPoints)
      }else{
        this.props.setError(message)
      }
    })
  }

  states = {
    game: new Game(this.props.gridSize),
  }

  play = async(position) => {
    const [success, message] = this.states.game.isValidMove(position, true)
    if (this.props.isPlayerTurn && success){
      this.props.setError("")
      socket.emit("new move", {move: position, gameId: this.props.gameId})
      // this.props.playMoveSound()
      this.props.setIsplayerTurn(false)

      const scoredPoints = this.states.game.play(position)
      this.props.addScore(scoredPoints)
    }else if(!success){
      this.props.setError(message)
    }
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
    console.log([x, y])
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
            {this.states.game.blankBars.map(bar => {
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
            {this.states.game.myBars.map(bar => {
              return (
                <Bar
                  key={bar}
                  index={bar}
                  orientation={this.getOrientationForBar(bar)}
                  color = "green"
                  gridSize={this.props.gridSize}
                  callbackFunction={() => {}}
                />
              )
            })}
            {this.states.game.opposantBars.map(bar => {
              return (
                <Bar
                  key={bar}
                  index={bar}
                  orientation={this.getOrientationForBar(bar)}
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

  return <Board
    gameId={props.gameId}
    gridSize={props.gridSize}
    isOwner={props.isOwner}
    isPlayerTurn={props.isPlayerTurn}
    setIsplayerTurn={props.setIsplayerTurn}
    setError={props.setError}
    addScore={props.addScore}
    addOpponentScore={props.addOpponentScore}
    playMoveSound = {playMoveSound}
    playOpponentMoveSound = {playOpponentMoveSound}
  />
}

export default BoardWrapper