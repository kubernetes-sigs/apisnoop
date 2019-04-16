import { createSelector } from 'redux-bundler'
import { pickBy } from 'lodash'

export default {
  name: 'tests',
  selectActiveTestsIndex: createSelector(
    'selectActiveEndpoint',
    'selectTestsResource',
    (endpoint, tests) => {
      let activeTests = []
      if (endpoint == null || tests== null) return activeTests
      else {
        activeTests = pickBy(tests, (test) => test.includes(endpoint.operationId))
        return Object.keys(activeTests)
      }
    }
  )
}
