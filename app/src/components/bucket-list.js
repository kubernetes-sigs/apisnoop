import React from 'react'
import { connect } from 'redux-bundler-react'


function BucketList (props) {
  let buckets = [
      'ci-kubernetes-e2e-gce-cos-k8sstable3-default/1121083339638312961',
      'ci-kubernetes-e2e-gce-cos-k8sstable2-default/1121457989778149377',
      'ci-kubernetes-e2e-gce-cos-k8sstable1-default/1121581392354873344',
      'ci-kubernetes-e2e-gce-cos-k8sbeta-default/1121564030004105216',
      'ci-kubernetes-e2e-gci-gce/1121334929389522946',
  ]

  const { doUpdateQuery,
          doMarkEndpointsResourceAsOutdated,
          doMarkMetadataResourceAsOutdated,
          doMarkTestsResourceAsOutdated,
          doMarkTestSequencesResourceAsOutdated,
          doMarkTestTagsResourceAsOutdated,
          doMarkUseragentsResourceAsOutdated,
          bucketJobPaths,
          bucket
        } = props
  return (
      <div id='bucket-list'>
      <h2>Select a Bucket</h2>
      <ul className="list flex flex-wrap pl0">
      {bucketJobPaths.map((b, i) => {
        return (
            <li className='pr2 pb2' key={`bucket_${i}`}>
            {(b === bucket) &&
                <button onClick={handleClick}
              className='f6 link dim ba b--black ph3 pv2 mb2 dib black bg-washed-red magic-pointer'>{b}</button>}
            {(b !== bucket) && <button onClick={handleClick}
              className='f6 link dim ba b--black ph3 pv2 mb2 dib black bg-transparent magic-pointer'>{b}</button>}
            </li>)
      })}
    </ul>
      </div>
  )

  function handleClick (e) {
    let bucket = e.target.textContent
    doMarkEndpointsResourceAsOutdated()
    doMarkTestsResourceAsOutdated()
    doMarkTestSequencesResourceAsOutdated()
    doMarkTestTagsResourceAsOutdated()
    doMarkMetadataResourceAsOutdated()
    doMarkUseragentsResourceAsOutdated()
    doUpdateQuery({bucket: bucket})
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
  'selectBucket',
  'selectBucketJobPaths',
  BucketList
)
