import { client } from './'

const url = '/api/v1/audits'
  export function fetchAudits () {
    return dispatch => {
      dispatch({
        type: 'FETCH_AUDITS',
        payload: client.get(url)
      })
    }
  }
