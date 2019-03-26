import React from 'react'
import {connect} from 'redux-bundler-react'

function UseragentSearchResults (props) {
  const useragents = props.useragentsFilteredByInput
  if(useragents == null || useragents.length <= 0) return null
  return (
      <ul>
        {useragents.map(useragent => <li>{ useragent }</li>)}
      </ul>
  )
}

export default connect(
  'selectUseragentsFilteredByInput',
  UseragentSearchResults
)
