import { client } from './'

const url = '/api/v1/statistics'
  export function fetchStatistics () {
    return dispatch => {
      dispatch({
        type: 'FETCH_STATISTICS',
        payload: client.get(url)
      })
    }
  }
