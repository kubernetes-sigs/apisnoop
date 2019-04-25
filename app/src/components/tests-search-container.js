import React from 'react'
import { connect } from 'redux-bundler-react'
import SearchBar from './search-bar'
import SearchResults from './search-results'
import ActiveFilter from './active-filter'


function TestsSearchContainer (props) {
  const {
    doUpdateTestsInput,
    namesTestsFilteredByQuery,
    testsInput,
    testsFilteredByInput
  } = props

  return (
    <div id='tests-search'>
      <h2>Filter by test names</h2>
      <SearchBar searchFilter={'tests_filter'} doUpdateInput={doUpdateTestsInput} input={testsInput} />
      <SearchResults searchFilter={'tests_filter'} results={testsFilteredByInput} />
      <ActiveFilter searchFilter={'tests_filter'} results={namesTestsFilteredByQuery}/>
    </div>
  )
}
export default connect(
  'doUpdateTestsInput',
  'selectTestsInput',
  'selectTestsFilteredByInput',
  'selectNamesTestsFilteredByQuery',
  TestsSearchContainer
)
