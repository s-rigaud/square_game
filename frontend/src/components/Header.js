import React from 'react'

import { Button, Icon } from 'semantic-ui-react'

class Header extends React.Component{

    isWin = () => {
        return this.props.score > this.props.opponentScore
      }

    isDraw = () => {
        return this.props.score === this.props.opponentScore
    }

    render(){
        return (
            <header>
                <div
                    className='navbar navbar-dark bg-dark shadow-sm'
                >
                    <div className='container d-flex justify-content-between'>
                        <h5
                            style={{ color: 'white', margin:'5px'}}
                            onClick={() => {window.location = "/"}}
                            className="home-link"
                        >🍹 Home</h5>
                        {this.props.gameId !== ""?
                        <React.Fragment>
                            <Button inverted={true}>
                                <Icon name='gamepad' />
                                Game id : {this.props.gameId}
                            </Button>
                            <Button color={(this.isWin()? "green": this.isDraw()? "grey": "red")}>
                                <Icon name='trophy' />
                                Score : {this.props.score+" - "+this.props.opponentScore}
                            </Button>
                        </React.Fragment>
                        :
                        <div/>
                    }
                    </div>
                </div>
            </header>
        )
    }
}

export default Header