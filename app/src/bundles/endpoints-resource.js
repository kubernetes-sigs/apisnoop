import { createAsyncResourceBundle, createSelector } from 'redux-bundler'

import { fetchResource } from '../lib/utils'

const bundle = createAsyncResourceBundle({
  name: 'endpointsResource',
  getPromise: ({store}) => {
    var gsPath = store.selectGsPath()
    return fetchResource(gsPath, '/endpoints.json')
  }
})

bundle.reactEndpointsResourceFetch = createSelector(
  'selectEndpointsResourceShouldUpdate',
  (shouldUpdate) => {
    if (!shouldUpdate) return
    return { actionCreator: 'doFetchEndpointsResource' }
  }
)

export default bundle
