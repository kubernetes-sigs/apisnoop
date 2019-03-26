import React from 'react'
import { connect } from 'redux-bundler-react'
import UseragentSearchBar from './useragent-search-bar'
import UseragentSearchResults from './useragent-search-results'

function UseragentSearchContainer (props) {
  return (
    <div id='useragent-search'>
      <UseragentSearchBar />
      <UseragentSearchResults />
    </div>
  )
}
export default connect(
  UseragentSearchContainer
)
