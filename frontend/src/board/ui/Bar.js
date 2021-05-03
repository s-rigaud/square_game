import { Rect } from 'react-konva'

const Bar = (props) => {
  // Basic Bar representation
  // This class handle UI (color change) and call to given callback function

  const [x, y] = props.position
  const width = props.orientation === "v" ? 10 : 50
  const height = props.orientation === "v" ? 50 : 10

  return (
      <Rect
        x = {x}
        y = {y}
        width = {width}
        height = {height}
        fill={props.color}
        onClick={() => {props.callbackFunction()}}
      />
  )
}

export default Bar