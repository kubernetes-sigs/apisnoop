import React from 'react'
import { connect } from 'redux-bundler-react'

import SunburstContainer from './sunburst-container'
import SummaryContainer from './summary-container'

const SunburstAndSummary = (props) => {
  return (
      <section
        id='summary-and-sunburst'
        className='flex'
      >
      <SunburstContainer />
      <SummaryContainer />
    </section>
  )
}

export default connect(
  SunburstAndSummary
)
