import { createAsyncResourceBundle, createSelector } from 'redux-bundler'

import { fetchResource } from '../lib/utils'

const bundle = createAsyncResourceBundle({
  name: 'testSequencesResource',
  getPromise: ({store}) => {
    var gsPath = store.selectGsPath()
    return fetchResource(gsPath, '/test_sequences.json')
  }
})

bundle.reactTestSequencesResourceFetch = createSelector(
  'selectTestSequencesResourceShouldUpdate',
  (shouldUpdate) => {
    if (!shouldUpdate) return
    return { actionCreator: 'doFetchTestSequencesResource' }
  }
)

export default bundle
