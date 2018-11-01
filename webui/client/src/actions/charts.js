export function focusChart (keyPath) {
  return {
    type: 'FOCUS_CHART',
    payload: keyPath
  }
}

export function setInteriorLabel (keyPath) {
  return {
    type: 'SET_INTERIOR_LABEL',
    payload: keyPath
  }
}

export function unfocusChart() {
  return {
    type: 'UNFOCUS_CHART'
  }
}
