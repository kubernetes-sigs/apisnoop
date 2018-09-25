import { takeEvery } from 'redux-saga'
     import { fork, call, put } from 'redux-saga/effects'
//     import { browserHistory } from 'react-router'

     import { getCats } from '../services/api'

function* catsSaga (feathersApp) {
  yield* takeEvery('CATS_REQUESTED', fetchCats, feathersApp)
}
function* fetchCats (feathersApp) {
  const cats = yield call(getCats, feathersApp)
  yield put({type: 'CATS_SUCCEEEDED', cats})
}
export default function* root(feathersApp) {
  yield [
    fork(catsSaga, feathersApp)
  ]
}
