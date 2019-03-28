import React from 'react'
import navHelper from 'internal-nav-helper'
import { connect } from 'redux-bundler-react'

import Header from './header'
import Footer from './footer'

export default connect(
  'selectMasterRelease',
  'selectRouteInfo',
  'doUpdateUrl',
  'selectRoute',
  ({ masterRelease, routeInfo, doUpdateUrl, doReplaceUrl, route }) => {
    const CurrentPage = route
    if (masterRelease && routeInfo.url === '/') {
      doUpdateUrl(`/${masterRelease.name}`)
      return null
    }
    return (
        <div onClick={navHelper(doUpdateUrl)}>
        <Header />
        <CurrentPage />
        <Footer />
        </div>
    )
  }
)
