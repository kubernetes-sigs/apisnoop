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
    'selectZoom',
    'selectEndpointsWithTestCoverage',
    (query, zoom, endpoints) =>{
      if (query.name === undefined || endpoints.stable === undefined) return []
      if (zoom && zoom.depth === 'endpoint') {
        var endpoint = endpoints[zoom.level][zoom.category][zoom.name]
        var sampleMethod = Object.keys(endpoint)[0]
      } else {
        endpoint = endpoints[query.level][query.category][query.name]
        sampleMethod = Object.keys(endpoint)[0]
      }
        return endpoint[sampleMethod].test_tags
    }
  ),
  selectActiveEndpointName: (state) => state.tests.activeEndpoint,
  selectActiveEndpoint: createSelector(
    'selectEndpointsResource',
    'selectQueryObject',
    'selectZoom',
    (endpoints, query, zoom) => {
      if (endpoints == null) return null
      if (zoom && zoom.depth === 'endpoint') {
        return endpoints.find(endpoint => {
          return (endpoint.name === zoom.name) && (endpoint.category === zoom.category) && (endpoint.level === zoom.level)
        })
      } else {
        return endpoints.find(endpoint => {
          return (endpoint.name === query.name) && (endpoint.category === query.category) && (endpoint.level === query.level)
        })
      }
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
  selectActiveTestsNumber: createSelector(
    'selectActiveTestsIndex',
    (tests) => {
      if (tests == null) return null
      return tests.length
    }
  ),
  selectActiveTest: createSelector(
    'selectQueryObject',
    'selectTestsResource',
    (query, tests) => {
      if (tests == null) return null
      return tests.find(test => test._id === query.test)
    }
  ),
  doDisplayEndpointTests: (payload) => ({dispatch}) => {
    dispatch({
      type: 'TESTS_REQUESTED_FOR_ENDPOINT',
      payload: payload
    })
  }
  
}
