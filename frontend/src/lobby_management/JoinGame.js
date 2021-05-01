import React from 'react'

import { useParams, Redirect } from 'react-router-dom'
const socket  = require('../connection/socket').socket

const JoinGame = (props) => {

  const { gameId } = useParams()

  const joinGame = () => {
    socket.emit("playerJoinGame", gameId)
    socket.on("update grid size", (response) =>{
      props.setGridSize(response.gridSize); props.setGameId(gameId)
    })
  }
  props.setIsOpponentConnected(true)

  React.useEffect(() => {joinGame()}, [])
  return <Redirect to = "/" />
}

export default JoinGame