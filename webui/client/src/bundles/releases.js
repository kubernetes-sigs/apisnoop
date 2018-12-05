export default {
  name: 'releases',
  getReducer: () => {
    const initialState = {}

    return (state = initialState, action = {}) => {
      return state;
    }
  },
  // selectReleaseNames
  // selectRelease
  selectCurrentReleaseName: createSelector(
    'selectRouteParams',
    (routeParams) => {
      return routeParams.releaseName || 'master'
    }
  }

import { client } from './'

const url = '/api/v1/releases'

export function fetchReleases () {
  return dispatch => {
    dispatch({
      type: 'FETCH_RELEASES',
      payload: client.get(url)
    })
  }
}

export function fetchRelease (releaseId) {
  return dispatch => {
    dispatch({
      type: 'FETCH_RELEASE',
      payload: client.get(`${url}?_id=${releaseId}`)
    })
  }
}

export function fetchReleaseNames () {
  return dispatch => {
    dispatch({
      type: 'FETCH_RELEASE_NAMES',
      payload: client.get('/api/v1/releases?$select[]=name&$select[]=_id')
    })
  }
}

export function chooseNewMain (name) {
  return dispatch => {
    dispatch({
      type: 'NEW_MAIN_CHOSEN',
      payload: name
    })
  }
}
