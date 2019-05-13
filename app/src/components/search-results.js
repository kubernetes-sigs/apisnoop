import React from 'react'
import {connect} from 'redux-bundler-react'

function SearchResults (props) {
  const {results, searchFilter } = props
  if(results == null || results.length <= 0) return null
  return (
    <div id={searchFilter.concat('-search-results')} className='mt0 mb0 w-100'>
      <ul className="list ph0 pv0 absolute bg-white z-999 w-100 shadow-1">
        {results.map(result => <li key={result} className="f6 dib mr2 pa2 mid-gray">{ result }</li>)}
      </ul>
    </div>
  )
}

export default connect(
  SearchResults
)
