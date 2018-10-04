import { combineReducers } from 'redux'

import ConfigReducer from './config-reducer'

const reducers = {
  configStore: ConfigReducer
}

const rootReducer = combineReducers(reducers)

export default rootReducer
