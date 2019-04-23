import React from 'react'
import { connect } from 'redux-bundler-react'


function BucketList (props) {
  let buckets = ['ci-kubernetes-e2e-gci-gce/1116453304528801792']
  const { doUpdateQuery } = props
  return (
      <div>
        <ul>
        {buckets.map(bucket => <li onClick={handleClick}>{bucket}</li>)}
        </ul>
      </div>
  )

  function handleClick (e) {
    let storagePath = 'apisnoop/spyglass'
    let bucket = e.target.innerHTML
    let fullPath = storagePath.concat(bucket)
    doUpdateQuery({bucket: fullPath})
  }
}

export default connect(
'doUpdateQuery',
BucketList
)
