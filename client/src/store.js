import { createStore, applyMiddleware } from 'redux'
import { composeWithDevTools } from 'redux-devtools-extension'

import thunk from 'redux-thunk'
import promiseMiddleware from 'redux-promise-middleware'

import rootReducer from './reducers/index.js'

var store = createStore(
  rootReducer,
  composeWithDevTools(applyMiddleware(thunk, promiseMiddleware))
)

export default store
