import { createSelector } from 'redux-bundler'
import {
  filter,
  find,
  keyBy,
  sortBy,
  trim} from 'lodash'

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
  selectCurrentReleaseSpyglassLink: createSelector(
    'selectCurrentReleaseObject',
    (currentRelease) => {
      if (currentRelease == null) return null
      var bucketJobPath = currentRelease.name.replace('_', '/')
      var spyglassBase = 'https://prow.k8s.io/view/gcs/kubernetes-jenkins/logs/'
      return spyglassBase + bucketJobPath
    }
  ),
  selectCurrentReleaseAPISnoopLink: createSelector(
    'selectCurrentReleaseSpyglassLink',
    (spyglassLink) => {
      if (spyglassLink== null) return null
      var spyglassBase = 'https://prow.k8s.io/view/gcs/kubernetes-jenkins/logs/'
      var APISnoopBase = 'https://storage.googleapis.com/apisnoop/dev/'
      return spyglassLink.replace(spyglassBase, APISnoopBase) + "/apisnoop.json"
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
  ),
  selectReleasesIndexSorted: createSelector(
    'selectReleasesIndexSansMaster',
    (releasesIndex) => {
      if (releasesIndex == null) return null
      return releasesIndex.sort((a, b) => {
        return a.version.localeCompare(b.version, undefined, {numeric: true})
      })
    }
  )
}
