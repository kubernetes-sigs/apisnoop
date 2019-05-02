import React from 'react'
import { connect } from 'redux-bundler-react'
import { map } from 'lodash'


function BucketList (props) {

  const { doUpdateQuery,
          doMarkEndpointsResourceAsOutdated,
          doMarkMetadataResourceAsOutdated,
          doMarkTestsResourceAsOutdated,
          doMarkTestSequencesResourceAsOutdated,
          doMarkTestTagsResourceAsOutdated,
          doMarkUseragentsResourceAsOutdated,
          config,
          bucketJobPaths,
          activeBucketJob
        } = props
  if (config == null) return null
  return (
      <div id='bucket-list'>
      <p><em>Jobs are coming from {config.source}</em></p>
      <ul className="list flex flex-wrap pl0">
      {map(bucketJobPaths, (fullPath, bucketJob, bucketJobPath)=> {
        let bucket = bucketJob.split('/')[0]
        return (
            <li className='pr2 pb2' key={fullPath}>
            {(bucketJob === activeBucketJob) &&
             <button onClick={() => handleClick(fullPath)}
              className='f6 link dim ba b--black ph3 pv2 mb2 dib black bg-washed-red magic-pointer'>{bucket}</button>}
          {(bucketJob !== activeBucketJob) && <button onClick={() => handleClick(fullPath)}
              className='f6 link dim ba b--black ph3 pv2 mb2 dib black bg-transparent magic-pointer'>{bucket}</button>}
          </li>
        )
      })}
    </ul>
      </div>
  )

  function handleClick (path) {
    let bucket = path;
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
  'selectActiveBucketJob',
  'selectBucketJobPaths',
  'selectConfig',
  BucketList
)
