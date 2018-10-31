import { combineReducers } from 'redux'

import ReleasesReducer from './releases-reducer'
import EndpointsReducer from './endpoints-reducer'

const reducers = {
  releasesStore: ReleasesReducer,
  endpoints: EndpointsReducer
}

const rootReducer = combineReducers(reducers)

export default rootReducer
