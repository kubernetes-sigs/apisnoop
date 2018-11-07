import MainPage from '../pages/main-page'

const initialState = {
  pathname: typeof window.location !== 'undefined' ? window.location.pathname : '/',
  release: typeof window.location !== 'undefined' ? window.location.pathname.replace('/','') : 'Master',
  endpoint: '',
  page: MainPage,
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
    var path = action.payload
    return {
      ...state,
      pathname: path.url,
      release: path.params.release ? path.params.release : '',
      endpoint: path.params.endpoint ? path.params.endpoint : '',
      page: path.page
    }
  }
  return state;
}
