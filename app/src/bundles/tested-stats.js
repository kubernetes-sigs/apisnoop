import { createSelector } from 'redux-bundler'
import { filter,
         groupBy,
         isEmpty,
         keyBy,
         mapValues } from 'lodash'

export default {
  name: 'testedStats',
  selectTestedStats: createSelector(
    'selectFilteredEndpoints',
    (endpoints) => {
      if (endpoints == null) return null
      var endpointsWithOpIds = mapValues(endpoints, (value, key, endpoints) => {
        return {operationId: key, ...value}
      })
      var testedStats = gatherTestedStats(endpoints)
      var endpointsByLevel = groupBy(endpointsWithOpIds, 'level')
      return {
        ...testedStats,
        ...mapValues(endpointsByLevel, (endpointsInLevel) => {
          var testedStats = gatherTestedStats(endpointsInLevel)
          var endpointsByCategory = groupBy(endpointsInLevel, 'category')
          return {
            ...testedStats,
            ...mapValues(endpointsByCategory, (endpointsInCategory) => {
              var testedStats = gatherTestedStats(endpointsInCategory)
              var endpoints = keyBy(endpointsInCategory, 'operationId')
              return {
                ...testedStats,
                ...mapValues(endpoints, (endpoint) => {
                  var testedStats = gatherEndpointTestedStats(endpoint)
                  return {
                    ...testedStats
                  }
                })
              }
            })
          }
        })
      }
    }
  ),
  selectActiveStats: createSelector(
    'selectTestedStats',
    'selectQueryObject',
    'selectZoom',
    (stats, query, zoom) => {
      if (stats == null || isEmpty(stats)) return null
      if (!isEmpty(query) && !query.level && !query.zoomed) {
        return {
          labelX: stats.labelX,
          labelY: stats.labelY,
          labelZ: stats.labelZ,
        }
      }
      if (isEmpty(query) || (!query.level && (zoom && !zoom.operationId))) {
        return {
          labelX: stats.labelX,
          labelY: stats.labelY,
          labelZ: stats.labelZ,
        }
      }
      if (query.operationId) {
        return {
          labelX: stats[query.level][query.category][query.operationId].labelX,
          labelY: stats[query.level][query.category][query.operationId].labelY,
          labelZ: stats[query.level][query.category][query.operationId].labelZ
        }
      }
      if (zoom && zoom.depth === 'operationId') {
        console.log({stats, zoom})
        return {
          labelX: stats[zoom.level][zoom.category][zoom.operationId].labelX,
          labelY: stats[zoom.level][zoom.category][zoom.operationId].labelY,
          labelZ: stats[zoom.level][zoom.category][zoom.operationId].labelZ
        }
      }
      if (query.category && !query.operationId) {
        return {
          labelX: stats[query.level][query.category].labelX,
          labelY: stats[query.level][query.category].labelY,
          labelZ: stats[query.level][query.category].labelZ,
        }
      }
      if (query.level && !query.category) {
        return {
          labelX: stats[query.level].labelX,
          labelY: stats[query.level].labelY,
          labelZ: stats[query.level].labelZ,
        }
      } else {
        return {
          labelX: '',
          labelY: '',
          labelZ: ''
        }
      }
    }
  )
  
}

function calculateNumber (endpoints, key) {
  var endpointsWithPositiveValue = filter(endpoints, (endpoint) => endpoint[key] > 0)
  return endpointsWithPositiveValue.length
}

function gatherTestedStats (endpoints) {
  if (isEmpty(endpoints)) return {}
  var totalOpIds = Object.keys(endpoints).length
  var testedOpIds = calculateNumber(endpoints, 'testHits')
  var conformanceTestedOpIds = calculateNumber(endpoints, 'conformanceHits')
  var percentTested = Math.round((testedOpIds / totalOpIds) * 100)
  var percentConformanceTested = Math.round((conformanceTestedOpIds / totalOpIds) * 100)
  var labelX = totalOpIds > 1 ? `${totalOpIds} endpoints` : `${totalOpIds} endpoint`
  var labelY = `${percentTested}% hit by tests.`
  var labelZ = `${percentConformanceTested}% hit by conformance tests.`
  return {
    labelX,
    labelY,
    labelZ
  }
}

function gatherEndpointTestedStats (endpoint) {
  var tested = endpoint.testHits > 1
  var conformanceTested = endpoint.conformanceHits > 1
  var labelX = () => {
    if (tested && conformanceTested) {
      return 'Tested and Conformance Tested'
    } else if (tested && !conformanceTested) {
      return 'Tested, but not Conformance Tested'
    } else {
      return 'Not Tested'
    }
  }
  var labelY = () => {
    if (tested) {
      return endpoint.testHits > 1
        ? `hit by tests ${endpoint.testHits} times`
        : `hit by tests ${endpoint.testHits} time`
    } else {
      if (endpoint.hits === 0) return 'Not Hit'
      return endpoint.hits > 1
        ? `hit ${endpoint.hits} times overall`
        : `hit ${endpoint.hits} time overall`
    }
  }
  var labelZ = () => {
    if (conformanceTested) {
      return endpoint.conformanceHits > 1
        ? `hit by conformance tests ${endpoint.conformanceHits} times`
        : `hit by conformance tests ${endpoint.conformanceHits} time`
    } else {
      return ''
    }
  }
  return {
    tested,
    testHits: endpoint.testHits,
    conformanceTested,
    conformanceHits: endpoint.conformanceHits,
    hits: endpoint.hits,
    labelX: labelX(),
    labelY: labelY(),
    labelZ: labelZ()
  }
}
