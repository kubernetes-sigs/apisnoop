const initialState = {
  pathname: typeof window.location !== 'undefined' ? window.location.pathname : '/',
  activeRoute: 'master',
  routeChange: false
}
export default (state = initialState, action = {}) => {

  if (action.type === 'ACTIVE_ROUTE_CHANGED') {
    return {
      ...state,
      activeRoute: action.payload,
      routeChange: true
    }
  }

  if (action.type === 'UPDATE_URL') {
    return {
      ...state,
      pathname: action.payload
    }
  }

  return state;
}
