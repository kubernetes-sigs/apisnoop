import { combineReducers } from 'redux'

import EndpointsReducer from './endpoints'
import TestsReducer from './tests'
import ChartsReducer from './charts'
import RoutesReducer from './routes'

const reducers = {
  charts: ChartsReducer,
  endpoints: EndpointsReducer,
  tests: TestsReducer,
  routes: RoutesReducer
}

const rootReducer = combineReducers(reducers)

export default rootReducer
