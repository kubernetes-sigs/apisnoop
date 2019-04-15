import { createAsyncResourceBundle, createSelector } from 'redux-bundler'

import { fetchResource } from '../lib/utils'

const bundle = createAsyncResourceBundle({
  name: 'testTagsResource',
  getPromise: ({store}) => {
    var gsPath = store.selectGsPath()
    return fetchResource(gsPath, '/test_tags.json')
  }
})

bundle.reactTestTagsResourceFetch = createSelector(
  'selectTestTagsResourceShouldUpdate',
  (shouldUpdate) => {
    if (!shouldUpdate) return
    return { actionCreator: 'doFetchTestTagsResource' }
  }
)

export default bundle
