export function changeActiveRoute (target) {
  return {
    type: 'ACTIVE_ROUTE_CHANGED',
    payload: target
  }
}

export function doUpdateUrl (pathname) {
  return {
    type: 'UPDATE_URL',
    payload: pathname
  }
}
