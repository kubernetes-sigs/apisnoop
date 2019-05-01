import { createSelector } from 'redux-bundler'
import { difference, pickBy, uniq } from 'lodash'

export default {
  name: 'tests',
  getReducer: () => {
    let filterInput
    const initialState = {
      filterInput
    }
    return (state=initialState, {type, payload}) => {
      if (type  === 'TESTS_INPUT_UPDATED') {
        return {...state, filterInput: payload}
      }
      return state
    }
  },
  selectActiveTestsIndex: createSelector(
    'selectActiveEndpoint',
    'selectTestsResource',
    (endpoint, tests) => {
      let activeTests = []
      if (endpoint == null || tests== null) return activeTests
      else {
        activeTests = pickBy(tests, (test) => test.includes(endpoint.operationId))
        return Object.keys(activeTests)
      }
    }
  ),
  selectActiveTest: createSelector(
    'selectQueryObject',
    'selectTestSequencesResource',
    (query, testSequences) => {
      if (testSequences == null || !query.test) return null
      return pickBy(testSequences, (val, key) => key === query.test)
    }
  ),
  selectFilteredTests: createSelector(
    'selectFilteredEndpoints',
    'selectTestsResource',
    (endpoints, tests) => {
      if (endpoints == null || tests == null) return []
      let filteredTests = []
      let endpointNames = Object.keys(endpoints)
      let testNames = Object.keys(tests)
      let i;
      for (i = 0; i < testNames.length; i++) {
        let test = testNames[i]
        let testEndpoints = tests[test]
        let endpointsNotHitByTest = difference(testEndpoints, endpointNames)
        if (endpointsNotHitByTest.length !== testEndpoints.length) {
          filteredTests.push(test)
        }
      }
      return filteredTests
    }
  ),
  selectTestsInput: (state) => state.tests.filterInput,
  selectTestsFilteredByInput: createSelector(
    'selectFilteredTests',
    'selectTestsInput',
    (tests, input) => {
      if (tests == null || input === '') return []
      let isValid = true
      try {
        new RegExp(input)
      } catch (err) {
        isValid = false
      }
      if (!isValid) return ['not valid regex']
  
      return tests.filter(ua => {
        let inputAsRegex = new RegExp(input)
        return inputAsRegex.test(ua)
      })
    }
  )
  ,
  selectTestsFilteredByQuery: createSelector(
    'selectTestsResource',
    'selectQueryObject',
    (tests, query) => {
      if (tests == null || !query) return []
      if (query.tests && query.tests.length) {
        return pickBy(tests, (val, key) => {
          var inputAsRegex = new RegExp(query.tests)
          return inputAsRegex.test(key)
        })
      } else {
        return []
      }
    }
  ),
  selectNamesTestsFilteredByQuery: createSelector(
    'selectTestsFilteredByQuery',
    (tests) => {
      return Object.keys(tests)
    }
  ),
  selectRatioTestsFilteredByQuery: createSelector(
    'selectFilteredTests',
    'selectTestsFilteredByQuery',
    (tests, testsHitByQuery) => {
      if (tests == null || testsHitByQuery == null) return {}
      return {
        totalTests: Object.keys(tests).length || 0,
        testHitByQuery: Object.keys(testsHitByQuery).length || 0
      }
    }
  ),
  selectOpIdsHitByFilteredTests: createSelector(
    'selectTestsFilteredByQuery',
    (tests) => {
      let opIdsHit = []
      let opIds = Object.keys(tests)
      let opId, opIdIndex;
  
      if (tests == null)  {
        return opIdsHit
      }
      for (opIdIndex = 0; opIdIndex < opIds.length; opIdIndex++) {
        opId = opIds[opIdIndex]
        opIdsHit.push(tests[opId])
      }
      return uniq(opIdsHit.flat())
    }
  ),
  doUpdateTestsInput: (payload) => ({dispatch}) => {
    dispatch({
      type: 'TESTS_INPUT_UPDATED',
      payload
    })
  }
  
}
