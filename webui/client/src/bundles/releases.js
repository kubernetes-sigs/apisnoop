import { createSelector } from 'redux-bundler'
import {
  filter,
  includes,
  keyBy,
  map,
  reject,
  split,
  trim
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
  selectReleasesSigOnly: createSelector(
    'selectReleasesIndexByName',
    (releasesIndex) => {
      if (releasesIndex == null) return null
      return filter(releasesIndex, (o) => {
        return includes(o.name.toLowerCase(), 'sig')
      })
    }
  ),
  selectReleasesConformanceOnly: createSelector(
    'selectReleasesIndexByName',
    (releasesIndex) => {
      if (releasesIndex == null) return null
      return filter(releasesIndex, (o) => {
        return includes(o.name.toLowerCase(), 'conformance')
      })
    }
  ),
  selectReleasesMasterOnly: createSelector(
    'selectReleasesIndexByName',
    (releasesIndex) => {
      if (releasesIndex == null) return null
      return filter(releasesIndex, (o) => {
        return includes(o.name.toLowerCase(), 'master')
      })
    }
  ),
  selectReleasesSigIndexE2E: createSelector(
    'selectReleasesSigOnly',
    (sigReleases) => {
      var e2eOnly = filter(sigReleases, (o) => {
        return includes(o.name.toLowerCase(), 'e2e')
      })
      return map(e2eOnly, (sigRelease) => {
        var nameWithoutSig = trim(sigRelease.name, 'sig-release_')
        var shortName = split(nameWithoutSig, '_')[0]
        return {
          name: shortName,
          url:sigRelease.name,
          _id: sigRelease._id
        }
      })
    }
  ),
  selectReleasesSigIndexNoE2E: createSelector(
    'selectReleasesSigOnly',
    (sigReleases) => {
      var noE2E = reject(sigReleases, (o) => {
        return includes(o.name.toLowerCase(), 'e2e')
      })
      return map(noE2E, (sigRelease) => {
        var nameWithoutSig = trim(sigRelease.name, 'sig-release_')
        var shortName = split(nameWithoutSig, '_')[0]
        return {
          name: shortName,
          url:sigRelease.name,
          _id: sigRelease._id
        }
      })
    }
  ),
  selectReleasesConformanceIndexNoE2E: createSelector(
    'selectReleasesConformanceOnly',
    (conReleases) => {
      var noE2E = reject(conReleases, (o) => {
        return includes(o.name.toLowerCase(), 'e2e')
      })
      return map(noE2E, (conRelease) => {
        var nameWithoutCon = trim(conRelease.name, 'conformance_')
        var shortName = split(nameWithoutCon, '_')[0]
        return {
          name: shortName,
          url: conRelease.name,
          _id: conRelease._id
        }
      })
    }
  ),
  selectReleasesConformanceIndexE2E: createSelector(
    'selectReleasesConformanceOnly',
    (conReleases) => {
      var e2eOnly = filter(conReleases, (o) => {
        return includes(o.name.toLowerCase(), 'e2e')
      })
      return map(e2eOnly, (conRelease) => {
        var nameWithoutCon = trim(conRelease.name, 'conformance_')
        var shortName = split(nameWithoutCon, '_')[0]
        return {
          name: shortName,
          url: conRelease.name,
          _id: conRelease._id
        }
      })
    }
  ),
  selectReleasesMasterIndex: createSelector(
    'selectReleasesMasterOnly',
    (masterReleases) => {
      return map(masterReleases, (masterRelease) => {
        return {
          name: masterRelease.name,
          url: masterRelease.name,
          _id: masterRelease._id
        }
      })
    }
  )
}
