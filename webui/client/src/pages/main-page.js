import React from 'react'
import { connect } from 'redux-bundler-react'

import ReleasesList from '../components/releases-list'
import SunburstContainer from '../components/sunburst-container'

function MainPage () {
  return (
      <main id='main-splash' className='min-vh-80 pa4 flex'>
      <h2>You are doing a good job.</h2>
      <ReleasesList />
      <SunburstContainer />
      </main>
  )
}

export default connect(
  MainPage
)
