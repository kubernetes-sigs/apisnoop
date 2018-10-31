import { combineReducers } from 'redux'

import ReleasesReducer from './releases'
import EndpointsReducer from './endpoints'
import ChartsReducer from './charts'
import RoutesReducer from './routes'

const reducers = {
  charts: ChartsReducer,
  endpoints: EndpointsReducer,
  releasesStore: ReleasesReducer,
  routes: RoutesReducer
}

const rootReducer = combineReducers(reducers)

export default rootReducer
