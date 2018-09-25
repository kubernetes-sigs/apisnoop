import { createStore, applyMiddleware } from 'redux'
// import { syncHistoryWithStore } from 'react-router-redux'
// import { browserHistory } from 'react-router'

import createSagaMiddleware from 'redux-saga'
import mySaga from './sagas/sagas'

import rootReducer from './reducers/index.js'

import superagent from 'superagent'
import feathers from '@feathersjs/client'

const defaultStore = {}

// const sagaMiddleware = createSagaMiddleware()

var store = createStore(rootReducer,
                        window.__REDUX_DEVTOOLS_EXTENSION__ && window.__REDUX_DEVTOOLS_EXTENSION__()
                       )
// const store = createStore(rootReducer, defaultStore, applyMiddleware(sagaMiddleware), window.__REDUX_DEVTOOLS_EXTENSION__ && window.__REDUX_DEVTOOLS_EXTENSION__())

export default store
