import React from 'react'
import { connect } from 'redux-bundler-react'
import SearchBar from './search-bar'
import SearchResults from './search-results'
import ActiveFilter from './active-filter'


function FilterContainer (props) {
  const {
    filter,
    input,
    doUpdateInput,
    namesFilteredByQuery,
    filteredByInput,
    queryObject
  } = props

  if (input === undefined && !queryObject[filter]) {
    return(
        <div>
        <p>by {filter}: <button onClick={()=>doUpdateInput('')}>Set...</button> </p>
        </div>
    )
  }
  if (input === undefined && queryObject[filter]) {
    return(
        <div>
        <p>by {filter}:
        <button
      className='f6 link dim ba b--black pv1 dib ml2 ph3 black bg-washed-blue magic-pointer'
      onClick={()=>doUpdateInput(queryObject[filter])}>
        /{queryObject[filter]}/
        </button>
        </p>
        <ActiveFilter searchFilter={filter} results={namesFilteredByQuery}/>
        </div>
    )
  }

  return (
      <form>
      <SearchBar searchFilter={filter} doUpdateInput={doUpdateInput} input={input} />
      <SearchResults searchFilter={filter} results={filteredByInput} />
      </form>
  )
}
export default connect(
  'selectQueryObject',
  FilterContainer
)
