import { createSelector } from 'redux-bundler'
import {
  groupBy,
  isEmpty,
  mapValues,
  pickBy,
  transform } from 'lodash'

import endpoints from '../data/endpoints.json'

export default {
  name: 'endpoints',
    getReducer: () => {
      const initialState = endpoints
      return (state=initialState, action) => {
        return state
      }
    },
    selectEndpoints: (state) => state.endpoints,
    selectFilteredEndpoints: createSelector(
      'selectEndpoints',
      'selectZoom',
      (endpoints, zoom) => {
        if (endpoints == null) return null
        if (isEmpty(zoom)) return endpoints
        if (zoom.depth === 'endpoint' || zoom.depth === 'category') {
          endpoints = pickBy(endpoints, (val, key) => val.level === zoom.level && val.category === zoom.category)
        } else if (zoom.depth === 'level') {
          endpoints =pickBy(endpoints, (val, key) => val.level === zoom.level)
        }
        return endpoints
      }
    ),
    selectEndpointsByLevelAndCategoryAndOperatorId: createSelector(
      'selectFilteredEndpoints',
      (endpoints) => {
        var endpointsWithOpIds = mapValues (endpoints, (value, key, endpoints) => {
          return {operatorId: key, ...value}
        })
        var endpointsByLevel = groupBy(endpointsWithOpIds, 'level')
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
    
}

selectFilteredEndpoints: createSelector(
  'selectEndpoints',
  'selectZoom',
  (endpoints, zoom) => {
    if (endpoints == null) return null
    if (isEmpty(zoom)) return endpoints
    if (zoom.depth === 'endpoint' || zoom.depth === 'category') {
      endpoints = pickBy(endpoints, (val, key) => val.level === zoom.level && val.category === zoom.category)
    } else if (zoom.depth === 'level') {
      endpoints =pickBy(endpoints, (val, key) => val.level === zoom.level)
    }
    return endpoints
  }
)
