import { filter,
         map,
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
        return filter(useragents, (ua) => {
          var inputAsRegex = new RegExp(query.useragents)
          return inputAsRegex.test(ua.name)
        })
      } else {
        return []
      }
    }
  ),
  selectEndpointsHitByFilteredUseragents: createSelector(
    'selectUseragentsFilteredByQuery',
    (useragents) => {
      if (useragents == null) return null
      var endpointsHit = []
      var uaEndpointsOnly = map(useragents, "endpoints")
      for (var uaEntry of uaEndpointsOnly) {
        var endpointNames = Object.keys(uaEntry)
        for (var endpoint of endpointNames) {
          var methods = Object.keys(uaEntry[endpoint])
          for (var method of methods) {
            var useragent = useragents[uaEndpointsOnly.indexOf(uaEntry)]
            var endpointEntry = {
              name: endpoint,
              method: method,
              release: useragent.release,
              bucket: useragent.bucket,
              job: useragent.job
            }
            endpointsHit.push(endpointEntry)
          }
        }
      }
      return uniq(endpointsHit)
    }
  ),
  doUpdateUseragentsInput: (payload) => ({dispatch}) => {
    dispatch({
      type: 'USERAGENT_INPUT_UPDATED',
      payload
    })
  }
  
}
