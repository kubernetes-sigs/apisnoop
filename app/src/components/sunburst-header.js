import React from 'react'
import { connect } from 'redux-bundler-react'
import dayjs from 'dayjs';

const SunburstHeader = (props) => {
  const {
    activeBucketJob,
    finished,
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
      {finished.timestamp &&
      <p className='i f7'>{dayjs.unix(finished.timestamp).format('YYYY-MM-DD')}</p>
      }
      <a href={spyglassLink} target="_blank" rel="noreferrer noopener">View this job on Spyglass</a>
      </div>
  )
}

export default connect(
  'selectFinished',
  'selectActiveBucketJob',
  'selectJobVersion',
  'selectSpyglassLink',
  SunburstHeader
)
