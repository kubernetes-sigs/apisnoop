import React from 'react'
import { connect } from 'redux-bundler-react'
import {pickBy} from 'lodash'
import SearchBar from './search-bar'
import SearchResults from './search-results'
import ActiveFilter from './active-filter'


function FilterContainer (props) {
  const {
    filter,
    input,
    doUpdateInput,
    doUpdateQuery,
    namesFilteredByQuery,
    filteredByInput,
    queryObject
  } = props

  const filterBoxClasses = 'f6 link dim ba w-20 b--light-blue pv1 dib ml2 ph3 black bg-washed-blue magic-pointer'
  const unsetFilterClasses = 'f6 link dim bw-20 bn pv1 dib ml2 ph3 black bg-light-gray magic-pointer'

  // no filter set
  if (input === undefined && !queryObject[filter]) {
    return(
        <div className='relative mb1 pb1'>
        <p className='ttsc pt0 pb0 f3 flex align-center'>{filter}
        <button className={unsetFilterClasses} onClick={()=>doUpdateInput('')}>Set Regex Pattern</button>
        </p>
        </div>
    )
  }
  // filter set
  if (input === undefined && queryObject[filter]) {
    return(
        <div className='relative  mb1 pb1'>
        <p className='ttsc pt0 pb0 f3 flex align-center'>{filter}
        <button
      className={filterBoxClasses}
      onClick={()=>doUpdateInput(queryObject[filter])}>
        /{queryObject[filter]}/
        </button>
        <button onClick={()=>clearQuery(filter)}
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

  //actively setting a filter
  return (
      <div className='relative mb1 pb1'>
      <SearchBar searchFilter={filter} doUpdateInput={doUpdateInput} input={input} />
      <SearchResults searchFilter={filter} results={filteredByInput} />
      </div>
  )
     function clearQuery (filter) {
       console.log({filter})
       let query = pickBy(queryObject, (v,k)=> k !== filter)
       doUpdateQuery(query)
   }
}
export default connect(
  'doUpdateQuery',
  'selectQueryObject',
  FilterContainer
)
