import { client } from './'

const url = '/api/v1/endpoints'

export function fetchEndpoints () {
  return dispatch => {
    dispatch({
      type: 'FETCH_ENDPOINTS',
      payload: client.get(url)
    })
  }
}
