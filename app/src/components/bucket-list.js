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
      <h2 className='pa3'>Select a Bucket</h2>
      <ul className="list flex flex-wrap">
      {buckets.map((bucket, i) => {
        return (
            <li className='pa2' key={`bucket_${i}`}>
               <button onClick={handleClick}
                       className='f6 link dim ba b--black ph3 pv2 mb2 dib black bg-transparent'>{bucket}</button>
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
