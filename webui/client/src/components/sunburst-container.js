import React from 'react'
import { connect } from 'redux-bundler-react'

import Sunburst from './sunburst'

const SunburstContainer = (props) => {
  const {
    currentReleaseName,
    focusedPath
  } = props
  return (
      <div id='sunburst-segment' className='pa4 flex'>
      <div id='sunburst'>
      <h2>{ currentReleaseName }</h2>
      <p>{ focusedPath }</p>
      <Sunburst />
      </div>
      </div>
  )
}

export default connect(
  'selectCurrentReleaseName',
  'selectFocusedPath',
  SunburstContainer
)
