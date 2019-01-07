import React from 'react'
import { connect } from 'redux-bundler-react'
import TestTagsList from './test-tags-list'

const TestsSummary = (props) => {
  const {
    activeTestsNumber
  } = props

  if (activeTestsNumber == null) return null

  if (activeTestsNumber > 0) {
    return(
        <div id='tests-summary'>
        <p>Covered by <span className="green b">{activeTestsNumber}</span> tests.</p>
        <TestTagsList />
        </div>
    )
  }

  if (activeTestsNumber === 0) {
    return(
        <p>Untested.</p>
    )
  }

}

export default connect(
  'selectActiveTestsNumber',
  TestsSummary
)
