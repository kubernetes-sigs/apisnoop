import React from 'react'
import { connect } from 'redux-bundler-react'

import TestTagsList from './test-tags-list'

const SummaryContainer = (props) => {
  const {
    activeLocation,
    activeStats,
  } = props

  if (activeStats == null) return null

  return(
      <div id='summary-container' className=''>
      <p>{activeLocation.level}{activeLocation.category}{activeLocation.operationId}</p>
      <p className='f3 mt0 mb3 ttsc'>{ activeStats.labelX }</p>
      <p className='f4 mt0 mb3 i fw2'>{ activeStats.labelY }</p>
      <TestTagsList />
      </div>
  )
}
export default connect(
  'selectActiveLocation',
  'selectActiveStats',
  'selectCategoryColours',
  'selectLevelColours',
  SummaryContainer
)
