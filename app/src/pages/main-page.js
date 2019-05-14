import React from 'react'
import { connect } from 'redux-bundler-react'

import SunburstAndSummary from '../components/sunburst-and-summary'
import TestsContainer from '../components/tests-container'
import Sidebar from '../components/sidebar'
import EndpointsList from '../components/endpoints-list'

function MainPage (props) {
  const {
    zoom
  } = props
  console.log({zoom})

    return (
        <main id='main-splash' className='min-vh-80 grid grid-bar-l'>
        <Sidebar />
        <div className='pt3 pl5 pb4 pr4 overflow-x-scroll'>
        <SunburstAndSummary />
        {(!zoom || zoom.depth !== 'operationId')
         ? <EndpointsList />
         : <TestsContainer />
        }
        </div>
      </main>
    )
}

export default connect(
  'selectZoom',
  MainPage
)
