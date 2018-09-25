import { combineReducers } from 'redux'
import { routerReducer } from 'react-router-redux'

import cats from './cats'

const rootReducer = combineReducers({
  cats,
  routing: routerReducer
})

export default rootReducer
