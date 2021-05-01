class GameState {
// Main game object use to represent game state

    constructor(gridSize){
        this.gridSize = gridSize
        this.maxBarIndex = 2 * this.gridSize * (Number(this.gridSize)+1) -1

        // every bar are equivalent to numbers betwwen 0 and the maxBarIndex
        this.blankBars = this.range(0, this.maxBarIndex)
        this.myBars = []
        this.opposantBars = []

        this.mySquares = []
        this.opposantSquares = []

        this.ended = false
    }

    range = (min, max) => {
      return Array.from({ length: max - min + 1 }, (_, i) => i)
    }

    // Current player move / function called only if the move is acceptable (see isValidMove)
    // return the number of point scored by the move
    play(move){
      this.myBars = [...this.myBars, move]
      this.blankBars = [...this.blankBars.filter(m => m !== move)]
      this.ended = this.blankBars.length === 0
      return this.computeNewPoints("me", move)
    }

    // Opponent player move / function called only if the move is acceptable (see isValidMove)
    // return the number of point scored by the move
    opponentPlay(move){
      this.opposantBars = [...this.opposantBars, move]
      this.blankBars = [...this.blankBars.filter(m => m !== move)]
      this.ended = this.blankBars.length === 0
      return this.computeNewPoints("opposant", move)
    }

    addSquare = (player, row, column) => {
      if (player === "me"){
        this.mySquares.push([row, column])
      }else{
        this.opposantSquares.push([row, column])
      }
    }

    // Compute the number of points scored by the last move
    // A move can marks up to 2 point
    // We use bar orientation to reduce the number of possible squares closed
    computeNewPoints = (player, move) => {
      // move is like "h15" or "v5"
      let score = 0
      const alredyPlayedMoves = this.myBars.concat(this.opposantBars)

      // If bar is vertical
      if(move % (2* this.gridSize + 1) >= this.gridSize){
        if (
          alredyPlayedMoves.indexOf(move-1) > -1
          && alredyPlayedMoves.indexOf(move+this.gridSize) > -1
          && alredyPlayedMoves.indexOf(move-this.gridSize-1) > -1
        ){
            //       ╔═══╗
            //       ║   ¦
            //       ╚═══╝
            score += 1
            console.log("Right bar placed")
            const row = Math.floor(move / (2 * this.gridSize + 1))
            const column = move % (2 * this.gridSize + 1) - this.gridSize -1
            this.addSquare(player, column, row)
        }
        if (
          alredyPlayedMoves.indexOf(move+1) > -1
          && alredyPlayedMoves.indexOf(move-this.gridSize) > -1
          && alredyPlayedMoves.indexOf(move+this.gridSize+1) > -1
        ){
            //       ╔═══╗
            //       ¦   ║
            //       ╚═══╝
            score += 1
            console.log("Left bar placed")
            const row = Math.floor(move / (2 * this.gridSize + 1))
            const column = move % (2 * this.gridSize + 1) - this.gridSize
            this.addSquare(player, column, row)
        }
      }else{
        if (
          alredyPlayedMoves.indexOf(move+this.gridSize) > -1
          && alredyPlayedMoves.indexOf(move+this.gridSize+1) > -1
          && alredyPlayedMoves.indexOf(move+2*this.gridSize+1) > -1
        ){
            //       ╔─ ─╗
            //       ║   ║
            //       ╚═══╝
            score += 1
            console.log("Top bar placed")
            const row = Math.floor(move / (2 * this.gridSize + 1))
            const column = move % ( 2 * this.gridSize + 1)
            this.addSquare(player, column, row)
        }
        if (
          alredyPlayedMoves.indexOf(move-this.gridSize) > -1
          && alredyPlayedMoves.indexOf(move-this.gridSize-1) > -1
          && alredyPlayedMoves.indexOf(move-2*this.gridSize-1) > -1
        ){
            //       ╔═══╗
            //       ║   ║
            //       ╚─ ─╝
            score += 1
            console.log("Bottom bar placed")
            const row = Math.floor(move / (2 * this.gridSize + 1)) -1
            const column = move % ( 2 * this.gridSize + 1)
            this.addSquare(player, column, row)
        }
      }
      return score
    }


    isValidMove = (move) => {
      /*Validate a given game move
      Moves should follow be an interger between 0 and the maxBarIndex (included)
      */
      let message = ""
      if(this.ended)
        message = "The game is over"

      if(isNaN(parseInt(move)))
        message = "Move is not valid. It should be a valid number"

      // Return now before exploiting numbers and letters
      if (message !== "") return [false, message]

      const alredyPlayedMoves = this.myBars.concat(this.opposantBars)
      if (move < 0)
        message = `Move is not valid. Number is too low: '${move}'`
      else if (move > this.maxBarIndex)
        message = `Move is not valid. Number is too high: '${move}'`
      else if (alredyPlayedMoves.indexOf(move) > -1)
        message = `Move is not valid. Someone already made it`

      return [message === "", message]
    }
}

export default GameState
//module.exports = GameState;