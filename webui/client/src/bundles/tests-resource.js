import { createAsyncResourceBundle, createSelector } from 'redux-bundler'

const bundle = createAsyncResourceBundle({
  name: 'tests',
  getPromise: ({ client, store }) => {
    const currentReleaseName = store.selectCurrentReleaseName()
    return fetchTestsByReleaseName(client, currentReleaseName)
  }
})

bundle.reactTestsFetch = createSelector(
  'selectTestsShouldUpdate',
  (shouldUpdate, currentReleaseId) => {
    if (!shouldUpdate) return
    return { actionCreator: 'doFetchTests' }
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
