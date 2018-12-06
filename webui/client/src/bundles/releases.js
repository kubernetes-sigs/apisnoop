import { createSelector } from 'redux-bundler'

export default {
  name: 'releases',
  getReducer: () => {
    const initialState = {}

    return (state = initialState, action = {}) => {
      return state;
    }
  },
  doChooseCurrrentRelease: () => {
  },
  // selectReleaseNames
  // selectRelease
  selectCurrentReleaseName: createSelector(
    'selectRouteParams',
    (routeParams) => {
      return routeParams.releaseName || 'master'
    }
  )
}
