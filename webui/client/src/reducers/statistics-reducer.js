const defaultState = {
  statistics: [],
  loading: true,
  errors: {}
}

export default (state = defaultState, action = {}) => {
  switch (action.type) {
    case 'FETCH_STATISTICS_FULFILLED': {
      return {
        ...state,
        statistics: action.payload.data,
        loading: false
      }
    }
    default:
      return state;
  }
}
