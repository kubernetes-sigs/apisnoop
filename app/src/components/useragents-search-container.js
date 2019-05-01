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
    useragentsFilteredByInput,
    queryObject
  } = props

  if (useragentsInput === undefined && !queryObject.useragents) {
    return(
        <div className='inactive-filter'>
        <p>by useragents: <button onClick={()=>doUpdateUseragentsInput('')}>Set...</button> </p>
        </div>
    )
  }
  if (useragentsInput === undefined && queryObject.useragents) {
    return(
        <div className='inactive-filter'>
        <p>by useragents:
        <button
      className='f6 link dim ba b--black pv1 dib ml2 ph3 black bg-washed-blue magic-pointer'
      onClick={()=>doUpdateUseragentsInput(queryObject.useragents)}>
        /{queryObject.useragents}/
        </button>
        </p>
        <ActiveFilter searchFilter={'useragents'} results={namesUseragentsFilteredByQuery}/>
        </div>
    )
  }

  return (
      <form id='test-tags-search'>
      <SearchBar searchFilter={'useragents'} doUpdateInput={doUpdateUseragentsInput} input={useragentsInput} />
      <SearchResults searchFilter={'useragents'} results={useragentsFilteredByInput} />
      </form>
  )
}
export default connect(
  'doUpdateUseragentsInput',
  'selectQueryObject',
  'selectUseragentsInput',
  'selectUseragentsFilteredByInput',
  'selectNamesUseragentsFilteredByQuery',
  UseragentsSearchContainer
)
