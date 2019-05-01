import { createSelector } from 'redux-bundler'
import { difference, pickBy, uniq } from 'lodash'

export default {
  name: 'testTags',
  getReducer: () => {
    let filterInput;
    const initialState = {
      filterInput
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
  selectFilteredTestTags: createSelector(
    'selectFilteredEndpoints',
    'selectTestTagsResource',
    (endpoints, testTags) => {
      if (endpoints == null || testTags == null) return []
      let filteredTestTags = []
      let endpointNames = Object.keys(endpoints)
      let ttNames = Object.keys(testTags)
      let i;
      for (i = 0; i < ttNames.length; i++) {
        let testTag = ttNames[i]
        let ttEndpoints = testTags[testTag]
        let endpointsNotHitByTestTag = difference(ttEndpoints, endpointNames)
        if (endpointsNotHitByTestTag.length !== ttEndpoints.length) {
          filteredTestTags.push(testTag)
        }
      }
      return filteredTestTags
    }
  ),
  selectTestTagsInput: (state) => state.testTags.filterInput,
  selectTestTagsFilteredByInput: createSelector(
    'selectFilteredTestTags',
    'selectTestTagsInput',
    (testTags, input) => {
      if (testTags == null || input === '') return []
      let isValid = true
      try {
        new RegExp(input)
      } catch (err) {
        isValid = false
      }
      if (!isValid) return ['not valid regex']
  
      return testTags.filter(ua => {
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
      if (query.test_tags && query.test_tags.length) {
        return pickBy(testTags, (val, key) => {
          var inputAsRegex = new RegExp(query.test_tags)
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
  selectRatioTestTagsFilteredByQuery: createSelector(
    'selectFilteredTestTags',
    'selectTestTagsFilteredByQuery',
    (testTags, testTagsHitByQuery) => {
      if (testTags == null || testTagsHitByQuery == null) return {}
      return {
        total: Object.keys(testTags).length || 0,
        hitByQuery: Object.keys(testTagsHitByQuery).length || 0
      }
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
      }
      return uniq(opIdsHit.flat())
    }
  ),
  doUpdateTestTagsInput: (payload) => ({dispatch}) => {
    dispatch({
      type: 'TEST_TAGS_INPUT_UPDATED',
      payload
    })
  }
  
}
