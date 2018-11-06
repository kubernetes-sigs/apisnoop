import { client } from './'

const url = '/api/v1/tests'

export function doFetchTests () {
  return dispatch => {
    dispatch({
      type: 'FETCH_TESTS',
      payload: client.get(url)
    })
  }
}

export function doChooseActiveTest (test) {
  return {
    type: 'NEW_ACTIVE_TEST_CHOSEN',
    payload: test
  }
}
