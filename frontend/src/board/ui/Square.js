import React from 'react'

import { Rect } from 'react-konva'

class Square extends React.Component {
  // Basic Bar representation

  componentDidMount = () => {
    this.changeSize()
  }

  changeSize = () => {
    this.rect.to({
      // Small adjustement to adapt pixels
      x: this.props.position[0],
      y: this.props.position[1],
      scaleX: 10,
      scaleY: 10,
      rotation: 0,
      duration: 0.5,
    })
  }

  render(){
    return (
        <Rect
          ref = {node => {this.rect = node}}
          x = {this.props.position[0] + 25}
          y = {this.props.position[1] + 25}
          width = {50/10}
          height = {50/10}
          rotation = {5}
          fill={this.props.color}
        />
    )
  }
}

export default Square