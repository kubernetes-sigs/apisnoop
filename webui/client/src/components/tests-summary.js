import React from 'react'
import { connect } from 'redux-bundler-react'
import TestTagsList from './test-tags-list'

const TestsSummary = (props) => {
  const {
    activeEndpoint,
    activeTestsNumber
  } = props

  if (activeTestsNumber == null || activeTestsNumber === 0) return null
  if (activeEndpoint == null) return null
  if (!activeEndpoint.isTested) {
    return(<p>Untested.</p>)
  } else {
    return(
        <div id='tests-summary'>
        <p>Covered by <span className="green b">{activeTestsNumber}</span> tests.</p>
        <TestTagsList />
        <button onClick={handleClick} className='but-no-style link magic-pointer blue'>Go To Tests</button>
        </div>
    )
  }
  function handleClick () {
    var tests = document.querySelector('.tests-section')
    if (tests == null) return null
    tests.scrollIntoView()
  }
}

export default connect(
  'selectActiveEndpoint',
  'selectActiveTestsNumber',
  TestsSummary
)
