import React from 'react'
import { render } from 'react-dom'
import './index.css'

import { Provider } from 'redux-bundler-react'

import App from './components/app'
import createStore from './bundles'

var store = createStore()

// document.title = 'APISnoop | ' + store.getState().routing.release

render(
    <Provider store={store}>
    <App />
    </Provider>,
  document.getElementById('root')
)
