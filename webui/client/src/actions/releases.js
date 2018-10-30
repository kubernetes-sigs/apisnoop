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
