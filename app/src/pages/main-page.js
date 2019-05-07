import React from 'react'
import { connect } from 'redux-bundler-react'

import SunburstAndSummary from '../components/sunburst-and-summary'
import TestsContainer from '../components/tests-container'
import BucketList from '../components/bucket-list'
import FiltersContainer from '../components/filters-container'
import Sidebar from '../components/sidebar'

function MainPage (props) {
    return (
        <main id='main-splash' className='min-vh-80 grid grid-gap-1 grid-bar-l'>
        <Sidebar />
        <div className='pl3'>
        <SunburstAndSummary />
        <TestsContainer />
        </div>
      </main>
    )
}

export default connect(
  MainPage
)
