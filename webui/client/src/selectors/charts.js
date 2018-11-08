import { createSelector, createStructuredSelector } from 'reselect'
import { forEach, get, includes, map, mapValues, orderBy, sortBy, reduce, values, without } from 'lodash'

import { selectEndpointsByReleaseAndLevelAndCategoryAndNameAndMethod,
         selectEndpointsWithTestCoverage,
         selectIsEndpointsReady } from './endpoints'
import { selectRelease } from './routing'


export function selectFocusPathAsArray (state) {
  return state.charts.focusedKeyPath
}

export function selectChartLocked (state) {
  return state.charts.chartLocked
}

export const selectFocusPathAsString = createSelector(
  selectFocusPathAsArray,
  (pathAsArray) => {
    return pathAsArray.join().replace(/,/g,' / ')
  }
)

export const selectInteriorLabelComponents = createStructuredSelector({
  focusPath: selectFocusPathAsArray,
  isEndpointsReady: selectIsEndpointsReady,
  endpoints: selectEndpointsWithTestCoverage,
  releaseFromRoute: selectRelease
}
                                                                     )
// TODO make this muuuuch better.  The nesting is gross, but it is because
// I am trying to make up an coverage thing to have our interior label work.  The ultimate goal is to be able to hover over a node and see either it's coverage (if it has children) or it's test_tags (if it doesn't)
export const selectInteriorLabel = createSelector(
  selectInteriorLabelComponents,
  (components) => {
    const { focusPath, endpoints, isEndpointsReady, releaseFromRoute } = components
    if (isEndpointsReady) {
      if (!focusPath.length) {
        return endpoints[releaseFromRoute]['coverage']
      } else {
        var path = (without(focusPath, 'root'))
        var testedEndpoint = get(endpoints[releaseFromRoute], path)
        if (testedEndpoint && testedEndpoint.coverage) {
          return testedEndpoint.coverage
        } else if (!testedEndpoint) {
          return {description: 'untested', test_tags: []}
        } else {
          var method = Object.keys(testedEndpoint)[0]
          return {description: testedEndpoint[method]['description'],
                  test_tags: testedEndpoint[method]['test_tags']
                 }
        }
      }
    }
  }
)

export const selectSunburstByRelease = createSelector(
  selectEndpointsByReleaseAndLevelAndCategoryAndNameAndMethod,
  (endpointsByReleaseAndLevelAndCategoryAndNameAndMethod) => {
    var dataByRelease = mapValues(endpointsByReleaseAndLevelAndCategoryAndNameAndMethod, (endpointsByLevelAndCategoryAndNameAndMethod, release) => {
      return {
        name: 'root',
        children: map(endpointsByLevelAndCategoryAndNameAndMethod, (endpointsByCategoryAndNameAndMethod, level) => {
          return {
            name: level,
            color: colors[level],
            children: map(endpointsByCategoryAndNameAndMethod, (endpointsByNameAndMethod, category) => {
              return {
                name: category,
                color: colors[`category.${category}`],
                children: endpointsSortedByConformance(endpointsByNameAndMethod)
              }
            })
          }
        })
      }
    })
    return {
      dataByRelease
    }
  }
)

function endpointsSortedByConformance (endpointsByNameAndMethod) {
  var endpoints = createEndpointAndMethod(endpointsByNameAndMethod)
  var sortedEndpoints = sortBy(endpoints, [
    (endpoint) => endpoint.name === 'Untested',
    (endpoint) => endpoint.isConformance !== 'conformance'])
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
    var path = isTested ? `${name}/${method}` : 'Untested'
    var size = (sofar[path] == null) ? 1 : sofar[path].size + 1
    sofar[path] = {
      name: isTested ? name : 'Untested',
      isConformance: isConformance ? "conformance" : "not conformance",
      size,
      color: isTested ? calculateColor(endpoint) : '#f4f4f4',
    }
  })
  return sofar
}

function checkForConformance (test_tags) {
  var tagsAsStrings = test_tags.map(tag => tag.replace(/\[|]/g,''))
  return includes(tagsAsStrings, 'Conformance')
}

export const selectSunburstByReleaseWithSortedLevel = createSelector(
  selectSunburstByRelease,
  (endpointsByRelease) => {
    var dataByRelease = endpointsByRelease.dataByRelease
    var sortedDataByRelease = mapValues(dataByRelease, (release) => {
      var levels = release.children
      var sortedLevels = orderBy(levels, 'name', 'desc')
      release.children = sortedLevels
      return release
    })
    endpointsByRelease.dataByRelease = sortedDataByRelease
    return endpointsByRelease
  }
)

export const selectIsSunburstReady = selectIsEndpointsReady

var colors = {
  'alpha': '#e6194b',
  'beta': '#0082c8',
  'stable': '#3cb44b',
  'unused': '#ffffff'
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
  "version"
]

var more_colors = [
  "#b71c1c", "#880E4F", "#4A148C", "#311B92", "#1A237E", "#0D47A1",
  "#01579B", "#006064", "#004D40", "#1B5E20", "#33691E", "#827717",
  "#F57F17", "#FF6F00", "#E65100", "#BF360C", "#f44336", "#E91E63",
  "#9C27B0", "#673AB7", "#3F51B5", "#2196F3", "#03A9F4", "#00BCD4",
  "#009688", "#4CAF50", "#8BC34A", "#CDDC39", "#FFEB3B", "#FFC107",
  "#FF9800", "#FF5722"
]

for (var catidx = 0; catidx < categories.length; catidx++) {
  var category = categories[catidx]
  colors['category.' + category] = more_colors[(catidx * 3) % more_colors.length]
}

function calculateColor (endpoint) {
  if (endpoint.isTested)  {
    return colors[`category.${endpoint.category}`]
  } else {
    return '#f4f4f4'
  }
}
