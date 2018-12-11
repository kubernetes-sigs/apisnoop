

import { fadeColor } from '../lib/utils'
import { createSelector } from 'redux-bundler'
import {
  assign,
  forEach,
  get,
  includes,
  isEmpty,
  map,
  mapValues,
  orderBy,
  reduce,
  sortBy,
  values,
  without
} from 'lodash'

export default {
  name: 'charts',
  getReducer: () => {
    const initialState = {
      focusedKeyPath: [],
      chartLocked: false
    }
  
    return (state = initialState, action = {}) => {
      if (action.type === 'CHART_FOCUSED') {
        return {
          ...state,
          focusedKeyPath: action.payload
        }
      }
      if (action.type === 'CHART_UNFOCUSED') {
        return {
          ...state,
          focusedKeyPath: []
        }
      }
      if (action.type === 'CHART_LOCKED') {
        return {
          ...state,
          chartLocked: true
        }
      }
      if (action.type === 'CHART_UNLOCKED') {
        return {
          ...state,
          chartLocked: false
        }
      }
      return state;
    }
  },
  selectSunburst: createSelector(
    'selectEndpointsByLevelAndCategoryAndNameAndMethod',
    'selectLevelColours',
    'selectCategoryColours',
    'selectQueryObject',
    (endpointsByLevelAndCategoryAndNameAndMethod, levelColours, categoryColours, queryObject) => {
      return {
        name: 'root',
        children: map(endpointsByLevelAndCategoryAndNameAndMethod, (endpointsByCategoryAndNameAndMethod, level) => {
          return {
            name: level,
            color: determineLevelColours(queryObject, levelColours, level),
            children: categoriesSortedByEndpointCount(endpointsByCategoryAndNameAndMethod, level, categoryColours, queryObject)
          }
        })
      }
    }
  ),
  selectLabelStyle: () => {
    return {
      PERCENTAGE: {
        fontSize: '1.3em',
        textAnchor: 'middle'
      },
      FRACTION: {
        fontSize: '1.2em,',
        textAnchor: 'middle'
      },
      PATH: {
        fontSize: '1em',
        textAnchor: 'middle'
      },
      DESCRIPTION: {
        fontSize: '0.9em',
        textAnchor: 'middle'
      }
    }
  },
  doLockChart: () => {
    return {
      type: 'CHART_LOCKED'
    }
  },
  doUnlockChart: () => {
    return {
      type: 'CHART_UNLOCKED'
    }
  },
  doUnfocusChart: () => {
    return {
      type: 'CHART_UNFOCUSED'
    }
  }
}

function determineLevelColours (query, colours, level) {
  if (isEmpty(query)) {
    return colours[level]
  } else if (query.level === level){
    return colours[level]
  } else {
    return fadeColor(colours[level], '0.1')
  }
}
function determineCategoryColours (query, categoryColours, category, level) {
  if (isEmpty(query)) {
    return categoryColours[`category.${category}`]
  } else if (query.level === level && query.category === category){
    return categoryColours[`category.${category}`]
  } else {
    return fadeColor(categoryColours[`category.${category}`], '0.1')
  }
}
function determineEndpointColours (query, color, category, level, endpoint) {
  if (isEmpty(query)) {
    return color
  } else if (query.level === level && query.category === category && query.name === endpoint.name){
    return color
  } else {
    return fadeColor(color, '0.1')
  }

}
function calculateInitialColor (endpoint, isConformance) {
  if (endpoint.isTested && isConformance)  {
    return colors[`category.${endpoint.category}`]
  } else  if( endpoint.isTested && !isConformance) {
    var color = colors[`category.${endpoint.category}`]
    var fadedColor = fadeColor(color, '0.2')
    return fadedColor
  } else {
    return 'rgba(244, 244, 244, 1)'
  }
}
function categoriesSortedByEndpointCount (endpointsByCategoryAndNameAndMethod, level, categoryColours, queryObject) {
  var categories = categoriesWithEndpointsAsChildren(endpointsByCategoryAndNameAndMethod, level, categoryColours, queryObject)
  return orderBy(categories, (category) => category.children.length, ['desc'])
}

function categoriesWithEndpointsAsChildren (endpointsByCategoryAndNameAndMethod, level, categoryColours, queryObject) {
  return map(endpointsByCategoryAndNameAndMethod, (endpointsByNameAndMethod, category) => {
    return {
      name: category,
      color: determineCategoryColours(queryObject, categoryColours, category, level),
      children: endpointsSortedByConformance(endpointsByNameAndMethod, category, level, queryObject, categoryColours)
    }
  })
}

function endpointsSortedByConformance (endpointsByNameAndMethod, category, level, queryObject, categoryColours) {
  var endpoints = createEndpointAndMethod(endpointsByNameAndMethod, category, level, queryObject, categoryColours)
  var sortedEndpoints = sortBy(endpoints, [
    (endpoint) => endpoint.tested === 'untested', (endpoint) => endpoint.isConformance !== 'conformance',
    (endpoint) => endpoint.testTagCount
  ])
  return sortedEndpoints
}

function createEndpointAndMethod(endpointsByNameAndMethod, category, level, queryObject, categoryColours) {
  return values(reduce(
    endpointsByNameAndMethod,
    (sofar, endpointsByMethod, name) => {
      sofar = fillOutMethodInfo(sofar, endpointsByMethod, category, name, level, queryObject, categoryColours)
      return sofar
    },
    {}
  ))
}

function fillOutMethodInfo (sofar, endpointsByMethod, category, name, level, queryObject, categoryColours) {
  forEach(endpointsByMethod, (endpoint, method) => {
    var { isTested } = endpoint
    var isConformance = checkForConformance(endpoint.test_tags)
    var path = `${name}/${method}`
    var size = (sofar[path] == null) ? 1 : sofar[path].size + 1
    var initialColor = calculateInitialColor(endpoint, isConformance)
    sofar[path] = {
      name,
      parentName: category,
      testTagCount: endpoint.test_tags.length,
      tested: isTested ? 'tested' : 'untested',
      isConformance: isConformance ? "conformance" : "not conformance",
      size,
      color: isTested ? determineEndpointColours(queryObject, initialColor, category, level, endpoint) : 'rgba(244,244,244, 1)',
    }
  })
  return sofar
}

function checkForConformance (test_tags) {
  var tagsAsStrings = test_tags.map(tag => tag.replace(/\[|]/g,''))
  return includes(tagsAsStrings, 'Conformance')
}

var colors = {
  'alpha': 'rgba(230, 25, 75, 1)',
  'beta': 'rgba(0, 130, 200, 1)',
  'stable': 'rgba(60, 180, 75, 1)',
  'unused': 'rgba(255, 255, 255, 1)'
}

var categories = [
  "admissionregistration",
  "apiextensions",
  "apiregistration",
  "apis",
  "apps",
  "authentication",
  "authorization",
  "autoscaling",
  "batch",
  "certificates",
  "core",
  "events",
  "extensions",
  "logs",
  "networking",
  "policy",
  "rbacAuthorization",
  "scheduling",
  "settings",
  "storage",
  "version",
  "auditregistration",
  "coordination"
]

var more_colors = [
  'rgba(183, 28, 28, 1)',
  'rgba(136, 14, 79, 1)',
  'rgba(74, 20, 140, 1)',
  'rgba(49, 27, 146, 1)',
  'rgba(26, 35, 126, 1)',
  'rgba(13, 71, 161, 1)',
  'rgba(1, 87, 155, 1)',
  'rgba(0, 96, 100, 1)',
  'rgba(0, 77, 64, 1)',
  'rgba(27, 94, 32, 1)',
  'rgba(51, 105, 30, 1)',
  'rgba(130, 119, 23, 1)',
  'rgba(245, 127, 23, 1)',
  'rgba(255, 111, 0, 1)',
  'rgba(230, 81, 0, 1)',
  'rgba(191, 54, 12, 1)',
  'rgba(244, 67, 54, 1)',
  'rgba(233, 30, 99, 1)',
  'rgba(156, 39, 176, 1)',
  'rgba(103, 58, 183, 1)',
  'rgba(63, 81, 181, 1)',
  'rgba(33, 150, 243, 1)',
  'rgba(3, 169, 244, 1)',
  'rgba(0, 188, 212, 1)',
  'rgba(0, 150, 136, 1)',
  'rgba(76, 175, 80, 1)',
  'rgba(139, 195, 74, 1)',
  'rgba(205, 220, 57, 1)',
  'rgba(255, 235, 59, 1)',
  'rgba(255, 193, 7, 1)',
  'rgba(255, 152, 0, 1)',
  'rgba(255, 87, 34, 1)'
]

for (var catidx = 0; catidx < categories.length; catidx++) {
  var category = categories[catidx]
  colors['category.' + category] = more_colors[(catidx * 3) % more_colors.length]
}
