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
        <button onClick={handleClick} className='but-no-style link magic-pointer blue'>Go To Tests</button>
        </div>
    )
  function handleClick () {
    var tests = document.querySelector('#tests-list')
    console.log('tests', tests)
    tests.scrollIntoView()
  }
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
