import React from 'react'
import EndpointHitList from './endpoint-hit-list'

export default function TestsContainer ({activeTest, chooseActiveTest, endpointTests}) {

  return (
      <div id='test-container' className="cf">
      <div className="fl w-100 w-50-ns bg-near-white tc pa3 pa5-ns">
          <h2>Tests</h2>
      <ul className='list ph3 ph5-ns pv4'>{listTests(endpointTests)}</ul>
        </div>
        <div className="fl w-100 w-50-ns bg-light-gray tc">
      <EndpointHitList activeTest={activeTest}/>
        </div>
      </div>
  )

  function listTests (endpointTests) {
    return endpointTests.map(test => {
      var testKey = 'test_' + endpointTests.indexOf(test)
      return <li key={testKey}
               onClick={() =>handleClick(test)}
      className='f6 f5-ns b db pa2 link dim dark-gray ba b--black-20'
             >{test}</li>
    })
  }

  function handleClick (test) {
    chooseActiveTest(test)
  }
}
