export function selectActiveRoute (state) {
  return state.routing.activeRoute
}

export function selectRouteChange (state) {
  return state.routing.routeChange
}

export function selectPathName (state) {
  return state.routing.pathname
}
export function selectRelease (state) {
  return state.routing.release
}

export function selectPage (state) {
  return state.routing.page
}
