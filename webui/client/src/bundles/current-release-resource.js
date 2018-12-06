const bundle = createAsyncResourceBundle({
  name: 'currentRelease',
  actionBaseType: 'CURRENT_RELEASE',
  getPromise: ({ client, getState, store }) => {
    // TODO use url params to get release id
    const releaseId = findReleaseIdByName(
      store.selectReleasesIndex(),
      store.selectCurrentReleaseName()
    )
    if (releaseId) return fetchReleaseById(client, releaseId)
  }
})

bundle.reactEndpointsFetch = createSelector(
  'selectReleaseShouldUpdate',
  (shouldUpdate) => {
    if (shouldUpdate) {
      return { actionCreator: 'doFetchRelease' }
    }
  }
)

export default bundle

function fetchReleaseById (client, releaseId) {
  return client.service('releases').get(releaseId)
}

function findReleaseIdByName (releases, name) {
  const release = releases.find(release => {
    return release.name === name
  })
  if (release) return release._id
  else return null
}
