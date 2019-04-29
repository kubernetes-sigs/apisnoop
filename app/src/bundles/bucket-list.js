import { createSelector } from 'redux-bundler'
import { flatten, map } from 'lodash'

export default {
  name: 'bucketList',
  selectBuckets: createSelector(
    'selectConfig',
    (config) => {
      let buckets = {};
      if (!config || !config.buckets) return buckets
      buckets = config.buckets
      return buckets
    }
  )
  ,
  selectBucketJobPaths: createSelector(
    'selectGsBucket',
    'selectBuckets',
    (gsBucket, buckets) => {
      let bucketJobPaths = [];
      if (!gsBucket || !buckets) return bucketJobPaths
      bucketJobPaths = map(buckets, (value, key) => {
        let bucket = key;
        let paths = [];
        value['jobs'].forEach(job => paths.push([gsBucket, bucket, job].join('/')))
        return paths
      })
      return flatten(bucketJobPaths)
    }
  )
}
