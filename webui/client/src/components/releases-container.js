import React from 'react'
import { connect } from 'redux-bundler-react'

import ReleasesList from './releases-list'

function ReleasesContainer (props) {
  const {
    releasesIndexSorted,
    releasesMasterIndex
  } = props

  return(
    <section id="releases-container" className="">
      <div className='flex items-start justify-start'>
      <ReleasesList grouping={"Master"} releases={releasesMasterIndex} />
      <ReleasesList grouping={"Releases"} releases={releasesIndexSorted} />
      </div>
    </section>
  )
}

export default connect(
  "selectReleasesIndexSorted",
  "selectReleasesMasterIndex",
  ReleasesContainer
)
