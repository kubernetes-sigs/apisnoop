import { combineReducers } from 'redux'

import ReleasesReducer from './releases-reducer'

const reducers = {
  releasesStore: ReleasesReducer,
}

const rootReducer = combineReducers(reducers)

export default rootReducer
