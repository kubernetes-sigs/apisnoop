import React from 'react'
import { connect } from 'redux-bundler-react'
import { map } from 'lodash'

function TestItem (props) {
  const {
    testItem,
    queryObject,
    doUpdateQuery } = props

  return (
      <li className='mb3 dim'key='test_{ testItem._id }'>
      <button className='but-no-style link mid-gray magic-pointer' onClick={()=> handleClick(queryObject, testItem._id)} title={'info for ' + testItem.name}>{ testItem.name }</button>
      </li>
  )

  function handleClick (query, id) {
    doUpdateQuery({
      ...query,
      test: id
    })
  }
}

function TestList (props) {
  const {
    activeTest,
    activeTestsIndex,
    queryObject,
    path,
    doUpdateQuery,
  } = props

  if (activeTestsIndex == null) return null
  if (activeTest !== undefined) return null
  return (
      <div id='tests-list' className='tests-section min-vh-100 mt4'>
      <h2 className='f1'>Tests for <span className='fw2'>{path.level} / {path.category} / {path.name} </span></h2>
      <ul className='list pl0'>
      {map(activeTestsIndex, (testItem) => {
        return <TestItem testItem={ testItem } doUpdateQuery={ doUpdateQuery } queryObject={ queryObject } />
      })}
    </ul>
      </div>
  )
}



export default connect(
  'selectActiveTest',
  'selectActiveTestsIndex',
  'selectPath',
  'selectQueryObject',
  'doUpdateQuery',
  TestList
)
