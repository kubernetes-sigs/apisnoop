import React from 'react'
import { connect } from 'redux-bundler-react'

import ReleasesList from './releases-list'

function ReleasesContainer (props) {
  const {
    releasesIndexMasterOnly,
    releasesIndexSorted
  } = props

  return(
    <section id="releases-container" className="">
      <div className='flex items-start justify-start'>
      <ReleasesList grouping={"Master"} releases={releasesIndexMasterOnly} />
      <ReleasesList grouping={"Releases"} releases={releasesIndexSorted} />
      </div>
    </section>
  )
}

export default connect(
  "selectReleasesIndexMasterOnly",
  "selectReleasesIndexSorted",
  ReleasesContainer
)
