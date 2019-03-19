import { map } from 'lodash'
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
            if (input === '') return useragentsNames
    
            return useragentsNames.filter(ua => {
                var inputAsRegex = new RegExp(input)
                return inputAsRegex.test(ua)
            })
        }
    )
    ,
    doUpdateUseragentInput: (payload) => ({dispatch}) => {
        dispatch({
            type: 'USERAGENT_INPUT_UPDATED',
            payload
        })
    }
    
  }
