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
        shadowColor="black"
        shadowBlur={10}
        shadowOpacity={0.4}
        shadowOffsetX={2}
        shadowOffsetY={2}
      />
  )
}

export default Dot