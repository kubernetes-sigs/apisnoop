import React from 'react'
import { connect } from 'redux-bundler-react'

import Sunburst from './sunburst'
import SunburstHeader from './sunburst-header'

const SunburstContainer = (props) => {
  const {
    focusedPath
  } = props
  return (
      <div id='sunburst-container' className='pa5 flex flex-column'>
      <SunburstHeader />
      <Sunburst />
      <p>{ focusedPath }</p>
      </div>
  )
}

export default connect(
  'selectFocusedPath',
  SunburstContainer
)
