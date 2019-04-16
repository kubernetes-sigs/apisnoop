import { createSelector } from 'redux-bundler'
import {
  groupBy,
  isEmpty,
  mapValues,
  pickBy } from 'lodash'

import endpoints from '../data/endpoints.json'

export default {
  name: 'endpoints',
  getReducer: () => {
    const initialState = endpoints
    return (state=initialState, action) => {
      return state
    }
  },
  selectEndpoints: (state) => {
    let endpoints = state.endpointsResource.data
    let endpointsWithOpId =  mapValues(endpoints, (val, key, obj) => {
      return {
        operationId: key,
        ...val
      }
    })
    return endpointsWithOpId
  },
  selectActiveEndpoint: createSelector(
    'selectEndpoints',
    'selectQueryObject',
    'selectZoom',
    (endpoints, query, zoom) => {
      let activeEndpoint = {}
      if (endpoints == null) return activeEndpoint
      if (zoom && zoom.depth === 'operationId') {
        activeEndpoint = endpoints[zoom.operationId]
        return activeEndpoint
      }
      if (query.operationId) {
        activeEndpoint = endpoints[query.operationId]
        return activeEndpoint
      } else {
        return activeEndpoint
      }
    }
  ),
  selectFilteredEndpoints: createSelector(
    'selectEndpoints',
    'selectOpIdsHitByFilteredUseragents',
    'selectOpIdsHitByFilteredTestTags',
    'selectZoom',
    (endpoints, useragentOpIds, testTagOpIds, zoom) => {
      if (endpoints == null) return null
      if (Array.isArray(useragentOpIds) && useragentOpIds.length > 0) {
        endpoints = filterBy(useragentOpIds, endpoints)
      }
      if (Array.isArray(testTagOpIds) && testTagOpIds.length > 0) {
        endpoints = filterBy(testTagOpIds, endpoints)
      }
      if (!isEmpty(zoom) && (zoom.depth === 'operationId' || zoom.depth === 'category')) {
        endpoints = pickBy(endpoints, (val, key) => val.level === zoom.level && val.category === zoom.category)
      } else if (!isEmpty(zoom) && zoom.depth === 'level') {
        endpoints = pickBy(endpoints, (val, key) => val.level === zoom.level)
      }
      return endpoints
    }
  ),
  selectEndpointsByLevelAndCategoryAndOperatorId: createSelector(
    'selectFilteredEndpoints',
    (endpoints) => {
      if (endpoints == null) return null
      var endpointsByLevel = groupBy(endpoints, 'level')
      return mapValues(endpointsByLevel, endpointsInLevel => {
        var endpointsByCategory = groupBy(endpointsInLevel, 'category')
        return mapValues(endpointsByCategory, endpointsInCategory => {
          return endpointsInCategory.map (endpoint => {
            return {
              ...endpoint,
              size: 1
            }
          })
        })
      })
    }
  )
  ,
}

// opIds, endpoints => endpoints
// if endpoint.opId is in the array of opIds keep it.
function filterBy (filteredOpIds, opIds) {
 return pickBy(opIds, (val, key) => {
    return filteredOpIds.includes(val.operationId)
  })
}
