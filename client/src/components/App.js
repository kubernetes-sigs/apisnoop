import React from 'react'
import { HashRouter, Route } from 'react-router-dom'

import { bindActionCreators } from 'redux'

import { connect } from 'react-redux'

import * as actionCreators from '../actions/actionCreators'
import Main from './Main'

function mapStateToProps (state) {
  return {
    cats: state.cats
  }
}

function mapDispatchToProps (dispatch) {
  return bindActionCreators(actionCreators, dispatch)
}

class App extends React.Component {
  render(){
    return (
    <HashRouter>
      <div>
        <Route exact path='/' component={Main} />
      </div>
    </HashRouter>
    )
  }
}
export default connect(mapStateToProps, mapDispatchToProps)(App)
