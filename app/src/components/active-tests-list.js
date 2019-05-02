import React from 'react'
import { connect } from 'redux-bundler-react'
import { isEmpty, map } from 'lodash'

function TestItem (props) {
  const {
    testItem,
    queryObject,
    doUpdateQuery } = props

  return (
      <li className='mb3 dim'key='test_{ testItem._id }'>
      <button className='tl but-no-style link mid-gray magic-pointer' onClick={()=> handleClick(queryObject, testItem)} title={'info for ' + testItem}>{ testItem }</button>
      </li>
  )

  function handleClick (query, id) {
    doUpdateQuery({
      ...query,
      test: testItem
    })
  }
}

function TestList (props) {
  const {
    activeEndpoint,
    activeTestsIndex,
    queryObject,
    doUpdateQuery,
  } = props

  if (activeTestsIndex == null || isEmpty(activeEndpoint)) return null
  return (
      <div id='tests-list' className='tests-section min-vh-100 mt4 w-75'>
      <h2 className='f1'>Tests for <span className='fw2'>{activeEndpoint.level} / {activeEndpoint.category} / {activeEndpoint.operationId} </span></h2>
      <ul className='list pl0'>
      {map(activeTestsIndex, (testItem, i) => {
        return <TestItem testItem={ testItem } doUpdateQuery={ doUpdateQuery } queryObject={ queryObject } key={'test_' + i} />
      })}
    </ul>
      </div>
  )
}



export default connect(
  'selectActiveEndpoint',
  'selectActiveTestsIndex',
  'selectQueryObject',
  'doUpdateQuery',
  TestList
)
