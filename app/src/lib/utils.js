import {
  isUndefined,
  words,
  pickBy } from 'lodash'

export function fadeColour (rgba, desiredOpacity) {
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

export function fetchResource (gsPath, resource) {
  var fullPath = gsPath + resource
  return fetch(fullPath)
    .then((response) => {
      if (!response.ok) {
        throw new Error("HTTP error, status = " + response.status);
      }
      return response.json()
    })
    .catch((err) => {
    })
}
