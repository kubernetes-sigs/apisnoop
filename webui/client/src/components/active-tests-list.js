import React from 'react'
import { connect } from 'redux-bundler-react'
import { map } from 'lodash'

function TestItem (props) {
  const {
    testItem,
    queryObject,
    doUpdateQuery } = props

  return (
      <li className='mb3'key='test_{ testItem._id }'>
      <a className='link gray' href='#test_{testItem._id}' onClick={()=> handleClick(queryObject, testItem._id)} title={'info for ' + testItem.name}>{ testItem.name }</a>
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
      <div className="ph3 mt4">
      <h2 className='f1'>Tests for <span className='fw2'>{path.level} / {path.category} / {path.name} </span></h2>
      <ul className='list'>
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
