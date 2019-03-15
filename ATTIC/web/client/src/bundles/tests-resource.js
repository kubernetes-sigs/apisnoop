import { createAsyncResourceBundle, createSelector } from 'redux-bundler'

const bundle = createAsyncResourceBundle({
  name: 'testsResource',
  getPromise: ({ client, store }) => {
    const currentReleaseName = store.selectCurrentReleaseName()
    return fetchTestsByReleaseName(client, currentReleaseName)
  }
})

bundle.reactTestsResourceFetch = createSelector(
  'selectTestsResourceShouldUpdate',
  (shouldUpdate, currentReleaseId) => {
    if (!shouldUpdate) return
    return { actionCreator: 'doFetchTestsResource' }
  }
)


export default bundle

function fetchTestsByReleaseName (client, releaseName) {
  return client.service('tests').find({
    query: {
      release: releaseName
    }
  })
}
