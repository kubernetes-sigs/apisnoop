import React from 'react'
import {connect} from 'redux-bundler-react'

function SearchResults (props) {
  const {results, searchFilter } = props
  if(results == null || results.length <= 0) return null
  return (
    <div id={searchFilter.concat('-search-results')} className='mt2 mb0'>
      <strong className='f5'>{searchFilter} covered by this regex</strong>
      <ul className="list ph0 scrollbox">
        {results.map(result => <li key={result} className="f6 dib mr2 pa2 mid-gray">{ result }</li>)}
      </ul>
    </div>
  )
}

export default connect(
  SearchResults
)
