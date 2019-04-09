import { createSelector } from 'redux-bundler'
import { groupBy, mapValues, transform } from 'lodash'

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
    selectEndpointsByLevelAndCategoryAndOperatorId: createSelector(
      'selectEndpoints',
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
