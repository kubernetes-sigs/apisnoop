import { createAsyncResourceBundle, createSelector } from 'redux-bundler'

const bundle = createAsyncResourceBundle({
  name: 'endpointsResource',
  getPromise: ({store}) => {
    const gsUrl= store.config.gsUrl
    return fetchEndpoints(gsUrl, 'products.json')
  }
})

bundle.reactEndpointsResourceFetch = createSelector(
  'selectEndpointsResourceShouldUpdate',
  (shouldUpdate) => {
    if (!shouldUpdate) return
    return { actionCreator: 'doFetchEndpointsResource' }
  }
)

export default bundle

function fetchResource (gsUrl, resource) {
  var path = `${gsUrl}/${resource}`
  fetch(path)
    .then((response) => {
      if (!response.ok) {
        throw new Error("HTTP error, status = " + response.status);
      }
      return response.json()
    })
    .catch((err) => {
      console.log({fetchErr: err})
    })
}
