import { createSelector } from 'redux-bundler'
import {
  filter,
  find,
  includes,
  keyBy,
  map,
  split,
  trim,
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
  selectReleasesSigOnly: createSelector(
    'selectReleasesIndexByName',
    (releasesIndex) => {
      if (releasesIndex == null) return null
      return filter(releasesIndex, (o) => {
        return includes(o.name.toLowerCase(), 'sig')
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
  selectReleasesSigIndex: createSelector(
    'selectReleasesSigOnly',
    (sigReleases) => {
      return map(sigReleases, (sigRelease) => {
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
  selectReleasesIndexSorted: createSelector(
    'selectReleasesSigIndex',
    (releases) => {
      if (releases == null) return null
      return releases.sort((a, b) => {
        return a.name.localeCompare(b.name, undefined, {numeric: true})
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
