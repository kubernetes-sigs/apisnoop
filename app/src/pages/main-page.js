import React from 'react'
import { connect } from 'redux-bundler-react'

// import FilterContainer from '../components/filter-container' # a regex filter for endpoints.
import Sunburst from '../components/sunburst-container'
// import UseragentSearchContainer from '../components/useragent-search-container'
import SunburstAndSummary from '../components/sunburst-and-summary'
// import ActiveTestsList from '../components/active-tests-list'
// import ActiveTestSequence from '../components/active-test-sequence'

function MainPage () {
  return (
    <main id='main-splash' className='min-vh-80 pa4 ma4 flex flex-column'>
      <h1>HELLO YOU ARE DOING GOODLY</h1>
      {/*<FilterContainer />*/}
      {/* <UseragentSearchContainer /> */}
      <SunburstAndSummary />
      {/* <ActiveTestsList /> */}
      {/* <ActiveTestSequence /> */}
    </main>
  )
}

export default connect(
  MainPage
)
