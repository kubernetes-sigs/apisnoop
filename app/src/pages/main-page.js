import React from 'react'
import { connect } from 'redux-bundler-react'

// import FilterContainer from '../components/filter-container' # a regex filter for endpoints.
import UseragentsSearchContainer from '../components/useragents-search-container'
import TestTagsSearchContainer from '../components/test-tags-search-container'
import TestsSearchContainer from '../components/tests-search-container'
import SunburstAndSummary from '../components/sunburst-and-summary'
import TestsContainer from '../components/tests-container'
import BucketList from '../components/bucket-list'
import FiltersContainer from '../components/filters-container'
// import ActiveTestSequence from '../components/active-test-sequence'

function MainPage (props) {
    return (
        <main id='main-splash' className='min-vh-80 pa4 ma4 flex flex-column'>
        {/*<FilterContainer />*/}
        <BucketList />
        <FiltersContainer />
        <SunburstAndSummary />
        <TestsContainer />
        {/* <ActiveTestSequence /> */}
      </main>
    )
}

export default connect(
  MainPage
)
