import React, { Component } from 'react'
import { connect } from 'react-redux'
import { Route } from 'react-router-dom'
import { createStructuredSelector } from 'reselect'


import { selectReleaseNamesFromEndpoints, selectIsEndpointsReady } from '../selectors'
import { fetchEndpoints } from '../actions/endpoints'
import { doFetchTests } from '../actions/tests'
import { changeActiveRoute } from '../actions/routes'

import Header from './header'
import Footer from './footer'
import ReleasesList from './releases-list.js'
import MainPage from '../pages/main-page.js'

class App extends Component {
  componentDidMount(){
    this.props.fetchEndpoints()
    this.props.doFetchTests()
  }

  render(){
    const {releaseNames, endpointsReady, changeActiveRoute } = this.props

    return (
      <div id='app'>
        <Header />
        {endpointsReady &&
         <ReleasesList
           releases={releaseNames}
           selected='master'
           changeActiveRoute={changeActiveRoute}
         /> }
  <Route exact path='/' component={MainPage} />
  <Route exact path='/:release' component={MainPage} />
        <Footer />
      </div>
    )
  }
}

export default connect(
  createStructuredSelector({
    releaseNames: selectReleaseNamesFromEndpoints,
    endpointsReady: selectIsEndpointsReady
  }),
  {fetchEndpoints,
   doFetchTests,
   changeActiveRoute})(App)
