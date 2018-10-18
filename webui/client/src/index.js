import React from 'react'
import ReactDOM from 'react-dom'
import { BrowserRouter } from 'react-router-dom'
import './index.css'

import {Provider} from 'react-redux'

import App from './components/App'
import store from './store.js'
import registerServiceWorker from './lib/service-workers'

ReactDOM.render(
    <BrowserRouter>
    <Provider store={store}>
    <App />
    </Provider>
    </BrowserRouter>,
  document.getElementById('root')
)
  registerServiceWorker()
