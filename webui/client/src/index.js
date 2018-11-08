import React from 'react'
import ReactDOM from 'react-dom'
import './index.css'

import {Provider} from 'react-redux'


import App from './components/App'
import {doUpdateUrl} from './actions/routing'
import store from './store.js'
import registerServiceWorker from './lib/service-workers'


window.addEventListener('popstate', () => {
  store.dispatch(doUpdateUrl(window.location.pathname))
})

store.subscribe(() => {
  const { pathname } = store.getState().routing
  if (window.location.pathname !== pathname) {
    window.history.pushState(null, '', pathname)
  }
})

document.title = 'APISnoop | ' + store.getState().routing.release
ReactDOM.render(
    <Provider store={store}>
    <App />
    </Provider>,
  document.getElementById('root')
)
registerServiceWorker()
