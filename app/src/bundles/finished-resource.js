import { createAsyncResourceBundle, createSelector } from 'redux-bundler'

import { fetchResource } from '../lib/utils'

const bundle = createAsyncResourceBundle({
  name: 'finishedResource',
  getPromise: ({store}) => {
    var gsPath = store.selectGsPath()
    return fetchResource(gsPath, '/finished.json')
  }
})

bundle.reactFinishedResourceFetch = createSelector(
  'selectFinishedResourceShouldUpdate',
  (shouldUpdate) => {
    if (!shouldUpdate) return
    return { actionCreator: 'doFetchFinishedResource' }
  }
)

export default bundle
