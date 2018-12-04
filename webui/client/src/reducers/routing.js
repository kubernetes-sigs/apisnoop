import MainPage from '../pages/main-page'

const initialState = {
  pathname: typeof window.location.pathname !== 'undefined' ? window.location.pathname : '/',
  release: isReleaseSet() ? window.location.pathname.replace('/','') : 'master',
  endpoint: '',
  page: MainPage
}


export default   (state = initialState, action = {}) => {
  if (action.type === 'UPDATE_URL') {
    var path = action.payload
    return {
      ...state,
      pathname: path.url,
      release: path.params.release ? path.params.release : 'master',
      endpoint: path.params.endpoint ? path.params.endpoint : '',
      page: path.page
    }
  }
  return state;
}

function isReleaseSet () {
  return window.location.pathname !== undefined && window.location.pathname !== '/'
}
