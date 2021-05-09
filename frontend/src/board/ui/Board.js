import React, { useState } from 'react'

import useSound from 'use-sound'
import { Stage, Layer } from 'react-konva'
import { GithubPicker } from 'react-color'
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

  generateGridDots = () => {
    let dots = []
    for(let i = 0; i < this.props.gridSize + 1; i++){
      for(let j = 0; j < this.props.gridSize + 1; j++){
        dots.push([i*60 + 20, j*60 + 20])
      }
    }
    return dots
  }

  initBoard = () => {
    this.states.dots = this.generateGridDots()
    this.states.game = new GameState(this.props.gridSize)
    this.props.setScore(0)
    this.props.setOpponentScore(0)
    this.updateBarsAndSquares()
  }

  componentDidMount() {
    socket.on("error", statusUpdate => {
      console.log(statusUpdate)
      alert(statusUpdate)
    })
    // Owner received "start game" when the other player joined
    socket.on("start game", _ => {
      this.props.setIsplayerTurn(true)
      this.props.setIsOpponentConnected(true)
      this.initBoard()
    })
    // We received play again when the other player emit it
    // We already rest the board if the player also wants it
    socket.on("play again", _ => {
      console.log("Replay received")
      this.states.opponentWantsReplay = true
      if(this.states.playerWantsReplay){
        this.props.setIsplayerTurn(!this.props.doesPlayerStarted)
        this.props.setDoesPlayerStarted(this.props.doesPlayerStarted)

        this.initBoard()
      }
    })

    // When player emit a move we first check if it is valid and if so we
    // update the board components
    socket.on("opponent move", action => {
      const [success, message] = this.states.game.isValidMove(action.move)
      if(success){
        this.props.setError("")
        const scoredPoints = this.states.game.opponentPlay(action.move)
        if(scoredPoints){
          this.props.setOpponentScore(this.props.opponentScore + scoredPoints)
          this.props.playOpponentMoveSound()
        }else{
          this.props.setIsplayerTurn(true)
        }

        this.updateBarsAndSquares()
        this.updateOnEndGame()

        // Reset replay options
        this.states.playerWantsReplay = false
        this.states.opponentWantsReplay = false

      }else{
        this.props.setError(message)
      }
    })
  }

  states = {
    game: new GameState(this.props.gridSize),
    dots : this.generateGridDots(),
    playerWantsReplay: false,
    opponentWantsReplay: false,
  }

  // When user click a grey bar we validate the move is valid and emit it
  // to the opponent
  play = (position) => {
    const [success, message] = this.states.game.isValidMove(position)
    if (this.props.isPlayerTurn && success){
      this.props.setError("")
      console.log(this.states.game)
      const scoredPoints = this.states.game.play(position)
      console.log(this.states.game)
      if (scoredPoints){
        this.props.setScore(this.props.score + scoredPoints)
        this.props.playMoveSound()
      }else{
        this.props.setIsplayerTurn(false)
      }
      this.updateBarsAndSquares()
      this.updateOnEndGame()
      socket.emit("new move", {move: position, gameId: this.states.gameId})

      // Reset replay options
      this.states.playerWantsReplay = false
      this.states.opponentWantsReplay = false

    }else if(!success){
      this.props.setError(message)
    }
  }

  // On the modal, we let the possibility for both player to
  // reset the game and start playing the game again using
  // the same grid size
  askReplay = () => {
    this.states.playerWantsReplay = true
    socket.emit("play again", this.props.gameId)
    if(this.states.opponentWantsReplay){
      this.props.setIsplayerTurn(!this.props.doesPlayerStarted)
      this.props.setDoesPlayerStarted(this.props.doesPlayerStarted)

      this.initBoard()
    }
  }

  // Re sync game state and UI when needed
  updateBarsAndSquares = () => {
    this.props.setGreyBars(this.states.game.blankBars)
    this.props.setMyBars(this.states.game.myBars)
    this.props.setRedBars(this.states.game.opposantBars)

    this.props.setGreenSquares(this.states.game.mySquares)
    this.props.setRedSquares(this.states.game.opposantSquares)
  }

  // Verify the game state to know if the game is over
  updateOnEndGame = () => {
    if(this.states.game.ended){
      this.props.setIsFirstGame(false)
      this.props.setIsOpponentConnected(false)
    }
  }

  getOrientationForBar = (bar) => {
    return (bar % (2* this.props.gridSize + 1) < this.props.gridSize? "h" : "v")
  }

  // A lot of math to get the position of the bar only knowing its
  // unique id which represent it
  getPositionForBar = (bar) => {
    // ------> x
    // |
    // y
    const orientation = this.getOrientationForBar(bar)
    const gr = this.props.gridSize
    let x = 0, y = 0
    if (orientation === "h"){
      x = (bar % ( 2 * gr + 1) * 60) + 30
      y = (Math.floor(bar / (2 * gr + 1)) * 60) + 20
    }else{
      x = ((bar % (2 * gr + 1) - gr) * 60) + 20
      y = (Math.floor(bar / (2 * gr + 1)) * 60) + 30
    }
    return [x, y]
  }

  getPositionForSquare = (square) => {
    let [x, y] = square
    x = x*60 + 30
    y = y*60 + 30
    return [x, y]
  }

  copyToClipboard = () => {
    const linkInput = document.getElementById("invitation-link")
    linkInput.select()
    document.execCommand("copy")
    linkInput.selected = false;
  }

  // Online option found to guess if text is better in white or black
  // on a given color (used for the button color option)
  getTextColorForBackground = () => {
    const bgColor = this.props.myBarColor
    var color = bgColor.substring(1, 7)
    var r = parseInt(color.substring(0, 2), 16); // hexToR
    var g = parseInt(color.substring(2, 4), 16); // hexToG
    var b = parseInt(color.substring(4, 6), 16); // hexToB
    return (((r * 0.299) + (g * 0.587) + (b * 0.114)) > 186) ? "#000" : "#fff"
  }

  // TODO close color picker when anything else is clicked
  closePicker = (e) => {
    if (e.target.id !== "color-button") this.props.setIsPickerDisplayed(false)
  }


  // Returns board display is both player joined
  // else the first player only see the invitation link
  // An end game Modal is also displayed
  // The board is using a wide canvas to display bars
  render() {
    this.updateBarsAndSquares()
    return (
      <div
        onClick={e => this.closePicker(e)}
      >
        {this.props.isOpponentConnected || !this.props.isFirstGame?
          <React.Fragment>
            <div id="turn-message">
              {this.props.isPlayerTurn?
              // TODO improve this display :/
                <h2 style={{color: "green"}}>Your Turn</h2>
                :
                <React.Fragment>
                  <h2
                    style={{color: "red",margin: "5px", display: "inline"}
                  }>Waiting your friend to play</h2>
                  <div className="lds-ellipsis"><div></div><div></div><div></div><div></div></div>
                </React.Fragment>
              }
            </div>
            <BoardModal
                open={this.states.game.ended && (!this.states.opponentWantsReplay || !this.states.playerWantsReplay)}
                score={this.props.score}
                opponentScore={this.props.opponentScore}
                replayCallback={this.askReplay}
            />
            <div
              style={{
                backgroundColor: "#f39c12",
                marginTop: "15px",
                width: "fit-content",
                margin: "auto",
              }}
            >
              <Stage
                id="stage"
                width = {(this.props.gridSize+1)*10 + this.props.gridSize*50 + 20*2}
                height = {(this.props.gridSize+1)*10 + this.props.gridSize*50 + 20*2}
              >
                <Layer>
                  {this.props.greyBars.map(bar => {
                    return (
                      <Bar
                        key={bar}
                        orientation={this.getOrientationForBar(bar)}
                        position = {this.getPositionForBar(bar)}
                        color = "lightgray"
                        gridSize={this.props.gridSize}
                        // Only blank bars are clickable
                        callbackFunction={() => this.play(bar)}
                      />
                    )
                  })}
                  {this.props.myBars.map(bar => {
                    return (
                      <Bar
                        key={bar}
                        orientation={this.getOrientationForBar(bar)}
                        position = {this.getPositionForBar(bar)}
                        color = {this.props.myBarColor}
                        gridSize={this.props.gridSize}
                        callbackFunction={() => {}}
                      />
                    )
                  })}
                  {this.props.redBars.map(bar => {
                    return (
                      <Bar
                        key={bar}
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
                  {// TODO fill square with gradient or something
                  this.props.greenSquares.map(square => {
                    return (
                      <Square
                        key = {`s${square}`}
                        position = {this.getPositionForSquare(square)}
                        color = {this.props.myBarColor + "90"} // Adding alpha
                      />
                    )
                  })}
                  {this.props.redSquares.map(square => {
                    return (
                      <Square
                        key = {`s${square}`}
                        position = {this.getPositionForSquare(square)}
                        color = {"#ff000090"} // With alpha
                      />
                    )
                  })}
                </Layer>
              </Stage>
            </div>
            <button
              id="color-button"
              style={{"backgroundColor": this.props.myBarColor, "color": this.getTextColorForBackground()}}
              color={this.props.myBarColor}
              onClick={() => this.props.setIsPickerDisplayed(!this.props.isPickerDisplayed)}
            >
              Change bar color
            </button>
            {this.props.isPickerDisplayed?
              <GithubPicker
                width="250px"
                colors={['#ff7979', '#eb4d4b', '#badc58', '#6ab04c', 'blue', 'violet', 'purple', 'pink', 'brown', 'grey', 'black']}
                onChangeComplete={e => this.props.setMyBarColor(e.hex)}
              />
              :
              <div/>
            }

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
      </div>
    )
  }
}

const BoardWrapper = (props) => {

  const [isPlayerTurn, setIsplayerTurn] = useState(false)

  const [playMoveSound] = useSound(moveSound)
  const [playOpponentMoveSound] = useSound(opponentMoveSound)

  const [greyBars, setGreyBars] = useState([])
  const [redBars, setRedBars] = useState([])
  const [myBars, setMyBars] = useState([])
  const [greenSquares, setGreenSquares] = useState([])
  const [redSquares, setRedSquares] = useState([])

  const [myBarColor, setMyBarColor] = useState('#007B02');
  const [isPickerDisplayed, setIsPickerDisplayed] = useState(false);

  return <Board

    {...props}
    isPlayerTurn={isPlayerTurn}
    setIsplayerTurn={setIsplayerTurn}

    playMoveSound = {playMoveSound}
    playOpponentMoveSound = {playOpponentMoveSound}

    greyBars={greyBars}
    redBars ={redBars}
    myBars={myBars}
    setGreyBars={setGreyBars}
    setRedBars={setRedBars}
    setMyBars={setMyBars}

    greenSquares={greenSquares}
    setGreenSquares={setGreenSquares}
    redSquares={redSquares}
    setRedSquares={setRedSquares}

    myBarColor={myBarColor}
    setMyBarColor={setMyBarColor}
    isPickerDisplayed={isPickerDisplayed}
    setIsPickerDisplayed={setIsPickerDisplayed}
  />
}

export default BoardWrapper