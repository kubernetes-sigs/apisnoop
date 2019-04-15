import { map,
         pickBy,
         uniq } from 'lodash'
import { createSelector } from 'redux-bundler'
export default {
  name: 'useragents',
  getReducer: () => {
    const initialState = {
      filterInput: ''
    }
    return (state=initialState, {type, payload}) => {
      if (type  === 'USERAGENT_INPUT_UPDATED') {
        return {...state, filterInput: payload}
      }
      return state
    }
  },
  selectUseragentsInput: (state) => state.useragents.filterInput,
  selectUseragentsFilteredByInput: createSelector(
    'selectUseragentsResource',
    'selectUseragentsInput',
    (useragents, input) => {
      var useragentsNames = map(useragents, 'name')
      if (input === '') return []
  
      var isValid = true
      try {
        new RegExp(input)
      } catch (err) {
        isValid = false
      }
      if (!isValid) return ['not valid regex']
  
      return useragentsNames.filter(ua => {
        var inputAsRegex = new RegExp(input)
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
  selectOpIdsHitByFilteredUseragents: createSelector(
    'selectUseragentsFilteredByQuery',
    (useragents) => {
      let opIdsHit = []
      let opIds = Object.keys(useragents)
      let opId, opIdIndex;
  
      if (useragents == null)  {
        return opIdsHit
      }
      for (opIdIndex = 0; opIdIndex < opIds.length; opIdIndex++) {
        opId = opIds[opIdIndex]
        opIdsHit.push(useragents[opId])
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
