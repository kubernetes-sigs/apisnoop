const defaultState = {
  audits: [],
  loading: true,
  errors: {}
}

export default (state = defaultState, action = {}) => {
  switch (action.type) {
    case 'FETCH_AUDITS_FULFILLED': {
      return {
        ...state,
        audits: action.payload.data,
        loading: false
      }
    }
    default:
      return state;
  }
}
