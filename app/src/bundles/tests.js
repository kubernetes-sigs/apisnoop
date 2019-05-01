import { createSelector } from 'redux-bundler'
import { pickBy, uniq } from 'lodash'

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
  selectTestsInput: (state) => state.tests.filterInput,
  selectTestsFilteredByInput: createSelector(
    'selectTestsResource',
    'selectTestsInput',
    (tests, input) => {
      if (tests == null || input === '') return []
      let testsNames = Object.keys(tests)
      let isValid = true
      try {
        new RegExp(input)
      } catch (err) {
        isValid = false
      }
      if (!isValid) return ['not valid regex']
  
      return testsNames.filter(ua => {
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
