import React from 'react'
import {getNavHelper} from 'internal-nav-helper'
import { connect } from 'redux-bundler-react'

import Header from './header'
import Footer from './footer'
import MainPage from '../pages/main-page'

export default connect(
 'doUpdateUrl',
  ({doUpdateUrl}) => {
    return (
        <div onClick={getNavHelper(doUpdateUrl)}>
        <Header />
        <MainPage />
        <Footer />
        </div>
    )
  }
)
