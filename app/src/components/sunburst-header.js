import React from 'react'
import { connect } from 'redux-bundler-react'

const SunburstHeader = (props) => {
  const {
    activeBucketJob,
    jobVersion,
    spyglassLink
  } = props

  if (jobVersion.length === 0) return null
  let bucket = activeBucketJob.split('/')[0]
  return (
      <div id='sunburst-header' className='relative mb2'>
      <h2 className='mb1 mt0 pt0 f1'>
      { jobVersion }
      </h2>
      <p className='i f7'>From <span className='ibm-plex-mono fs-normal f6'>{bucket}</span></p>
      <a href={spyglassLink} target="_blank" rel="noreferrer noopener">View this job on Spyglass</a>
      </div>
  )
}

export default connect(
  'selectActiveBucketJob',
  'selectJobVersion',
  'selectSpyglassLink',
  SunburstHeader
)
