import React from 'react'
import EndpointHitList from './endpoint-hit-list'

export default function TestsContainer ({activeTest, chartLocked, chooseActiveTest, closeActiveTest, endpointTests, interiorLabel, isTestsReady }) {

  return (
      <div id='test-container' className="cf">

     {(interiorLabel && interiorLabel.test_tags && !chartLocked) &&
     <div id='test-tags'>
      <h2>Test Tags</h2>
        <ul className='list ph3 ph5-ns pv4'>
          {displayTestTags(interiorLabel.test_tags)}
        </ul>
      </div>
     }

    {(interiorLabel && interiorLabel.test_tags && chartLocked && !activeTest.name) &&
      <div id='tests-list'>
      <h2>Tests</h2>
      <ul className='list ph3 ph5-ns pv4'>{listTests(endpointTests)}</ul>
      </div>
    }

    {(isTestsReady && endpointTests.length > 0 && activeTest) &&
     <div id='hit-list'>
      <h2>Test:</h2>
      <EndpointHitList activeTest={activeTest} closeActiveTest={closeActiveTest}/>
     </div>
    }
      </div>
  )

 function displayTestTags (testTags) {
   return testTags.map(testTag => {
     return (<li key={testTag} className='dib mr1 mb1' >
             <p className='f7 f6-ns b db pa0'>
             {testTag}
             </p>
             </li>)
   })
 }

  function listTests (endpointTests) {
    return endpointTests.map(test => {
      var testKey = 'test_' + endpointTests.indexOf(test)
      return <li key={testKey}
               onClick={() =>handleClick(test)}
      className='f6 f5-ns b db pa2 link dim dark-gray ba b--black-20 magic-pointer'
             >{test}</li>
    })
  }

  function handleClick (test) {
    chooseActiveTest(test)
  }
}
