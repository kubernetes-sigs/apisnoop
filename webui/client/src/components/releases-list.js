import React, { Component } from 'react'
import { connect } from 'react-redux'
import { chooseNewMain } from '../actions/releases-actions'

class ReleasesList extends Component {
  constructor (props) {
    super(props)
    this.optionsList = this.optionsList.bind(this)
    this.setNewMain = this.setNewMain.bind(this)
  }
  setNewMain (option) {
    console.log({newMain: option})
  }

  optionsList (options) {
    return options.map(option => {
      if (this.props.selected.includes(option)) {
        return(
            <a className="f6 ml1 mr1 grow no-underline br-pill ba ph2 pv2 mb2 dib pink" href="#0" onClick={()=> this.props.chooseNewMain(option)} key={`release_${option}`}>{option}</a>
        )
      } else {
        return (
            <a className="f6 ml1 mr1 grow no-underline br-pill ba ph2 pv2 mb2 dib black" href="#0" onClick={()=> this.props.chooseNewMain(option)} key={`release_${option}`}>{option}</a>
        )
      }
    })
  }

  render () {
    return (
        <div className="ph3 mt4">
        <h1 className="f6 fw6 ttu tracked">{this.props.context}</h1>
        {this.optionsList(this.props.options)}
      </div>
    )
  }
}

function mapStateToProps (state) {
  return {}
}
export default connect(mapStateToProps, {chooseNewMain})(ReleasesList)
