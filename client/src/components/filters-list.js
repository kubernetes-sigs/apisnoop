import React, { Component } from 'react'

class FiltersList extends Component {
  constructor (props) {
    super(props)
    this.optionsList = this.optionsList.bind(this)
  }

  optionsList (options) {
     var formattedNames = options.map(name => {
       return name.replace(/[\[\]]/g,'').replace(/_/g,'.')
     })
    var selected = this.props.selected.map(selection => {
      return selection.replace(/_/g,'.') //.replace(/^/,'[').replace(/$/,']')
    })
    return formattedNames.map(name => {
      if (selected.includes(name)) {
        return(
            <a className="f6 ml1 mr1 grow no-underline br-pill ba ph2 pv2 mb2 dib pink" href="#0" key={`filter_${name}`}>{name}</a>
        )
      } else {
        return (
            <a className="f6 ml1 mr1 grow no-underline br-pill ba ph2 pv2 mb2 dib silver" href="#0" key={`filter_${name}`}>{name}</a>
        )
      }
    })
  }

    render () {
      console.log({filterProps: this.props})
      return (
          <div className="ph3 mt4">
          <h1 className="f6 fw6 ttu tracked">{this.props.context}</h1>
          {this.optionsList(this.props.options)}
        </div>
      )
    }
  }

  export default FiltersList
