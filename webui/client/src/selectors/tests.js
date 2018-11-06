import { createSelector, createStructuredSelector } from 'reselect'
import { groupBy, keyBy, mapValues, size } from 'lodash'

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
    route: state.routes.activeRoute,
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
