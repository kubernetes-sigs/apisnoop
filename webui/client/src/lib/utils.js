export function calculateCoverage (endpoints) {
  var total = endpoints.length
  var tested = endpoints.filter(endpoint => endpoint.isTested).length
  var percentage = (100 * tested /total).toPrecision(3)

  return {
    tested,
    total,
    percentage: `${percentage}%`,
    ratio: `${tested}/${total}`
  }
}
