import React from 'react'
import { connect } from 'redux-bundler-react'

function TestTag (props) {
  const { testTag } = props
  return (
    <li className='dib tal ttsc mr2 mb2 ph2 pv1 mid-gray'>
      { testTag }
    </li>
  )
}

function TestTagsList (props) {
  const { activeTestTags } = props

  if (activeTestTags == null) return null
  if (activeTestTags.length === 0) return null

  return (
    <div className="mt0 pl3">
      <p>Tests are coming from:</p>
      <div className="scrollbox">
      <ul className='list pl0 ml0'>
      {activeTestTags.map((testTag, index) => {
          return <TestTag key={'testTag_'.concat(index)} testTag={ testTag } />
        })}
      </ul>
    </div>
    </div>
  )
}

export default connect(
  'selectActiveTestTags',
  TestTagsList
)
