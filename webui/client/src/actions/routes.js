export function changeActiveRoute (target) {
  return {
    type: 'ACTIVE_ROUTE_CHANGED',
    payload: target
  }
}
