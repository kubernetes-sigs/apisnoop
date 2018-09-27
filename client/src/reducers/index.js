import { combineReducers } from 'redux'

import ContactReducer from './contact-reducer'

const reducers = {
  contactStore: ContactReducer
}

const rootReducer = combineReducers(reducers)

export default rootReducer
