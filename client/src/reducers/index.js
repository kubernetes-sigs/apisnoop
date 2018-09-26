import { combineReducers } from 'redux'
import { routerReducer } from 'react-router-redux'

import reduxifyServices from 'feathers-redux'
import feathers from '@feathersjs/client'
import superagent from 'superagent'

import cats from './cats'

const host = 'http://localhost:3030'
export const feathersClient = feathers()
  .configure(feathers.rest(host).superagent(superagent))
  .configure(feathers.authentication({ store: window.localstorage }))

const services = reduxifyServices(feathersClient, ['cats'])

const rootReducer = combineReducers({
  cats,
  routing: routerReducer,
  fcat: services.cats.reducer
})

export default rootReducer
