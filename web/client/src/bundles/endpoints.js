import { createSelector } from 'redux-bundler'
import {
    groupBy,
    keyBy,
    mapValues} from 'lodash'

import { calculateCoverage } from '../lib/utils.js'

export default {
  name: 'endpoints',
    selectFilteredEndpoints: createSelector(
      'selectEndpointsResource',
      'selectFilter',
      (endpoints, filter) => {
        if (endpoints == null) return null
        if (filter) {
          var filterAsRegexp = new RegExp(filter)
          endpoints = endpoints.filter(endpoint => filterAsRegexp.test(endpoint.name))
        }
        return endpoints
      }
    ),
    selectFilteredAndZoomedEndpoints: createSelector(
        'selectFilteredEndpoints',
        'selectZoom',
        (endpoints, zoom) => {
            if (endpoints == null) return null
            if (zoom) {
              if (zoom.depth === 'endpoint') {
                endpoints = endpoints.filter(endpoint => endpoint.level === zoom.level && endpoint.category === zoom.category)
              } else if (zoom.depth === 'category') {
                endpoints = endpoints.filter(endpoint => endpoint.level === zoom.level && endpoint.category === zoom.category)
              } else if (zoom.depth === 'level') {
                endpoints = endpoints.filter(endpoint => endpoint.level === zoom.level)
              }
            }
            return endpoints
        }
    ),
    selectZoomedEndpoint: createSelector(
        'selectEndpointsResource',
        'selectZoom',
        (endpoints,zoom) => {
            if (endpoints == null) return null
            if (zoom == null | zoom === undefined) return null
            if (zoom.depth === 'endpoint') {
                var zoomedEndpoint = endpoints.find(endpoint => endpoint.name === zoom.name)
                return zoomedEndpoint
            }
        }
    ),
    selectEndpointsById: createSelector(
        'selectFilteredAndZoomedEndpoints',
        (endpoints) => {
            if (endpoints == null) return null
            return keyBy(endpoints, '_id')
        }
    ),
    selectEndpointsByLevelAndCategoryAndNameAndMethod: createSelector(
        'selectEndpointsById',
        (endpointsById) => {
            var endpointsByLevel = groupBy(endpointsById, 'level')
            return mapValues(endpointsByLevel, endpointsInLevel => {
                var endpointsByCategory = groupBy(endpointsInLevel, 'category')
                return mapValues(endpointsByCategory, endpointsInCategory => {
                    var endpointsByName = groupBy(endpointsInCategory, 'name')
                    return mapValues(endpointsByName, endpointsInName => {
                        return keyBy(endpointsInName, 'method')
                    })
                })
            })
        }
    ),
    selectEndpointsWithTestCoverage: createSelector(
        'selectEndpointsById',
        (endpointsById) => {
            var endpointsByLevel = groupBy(endpointsById, 'level')
            var coverage = calculateCoverage(endpointsById)
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
        }
    ),
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
    )
}
