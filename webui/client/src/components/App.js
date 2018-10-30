import React, { Component } from 'react'
import { connect } from 'react-redux'

import { Route } from 'react-router-dom'

import Header from './header'
import Footer from './footer'
import MainPage from '../pages/main-page.js'

class App extends Component {
  constructor (props) {
    super(props)
  }

  componentDidMount(){
    this.props.fetchReleaseNames()
  }

  render(){
    return (
      <div id='app'>
        <Header />
        {/* <Route exact path='/' component={MainPage} /> */}
        <Footer />
      </div>
    )
  }
}

function mapStateToProps (state) {
  return {
  release_names: state.releasesStore.release_names
  }
}

export default connect(mapStateToProps, {feetchReleaseNames})(App)
