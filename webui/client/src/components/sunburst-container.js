import React from 'react'
import { connect } from 'redux-bundler-react'

import Sunburst from './sunburst'

const SunburstContainer = (props) => {
  const {
    currentReleaseName
  } = props
  return (
      <div id='sunburst-segment' className='pa4 flex'>
      <div id='sunburst'>
      <h2>{currentReleaseName}</h2>
      <Sunburst />
      </div>
      </div>
  )
}

export default connect(
  'selectCurrentReleaseName',
  SunburstContainer
)
