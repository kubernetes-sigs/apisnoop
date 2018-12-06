import React from 'react'
import navHelper from 'internal-nav-helper'
import { connect } from 'redux-bundler-react'

import Header from './header'
import Footer from './footer'

export default connect(
  'doUpdateUrl',
  'selectRoute',
  ({ doUpdateUrl, route }) => {
    const CurrentPage = route
    return (
      <div onClick={navHelper(doUpdateUrl)}>
        <Header />
        <CurrentPage />
        <Footer />
      </div>
    )
  }
)
