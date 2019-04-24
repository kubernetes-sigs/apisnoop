import React from 'react'
import { connect } from 'redux-bundler-react'


function BucketList (props) {
  let buckets = ['ci-kubernetes-e2e-gci-gce/1116453304528801792',
                 'ci-kubernetes-e2e-gce-cos-k8sstable3-default/1116369525902675974',
                 'ci-kubernetes-e2e-gce-cos-k8sstable2-default/1116461866978119689',
                 'ci-kubernetes-e2e-gce-cos-k8sstable1-default/1116466143159128064',
                 'ci-kubernetes-e2e-gce-cos-k8sbeta-default/1116430159767932928'
                ]

  const { doUpdateQuery,
          doMarkEndpointsResourceAsOutdated,
          doMarkMetadataResourceAsOutdated,
          doMarkTestsResourceAsOutdated,
          doMarkTestSequencesResourceAsOutdated,
          doMarkTestTagsResourceAsOutdated,
          doMarkUseragentsResourceAsOutdated,
        } = props
  return (
      <div className='min-vh-80'>
      <h1>Select A Bucket</h1>
      <ul className="list">
      {buckets.map((bucket, i) => {
        return (
            <li className='pb2' key={`bucket_${i}`}>
               <a href='#' onClick={handleClick} className='link black hover-mid-gray'>{bucket}</a>
            </li>)
      })}
    </ul>
      </div>
  )

  function handleClick (e) {
    let storagePath = 'apisnoop/spyglass/'
    let bucket = e.target.innerHTML
    let fullPath = storagePath.concat(bucket)
    doMarkEndpointsResourceAsOutdated()
    doMarkTestsResourceAsOutdated()
    doMarkTestSequencesResourceAsOutdated()
    doMarkTestTagsResourceAsOutdated()
    doMarkMetadataResourceAsOutdated()
    doMarkUseragentsResourceAsOutdated()
    doUpdateQuery({bucket: fullPath})
  }
}

export default connect(
  'doUpdateQuery',
  'doMarkEndpointsResourceAsOutdated',
  'doMarkTestsResourceAsOutdated',
  'doMarkMetadataResourceAsOutdated',
  'doMarkTestSequencesResourceAsOutdated',
  'doMarkTestTagsResourceAsOutdated',
  'doMarkUseragentsResourceAsOutdated',
  BucketList
)
