import React from 'react'
import { connect } from 'redux-bundler-react'

import TestsSummary from './tests-summary'

const SummaryContainer = (props) => {
  const {
    currentReleaseShouldUpdate,
    activeEndpoint,
    categoryColours,
    levelColours,
    queryObject
  } = props

  const level = queryObject.level || ''
  const category = queryObject.category || ''
  const name = queryObject.name || ''
  const description = (activeEndpoint == null) ? '' : activeEndpoint.description

  if (currentReleaseShouldUpdate == null || currentReleaseShouldUpdate === true) return null
  return(
      <div id='summary-container' className=''>
      <p className='f2 mt1 pt4 mb3 fw3'>
      <span style={{color: levelColours[level]}}>{ level }</span>
      <span style={{color: categoryColours['category.' + category]}}>{ category }</span>
      </p>
      <p className='f3 mt0 mb3 ttsc'>{ name }</p>
      <p className='f4 mt0 mb3 i fw2'>{ description }</p>
      <TestsSummary />
      </div>
  )
}
export default connect(
  'selectActiveEndpoint',
  'selectCurrentReleaseShouldUpdate',
  'selectCategoryColours',
  'selectLevelColours',
  'selectPath',
  'selectQueryObject',
  SummaryContainer
)
