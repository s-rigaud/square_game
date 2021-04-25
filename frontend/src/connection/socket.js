import io from 'socket.io-client'

const SERVER_URL = "http://127.0.0.1:8000"

const socket = io(SERVER_URL)

socket.on("createNewGame", statusUpdate => {
    console.log(statusUpdate)
})

/*socket.on("opponent move", statusUpdate => {
    alert(statusUpdate.move)
})*/

export {socket}