import { assign } from 'lodash'

export function focusChart (keyPath) {
  return function ( dispatch, getState) {
    dispatch({
      type: 'CHART_FOCUSED',
      payload: keyPath
    })

    const state = getState()
    const {route} = state
    const { url, params } = route
    const { level, category, endpoint, method } = params
    dispatch({
      type: 'URL_UPDATED',
      payload: {
        url: route.url,
        params: assign({}, route.params, {
          level,
          category,
          endpoint,
          method
        })
      }
    })
  }
}

export function doLockChart () {
  return {
    type: 'CHART_LOCKED'
  }
}

export function doUnlockChart () {
  return {
    type: 'CHART_UNLOCKED'
  }
}

export function unfocusChart() {
  return {
    type: 'CHART_UNFOCUSED'
  }
}
