import './index.scss'

import React from 'react'
import { render } from 'react-dom'
import { Provider } from 'react-redux'
import { applyMiddleware, createStore } from 'redux'
import createMiddleware from 'redux-saga'

import App from 'App'
import rootSaga from 'sagas'
import reducers from 'ducks'

const sagaMiddleware = createMiddleware()

let store
if (process.env.NODE_ENV === 'development') {
  const devTools = (window.__REDUX_DEVTOOLS_EXTENSION__ && window.__REDUX_DEVTOOLS_EXTENSION__())
  store = applyMiddleware(sagaMiddleware)(createStore)(reducers, devTools)
} else {
  store = applyMiddleware(sagaMiddleware)(createStore)(reducers)
}

sagaMiddleware.run(rootSaga)

render(
  <Provider store={store}>
    <App />
  </Provider>,
  document.getElementById('root')
)