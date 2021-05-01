import { Rect } from 'react-konva'

const Dot = (props) => {
  // Basic Bar representation
  // This class handle UI (color change) and call to given callback function

  const [x, y] = props.position

  return (
      <Rect
        x = {x}
        y = {y}
        width = {10}
        height = {10}
        fill={"black"}
      />
  )
}

export default Dot