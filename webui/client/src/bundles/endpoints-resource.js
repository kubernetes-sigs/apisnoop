const bundle = createAsyncResourceBundle({
  name: 'endpoints',
  actionBaseType: 'ENDPOINTS',
  getPromise: ({ client, getState }) => {
    // TODO use url params to fetch
    return client.service('endpoints').find()
  }
})

// fetch endpoints if not yet fetched
// fetch endpoints if recently moved urls
bundle.reactEndpointsFetch = createSelector(
  'selectEndpointsShouldUpdate',
  (shouldUpdate) => {
    if (shouldUpdate) {
      return { actionCreator: 'doFetchEndpoints' }
    }
  }
)

export default bundle
