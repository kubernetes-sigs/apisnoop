import { client } from './'

const url = '/config'

export function fetchConfig () {
  return dispatch => {
    dispatch({
      type: 'FETCH_CONFIG',
      payload: client.get(url)
    })
  }
}
