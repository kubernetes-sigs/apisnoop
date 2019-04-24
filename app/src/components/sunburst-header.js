import React from 'react'
import { connect } from 'redux-bundler-react'

const SunburstHeader = (props) => {
  const {
    job,
    bucket
  } = props

  if (job.length === 0) return null
  return (
      <div id='sunburst-header' className='relative'>
      <h2 className='mb1 mt1 pt4 f1'>
      { job }
      </h2>
      <p className='ibm-plex-mono f6 mt0 pt0 pl2'> from {bucket}</p>
      </div>
  )
}

export default connect(
  'selectBucket',
  'selectJob',
  SunburstHeader
)
