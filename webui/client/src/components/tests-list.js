import React, { Component } from 'react'
import { connect } from 'react-redux'
import { addTest } from '../actions/releases-actions'
import { removeTest } from '../actions/releases-actions'

class TestsList extends Component {
  constructor (props) {
    super(props)
    this.optionsList = this.optionsList.bind(this)
  }

  optionsList (options) {
     var filteredTests = options.map(name => {
       return name.replace(/_/g,'.')
     }).filter(test => this.props.selected_test_tags.filter( tt => test.includes(tt)).length > 0)
    var selected = this.props.selected
   //.map(selection => {
    //  return selection.replace(/^/g,'[').replace(/$/g,']')
      //return selection.replace(/_/g,'.').replace(/^/,'[').replace(/$/,']')
    //})
    // var taggedTests = testList.filter(test => {
    //  return self.props.selected_tests.includes(test)
    //})

    return filteredTests.map(name => {
      console.log({'Selected_Tests': this.props.selected_tests})
      if (this.props.selected_tests.includes(name)) {
        console.log({'Included NAME': name})
      } else {
        console.log({'Excluded NAME': name})
      }
      if (selected.includes(name.replace(/^/g,'[').replace(/$/g,']'))) {
        return(
            <a className="f6 ml1 mr1 grow no-underline br-pill ba ph2 pv2 mb2 dib pink"
               href="#0"
               key={`filter_${name}`}
               onClick={()=> this.props.removeTest(name)}>{name}</a>
        )
      } else {
        return (
            <a className="f6 ml1 mr1 grow no-underline br-pill ba ph2 pv2 mb2 dib silver"
               href="#0"
               key={`filter_${name}`}
               onClick={()=> this.props.addTest(name)}>{name}</a>
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
      selected_tests: state.releasesStore.selected_tests,
      tests: state.releasesStore.tests
    }
}

export default connect(mapStateToProps, {addTest,removeTest})(TestsList)
