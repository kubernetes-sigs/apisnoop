import React from 'react'
import { connect } from 'redux-bundler-react'


function BucketList (props) {

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
