import { createAsyncResourceBundle, createSelector } from 'redux-bundler'

const bundle = createAsyncResourceBundle({
  name: 'currentRelease',
  getPromise: ({ client, store }) => {
    const currentReleaseId = store.selectCurrentReleaseId()
    if (currentReleaseId) return fetchReleaseById(client, currentReleaseId)
  }
})

bundle.reactCurrentReleaseFetch = createSelector(
  'selectCurrentReleaseShouldUpdate',
  'selectCurrentReleaseId',
  (shouldUpdate, currentReleaseId) => {
    if (!shouldUpdate) return
    if (currentReleaseId == null) return

    return { actionCreator: 'doFetchCurrentRelease' }
  }
)

export default bundle

function fetchReleaseById (client, releaseId) {
  return client.service('releases').get(releaseId)
}
