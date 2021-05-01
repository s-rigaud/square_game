import React from 'react'

import useSound from 'use-sound'
import { Stage, Layer } from 'react-konva'
import { Input, Loader } from 'semantic-ui-react'

import Bar from './Bar'
import Dot from './Dot'
import Square from './Square'
import BoardModal from './BoardModal'
import GameState from '../model/GameState'

import moveSound from '../../assets/whoa.mp3'
import opponentMoveSound from '../../assets/ok.mp3'

const socket  = require('../../connection/socket').socket


class Board extends React.Component {
  // Handle Bar displaying UI, board generation

  componentDidMount() {
    this.props.setGreyBars(this.states.game.blankBars)
    socket.on("error", statusUpdate => {
      console.log(statusUpdate)
      alert(statusUpdate)
    })
    socket.on("start game", statusUpdate => {
      this.props.setIsplayerTurn(true)
      this.props.setIsOpponentConnected(true)
    })
    socket.on("opponent move", action => {
      const [success, message] = this.states.game.isValidMove(action.move)
      if(success){
        this.props.setError("")
        const scoredPoints = this.states.game.opponentPlay(action.move)
        if(scoredPoints){
          this.props.setOpponentScore(this.props.opponentScore + scoredPoints)
          // this.props.playOpponentMoveSound()
        }else{
          this.props.setIsplayerTurn(true)
        }

        this.updateBarsAndSquares()
        this.updateOnEndGame()

      }else{
        this.props.setError(message)
      }
    })
  }

  generateGridDots = () => {
    let dots = []
    for(let i = 0; i < this.props.gridSize + 1; i++){
      for(let j = 0; j < this.props.gridSize + 1; j++){
        dots.push([i*60 + 20, j*60 +5])
      }
    }
    return dots
  }

  states = {
    game: new GameState(this.props.gridSize),
    dots : this.generateGridDots(),
  }

  play = (position) => {
    const [success, message] = this.states.game.isValidMove(position)
    if (this.props.isPlayerTurn && success){
      this.props.setError("")
      console.log(this.states.game)
      const scoredPoints = this.states.game.play(position)
      console.log(this.states.game)
      if (scoredPoints){
        this.props.setScore(this.props.score + scoredPoints)
        // this.props.playMoveSound()
      }else{
        this.props.setIsplayerTurn(false)
      }
      this.updateBarsAndSquares()
      this.updateOnEndGame()
      socket.emit("new move", {move: position, gameId: this.states.gameId})

    }else if(!success){
      this.props.setError(message)
    }
  }

  playAgain = () => {
    // TODO fix using setState
    this.states.game = new GameState(this.props.gridSize)
    this.updateBarsAndSquares()
    this.props.setScore(0)
    this.props.setOpponentScore(0)
  }

  updateBarsAndSquares = () => {
    this.props.setGreyBars(this.states.game.blankBars)
    this.props.setGreenBars(this.states.game.myBars)
    this.props.setRedBars(this.states.game.opposantBars)

    this.props.setGreenSquares(this.states.game.mySquares)
    this.props.setRedSquares(this.states.game.opposantSquares)
  }

  updateOnEndGame = () => {
    if(this.states.game.ended){
      this.props.setIsFirstGame(false)
      this.props.setIsOpponentConnected(false)
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
    return [x, y]
  }

  getPositionForSquare = (square) => {
    let [x, y] = square
    x = x*60 +30
    y = y*60 +15
    return [x, y]
  }

  copyToClipboard = () => {
    const linkInput = document.getElementById("invitation-link")
    linkInput.select()
    document.execCommand("copy")
    linkInput.selected = false;
  }

  render() {
    return (
      <React.Fragment>
        {this.props.isOpponentConnected || !this.props.isFirstGame?
          <React.Fragment>
            {this.props.isPlayerTurn?
              <h2 style={{color: "green"}}>My turn</h2>
              :
              <h2 style={{color: "red"}}>Not my turn</h2>
            }
            <BoardModal
                open={this.states.game.ended}
                actionCallback={this.playAgain}
                score={this.props.score}
                opponentScore={this.props.opponentScore}
            />
            <div
              style={{
                backgroundColor: "#f39c12",
              }}
            >
              <Stage width = {this.props.gridSize*70} height = {this.props.gridSize*70}>
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
                        callbackFunction={() => this.play(bar)}
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
                        orientation = {this.getOrientationForBar(bar)}
                        position = {this.getPositionForBar(bar)}
                        color = "red"
                        gridSize={this.props.gridSize}
                        callbackFunction={() => {}}
                      />
                    )
                  })}
                  {this.states.dots.map(dot => {
                    return (
                      <Dot
                        key={dot}
                        position = {dot}
                      />
                    )
                  })}
                  {this.props.greenSquares.map(square => {
                    return (
                      <Square
                        key = {`s${square}`}
                        position = {this.getPositionForSquare(square)}
                        color = "green"
                      />
                    )
                  })}
                  {this.props.redSquares.map(square => {
                    return (
                      <Square
                        key = {`s${square}`}
                        position = {this.getPositionForSquare(square)}
                        color = "red"
                      />
                    )
                  })}
                </Layer>
              </Stage>
            </div>
          </React.Fragment>
          :
          <React.Fragment>
            <h1>Waiting for your friend</h1>
            <Loader active inline />
            <br/>
            <br/>
            <br/>
            <b>Send this link to your friend to start playing</b>
            <br/>
            <Input
              id="invitation-link"
              action={{
                color: 'teal',
                labelPosition: 'right',
                icon: 'copy',
                content: 'Copy',
                onClick: this.copyToClipboard,
              }}
              size='large'
              value={"http://localhost:3000/game/" + this.props.gameId + "/join"}
            />
          </React.Fragment>
        }
      </React.Fragment>
    )
  }
}

const BoardWrapper = (props) => {

  const [isPlayerTurn, setIsplayerTurn] = React.useState(false)

  const [playMoveSound] = useSound(moveSound)
  const [playOpponentMoveSound] = useSound(opponentMoveSound)

  const [greyBars, setGreyBars] = React.useState([])
  const [redBars, setRedBars] = React.useState([])
  const [greenBars, setGreenBars] = React.useState([])
  const [greenSquares, setGreenSquares] = React.useState([])
  const [redSquares, setRedSquares] = React.useState([])

  return <Board
    gameId={props.gameId}
    gridSize={props.gridSize}
    isPlayerTurn={isPlayerTurn}
    setIsplayerTurn={setIsplayerTurn}

    setError={props.setError}

    isOpponentConnected={props.isOpponentConnected}
    setIsOpponentConnected={props.setIsOpponentConnected}

    score={props.score}
    setScore={props.setScore}

    opponentScore={props.opponentScore}
    setOpponentScore={props.setOpponentScore}

    isFirstGame={props.isFirstGame}
    setIsFirstGame={props.setIsFirstGame}

    playMoveSound = {playMoveSound}
    playOpponentMoveSound = {playOpponentMoveSound}

    greyBars={greyBars}
    redBars ={redBars}
    greenBars={greenBars}
    setGreyBars={setGreyBars}
    setRedBars={setRedBars}
    setGreenBars={setGreenBars}
  
    greenSquares={greenSquares}
    setGreenSquares={setGreenSquares}
    redSquares={redSquares}
    setRedSquares={setRedSquares}
  />
}

export default BoardWrapper