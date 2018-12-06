import { createAsyncResourceBundle, createSelector } from 'redux-bundler'

const url = '/api/v1/releases'

const bundle = createAsyncResourceBundle({
  name: 'releasesIndex',
  actionBaseType: 'RELEASES_INDEX',
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
  return client.get(`${url}?$select[]=name&$select[]=_id`)
}
