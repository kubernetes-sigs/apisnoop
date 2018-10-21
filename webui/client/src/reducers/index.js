import { combineReducers } from 'redux'

import AuditsReducer from './audits-reducer'
import StatisticsReducer from './statistics-reducer'
import D3FlareReducer from './flare-reducer'

const reducers = {
  auditsStore: AuditsReducer,
  statisticsStore: StatisticsReducer,
  D3FlareStore: D3FlareReducer
}

const rootReducer = combineReducers(reducers)

export default rootReducer
