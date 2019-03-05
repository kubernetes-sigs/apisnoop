import { createSelector } from 'redux-bundler'
import {
  filter,
  find,
  includes,
  keyBy,
  map,
  sortBy,
  split,
  isUndefined
} from 'lodash'

export default {
  name: 'releases',
  init: (store) => {
    store.subscribeToSelectors(
      ['selectCurrentReleaseName'],
      (currentReleaseName) => {
        store.doMarkCurrentReleaseAsOutdated()
        store.doMarkEndpointsResourceAsOutdated()
        store.doMarkTestsResourceAsOutdated()
      }
    )
  },
  getReducer: () => {
    const initialState = {}

    return (state = initialState, action = {}) => {
      return state;
    }
  },
  selectMasterRelease: createSelector(
    'selectReleasesIndex',
    (releasesIndex) => {
      if (releasesIndex == null) return null
      var masterBucket = releasesIndex.filter(release => release.bucket.includes("gci-gce"))
      var masterBucketSorted = sortBy(masterBucket, (job) => parseInt(job.job))
      return masterBucketSorted[0]
    }
  ),
  selectCurrentReleaseName: createSelector(
    'selectRouteParams',
    'selectMasterRelease',
    (routeParams, masterRelease) => {
      if (masterRelease == null) return null
      return routeParams.releaseName || masterRelease.name
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
  selectCurrentReleaseObject: createSelector(
    'selectCurrentReleaseName',
    'selectReleasesIndexByName',
    (currentReleaseName, releasesIndex) =>  {
      if (releasesIndex == null) return null
      return find(releasesIndex, (release) => {
        return release.name  === currentReleaseName
      })
    }
  ),
  selectReleasesIndexMasterOnly: createSelector(
    'selectReleasesIndexByName',
    'selectMasterRelease',
    (releasesIndex, masterRelease) => {
      if (releasesIndex == null) return null
      return filter(releasesIndex, (release) => {
        return release.name === masterRelease.name
      })
    }
  ),
  selectReleasesIndexSansMaster: createSelector(
    'selectReleasesIndexByName',
    'selectMasterRelease',
    (releasesIndex, masterRelease) => {
      if (releasesIndex == null) return null
      return filter(releasesIndex, (release) => {
        return release.name !== masterRelease.name
      })
    }
  )
}
