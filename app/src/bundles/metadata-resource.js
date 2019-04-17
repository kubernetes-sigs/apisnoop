import { createAsyncResourceBundle, createSelector } from 'redux-bundler'

import { fetchResource } from '../lib/utils'

const bundle = createAsyncResourceBundle({
  name: 'metadataResource',
  getPromise: ({store}) => {
    var gsPath = store.selectGsPath()
    return fetchResource(gsPath, '/metadata.json')
  }
})

bundle.reactMetadataResourceFetch = createSelector(
  'selectMetadataResourceShouldUpdate',
  (shouldUpdate) => {
    if (!shouldUpdate) return
    return { actionCreator: 'doFetchMetadataResource' }
  }
)

export default bundle
