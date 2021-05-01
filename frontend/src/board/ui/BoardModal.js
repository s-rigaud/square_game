import React from 'react'

import { Button, Modal, Image } from 'semantic-ui-react'

import winImage from '../../assets/win.png'
import drawImage from '../../assets/draw.png'
import loseImage from '../../assets/lose.png'

const BoardModal = (props) => {

  const isWin = () => {
    return props.score > props.opponentScore
  }

  const isDraw = () => {
    return props.score === props.opponentScore
  }

  const formatScore = () => {
    return `${props.score} - ${props.opponentScore}`
  }

  return (
    <Modal
      closeOnDocumentClick={true}
      centered={true}
      size={"large"}
      open={props.open}
      mountNode={document.getElementById("root")}
    >
      <Modal.Header>{"You " +(isWin()? "won !": isDraw()? "draw": "lost") }</Modal.Header>
      <Modal.Content image>
        <Image size='medium' src={(isWin()? winImage: isDraw()? drawImage: loseImage)} wrapped />
        <Modal.Description>
          <p>
            {(isWin()?
              "You manage to win the game with "+formatScore()+"."
              :
              isDraw()?
                "Well that's a draw, you may win the next game."
                :
                "Unfortunately you lose the game "+formatScore()+" don't worry, you will be better next time !"
            )}
          </p>
        </Modal.Description>
      </Modal.Content>
      <Modal.Actions>
          <Button onClick={() => {window.location = "/"}}>Back to game creation</Button>
          <Button onClick={props.actionCallback} positive>
            Play again
          </Button>
      </Modal.Actions>
    </Modal>
  )
}
export default BoardModal