/*
const { keyBy } = require('lodash')

const initialState = {
  activeTest: {},
  byId: {},
  endpointTests: [],
  errors: {},
  isLoading: false,
  hasLoaded: false
}

export default (state = initialState, action = {}) => {
  switch(action.type) {
  case 'FETCH_TESTS_PENDING': {
    return {
      ...state,
      isLoading: true
    }
  }
  case 'FETCH_TESTS_FULFILLED': {
    return {
      ...state,
      byId: {
        ...state.byId,
        ...keyBy(action.payload.data, '_id')
      },
      isLoading: false,
      hasLoaded: true
    }
  }
  case 'ENDPOINT_TESTS_SET': {
    return {
      ...state,
      endpointTests: action.payload
    }
  }
  case 'NEW_ACTIVE_TEST_CHOSEN': {
    return {
      ...state,
      activeTest: action.payload
    }
  }
  case 'ACTIVE_TEST_CLOSED': {
    return {
      ...state,
      activeTest: {}
    }
  }
  case 'CHART_UNLOCKED': {
    return {
      ...state,
      activeTest: {},
      endpointTests: []
    }
  }
  case 'ACTIVE_ROUTE_CHANGED': {
    return {
      ...state,
      activeTest: {},
      endpointTests: []
    }
  }
  default:
    return state;
  }
}
import { createSelector, createStructuredSelector } from 'reselect'
import { groupBy, keyBy, mapValues } from 'lodash'

export function selectTestsById (state) {
  return state.tests.byId
}

export const selectIsTestsReady = (state) => {
  return state.tests.hasLoaded
}

export const selectEndpointTests = (state) => {
  return state.tests.endpointTests
}

export const selectActiveTestRaw = (state) => {
  return {
    name: state.tests.activeTest,
    route: state.routing.release,
  }
}

export const selectTestsByReleaseAndName = createSelector(
  selectTestsById,
  (testsById) => {
    var testsByRelease = groupBy(testsById, 'release')
    return mapValues(testsByRelease, testsInRelease => {
      var testsByName = keyBy(testsInRelease, 'name')
      return mapValues(testsByName, testInName => {
        return {
          name: testInName.name,
          id: testInName._id,
          sequence: testInName.sequence
        }
      })
    })
  }
)

export const selectActiveTestComponents = createStructuredSelector({
  activeTest: selectActiveTestRaw,
  tests: selectTestsByReleaseAndName
})

export const selectActiveTest = createSelector(
  selectActiveTestComponents,
  (atc) => {
    if (atc.activeTest.name.length > 0) {
      var activeTest = atc.tests[atc.activeTest.route][atc.activeTest.name]
      return activeTest
    } else {
      return atc.activeTest.name
    }
  }
)
import { client } from './'

const url = '/api/v1/tests'

export function doFetchTests () {
  return dispatch => {
    dispatch({
      type: 'FETCH_TESTS',
      payload: client.get(url)
    })
  }
}

export function doChooseActiveTest (test) {
  return {
    type: 'NEW_ACTIVE_TEST_CHOSEN',
    payload: test
  }
}

export function doCloseActiveTest (test) {
  return {
    type: 'ACTIVE_TEST_CLOSED'
  }
}

export function doSetEndpointTests (endpointTests) {
  return {
    type: 'ENDPOINT_TESTS_SET',
    payload: endpointTests
  }
}
*/
