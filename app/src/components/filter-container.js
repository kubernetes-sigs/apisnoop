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
      <div className='relative'>
        <p>{filter}: <button onClick={()=>doUpdateInput('')}>Set...</button> </p>
      </div>
    )
  }
  if (input === undefined && queryObject[filter]) {
    return(
        <div className='relative  mb3 pb1'>
        <p className='ttsc pt0 pb0 f3 flex align-center'>{filter}
        <button
      className='f6 link dim ba w-20 b--light-blue pv1 dib ml2 ph3 black bg-washed-blue magic-pointer'
      onClick={()=>doUpdateInput(queryObject[filter])}>
        /{queryObject[filter]}/
        </button>
        <button
          className='f6 link dim w1 bn b--near-black pv1 dib ml0 ph3 black bg-light-blue magic-pointer flex items-center justify-center'
        >
          X
        </button>
        </p>
        <details className='f5 mb1'>
        <summary>See All Matches</summary>
        <ActiveFilter searchFilter={filter} results={namesFilteredByQuery}/>
        </details>
        </div>
    )
  }

  return (
      <form className='relative'>
      <SearchBar searchFilter={filter} doUpdateInput={doUpdateInput} input={input} />
      <SearchResults searchFilter={filter} results={filteredByInput} />
      </form>
  )
}
export default connect(
  'selectQueryObject',
  FilterContainer
)
