import React from 'react'
import navHelper from 'internal-nav-helper'
import { connect } from 'redux-bundler-react'

import Header from './header'
import Footer from './footer'
import BucketList from './bucket-list'
import MainPage from '../pages/main-page'

function App (props) {
  const {
    doUpdateUrl,
    queryObject
  } = props

  if (queryObject && queryObject.bucket) {
    return (
        <div onClick={navHelper(doUpdateUrl)}>
        <Header />
       <MainPage />
        <Footer />
        </div>
    )
  } else {
    return(
        <div onClick={navHelper(doUpdateUrl)}>
        <Header />
        <BucketList />
        <Footer />
        </div>
    )
  }
}

export default connect(
 'doUpdateUrl',
 'selectQueryObject',
  App
)
