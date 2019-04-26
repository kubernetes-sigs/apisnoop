import { createSelector } from 'redux-bundler'
const config = {
  bucket: document.querySelector('meta[name="gs-bucket"]').getAttribute('content'),
  provider: 'https://storage.googleapis.com/'
}

export default {
  name: 'config',
  reducer: (state = config) => state,
  selectConfig: (state) => state.config,
  selectGsPath: createSelector(
    'selectQueryObject',
    'selectConfig',
    (query, config) => {
      if (query && query.bucket) {
        return config.provider.concat(query.bucket)
      }
      return config.provider.concat(config.bucket)
    }
  )
}
