import React from 'react'
import {connect} from 'redux-bundler-react'

function UseragentSearchResults (props) {
  const useragents = props.useragentsFilteredByInput
  if(useragents == null || useragents.length <= 0) return null
  return (
    <div id='useragent-search-results' className='mt2 mb0'>
      <strong className='f5'>Useragents covered by this regex</strong>
      <ul className="list ph0">
        {useragents.map(useragent => <li key={useragent} className="f6 dib mr2 pa2 mid-gray">{ useragent }</li>)}
      </ul>
    </div>
  )
}

export default connect(
  'selectUseragentsFilteredByInput',
  UseragentSearchResults
)
