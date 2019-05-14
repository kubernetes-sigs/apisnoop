import React from 'react'
import { connect } from 'redux-bundler-react'

import Sunburst from './sunburst'
import SunburstHeader from './sunburst-header'
import TestedToggle from './tested-toggle'

const SunburstContainer = (props) => {
  return (
      <div id='sunburst-container' className='flex flex-column mr4'>
      <SunburstHeader />
      <Sunburst />
      <TestedToggle />
      </div>
  )
}

export default connect(
  SunburstContainer
)
