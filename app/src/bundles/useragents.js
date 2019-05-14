import {
  difference,
  pickBy,
  uniq } from 'lodash'
import { createSelector } from 'redux-bundler'
export default {
  name: 'useragents',
  getReducer: () => {
    let filterInput;
    const initialState = {
      filterInput
    }
    return (state=initialState, {type, payload}) => {
      if (type  === 'USERAGENT_INPUT_UPDATED') {
        return {...state, filterInput: payload}
      }
      return state
    }
  },
  selectUseragentsInput: (state) => state.useragents.filterInput,
  selectFilteredUseragents: createSelector(
    'selectFilteredEndpoints',
    'selectUseragentsResource',
    (endpoints, useragents) => {
      if (endpoints == null || useragents == null) return []
      let filteredUseragents = []
      let endpointNames = Object.keys(endpoints)
      let uaNames = Object.keys(useragents)
      let i;
      for (i = 0; i < uaNames.length; i++) {
        let useragent = uaNames[i]
        let uaEndpoints = useragents[useragent]
        let endpointsNotHitByUseragent = difference(uaEndpoints, endpointNames)
        if (endpointsNotHitByUseragent.length !== uaEndpoints.length) {
          filteredUseragents.push(useragent)
        }
      }
      return filteredUseragents
    }
  ),
  selectUseragentsFilteredByInput: createSelector(
    'selectFilteredUseragents',
    'selectUseragentsInput',
    (useragents, input) => {
      if (useragents == null || input === undefined || input === '') return []
      let isValid = true
      try {
        new RegExp(input)
      } catch (err) {
        isValid = false
      }
      if (!isValid) return ['not valid regex']
  
      return useragents.filter(ua => {
        let inputAsRegex = new RegExp(input)
        return inputAsRegex.test(ua)
      })
    }
  )
  ,
  selectUseragentsFilteredByQuery: createSelector(
    'selectUseragentsResource',
    'selectQueryObject',
    (useragents, query) => {
      if (useragents == null || !query) return []
      if (query.useragents && query.useragents.length) {
        return pickBy(useragents, (val, key) => {
          var inputAsRegex = new RegExp(query.useragents)
          return inputAsRegex.test(key)
        })
      } else {
        return []
      }
    }
  ),
  selectNamesUseragentsFilteredByQuery: createSelector(
    'selectUseragentsFilteredByQuery',
    (useragents) => {
      return Object.keys(useragents)
    }
  ),
  selectRatioUseragentsFilteredByQuery: createSelector(
    'selectFilteredUseragents',
    'selectUseragentsFilteredByQuery',
    (useragents, useragentsHitByQuery) => {
      if (useragents == null || useragentsHitByQuery == null) return {}
      return {
        total: Object.keys(useragents).length || 0,
        hitByQuery: Object.keys(useragentsHitByQuery).length || 0
      }
    }
  ),
  selectOpIdsHitByFilteredUseragents: createSelector(
    'selectUseragentsFilteredByQuery',
    (useragents) => {
      let opIdsHit = []
      let useragentsNames = Object.keys(useragents)
      let useragentsIndex = 0;
  
      if (useragents == null)  {
        return opIdsHit
      }
      for (useragentsIndex; useragentsIndex < useragentsNames.length; useragentsIndex++) {
        let useragent = useragentsNames[useragentsIndex]
        opIdsHit.push(useragents[useragent])
      }
      return uniq(opIdsHit.flat())
    }
  ),
  doUpdateUseragentsInput: (payload) => ({dispatch}) => {
    dispatch({
      type: 'USERAGENT_INPUT_UPDATED',
      payload
    })
  }
  
}
