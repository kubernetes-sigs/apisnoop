const initialState = {
  interiorLabel: '',
  focusedKeyPath: []
}

export default (state = initialState, action = {}) => {
  switch (action.type) {
  case 'FOCUS_CHART':
    return {
      ...state,
      focusedKeyPath: action.payload
    }
  case 'SET_INTERIOR_LABEL':
    return {
      ...state,
      interiorLabel: action.payload
    }
  case 'UNFOCUS_CHART':
    return {
      ...state,
      focusedKeyPath: []
    }
  default:
    return state;
  }
}
