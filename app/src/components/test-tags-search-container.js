import React from 'react'
import { connect } from 'redux-bundler-react'
import SearchBar from './search-bar'
import SearchResults from './search-results'
import ActiveFilter from './active-filter'


function TestTagsSearchContainer (props) {
  const {
    doUpdateTestTagsInput,
    namesTestTagsFilteredByQuery,
    testTagsInput,
    testTagsFilteredByInput
  } = props

  return (
    <div id='test-tags-search'>
      <h2>Filter by test tags</h2>
      <SearchBar searchFilter={'test_tags'} doUpdateInput={doUpdateTestTagsInput} input={testTagsInput} />
      <SearchResults searchFilter={'test_tags'} results={testTagsFilteredByInput} />
      <ActiveFilter searchFilter={'test_tags'} results={namesTestTagsFilteredByQuery}/>
    </div>
  )
}
export default connect(
  'doUpdateTestTagsInput',
  'selectTestTagsInput',
  'selectTestTagsFilteredByInput',
  'selectNamesTestTagsFilteredByQuery',
  TestTagsSearchContainer
)
