import React from 'react'
import { connect } from 'redux-bundler-react'

function TestTag (props) {
  const { testTag } = props
  return (
    <li className='dib'>
      { testTag }
    </li>
  )
}

function TestTagsList (props) {
  const { testTagsIndex } = props

  if (testTagsIndex == null) return null

  return (
    <div className="ph3 mt4">
      <ul className='list'>
      {testTagsIndex.map(testTag => {
          return <TestTag testTag={ testTag } />
        })}
      </ul>
    </div>
  )
}

export default connect(
  'selectTestTagsIndex',
  TestTagsList
)
