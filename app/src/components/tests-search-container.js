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
    testsFilteredByInput,
    queryObject
  } = props

  if (testsInput === undefined && !queryObject.tests) {
    return(
        <div>
        <p>by tests: <button onClick={()=>doUpdateTestsInput('')}>Set...</button> </p>
        </div>
    )
  }
  if (testsInput === undefined && queryObject.tests) {
    return(
        <div>
        <p>by tests:
        <button
      className='f6 link dim ba b--black pv1 dib ml2 ph3 black bg-washed-blue magic-pointer'
      onClick={()=>doUpdateTestsInput(queryObject.tests)}>
        /{queryObject.tests}/
        </button>
        </p>
        <ActiveFilter searchFilter={'tests'} results={namesTestsFilteredByQuery}/>
        </div>
    )
  }

  return (
      <form id='test-tags-search'>
      <SearchBar searchFilter={'tests'} doUpdateInput={doUpdateTestsInput} input={testsInput} />
      <SearchResults searchFilter={'tests'} results={testsFilteredByInput} />
      </form>
  )
}
export default connect(
  'doUpdateTestsInput',
  'selectQueryObject',
  'selectTestsInput',
  'selectTestsFilteredByInput',
  'selectNamesTestsFilteredByQuery',
  TestsSearchContainer
)
