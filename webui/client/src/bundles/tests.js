import { createSelector } from 'redux-bundler'
import { trim } from 'lodash'

export default {
  name: 'tests',
  getReducer: () => {
    const initialState = {
    }
    return (state=initialState, action) => {
      return state
    }
  },
  selectTestTagsIndexRaw: createSelector(
    'selectActiveEndpoint',
    (endpoint) =>{
        if (endpoint == null) return null
        return endpoint.test_tags
    }
  ),
  selectTestTagsIndex: createSelector(
    'selectTestTagsIndexRaw',
    (testTagsRaw) => {
      if (testTagsRaw == null) return null
      return testTagsRaw.map(rawTag => {
        return trim(rawTag, '[]')
      }
     )
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
