export function focusChart (keyPath) {
  return {
    type: 'CHART_FOCUSED',
    payload: keyPath
  }
}

export function unfocusChart() {
  return {
    type: 'CHART_UNFOCUSED'
  }
}
