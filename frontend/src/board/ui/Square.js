import { Rect } from 'react-konva'

const Square = (props) => {
  // Basic Bar representation
  // This class handle UI (color change) and call to given callback function

  const [x, y] = props.position
  const width = 50
  const height = 50

  return (
      <Rect
        x = {x}
        y = {y}
        width = {width}
        height = {height}
        fill={props.color}
      />
  )
}

export default Square