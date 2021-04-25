const express = require('express')
const http = require('http')
const socketio = require('socket.io')
const gameLogic = require('./game_logic')
const app = express()

const httpServer = http.createServer(app)
const io = socketio(httpServer, {
    cors: {
      origin: "http://localhost:3000",
      methods: ["GET", "POST"]
    }
  })

io.on('connection', client => {
    gameLogic.initializeGame(io, client)
})

const port = 8000
httpServer.listen(process.env.PORT || port, () => console.log("Server running on port: " + port))