import { createSelector } from 'redux-bundler'
  export default {
    name: 'filter',
    getReducer: () => {
      const initialState = {
      }
      return (state=initialState, action) => {
        return state
      }
    },
    selectFilter: createSelector(
      'selectQueryObject',
      (query) => {
        if (query == null) return null
        if (query.filter == null | query.filter === undefined) return null
        return query.filter
      }
    )
  }
