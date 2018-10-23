const defaultState = {
  releases: [],
  loading: true,
  errors: {}
}

export default (state = defaultState, action = {}) => {
  switch (action.type) {
    case 'FETCH_RELEASES_FULFILLED': {
      return {
        ...state,
        releases: action.payload.data,
        loading: false
      }
    }
    default:
      return state;
  }
}
