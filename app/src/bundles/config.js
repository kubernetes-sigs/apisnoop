import { createSelector } from 'redux-bundler'
const config = {
  bucket: document.querySelector('meta[name="gs-bucket"]').getAttribute('content'),
  provider: 'https://storage.googleapis.com/'
}

export default {
  name: 'config',
  reducer: (state = config) => state,
  selectStorage: (state) => state.config,
  selectGsPath: createSelector(
    'selectQueryObject',
    'selectStorage',
    (query, storage) => {
      if (query && query.bucket) {
        return storage.provider.concat(query.bucket)
      }
      return storage.provider.concat(storage.bucket)
    }
  )
}
