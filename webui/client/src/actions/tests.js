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

export function doCloseActiveTest (test) {
  return {
    type: 'ACTIVE_TEST_CLOSED'
  }
}

export function doSetEndpointTests (endpointTests) {
  return {
    type: 'ENDPOINT_TESTS_SET',
    payload: endpointTests
  }
}
