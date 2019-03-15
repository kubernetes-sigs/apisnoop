import React from 'react'
import { connect } from 'redux-bundler-react'

import Sunburst from './sunburst'
import SunburstHeader from './sunburst-header'

const SunburstContainer = (props) => {
  return (
      <div id='sunburst-container' className='flex flex-column mr4'>
      <SunburstHeader />
      <Sunburst />
      </div>
  )
}

export default connect(
  SunburstContainer
)
