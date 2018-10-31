import { createSelector } from 'reselect'
import { forEach, map, mapValues, reduce, values } from 'lodash'

import { selectEndpointsByReleaseAndLevelAndCategoryAndNameAndMethod, selectIsEndpointsReady } from './endpoints'

export const selectSunburstByRelease = createSelector(
  selectEndpointsByReleaseAndLevelAndCategoryAndNameAndMethod,
  (endpointsByReleaseAndLevelAndCategoryAndNameAndMethod) => {
    return mapValues(endpointsByReleaseAndLevelAndCategoryAndNameAndMethod, (endpointsByLevelAndCategoryAndNameAndMethod, release) => {
      return {
        name: 'root',
        children: map(endpointsByLevelAndCategoryAndNameAndMethod, (endpointsByCategoryAndNameAndMethod, level) => {
          return {
            name: level,
            children: map(endpointsByCategoryAndNameAndMethod, (endpointsByNameAndMethod, category) => {
              return {
                name: category,
                children: values(reduce(
                  endpointsByNameAndMethod,
                  (sofar, endpointsByMethod, name) => {
                    forEach(endpointsByMethod, (endpoint, method) => {
                      var { isTested } = endpoint
                      var color = 'green'
                      var path = isTested ? `${name}/${method}` : 'untested'
                      var size = (sofar[path] == null) ? 1 : sofar[path].size + 1
                      sofar[path] = {
                        color,
                        size,
                        name,
                        method,
                        isTested
                      }
                    })
                    return sofar
                  },
                  {}
                ))
              }
            })
          }
        })
      }
    })
  }
)

export const selectIsSunburstReady = selectIsEndpointsReady
