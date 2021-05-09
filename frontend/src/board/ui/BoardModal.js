import {useState} from 'react'

import { Button, Modal, Image, Icon } from 'semantic-ui-react'

import winImage from '../../assets/win.png'
import drawImage from '../../assets/draw.png'
import loseImage from '../../assets/lose.png'


// Endgame modal used to recapitulate score and ask for another game
const BoardModal = (props) => {

  const [loading, setLoading] = useState(false)

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
      size={"large"}
      open={props.open}
      centered={false}
      onMount={() => setLoading(false)}
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
        <Button animated onClick={() => {window.location = "/"}}>
          <Button.Content visible>Back to game creation</Button.Content>
          <Button.Content hidden>
            <Icon name='home' />
            <Icon name='long arrow alternate left' />
          </Button.Content>
        </Button>

        <Button animated onClick={() => {setLoading(true); props.replayCallback()}} positive loading={loading}>
          <Button.Content visible>Play again</Button.Content>
          <Button.Content hidden>
            <Icon name='trophy' />
            <Icon name='gamepad' />
            <Icon name='trophy' />
          </Button.Content>
        </Button>
      </Modal.Actions>
    </Modal>
  )
}
export default BoardModal