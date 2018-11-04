const initialState = {
  release_names: [],
  active_release: {},
  loading: true,
  errors: {}
}
export default (state = initialState, action = {}) => {
  switch (action.type) {
  case 'FETCH_RELEASE_NAMES_FULFILLED': {
    return {
      ...state,
      release_names: action.payload.data
    }
  }
  case 'FETCH_RELEASE_FULFILLED': {
    return {
      ...state,
      active_release: {name: action.payload.data[0].name, ...action.payload.data[0].data},
      loading: false
    }
  }
  default:
    return state;
  }
}
