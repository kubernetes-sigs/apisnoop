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
    'selectEndpointsResource',
    'selectQueryObject',
    'selectZoom',
    (endpoints, query, zoom) => {
      if (endpoints == null) return null
      if (zoom && zoom.depth === 'endpoint') {
        return endpoints[zoom.operatorID]
      }
      if (query.operationId) {
        return endpoints[query.operationId]
      }
  
      return {}
    }
  ),
  selectFilteredEndpoints: createSelector(
    'selectEndpoints',
    'selectOpIdsHitByFilteredUseragents',
    'selectZoom',
    (endpoints, opIds, zoom) => {
      if (endpoints == null) return null
      if (Array.isArray(opIds) && opIds.length > 0) {
        // if endpoint.opId is in the array of opIds keep it.
        endpoints = pickBy(endpoints, (val, key) => {
          return opIds.includes(val.operationId)
        })
      }
      if (!isEmpty(zoom) && (zoom.depth === 'endpoint' || zoom.depth === 'category')) {
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
