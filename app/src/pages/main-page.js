import React from 'react'
import { connect } from 'redux-bundler-react'

import SunburstAndSummary from '../components/sunburst-and-summary'
import TestsContainer from '../components/tests-container'
import BucketList from '../components/bucket-list'
import FiltersContainer from '../components/filters-container'

function MainPage (props) {
    return (
        <main id='main-splash' className='min-vh-80 pa4 ma4 flex flex-column'>
        <BucketList />
        <FiltersContainer />
        <SunburstAndSummary />
        <TestsContainer />
      </main>
    )
}

export default connect(
  MainPage
)
