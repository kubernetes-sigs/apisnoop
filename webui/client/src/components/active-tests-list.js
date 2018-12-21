import React from 'react'
import { connect } from 'redux-bundler-react'
import { map } from 'lodash'

function TestItem (props) {
  const { testItem,
          queryObject,
          doUpdateQuery } = props
  return (
      <li className='dib' key='test_{ testItem._id }'>
      <a href='#testsamplechangethis' onClick={()=> handleClick(queryObject, testItem._id)} title="info for { testItem.name }">{ testItem.name }</a>
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
    activeTestsIndex,
    queryObject,
    doUpdateQuery,
  } = props

  if (activeTestsIndex == null) return null

  return (
      <div className="ph3 mt4">
      <ul className='list'>
      {map(activeTestsIndex, (testItem) => {
        return <TestItem testItem={ testItem } doUpdateQuery={ doUpdateQuery } queryObject={ queryObject } />
      })}
    </ul>
      </div>
  )
}



export default connect(
  'selectActiveTestsIndex',
  'selectQueryObject',
  'doUpdateQuery',
  TestList
)
