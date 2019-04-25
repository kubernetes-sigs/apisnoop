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
    'selectConfig',
    'selectQueryObject',
    (config, query) => {
      let bucket = ''
      if (query.bucket === undefined && config.bucket == undefined) {
        return bucket
      } else if (config.bucket && !query.bucket) {
        bucket = config.bucket.split('apisnoop/spyglass/')[1]
        return bucket
      } else {
        bucket = query.bucket.split('apisnoop/spyglass/')[1]
        return bucket
      }
   }
  )
}
