import React from 'react'
import navHelper from 'internal-nav-helper'
import { connect } from 'redux-bundler-react'

import Header from './header'
import Footer from './footer'
import MainPage from '../pages/main-page'

export default connect(
  () => {
    return (
        <div>
        <Header />
        <MainPage />
        <Footer />
        </div>
    )
  }
)
