const defaultState = {
  audits: [],
  loading: true,
  errors: {}
}

export default (state = defaultState, action = {}) => {
  switch (action.type) {
    case 'FETCH_AUDITS_FULFILLED': {
      var config = action.payload.data
      console.log(config)
      return {
        ...state,
        audits: action.payload.data
      }
    }
    default:
      return state;
  }
}
