import { createSelector } from 'redux-bundler'
import { forEach } from 'lodash'

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
      if (!gsBucket || !buckets) return {};
      let bucketJobPaths = {};
      let bucketNames = Object.keys(buckets);
      let i;
      for (i = 0; i < bucketNames.length; i++) {
        console.log(buckets)
        let bucket = bucketNames[i];
        let jobs = buckets[bucket].jobs
        forEach(jobs, (job) => {
          let bucketJob = [bucket, job].join('/')
          let fullPath = [gsBucket, bucket, job].join('/')
          bucketJobPaths[bucketJob] = fullPath;
        })
      }
      return bucketJobPaths;
    }
  ),
  selectActiveBucketJob: createSelector(
    'selectBucketJobPaths',
    'selectQueryObject',
    (bucketJobPaths, query) => {
      if (bucketJobPaths == null || query.bucket === undefined) return '';
      let bucketJobs = Object.keys(bucketJobPaths)
      return bucketJobs.find(bucketJob => bucketJobPaths[bucketJob] === query.bucket)
    }
  )
}
