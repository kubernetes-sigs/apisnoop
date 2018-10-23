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
