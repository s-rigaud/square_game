import React from 'react'
import { v4 as uuidv4 } from 'uuid';
const socket  = require('../connection/socket').socket


const HomePage = (props) => {
  // Main page to create a game

  const [localGridSize, setLocalGridSize] = React.useState(props.gridSize)

  const createGame = () => {
    props.setIsOwner(true)
    props.setGridSize(localGridSize)

    const gameId = uuidv4()
    props.setGameId(gameId)
    socket.emit('createNewGame', {gameId: gameId, gridSize: localGridSize})
  }

  return (
    <div>
      <h1 className={"hover_effect typing-demo"}>Game creator</h1>
      <p>Select grid size:</p>
      <input
        placeholder='4'
        value={localGridSize}
        onChange={e => setLocalGridSize(e.target.value)}
      />
      <br/>
      <button
        className="btn create-btn"
        onClick={() => {createGame()}}
        disabled = {localGridSize < 2 || localGridSize > 9}
      >
        Create new game
      </button>
    </div>
  )

}

export default HomePage