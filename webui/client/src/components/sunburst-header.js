import React from 'react'
import { connect } from 'redux-bundler-react'

const SunburstHeader = (props) => {
  const {
    currentReleaseObject
  } = props
  var release = currentReleaseObject

  if (release == null) return null

  return (
      <div id='sunburst-header'>
      <h2 className='mb1 f1'>
        <VersionTag version={release.version}/>
        {release.release }
        <E2ETag e2eOnly={release.e2eOnly}/>
      </h2>
      <p className='ibm-plex-mono f6 mt0 pt0 pl2'>Data Gathered on { release.date}</p>
      </div>
  )

  function VersionTag (version) {
    version = version.version
    if (version === 'master' || version == null) return null
    if (version === 'sig-release') {
      return <span className='light-red mr2'>Sig Release</span>
    }
    if (version === 'conformance') {
      return <span className='light-blue mr2'>Conformance</span>
    }
    return null
  }

  function E2ETag (e2eOnly) {
    e2eOnly = e2eOnly.e2eOnly
    if (e2eOnly === true) return <span className='f6 i ml1'>e2e only</span>
    return null
  }
}

export default connect(
  'selectCurrentReleaseObject',
  SunburstHeader
)
