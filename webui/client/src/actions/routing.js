import routeMatcher from '../routes'

export function changeActiveRoute (target) {
  return {
    type: 'ACTIVE_ROUTE_CHANGED',
    payload: target
  }
}

export function doUpdateUrl (pathname) {
  var pathData = routeMatcher(pathname)
  return {
    type: 'UPDATE_URL',
    payload: pathData
  }
}
