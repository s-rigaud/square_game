import io from 'socket.io-client'

// Instanciation of a TCP socket used to communicate with the server
// thanks to socket.IO

const SERVER_URL = "http://127.0.0.1:8000"

const socket = io(SERVER_URL)

socket.on("createNewGame", statusUpdate => {
    console.log(statusUpdate)
})

socket.on("error", statusUpdate => {
    alert(statusUpdate)
})

export {socket}