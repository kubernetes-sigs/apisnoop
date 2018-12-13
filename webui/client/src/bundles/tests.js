import { createSelector } from 'redux-bundler'

export default {
  name: 'tests',
  getReducer: () => {
    const initialState = {
      activeTest: {},
      activeEndpoint: ''
    }
    return (state=initialState, action) => {
      if (action.type === 'TESTS_REQUESTED_FOR_ENDPOINT') {
        return {
          ...state,
          activeEndpoint: action.payload
        }
      }
      return state
    }
  },
  selectTestTagsIndex: createSelector(
    'selectQueryObject',
    'selectEndpointsWithTestCoverage',
    (query, endpoints) =>{
      if (query.name === undefined || endpoints.stable === undefined) return []
      var queriedEndpoint = endpoints[query.level][query.category][query.name]
      var sampleMethod = Object.keys(queriedEndpoint)[0]
      return queriedEndpoint[sampleMethod].test_tags
    }
  ),
  selectActiveEndpointName: (state) => state.tests.activeEndpoint,
  selectActiveEndpoint: createSelector(
    'selectEndpointsResource',
    'selectActiveEndpointName',
    'selectQueryObject',
    (endpoints, activeEndpoint, query) => {
      if (endpoints == null) return null
      return endpoints.find(endpoint => {
        return (endpoint.name === query.name) && (endpoint.category === query.category) && (endpoint.level === query.level)
      })
    }
  ),
  selectActiveTestsIndex: createSelector(
    'selectActiveEndpoint',
    'selectTestsResource',
    (endpoint, testsResource) => {
      if (endpoint == null || testsResource == null) return null
      var activeTests = testsResource.filter(test => endpoint.tests.includes(test.name))
      return activeTests
    }
  ),
  doDisplayEndpointTests: (payload) => ({dispatch}) => {
    dispatch({
      type: 'TESTS_REQUESTED_FOR_ENDPOINT',
      payload: payload
    })
  }
  
}
