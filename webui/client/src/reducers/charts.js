const initialState = {
  focusedKeyPath: []
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
  default:
    return state;
  }
}
