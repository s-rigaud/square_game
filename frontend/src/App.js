import {useState} from 'react'
import './App.css'

import 'semantic-ui-css/semantic.min.css'

import { BrowserRouter as Router, Route, Redirect, Switch } from 'react-router-dom'

import HomePage from './lobby_management/HomePage'
import JoinGame from './lobby_management/JoinGame'
import BoardWrapper from './board/ui/Board'
import Header from './components/Header'

function App() {
  // Main app entry point
  // Handle url route logic and share property with components

  const [gameId, setGameId] = useState("")
  const [gridSize, setGridSize] = useState(4)

  const [score, setScore] = useState(0)
  const [opponentScore, setOpponentScore] = useState(0)
  const [isFirstGame, setIsFirstGame] = useState(true)
  const [doesPlayerStarted, setDoesPlayerStarted] = useState("")

  const [isOpponentConnected, setIsOpponentConnected] = useState(false)
  const [error, setError] = useState("")

  // Return Board if the player created the game or joined it
  // else return the HomePage
  return (
    <div>
      <p style={{color: "red"}}>{error}</p>
      <Header
        gameId={gameId}
        score={score}
        opponentScore={opponentScore}
      />
      <div id="content">
        <Router>
          <Switch>
            <Route path = "/" exact>
              {gameId !== "" ?
                <div>
                  <BoardWrapper
                    gameId={gameId}
                    gridSize={gridSize}
                    setError={setError}

                    isFirstGame={isFirstGame}
                    setIsFirstGame={setIsFirstGame}
                    isOpponentConnected={isOpponentConnected}
                    setIsOpponentConnected={setIsOpponentConnected}
                    doesPlayerStarted={doesPlayerStarted}
                    setDoesPlayerStarted={setDoesPlayerStarted}

                    score={score}
                    setScore={setScore}
                    opponentScore={opponentScore}
                    setOpponentScore={setOpponentScore}
                  />
                </div>
                :
                <HomePage
                  // Game creation
                  gameId={gameId}
                  gridSize={gridSize}
                  setGameId={setGameId}
                  setGridSize={setGridSize}
                  setDoesPlayerStarted={setDoesPlayerStarted}
                />
              }
            </Route>

            <Route path = "/game/:gameId/join" exact>
              <JoinGame
                setGridSize={setGridSize}
                setGameId={setGameId}
                setIsOpponentConnected={setIsOpponentConnected}
                setDoesPlayerStarted={setDoesPlayerStarted}
              />
            </Route>

            <Redirect to = "/" />

          </Switch>
        </Router>
      </div>
    </div>
  );
}

export default App;
