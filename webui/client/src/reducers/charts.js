const initialState = {
  focusedKeyPath: [],
  chartLocked: false
}

export default (state = initialState, action = {}) => {
  switch (action.type) {
  case 'CHART_FOCUSED':
    return {
      ...state,
      focusedKeyPath: action.payload
    }
  case 'CHART_UNFOCUSED':
    return {
      ...state,
      focusedKeyPath: []
    }
  case 'CHART_LOCKED':
    return {
      ...state,
      chartLocked: true
    }
  case 'CHART_UNLOCKED':
    return {
      ...state,
      chartLocked: false
    }
  case 'ACTIVE_ROUTE_CHANGED': {
    return {
      ...state,
      chartLocked: false
    }
  }
  default:
    return state;
  }
}
