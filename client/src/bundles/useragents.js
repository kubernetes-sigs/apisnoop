export default {
  name: 'useragents',
  getReducer: () => {
      const initialState = {
          filterInput: ''
      }
      return (state=initialState, {type, payload}) => {
          if (type  === 'USERAGENT_FILTER_INPUT_UPDATED') {
              return {...state, filterInput: payload}
          }
          return state
      }
  },
  selectUseragentsInput: (state) => state.useragents.filterInput
}
