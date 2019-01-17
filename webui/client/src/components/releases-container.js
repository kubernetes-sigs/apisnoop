import React from 'react'
import { connect } from 'redux-bundler-react'

import ReleasesList from './releases-list'

function ReleasesContainer (props) {
  const {
    releasesConformanceIndexE2E,
    releasesConformanceIndexNoE2E,
    releasesSigIndexE2E,
    releasesSigIndexNoE2E,
    releasesMasterIndex
  } = props

  return(
    <section id="releases-container" className="">
      <div className='flex items-start justify-start'>
      <ReleasesList release={"Master"} all={releasesMasterIndex} />
      <ReleasesList release={"Sig Release"} all={releasesSigIndexNoE2E} e2eOnly={releasesSigIndexE2E} />
      <ReleasesList release={"Conformance"} all={releasesConformanceIndexNoE2E} e2eOnly={releasesConformanceIndexE2E} />
      </div>
    </section>
  )
}

export default connect(
"selectReleasesConformanceIndexE2E",
  "selectReleasesConformanceIndexNoE2E",
  "selectReleasesSigIndexE2E",
  "selectReleasesSigIndexNoE2E",
  "selectReleasesMasterIndex",
  ReleasesContainer
)
