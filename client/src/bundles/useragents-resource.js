import { createAsyncResourceBundle, createSelector } from 'redux-bundler'

const bundle = createAsyncResourceBundle({
  name: 'useragentsResource',
  getPromise: ({ client, store }) => {
    const currentReleaseName = store.selectCurrentReleaseName()
    return fetchUseragentsByReleaseName(client, currentReleaseName)
  }
})

bundle.reactUseragentsResourceFetch = createSelector(
  'selectUseragentsResourceShouldUpdate',
  (shouldUpdate, currentReleaseId) => {
    if (!shouldUpdate) return
    return { actionCreator: 'doFetchUseragentsResource' }
  }
)

export default bundle

function fetchUseragentsByReleaseName (client, releaseName) {
  return client.service('useragents').find({
    query: {
      release: releaseName
    }
  })
}
