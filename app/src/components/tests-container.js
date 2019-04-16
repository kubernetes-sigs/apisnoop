import React from 'react'
import { connect } from 'redux-bundler-react'

import ActiveTestsList from './active-tests-list'
import ActiveTestSequence from './active-test-sequence'

function TestsContainer (props) {
  const {
    queryObject
  } = props

  if (queryObject == null) return null

  return(
      <section id='tests'>
      {queryObject && queryObject.test == null &&
       <ActiveTestsList />}
      {queryObject.test && (typeof queryObject.test == 'string') &&
        <ActiveTestSequence />}
      </section>
  )
}

export default connect(
  'selectQueryObject',
  TestsContainer
)
