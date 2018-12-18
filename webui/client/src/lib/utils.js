import {
  filter,
  isUndefined,
  size,
  words,
  pickBy } from 'lodash'

export function calculateCoverage (endpoints) {
  var total = size(endpoints)
  var tested = size(filter(endpoints, ['isTested', true]))
  var percentage = (100 * tested /total).toPrecision(3)

  return {
    tested,
    total,
    percentage: `${percentage}%`,
    ratio: `${tested}/${total}`
  }
}

export function fadeColor (rgba, desiredOpacity) {
  var rgbaParts = words(rgba, /[^,|^(|^)]+/g)
  rgbaParts.pop()
  rgbaParts.push(desiredOpacity)
  var newRgbaString = rgbaParts.join(',')
  var newRgba = newRgbaString.replace(/,/,'(') + ')'
  return newRgba
}

export function propertiesWithValue (obj) {
  return pickBy(obj, (val) => !isUndefined(val))
}
