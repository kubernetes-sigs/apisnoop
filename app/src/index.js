import React from 'react'
import { render } from 'react-dom'

import { Provider } from 'redux-bundler-react'

import App from './components/app'
import createStore from './bundles'
var store = createStore()

document.title = 'APISnoop'

render(
    <Provider store={store}>
    <App />
    </Provider>,
  document.getElementById('root')
)
