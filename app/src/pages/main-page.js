import React from 'react'
import { connect } from 'redux-bundler-react'

import SunburstAndSummary from '../components/sunburst-and-summary'
import TestsContainer from '../components/tests-container'
import Sidebar from '../components/sidebar'

function MainPage (props) {
    return (
        <main id='main-splash' className='min-vh-80 grid grid-bar-l'>
        <Sidebar />
        <div className='pa4 overflow-x-scroll'>
        <SunburstAndSummary />
        <TestsContainer />
        </div>
      </main>
    )
}

export default connect(
  MainPage
)
