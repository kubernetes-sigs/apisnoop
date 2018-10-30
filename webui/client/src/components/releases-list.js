import React, { Component } from 'react'
import { NavLink } from 'react-router-dom'
import { connect } from 'react-redux'

class ReleasesList extends Component {
  constructor (props) {
    super(props)
    this.optionsList = this.optionsList.bind(this)
  }

  optionsList (options) {
    return options.map(option => {
        return(
            <NavLink className="f6 ml1 mr1 grow no-underline br-pill ba ph2 pv2 mb2 dib pink" exact to={option.name} key={`release_${option._id}`}>{option.name}</NavLink>
        )
    })
  }

  render () {
    console.log({navReleases: this.props.releases})
    return (
        <div className="ph3 mt4">
        <h1 className="f6 fw6 ttu tracked">Releases</h1>
        {this.optionsList(this.props.releases)}
      </div>
    )
  }
}

export default ReleasesList
