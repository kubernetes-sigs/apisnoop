import React, { Component } from 'react'
import { connect } from 'react-redux'

import { Route } from 'react-router-dom'

import { fetchReleaseNames} from '../actions/releases'
import { fetchEndpoints } from '../actions/endpoints'

import Header from './header'
import Footer from './footer'
import ReleasesList from './releases-list.js'
import MainPage from '../pages/main-page.js'

class App extends Component {
  componentDidMount(){
    this.props.fetchReleaseNames()
    this.props.fetchEndpoints()
  }

  render(){
    return (
      <div id='app'>
        <Header />
        {this.props.release_names && <ReleasesList releases={this.props.release_names} selected='master' /> }
        <Route exact path='/' component={MainPage} />
        <Route exact path='/:release' component={MainPage} />
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

export default connect(mapStateToProps, {fetchReleaseNames, fetchEndpoints})(App)
