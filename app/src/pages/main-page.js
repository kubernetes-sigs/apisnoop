import React from 'react'
import { connect } from 'redux-bundler-react'

// import FilterContainer from '../components/filter-container' # a regex filter for endpoints.
import UseragentsSearchContainer from '../components/useragents-search-container'
import TestTagsSearchContainer from '../components/test-tags-search-container'
import SunburstAndSummary from '../components/sunburst-and-summary'
import TestsContainer from '../components/tests-container'
// import ActiveTestSequence from '../components/active-test-sequence'

function MainPage (props) {
  const {
    endpointsResourceShouldUpdate,
    metadataResourceIsStale} = props

  if (endpointsResourceShouldUpdate || metadataResourceIsStale) {
    return (
        <main id='main-splash' className='min-vh-80 pa4 ma4 flex flex-column'>
        <h2>loading...</h2>
      </main>

    )

  } else {
    return (
        <main id='main-splash' className='min-vh-80 pa4 ma4 flex flex-column'>
        {/*<FilterContainer />*/}
        <UseragentsSearchContainer />
        <TestTagsSearchContainer />
        <SunburstAndSummary />
        <TestsContainer />
        {/* <ActiveTestSequence /> */}
      </main>
    )
  }
}

export default connect(
  'selectMetadataResourceIsStale',
  'selectEndpointsResourceShouldUpdate',
  MainPage
)
