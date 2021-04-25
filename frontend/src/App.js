import React from 'react'
import './App.css'

import { BrowserRouter as Router, Route, Redirect, Switch } from 'react-router-dom'

import HomePage from './lobby_management/HomePage'
import JoinGame from './lobby_management/JoinGame'
import BoardWrapper from './board/ui/Board'

function App() {
  // Main app entry point
  // Handle url route logic and share property with components

  const [gameId, setGameId] = React.useState("")
  const [gridSize, setGridSize] = React.useState(4)

  const [isOwner, setIsOwner] = React.useState(false)
  const [isPlayerTurn, setIsplayerTurn] = React.useState(false)
  const [score, setScore] = React.useState(0)
  const [opponentScore, setOpponentScore] = React.useState(0)

  const [error, setError] = React.useState("")

  const addScore = (points) => {
    setScore(score + points)
  }

  const addOpponentScore = (points) => {
    setOpponentScore(score + points)
  }

  return (
    <div>
      <p style={{color: "red"}}>{error}</p>
      <Router>
        <Switch>
          <Route path = "/" exact>
            {gameId !== "" ?
              <div>
                <h2><a href="/">Home</a></h2>
                <h2>Game number: {gameId}</h2>
                <h2>Grid size: {gridSize}</h2>
                <h2>Score: {score}-{opponentScore}</h2>
                {isPlayerTurn?
                <h2 style={{color: "green"}}>My turn: {isPlayerTurn}</h2>
                :
                <h2 style={{color: "red"}}>Not my turn</h2>
                }
                {isOwner?
                  <p>
                    <b>Send this link to your friend to start playing: </b>
                    <a href={"http://localhost:3000/game/" + gameId + "/join"} target="_blank" rel="noreferrer">
                      { "http://localhost:3000/game/" + gameId + "/join"}
                    </a>
                  </p>
                  :
                  <p></p>
                }

                <BoardWrapper
                  gameId={gameId}
                  gridSize={gridSize}
                  isOwner={isOwner}
                  isPlayerTurn={isPlayerTurn}
                  setIsplayerTurn={setIsplayerTurn}
                  setError={setError}
                  addScore={addScore}
                  addOpponentScore={addOpponentScore}
                />
              </div>
              :
              <HomePage
                // Game creation
                gameId={gameId}
                gridSize={gridSize}
                setGameId={setGameId}
                setGridSize={setGridSize}
                setError={setError}
                setIsOwner={setIsOwner}
              />
            }
          </Route>

          <Route path = "/game/:gameId/join" exact>
            <JoinGame
              setGridSize={setGridSize}
              setGameId={setGameId}
            />
          </Route>

          <Redirect to = "/" />

        </Switch>
      </Router>
    </div>
  );
}

export default App;
