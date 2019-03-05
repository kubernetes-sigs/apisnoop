import { createAsyncResourceBundle, createSelector } from 'redux-bundler'

const bundle = createAsyncResourceBundle({
  name: 'releasesIndex',
  getPromise: ({ client, getState }) => {
    return fetchReleasesIndex(client)
  }
})

bundle.reactReleasesIndexFetch = createSelector(
  'selectReleasesIndexShouldUpdate',
  (shouldUpdate) => {
    if (shouldUpdate) {
      return { actionCreator: 'doFetchReleasesIndex' }
    }
  }
)

export default bundle

function fetchReleasesIndex (client) {
  return client.service('releases').find()
}
