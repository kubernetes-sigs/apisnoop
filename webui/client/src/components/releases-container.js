import React from 'react'
import { connect } from 'redux-bundler-react'

import ReleasesList from './releases-list'

function ReleasesContainer (props) {
  const {
    releasesSigIndex,
    releasesMasterIndex
  } = props

  return(
    <section id="releases-container" className="">
      <div className='flex items-start justify-start'>
      <ReleasesList grouping={"Master"} releases={releasesMasterIndex} />
      <ReleasesList grouping={"Releases"} releases={releasesSigIndex} />
      </div>
    </section>
  )
}

export default connect(
  "selectReleasesSigIndex",
  "selectReleasesMasterIndex",
  ReleasesContainer
)
