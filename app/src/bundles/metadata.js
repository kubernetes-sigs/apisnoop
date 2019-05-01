import { createSelector } from 'redux-bundler'

export default {
  name: 'metadata',
  selectJobVersion: createSelector(
    'selectMetadataResource',
    (metadata) => {
      let job = ''
      if (metadata == null) return job
      job = metadata['job-version'].split('+')[0]
      return job
   }
  ),
  selectSpyglassLink: createSelector(
    'selectActiveBucketJob',
    (bucketJob) => {
      let spyglassPath = 'https://prow.k8s.io/view/gcs/kubernetes-jenkins/logs';
      return [spyglassPath, bucketJob].join('/');
    }
  )
  
}
