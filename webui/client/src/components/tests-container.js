import React from 'react'
import EndpointHitList from './endpoint-hit-list'

export default function TestsContainer ({tests, activeTest, chooseActiveTest}) {
  const testNames = Object.keys(tests)

  return (
      <div id='test-container' class="cf">
      <div className="fl w-100 w-50-ns bg-near-white tc pa3 pa5-ns">
          <h2>Tests</h2>
      <ul className='list pl0 measure center'>{listTests(testNames)}</ul>
        </div>
        <div className="fl w-100 w-50-ns bg-light-gray tc">
      <EndpointHitList test={activeTest}/>
        </div>
      </div>
  )

  function listTests (testNames) {
    return testNames.map(testName => {
      var test = tests[testName]
      return <li key={test.id}
               onClick={() =>handleClick(test)}
               className='lh-copy pv3 ba bl-0 bt-0 br-0 b--dotted b--black-30'
             >{test.name}</li>
    })
  }

  function handleClick (test) {
    chooseActiveTest(test)
  }
}
