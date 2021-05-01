
var io
var gameSocket
var gameSessions = []

// Mapping for grid size for each living session
// {<gameId>: gridSize, ...}
// {4: 5, ....}
var gridSizeMapping = {}

// Initialize at the start of every connection ?
const initializeGame = (socket_io, socket) => {
    io = socket_io
    gameSocket = socket
    gameSessions.push(gameSocket)

    gameSocket.on("disconnect", onDisconnect)
    gameSocket.on("new move", newMove)
    gameSocket.on("createNewGame", createNewGame)
    gameSocket.on("playerJoinGame", playerJoinGame)
}

// Received when creator makes the lobby
function createNewGame(gameInfo) {
    gameId = gameInfo.gameId
    this.emit("createNewGame", {gameId: gameId, gridSize: gameInfo.gridSize})
    gridSizeMapping[gameId] = gameInfo.gridSize
    console.log(`Game ${gameId} created`)
    this.join(gameId)
}

// Received when one of the player enter the lobby
function playerJoinGame(gameId) {
    var room = io.sockets.adapter.rooms.get(gameId)

    if (room === undefined) {
        this.emit("error" , "This game session does not exist" )
        return
    }

    console.log("Another player joined game " + gameId)
    if (room.size < 2) {
        this.join(gameId)
        this.emit("update grid size", {gridSize: gridSizeMapping[gameId]})
        if (room.size === 2) {
            // Send "start game" to game owner
            io.sockets.to(getOpponentSocketId(room, this.id)).emit("start game", null)
        }
    } else {
        this.emit("error" , "There are already two players in this room")
    }
}

// Received when a player make a move
function newMove(move) {
    const room = io.sockets.adapter.rooms.get(gameId)
    console.log(`Game ${gameId}: New move '${move.move}'`)
    io.to(getOpponentSocketId(room, this.id)).emit("opponent move", move)
}

// Received when a user close the browser ?
function onDisconnect() {
    var i = gameSessions.indexOf(gameSocket)
    console.log(`Player disconnected`)
    gameSessions.splice(i, 1)
}

function getOpponentSocketId(room, mySocketId){
    if (room.size == 2){
        for(id of room.values()){
            if (id != mySocketId){
                return id
            }
        }
    }
    return null
}

exports.initializeGame = initializeGame