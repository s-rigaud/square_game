import React from 'react'
import { v4 as uuidv4 } from 'uuid';
const socket  = require('../connection/socket').socket


const HomePage = (props) => {
  // Main page to create a game

  const [localGridSize, setLocalGridSize] = React.useState(props.gridSize)

  const createGame = async() => {
    props.setIsOwner(true)
    props.setGridSize(localGridSize)

    const gameId = uuidv4()
    props.setGameId(gameId)
    socket.emit('createNewGame', {gameId: gameId, gridSize: localGridSize})
  }

  return (
    <div>
      <h1>Game creator</h1>
      <input
        placeholder='5'
        value={localGridSize}
        onChange={e => setLocalGridSize(e.target.value)}
      />
      <p>Current grid size: {localGridSize}</p>
      <button
        className="btn btn-primary"
        onClick={() => {createGame()}}
        disabled = {localGridSize < 2 || localGridSize > 9}
      >
        Create Game
      </button>
    </div>
  )

}

export default HomePage