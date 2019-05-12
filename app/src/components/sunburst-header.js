import React from 'react'
import { connect } from 'redux-bundler-react'

const SunburstHeader = (props) => {
  const {
    jobVersion,
    spyglassLink
  } = props

  if (jobVersion.length === 0) return null
  return (
      <div id='sunburst-header' className='relative mb2'>
      <h2 className='mb1 mt0 pt0 f1'>
      { jobVersion }
      </h2>
      <a href={spyglassLink} target="_blank" rel="noreferrer noopener">View this job on Spyglass</a>
      </div>
  )
}

export default connect(
  'selectJobVersion',
  'selectSpyglassLink',
  SunburstHeader
)
