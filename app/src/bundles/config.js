import { createSelector } from 'redux-bundler'
import { trimEnd } from 'lodash'

const STORAGE_PROVIDER = 'https://storage.googleapis.com/'

const config = {
  provider: STORAGE_PROVIDER
}

export default {
  name: 'config',
  reducer: (state = config) => state,
  selectConfigDUMP: (state) => state.config,
  selectConfig: (state) => state.configResource.data,
  selectProvider: (state) => state.config.provider,
  selectGsBucket: createSelector(
    'selectProvider',
    'selectConfig',
    (provider, config) => {
      let gsBucket;
      if  (config == null || config['gs-bucket'] === undefined) return gsBucket;
      gsBucket = config['gs-bucket']
      return trimEnd(gsBucket, '/')
    }
  ),
  selectDefaultBucketJob: createSelector(
    'selectConfig',
    'selectGsBucket',
    (config, gsBucket) => {
      let defaultBucketJob, bucket, job = '';

      if (config == null || config['default-view'] === undefined) return '';

      bucket = trimEnd(config['default-view'].bucket, '/')
      job = trimEnd(config['default-view'].job, '/')
      return [gsBucket, bucket, job].join('/')
    }
  ),
  selectGsPath: createSelector(
    'selectProvider',
    'selectQueryObject',
    'selectDefaultBucketJob',
    (provider, query, bucketJob) => {
      if (query && query.bucket) {
        return provider.concat(query.bucket)
      }
      return provider.concat(bucketJob)
    }
  )
}
