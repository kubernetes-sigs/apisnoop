import React from 'react'
import { connect } from 'redux-bundler-react'

import ReleasesList from './releases-list'

function ReleasesContainer (props) {
  const {
    releasesIndexMasterOnly,
    releasesIndexSansMaster
  } = props

  return(
    <section id="releases-container" className="">
      <div className='flex items-start justify-start'>
      <ReleasesList grouping={"Master"} releases={releasesIndexMasterOnly} />
      <ReleasesList grouping={"Releases"} releases={releasesIndexSansMaster} />
      </div>
    </section>
  )
}

export default connect(
  "selectReleasesIndexMasterOnly",
  "selectReleasesIndexSansMaster",
  ReleasesContainer
)
