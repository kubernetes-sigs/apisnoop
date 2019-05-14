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
    ratio,
    queryObject
  } = props

  const filterContainerClasses = 'relative mb2 pa1 mt0 w-100'
  const filterBoxClasses = 'f6 link dim ba w-20 b--light-blue pv1 dib w-100 black bg-washed-blue magic-pointer'
  const unsetFilterClasses = 'f6 link w-100 dim bw-20 bn pv1 dib ml0 ph3 mid-gray bg-light-gray magic-pointer'

  // no filter set
  if (input === undefined && !queryObject[filter]) {
    return(
        <div className={filterContainerClasses}>
        <p className='ttsc pt0 pb0 mb2 f6'>{filter.replace('_',' ')}</p>
        <button className={unsetFilterClasses} onClick={()=>doUpdateInput('')}>Set Regex Pattern</button>
        </div>
    )
  }
  // filter set
  if (input === undefined && queryObject[filter]) {
    return(
        <div className={filterContainerClasses}>
        <p className='ttsc pt0 pb0 mb2 f6 flex align-center flex-column'>{filter.replace('_', ' ')}
        <span className='flex pl0 ml0'>
        <button className={filterBoxClasses} onClick={()=>doUpdateInput(queryObject[filter])}>
        /{queryObject[filter]}/
        </button>
        <button onClick={()=>clearQuery(filter)}
      className='border-none f6 link dim w1 bt bb b--light-blue pv1 shadow-0 dib ml0 ph3 black bg-light-blue magic-pointer flex items-center justify-center' >
        X
      </button>
      </span>
        </p>
        <em className='f6 mb1'>Pattern matches {ratio.hitByQuery} of {ratio.total} {filter.replace('_',' ')}</em>
        <details className='f5 mb1 w-100 relative'>
        <summary>See All Matches</summary>
        <ActiveFilter searchFilter={filter} results={namesFilteredByQuery}/>
        </details>
        </div>
    )
  }

  //actively setting a filter
  return (
      <div className={filterContainerClasses}>
      <SearchBar searchFilter={filter} doUpdateInput={doUpdateInput} input={input} />
      <SearchResults searchFilter={filter} results={filteredByInput} />
      </div>
  )
     function clearQuery (filter) {
       let query = pickBy(queryObject, (v,k)=> k !== filter)
       doUpdateQuery(query)
   }
}
export default connect(
  'doUpdateQuery',
  'selectQueryObject',
  FilterContainer
)
