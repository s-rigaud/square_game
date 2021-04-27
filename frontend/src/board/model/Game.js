class Game {

    // every bar are equivalent to numbers betwwen 0 and the maxBarIndex
    constructor(gridSize){
        this.gridSize = gridSize
        this.maxBarIndex = 2 * this.gridSize * (Number(this.gridSize)+1) -1

        this.blankBars = this.range(0, this.maxBarIndex)
        this.myBars = []
        this.opposantBars = []

        this.ended = false
    }

    range = (min, max) => {
      return Array.from({ length: max - min + 1 }, (_, i) => i)
    }

    play(position){
      this.myBars = [...this.myBars, position]
      this.blankBars = [...this.blankBars.filter(pos => pos !== position)]
      this.updateEndGame()
      return this.computeNewPoints(position)
    }

    opponentPlay(position){
      this.opposantBars = [...this.opposantBars, position]
      this.blankBars = [...this.blankBars.filter(pos => pos !== position)]
      this.updateEndGame()
      return this.computeNewPoints(position)
    }

    updateEndGame = () => {
      this.ended = this.blankBars.length === 0
    }

    computeNewPoints = (move) => {
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
        }
      }
      return score
    }


    isValidMove = (move, isCurrentPlayerMove) => {
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

export default Game
//module.exports = Game;