import { createSelector } from 'redux-bundler'

export default {
  name: 'metadata',
  selectJob: createSelector(
    'selectMetadataResource',
    (metadata) => {
      let job = ''
      if (metadata == null) return job
      job = metadata['job-version'].split('+')[0]
      return job
   }
  ),
  selectBucket: createSelector(
    'selectQueryObject',
    (query) => {
      let bucket = ''
      if (query.bucket === undefined )return bucket
      bucket = query.bucket.split('apisnoop/spyglass/')[1]
      return bucket
   }
  )
}
