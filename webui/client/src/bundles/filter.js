export default {
  name: 'filter',
  getReducer: () => {
    const initialState = {
      filter: 'namespace'
    }
    return (state=initialState, action) => {
      return state
    }
  },
  selectFilter:  (state) => state.filter.filter
}
