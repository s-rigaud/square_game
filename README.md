# "Square Game" projet

Also called "Dots and boxes", "carrés magiques" or "pipo-pipette" in France.

## Setup
```
git clone https://github.com/s-rigaud/square_game.git

# Start Express.Js and Socket.IO backend
cd backend
npm install
npm start

# Start React.Js frontend (in another terminal)
cd frontend
npm install
npm start
```

## Goal

The goal of this project is to provide a scaling platform to create two player games for the Square Game.
All the game logic is stored in the front-end and the backend is only responsible for the socket communication between players.

The creator of the game as only to give a short link to his friend to start playing.

![Send link image](https://raw.githubusercontent.com/s-rigaud/square_game/master/assets/link.png?token=ALBTC7TSVOUBSP3ZVNHNT63ATFJGU)
![Game image](https://raw.githubusercontent.com/s-rigaud/square_game/master/assets/game.png?token=ALBTC7TRZ2UDPWBG4XO3AXTATFJEU)

## Dependencies

For the backend, I used Express.Js with socket.IO to handle asynchronous events when a move is made and avoiding having a frontend constantly calling the backend to look for an update of the game state.

For the frontend, I mainly used React.js as well as react-color and react-konva to handle the grid game rendering.


## Thanks
Thanks to [Jack He](https://github.com/ProjectsByJackHe) for his [chessgame project](https://github.com/JackHeTech/multiplayer-chess-game) which gave me the inspiration to start implementing the Square Game for this project.