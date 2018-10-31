const initialState = {
  focusedKeyPath: []
}

export default (state = initialState, action = {}) => {
  switch (action.type) {
  case 'FOCUS_CHART':
    return {
      ...state,
      focusedKeyPath: action.payload
    }
  default:
    return state;
  }
}
