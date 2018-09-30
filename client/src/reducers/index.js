import { combineReducers } from 'redux'
import { reducer as formReducer } from 'redux-form'

import ContactReducer from './contact-reducer'

const reducers = {
  contactStore: ContactReducer,
  form: formReducer
}

const rootReducer = combineReducers(reducers)

export default rootReducer
