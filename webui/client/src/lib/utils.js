import { filter, size, words } from 'lodash'

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

// Hey!  You're doing good.  Thanks for chekcing this out.  Just to warn ya, there's going to be a regular expression
// it's two lines down.  It's just making it so that we pop out the opacity at the end of an rgba string correctly.
// I have nothing else to give you.
export function fadeColor (rgba, desiredOpacity) {
  var rgbaParts = words(rgba, /[^,|^(|^)]+/g)
  rgbaParts.pop()
  rgbaParts.push(desiredOpacity)
  var newRgbaString = rgbaParts.join(',')
  var newRgba = newRgbaString.replace(/,/,'(') + ')'
  return newRgba
}
