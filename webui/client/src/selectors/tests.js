import { createSelector } from 'reselect'
import { groupBy, keyBy, mapValues, size } from 'lodash'

export function selectTestsById (state) {
  return state.tests.byId
}

export const selectIsTestsReady = (state) => {
  return state.tests.hasLoaded
}

export const selectActiveTest = (state) => {
  if( size(state.tests.activeTest) > 0) {
    var activeId = state.tests.activeTest.id
    return state.tests.byId[activeId]
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
          id: testInName._id
        }
      })
    })
  }
)
