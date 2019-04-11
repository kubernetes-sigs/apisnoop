import React from 'react'
import { connect } from 'redux-bundler-react'

const SunburstHeader = (props) => {
  const {
    metadata
  } = props

  return (
      <div id='sunburst-header' className='relative'>
      <h2 className='mb1 mt1 pt4 f1'>
      { metadata.version }
      </h2>
      <p className='ibm-plex-mono f6 mt0 pt0 pl2'> from job {metadata.job} in bucket {metadata.bucket}</p>
      <p className='ibm-plex-mono f6 mb1 pt0 pl2'>Data Gathered on {metadata.timestamp}</p>
      </div>
  )
}

export default connect(
  'selectMetadata',
  SunburstHeader
)
