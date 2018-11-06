export function focusChart (keyPath) {
  return {
    type: 'CHART_FOCUSED',
    payload: keyPath
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
