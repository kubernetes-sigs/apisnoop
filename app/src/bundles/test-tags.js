import { createSelector } from 'redux-bundler'
import { pickBy, uniq } from 'lodash'

export default {
  name: 'testTags',
  getReducer: () => {
    const initialState = {
      filterInput: ''
    }
    return (state=initialState, {type, payload}) => {
      if (type  === 'TEST_TAGS_INPUT_UPDATED') {
        return {...state, filterInput: payload}
      }
      return state
    }
  },
  selectActiveTestTags: createSelector(
    'selectActiveEndpoint',
    'selectTestTagsResource',
    (endpoint, testTags) => {
      let activeTestTags = []
      if (endpoint == null || testTags== null) return activeTestTags
      else {
        activeTestTags = pickBy(testTags, (testTag) => testTag.includes(endpoint.operationId))
        return uniq(Object.keys(activeTestTags))
      }
    }
  ),
  selectTestTagsInput: (state) => state.testTags.filterInput,
  selectTestTagsFilteredByInput: createSelector(
    'selectTestTagsResource',
    'selectTestTagsInput',
    (testTags, input) => {
      if (testTags == null || input === '') return []
      let testTagsNames = Object.keys(testTags)
      let isValid = true
      try {
        new RegExp(input)
      } catch (err) {
        isValid = false
      }
      if (!isValid) return ['not valid regex']
  
      return testTagsNames.filter(ua => {
        let inputAsRegex = new RegExp(input)
        return inputAsRegex.test(ua)
      })
    }
  )
  ,
  selectTestTagsFilteredByQuery: createSelector(
    'selectTestTagsResource',
    'selectQueryObject',
    (testTags, query) => {
      if (testTags == null || !query) return []
      if (query.testTags && query.testTags.length) {
        return pickBy(testTags, (val, key) => {
          var inputAsRegex = new RegExp(query.testTags)
          return inputAsRegex.test(key)
        })
      } else {
        return []
      }
    }
  ),
  selectNamesTestTagsFilteredByQuery: createSelector(
    'selectTestTagsFilteredByQuery',
    (testTags) => {
      return Object.keys(testTags)
    }
  ),
  selectOpIdsHitByFilteredTestTags: createSelector(
    'selectTestTagsFilteredByQuery',
    (testTags) => {
      let opIdsHit = []
      let opIds = Object.keys(testTags)
      let opId, opIdIndex;
  
      if (testTags == null)  {
        return opIdsHit
      }
      for (opIdIndex = 0; opIdIndex < opIds.length; opIdIndex++) {
        opId = opIds[opIdIndex]
        opIdsHit.push(testTags[opId])
        console.log({opIds, opId, opIdsHit})
      }
      return uniq(opIdsHit.flat())
    }
  )
}
