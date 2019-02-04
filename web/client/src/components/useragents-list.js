import React, { Component } from 'react'
import { connect } from 'react-redux'
import { addUserAgent } from '../actions/releases-actions'
import { removeUserAgent } from '../actions/releases-actions'

class UserAgentsList extends Component {
  constructor (props) {
    super(props)
    this.optionsList = this.optionsList.bind(this)
  }

  optionsList (options) {
     var formattedNames = options.map(name => {
       return name.replace(/_/g,'.')
     })
    var selected = this.props.selected.map(selection => {
      return selection.replace(/_/g,'.')
    })
    return formattedNames.map(name => {
      if (selected.includes(name)) {
        return(
            <a className="f6 ml1 mr1 grow no-underline br-pill ba ph2 pv2 mb2 dib pink"
             href="#0" key={`useragent_${name}`}
             onClick={()=> this.props.removeUserAgent(name)}>{name}</a>
        )
      } else {
        return (
            <a className="f6 ml1 mr1 grow no-underline br-pill ba ph2 pv2 mb2 dib silver"
             href="#0" key={`filter_${name}`}
             onClick={()=> this.props.addUserAgent(name)}>{name}</a>
        )
      }
    })
  }

    render () {
      //console.log({filterProps: this.props})
      return (
          <div className="ph3 mt4">
          <h1 className="f6 fw6 ttu tracked">{this.props.context}</h1>
          {this.optionsList(this.props.options)}
        </div>
      )
    }
  }

function mapStateToProps (state) {
  return {
      main_release: state.releasesStore.main_release,
      userAgents: state.releasesStore.useragents
    }
}
//export default UserAgentsList
export default connect(mapStateToProps, {addUserAgent,removeUserAgent})(UserAgentsList)
