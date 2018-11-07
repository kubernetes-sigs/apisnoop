import { createSelector } from 'reselect'
import { groupBy, keyBy, mapValues } from 'lodash'
import { calculateCoverage } from '../lib/utils.js'

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

export const selectReleaseNamesFromEndpoints = createSelector(
  selectEndpointsByReleaseAndNameAndMethod,
  (endpointsByReleaseAndNameAndMethod) => {
    return Object.keys(endpointsByReleaseAndNameAndMethod)
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

export const selectEndpointsWithTestCoverage = createSelector(
  selectEndpointsById,
  (endpointsById) => {
    var endpointsByRelease = groupBy(endpointsById, 'release')
    return mapValues(endpointsByRelease, endpointsInRelease => {
      var endpointsByLevel = groupBy(endpointsInRelease, 'level')
      var coverage = calculateCoverage(endpointsInRelease)
      return Object.assign({},{coverage}, mapValues(endpointsByLevel, endpointsInLevel => {
        var endpointsByCategory = groupBy(endpointsInLevel, 'category')
        var coverage = calculateCoverage(endpointsInLevel)
        return Object.assign({}, {coverage}, mapValues(endpointsByCategory, endpointsInCategory => {
          var endpointsByName = groupBy(endpointsInCategory, 'name')
          var coverage = calculateCoverage(endpointsInCategory)
          return Object.assign({}, {coverage}, mapValues(endpointsByName, endpointsInName => {
            var methods = keyBy(endpointsInName, 'method')
            return mapValues(methods, method => {
              var coverage = method.test_tags ? method.test_tags : [] // display empty array if untested, so chart don't break.
              return Object.assign({}, {coverage}, method)
            })
          }))
        }))
      }))
    })
  }
)

export const selectIsEndpointsReady = (state) => {
  return state.endpoints.hasLoaded
}
