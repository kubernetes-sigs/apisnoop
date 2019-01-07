import React from 'react'
import { connect } from 'redux-bundler-react'

import Sunburst from './sunburst'
import SunburstHeader from './sunburst-header'

const SunburstContainer = (props) => {
  return (
      <div id='sunburst-container' className='pa5 flex flex-column'>
      <SunburstHeader />
      <Sunburst />
      </div>
  )
}

export default connect(
  SunburstContainer
)
