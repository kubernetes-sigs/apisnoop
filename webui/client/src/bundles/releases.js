import { createSelector } from 'redux-bundler'
import { keyBy } from 'lodash'

export default {
  name: 'releases',
  getReducer: () => {
    const initialState = {
      syncdReleaseName: 'master'
    }

    return (state = initialState, action = {}) => {
      if (action.type === 'SYNCD_SET_RELEASE_NAME') {
        return {
          ...state,
          syncdReleaseName: action.payload
        }
      }

      return state;
    }
  },
  selectSyncdReleaseName: (state) => state.syncdReleaseName,
  doSyncReleaseName: (releaseName) => ({ dispatch, store }) => {
    // dispatch({
    //   type: 'SYNCD_SET_RELEASE_NAME',
    //   payload: releaseName
    // })

    // TODO mark all the release resources as stale
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
  ),
  reactShouldSyncReleaseName: createSelector(
    'selectSyncdReleaseName',
    'selectCurrentReleaseName',
    (syncdReleaseName, currentReleaseName) => {
      if (syncdReleaseName === currentReleaseName) return false

      return {
        actionCreator: 'doSyncReleaseName',
        args: [currentReleaseName]
      }
    }
  )
}
