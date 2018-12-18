import React from 'react'
import { connect } from 'redux-bundler-react'
import { map, omit } from 'lodash'

function ActiveTestSequence (props) {
  const {
    activeTest,
    queryObject,
    doUpdateQuery
  } = props

  if (activeTest== null) return null

  return (
      <div className="ph3 mt4">
      <h3>{ activeTest.name }</h3>
      <button onClick={handleClick}>Back</button>
      <ul className='list'>
      {map(activeTest.sequence, (step) => {
        return <SequenceStep rawStep={ step }  />
      })}
    </ul>
      </div>
  )

  function handleClick () {
    var queryWithoutTest = omit(queryObject, 'test')
    doUpdateQuery(queryWithoutTest)
  }
}

function SequenceStep (props) {
  const {
    rawStep
  } = props

  var step = {
    timeStamp: rawStep[0],
    level: rawStep[1],
    category: rawStep[2],
    method: rawStep[3],
    endpoint: rawStep[4]
  }

  return (
      <li className='dib' key='test_{ testItem._id }'>
      { step.Timestamp} / {step.level} / {step.category} / {step.endpoint}
      </li>
  )
}


export default connect(
  'selectActiveTest',
  'selectQueryObject',
  'doUpdateQuery',
  ActiveTestSequence
)
