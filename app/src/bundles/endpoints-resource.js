import { createAsyncResourceBundle, createSelector } from 'redux-bundler'

const bundle = createAsyncResourceBundle({
  name: 'endpointsResource',
  getPromise: ({store}) => {
    var gsPath = store.selectGsPath()
    return fetchResource(gsPath, 'endpoints.json')
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

function fetchResource (gsPath, resource) {
  var fullPath = gsPath + resource
  console.log({fullPath})
  return fetch(fullPath, {mode: 'no-cors'})
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
