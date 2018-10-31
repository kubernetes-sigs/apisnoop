const initialState = {
  byId: {},
  loading: false,
  errors: {}
}

const { keyBy } = require('lodash')
export default (state = initialState, action = {}) => {
  switch(action.type) {
  case 'FETCH_ENDPOINTS_PENDING': {
    return {
      ...state,
      loading: true
    }
  }
  case 'FETCH_ENDPOINTS_FULFILLED': {
    return {
      ...state,
      byId: {
        ...state.byId,
        ...keyBy(action.payload.data, '_id')
      },
      loading: false
    }
  }
  default:
    return state;
  }
}
