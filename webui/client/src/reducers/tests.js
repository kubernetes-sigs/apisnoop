const { keyBy } = require('lodash')

const initialState = {
  activeTest: {},
  byId: {},
  errors: {},
  isLoading: false,
  hasLoaded: false
}

export default (state = initialState, action = {}) => {
  switch(action.type) {
  case 'FETCH_TESTS_PENDING': {
    return {
      ...state,
      isLoading: true
    }
  }
  case 'FETCH_TESTS_FULFILLED': {
    return {
      ...state,
      byId: {
        ...state.byId,
        ...keyBy(action.payload.data, '_id')
      },
      isLoading: false,
      hasLoaded: true
    }
  }
  case 'NEW_ACTIVE_TEST_CHOSEN': {
    return {
      ...state,
      activeTest: action.payload
    }
  }
  case 'ACTIVE_ROUTE_CHANGED': {
    return {
      ...state,
      activeTest: {}
    }
  }
  default:
    return state;
  }
}
