import React, { Component } from 'react'
import { connect } from 'react-redux'
import { addTestTag } from '../actions/releases-actions'
import { removeTestTag } from '../actions/releases-actions'

class TestTagsList extends Component {
  constructor (props) {
    super(props)
    this.optionsList = this.optionsList.bind(this)
  }

  optionsList (options) {
     var formattedNames = options.map(name => {
       return name.replace(/[\[\]]/g,'').replace(/_/g,'.')
     })
    var selected = this.props.selected
    //.map(selection => {
    //  return selection.replace(/^/g,'[').replace(/$/g,']')
      //return selection.replace(/_/g,'.').replace(/^/,'[').replace(/$/,']')
    //})
    return formattedNames.map(name => {
      if (selected.includes(name.replace(/^/g,'[').replace(/$/g,']'))) {
        return(
            <a className="f6 ml1 mr1 grow no-underline br-pill ba ph2 pv2 mb2 dib pink"
               href="#0"
               key={`filter_${name}`}
               onClick={()=> this.props.removeTestTag(name)}>{name}</a>
        )
      } else {
        return (
            <a className="f6 ml1 mr1 grow no-underline br-pill ba ph2 pv2 mb2 dib silver"
               href="#0"
               key={`filter_${name}`}
               onClick={()=> this.props.addTestTag(name)}>{name}</a>
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
  return {
      main_release: state.releasesStore.main_release,
      selected_test_tags: state.releasesStore.selected_test_tags,
      test_tags: state.releasesStore.test_tags
    }
}

export default connect(mapStateToProps, {addTestTag,removeTestTag})(TestTagsList)
