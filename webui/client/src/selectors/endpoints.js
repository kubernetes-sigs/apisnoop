import { createSelector } from 'reselect'
import { groupBy, keyBy, mapValues } from 'lodash'

export function selectEndpointsById (state) {
  return state.endpoints.byId
}

export const selectEndpointsByReleaseAndNameAndMethod = createSelector(
  selectEndpointsById,
  (endpointsById) => {
    var endpointsByRelease = groupBy(endpointsById, 'release')
    return mapValues(endpointsByRelease, endpointsInRelease => {
      var endpointsByName = groupBy(endpointsInRelease, 'name')
      return mapValues(endpointsByName, endpointsInName => {
        return keyBy(endpointsInName, 'method')
      })
    })
  }
)

export const selectEndpointsByReleaseAndLevelAndCategoryAndNameAndMethod = createSelector(
  selectEndpointsById,
  (endpointsById) => {
    var endpointsByRelease = groupBy(endpointsById, 'release')
    return mapValues(endpointsByRelease, endpointsInRelease => {
      var endpointsByLevel = groupBy(endpointsInRelease, 'level')
      return mapValues(endpointsByLevel, endpointsInLevel => {
        var endpointsByCategory = groupBy(endpointsInLevel, 'category')
        return mapValues(endpointsByCategory, endpointsInCategory => {
          var endpointsByName = groupBy(endpointsInCategory, 'name')
          return mapValues(endpointsByName, endpointsInName => {
            return keyBy(endpointsInName, 'method')
          })
        })
      })
    })
  }
)

export const selectIsEndpointsReady = (state) => {
  return state.endpoints.hasLoaded
}
