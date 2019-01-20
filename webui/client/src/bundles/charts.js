import { fadeColor } from '../lib/utils'
import { createSelector } from 'redux-bundler'
import {
  forEach,
  get,
  includes,
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
    (endpointsByLevelAndCategoryAndNameAndMethod) => {
      return {
        name: 'root',
        children: map(endpointsByLevelAndCategoryAndNameAndMethod, (endpointsByCategoryAndNameAndMethod, level) => {
          return {
            name: level,
            color: colors[level],
            children: categoriesSortedByEndpointCount(endpointsByCategoryAndNameAndMethod)
          }
        })
      }
    }
  ),
  doFocusChart: (keyPath) => {
    return function ({ dispatch, getState }) {
      dispatch({
        type: 'CHART_FOCUSED',
        payload: keyPath
      })
  
      const state = getState()
      const {route} = state
      const { url, params } = route
      const { level, category, endpoint, method } = params
      dispatch({
        type: 'URL_UPDATED',
        payload: {
          url: route.url,
          params: assign({}, route.params, {
            level,
            category,
            endpoint,
            method
          })
        }
      })
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

function categoriesWithEndpointsAsChildren (endpointsByCategoryAndNameAndMethod) {
  return map(endpointsByCategoryAndNameAndMethod, (endpointsByNameAndMethod, category) => {
    return {
      name: category,
      color: colors[`category.${category}`],
      children: endpointsSortedByConformance(endpointsByNameAndMethod)
    }
  })
}

function endpointsSortedByConformance (endpointsByNameAndMethod) {
  var endpoints = createEndpointAndMethod(endpointsByNameAndMethod)
  var sortedEndpoints = sortBy(endpoints, [
    (endpoint) => endpoint.tested === 'untested',
    (endpoint) => endpoint.isConformance !== 'conformance',
    (endpoint) => endpoint.testTagCount
  ])
  return sortedEndpoints
}

function createEndpointAndMethod(endpointsByNameAndMethod) {
  return values(reduce(
    endpointsByNameAndMethod,
    (sofar, endpointsByMethod, name) => {
      sofar = fillOutMethodInfo(sofar, endpointsByMethod, name)
      return sofar
    },
    {}
  ))
}

// TODO change endpoint to method for clarity starting on line 115
function fillOutMethodInfo (sofar, endpointsByMethod, name) {
  forEach(endpointsByMethod, (endpoint, method) => {
    var { isTested } = endpoint
    var isConformance = checkForConformance(endpoint.test_tags)
    var path = `${name}/${method}`
    var size = (sofar[path] == null) ? 1 : sofar[path].size + 1
    sofar[path] = {
      name,
      testTagCount: endpoint.test_tags.length,
      tested: isTested ? 'tested' : 'untested',
      isConformance: isConformance ? "conformance" : "not conformance",
      size,
      color: isTested ? calculateColor(endpoint, isConformance) : 'rgba(244,244,244, 1)',
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

function calculateColor (endpoint, isConformance) {
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
