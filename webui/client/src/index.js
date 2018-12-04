import React from 'react'
import ReactDOM from 'react-dom'
import './index.css'

import { Provider } from 'redux-bundler-react'

import App from './components/App'
import createStore from './bundles'

var store = createStore()

// document.title = 'APISnoop | ' + store.getState().routing.release

ReactDOM.render(
  <Provider store={store}>
      <App />
  </Provider>,
  document.getElementById('root')
)
