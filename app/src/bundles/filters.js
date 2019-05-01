export  default {
  name: 'filters',
  getReducer: () => {
    const initialState = {
      displayFilters: false
    }
    return (state=initialState, {type, payload}) => {
      if (type === 'FILTERS_TOGGLED') {
        return {
          ...state,
          displayFilters: !state.displayFilters
        }

      }
      return state
    }
  },
  selectDisplayFilters: (state) => state.filters.displayFilters,
  doToggleFilters: () => ({dispatch}) => {
    dispatch({
      type: "FILTERS_TOGGLED"
    })
  }
}
