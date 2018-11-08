import React, { Component } from 'react'
import { connect } from 'react-redux'
import { createStructuredSelector } from 'reselect'


import { selectReleaseNamesFromEndpoints, selectIsEndpointsReady, selectPage } from '../selectors'
import { fetchEndpoints } from '../actions/endpoints'
import { doFetchTests } from '../actions/tests'

import Header from './header'
import Footer from './footer'
import ReleasesList from './releases-list.js'

class App extends Component {

  componentDidMount(){
    this.props.fetchEndpoints()
    this.props.fetchTests()
  }

  render(){
    const {
      Page,
      releaseNames,
      endpointsReady
    } = this.props

    return (
      <div id='app'>
        <Header />
        {endpointsReady &&
         <div>
         <ReleasesList
           releases={releaseNames}
         />
        <Page />
        </div>
        }
        {!endpointsReady &&
        <div className='min-vh-80'>
        <h3>Loading...</h3>
        </div>
        }
        <Footer />
      </div>
    )
  }
}

export default connect(
  createStructuredSelector({
    releaseNames: selectReleaseNamesFromEndpoints,
    endpointsReady: selectIsEndpointsReady,
    Page: selectPage
  }),
  {fetchEndpoints,
   fetchTests: doFetchTests
  })(App)
