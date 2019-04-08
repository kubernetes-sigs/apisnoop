import React from 'react'
import { connect } from 'redux-bundler-react'


const Metadata = (props) => {
  const {
    metadata
  } = props
  return (
    <section id='metadata'>
      <h1>{metadata.version}</h1>
      <p>from job {metadata.job} in bucket {metadata.bucket}</p>
    </section>
  )
}

export default connect(
  'selectMetadata',
  Metadata
)
