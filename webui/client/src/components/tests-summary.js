import React from 'react'
import { connect } from 'redux-bundler-react'

const TestsSummary = (props) => {
  const {
    activeTestsNumber
  } = props

  if (activeTestsNumber == null) return null

  if (activeTestsNumber > 0) {
    return(
        <p>Covered by <span className="green b">{activeTestsNumber}</span> tests.</p>
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
