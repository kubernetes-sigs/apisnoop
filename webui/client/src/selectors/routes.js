// import { createSelector } from 'reselect'

export function selectActiveRoute (state) {
  return state.routes.activeRoute
}

export function selectRouteChange (state) {
  return state.routes.routeChange
}
