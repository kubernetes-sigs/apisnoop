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
  selectCurrentReleaseObjectRaw: createSelector(
    'selectCurrentReleaseName',
    'selectReleasesIndexByName',
    (currentRelease, releasesIndex) =>  {
      if (releasesIndex == null) return null
      return find(releasesIndex, (release) => {
        return includes(release.name.toLowerCase(), currentRelease.toLowerCase())
      })
    }
  ),
  selectCurrentReleaseObject: createSelector(
    'selectCurrentReleaseObjectRaw',
    (rawRelease) => {
      if (rawRelease == null) return null
      var nameArr = split(rawRelease.name, '_')
      if (nameArr.length === 1) {
        return {
          version: '',
          release: nameArr[0],
          date: ''
        }
      }
      return {
        version: nameArr[0],
        release: nameArr[1],
        date: nameArr[2],
        e2eOnly: !isUndefined(nameArr[3])
      }
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
