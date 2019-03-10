import React from 'react'
import { connect } from 'redux-bundler-react'

const SunburstHeader = (props) => {
  const {
    currentReleaseObject,
    currentReleaseIsLoading,
    currentReleaseShouldUpdate,
    currentReleaseAPISnoopLink,
    currentReleaseSpyglassLink
  } = props
  var release = currentReleaseObject

  if (release == null) return null

  return (
      <div id='sunburst-header' className='relative'>
      {(currentReleaseShouldUpdate || currentReleaseIsLoading) &&
        <p className='i fw2 absolute top-0'>Switching To...</p>}
      <h2 className='mb1 mt1 pt4 f1'>
      {release.release_short }
      </h2>
      <p className='ibm-plex-mono f6 mt0 pt0 pl2'> from job {release.job} in&nbsp;
        <a
          href={currentReleaseSpyglassLink}
          title='job information on spyglass'
          target='_blank'
          rel='noopener noreferrer'
        >{release.bucket}</a>
    </p>
      <a className='ibm-plex-mono f6 mt0 mb1  pt0 pl2'
        href={currentReleaseAPISnoopLink}
        title='Processed Data in Apisnoop gcs bucket'
        target='_blank'
        rel='noopener noreferrer'
      >See processed audit of {release.bucket}</a>
      <p className='ibm-plex-mono f6 mb1 pt0 pl2'>Data Gathered on {release.gathered_datetime}</p>
      </div>
  )
}

export default connect(
  'selectCurrentReleaseObject',
  'selectCurrentReleaseIsLoading',
  'selectCurrentReleaseShouldUpdate',
  'selectCurrentReleaseAPISnoopLink',
  'selectCurrentReleaseSpyglassLink',
  SunburstHeader
)
