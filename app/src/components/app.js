import React from 'react'
import navHelper from 'internal-nav-helper'
import { connect } from 'redux-bundler-react'

import Footer from './footer'
import MainPage from '../pages/main-page'

function App (props) {
  const {
    doUpdateUrl,
  } = props
    return (
        <div onClick={navHelper(doUpdateUrl)} className='relative'>
       <MainPage />
        <Footer />
        </div>
    )
}

export default connect(
 'doUpdateUrl',
  App
)
