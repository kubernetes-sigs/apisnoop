import { createAsyncResourceBundle, createSelector } from 'redux-bundler'

const bundle = createAsyncResourceBundle({
  name: 'endpointsResource',
  getPromise: ({ client, store }) => {
    const currentReleaseName = store.selectCurrentReleaseName()
    return fetchEndpointsByReleaseName(client, currentReleaseName)
  }
})

bundle.reactEndpointsFetch = createSelector(
  'selectEndpointsResourceShouldUpdate',
  (shouldUpdate, currentReleaseId) => {
    if (!shouldUpdate) return
    return { actionCreator: 'doFetchEndpointsResource' }
  }
)


export default bundle

function fetchEndpointsByReleaseName (client, releaseName) {
  return client.service('endpoints').find({
    query: {
      release: releaseName
    }
  })
}
