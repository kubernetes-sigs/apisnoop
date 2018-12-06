import { createSelector } from 'redux-bundler'
import { keyBy } from 'lodash'

export default {
  name: 'releases',
  getReducer: () => {
    const initialState = {}

    return (state = initialState, action = {}) => {
      return state;
    }
  },
  selectCurrentReleaseName: createSelector(
    'selectRouteParams',
    (routeParams) => {
      return routeParams.releaseName || 'master'
    }
  ),
  selectCurrentReleaseId: createSelector(
    'selectCurrentReleaseName',
    'selectReleasesIndex',
    (currentReleaseName, releasesIndex) => {
      if (releasesIndex == null) return null
      const release = releasesIndex.find(release => {
        return release.name === currentReleaseName
      })
      return release == null ? null : release._id
    }
  ),
  selectReleasesIndexByName: createSelector(
    'selectReleasesIndex',
    releasesIndex => keyBy(releasesIndex, 'name')
  )
}
