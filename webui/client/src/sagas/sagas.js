import { call, put, takeEvery } from 'redux-saga/effects'

import { getCats } from '../services/api'

function* catsSaga (feathersApp) {
  yield* takeEvery('CATS_REQUESTED', fetchCats, feathersApp)
}
  function* fetchCats (feathersApp) {
console.log('fetch cats reached')
    try {
      const cats = yield call(getCats, feathersApp)
      yield put({type: 'CATS_SUCCEEDED', cats})
    } catch (e) {
      yield put({type: 'FETCH_CATS_FAILED', message: e.message})
    }
  }
export default function* root(feathersApp) {
  yield call(catsSaga, feathersApp)
}
