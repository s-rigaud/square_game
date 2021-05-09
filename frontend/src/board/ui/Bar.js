import React from 'react'

import { Rect } from 'react-konva'

class Bar extends React.Component {
  // Basic Bar representation
  // This class handle UI (color change) and call to given callback function

  componentDidMount = () => {
    if(this.props.color !== "lightgray")   this.changeSize()
  }

  changeSize = () => {
    this.rect.to({
      scaleX: 1.05,
      scaleY: 1,
      duration: 0.5,
    })
  }

  render = () => {
    return (
        <Rect
          ref = {node => {this.rect = node}}
          x = {this.props.position[0]}
          y = {this.props.position[1]}
          width = {this.props.orientation === "v" ? 10 : 50}
          height = {this.props.orientation === "v" ? 50 : 10}
          fill={this.props.color}
          onClick={() => {this.props.callbackFunction()}}
          shadowColor={this.props.color === "lightgray"? "black" : this.props.color}
          shadowBlur={10}
          shadowOpacity={0.4}
          shadowOffsetX={3}
          shadowOffsetY={3}
        />
    )
  }
}

export default Bar