import { createSelector } from 'redux-bundler'
import { map, orderBy, sortBy } from 'lodash'
import { fadeColour } from '../lib/utils'

export default {
  name: 'sunburst',
  selectSunburst: createSelector(
    'selectEndpointsByLevelAndCategoryAndOperatorId',
    'selectLevelColours',
    'selectCategoryColours',
    'selectQueryObject',
    (endpointsByLevelAndCategoryAndOperatorId, levelColours, categoryColours, query) => {
      var sunburst = {
        name: 'root',
        children: map(endpointsByLevelAndCategoryAndOperatorId, (endpointsByCategoryAndOperatorId, level) => {
          return {
            name: level,
            color: determineLevelColours(query, levelColours, level),
            children: map(endpointsByCategoryAndOperatorId, (endpointsByOperatorId, category) => {
              return {
                name: category,
                color: determineCategoryColours(query, categoryColours, category, level),
                children: sortedEndpoints(endpointsByOperatorId, categoryColours, query)
              }
            })
          }
        })
      }
      var sortedLevels = orderBy(sunburst.children, 'name', 'desc')
      sunburst.children = sortedLevels
      return sunburst
    }
  )
}

function determineLevelColours (query, colours, level) {
  if (query.level === undefined || query.level === level) {
    return colours[level]
  } else {
    return fadeColour(colours[level], '0.1')
  }
}

function determineCategoryColours (query, categoryColours, category, level) {
  if (query.level === undefined) {
    return categoryColours[`category.${category}`]
  } else if (query.level === level && query.category === category){
    return categoryColours[`category.${category}`]
  } else {
    return fadeColour(categoryColours[`category.${category}`], '0.1')
  }
}

function determineEndpointColour (endpoint, categoryColours, query) {
  var initialColor = determineInitialEndpointColour(endpoint, categoryColours)
  if (query.level === undefined) {
    return initialColor
  }
  if (query.operatorId && query.operatorId === endpoint.operatorId) {
    return initialColor
  } else {
    return fadeColour(initialColor, '0.1')
  }
}

function determineInitialEndpointColour (endpoint, categoryColours) {
  if (endpoint.testHits > 0 && endpoint.conformanceHits > 0)  {
    return categoryColours[`category.${endpoint.category}`]
  } else  if( endpoint.testHits > 0 && endpoint.conformanceHits === 0) {
    var color = categoryColours[`category.${endpoint.category}`]
    var fadedColor = fadeColour(color, '0.2')
    return fadedColor
  } else {
    return 'rgba(244, 244, 244, 1)'
  }
}

function sortedEndpoints (endpoints, categoryColours, query) {
  var sortedEndpoints = sortBy(endpoints, [
    'kind',
    (endpoint) => endpoint.testHits > 0,
    (endpoint) => endpoint.conformanceHits > 0
  ])
  return sortedEndpoints.map(endpoint => {
    return {
      name: endpoint.operatorId,
      kind: endpoint.kind,
      size: endpoint.size,
      color: determineEndpointColour(endpoint, categoryColours, query)
    }
  })
}
