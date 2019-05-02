import React from 'react'
import { connect } from 'redux-bundler-react'
import { isEmpty } from 'lodash'

import TestTagsList from './test-tags-list'
import EndpointSummary from './endpoint-summary'

const SummaryContainer = (props) => {
  const {
    activeEndpoint,
    activeLocation,
    activeStats
  } = props

  if (activeStats == null) return null
  if (isEmpty(activeEndpoint)) {
    return (
      <div id='summary-container'>
        <p>{activeLocation.level}{activeLocation.category}</p>
        <p className='f3 mt0 mb3 ttsc'>{ activeStats.labelX }</p>
        <p className='f4 mt0 mb3 i fw2'>{ activeStats.labelY }</p>
      </div>
    )
  } else {
    return (
      <div id='summary-container'>
        <EndpointSummary endpoint={activeEndpoint}/>
        <TestTagsList />
      </div>
    )
  }
}

export default connect(
  'selectActiveEndpoint',
  'selectActiveLocation',
  'selectActiveStats',
  'selectCategoryColours',
  'selectLevelColours',
  SummaryContainer
)
