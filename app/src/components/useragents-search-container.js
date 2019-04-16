import React from 'react'
import { connect } from 'redux-bundler-react'
import SearchBar from './search-bar'
import SearchResults from './search-results'
import ActiveFilter from './active-filter'


function UseragentsSearchContainer (props) {
  const {
    doUpdateUseragentsInput,
    namesUseragentsFilteredByQuery,
    useragentsInput,
    useragentsFilteredByInput
  } = props

  return (
    <div id='test-tags-search'>
      <h2>Filter by user-agents</h2>
      <SearchBar searchFilter={'useragents'} doUpdateInput={doUpdateUseragentsInput} input={useragentsInput} />
      <SearchResults searchFilter={'useragents'} results={useragentsFilteredByInput} />
      <ActiveFilter searchFilter={'useragents'} results={namesUseragentsFilteredByQuery}/>
    </div>
  )
}
export default connect(
  'doUpdateUseragentsInput',
  'selectUseragentsInput',
  'selectUseragentsFilteredByInput',
  'selectNamesUseragentsFilteredByQuery',
  UseragentsSearchContainer
)
