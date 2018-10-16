import { combineReducers } from 'redux'

import AuditsReducer from './audits-reducer'

const reducers = {
  auditsStore: AuditsReducer
}

const rootReducer = combineReducers(reducers)

export default rootReducer
