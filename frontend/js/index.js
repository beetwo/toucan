import 'babel-polyfill'
import React from 'react'
import { render } from 'react-dom'

import { Provider } from 'react-redux'
import thunkMiddleware from 'redux-thunk'
import createLogger from 'redux-logger'
import { createStore, applyMiddleware, combineReducers } from 'redux'
import reducers from './reducers'
import App from './containers/app'
import IssueDetail from './containers/issueDetail'
import IssueList from './containers/issueList'

import {requestIssues, fetchIssues} from './actions'


import { Router, Route, IndexRoute, browserHistory } from 'react-router'
import { syncHistoryWithStore, routerReducer } from 'react-router-redux'

const loggerMiddleware = createLogger()

// create the root reducer
let issueTrackerApp = combineReducers({
  ...reducers,
  routing: routerReducer
})

// and create the store
let store = createStore(
  issueTrackerApp,
  applyMiddleware(
    thunkMiddleware,
    loggerMiddleware
  )
)

// Create an enhanced history that syncs navigation events with the store
const history = syncHistoryWithStore(browserHistory, store)

render(
  <Provider store={store}>
    <Router history={history}>
      <Route path="/" component={App}>
        <IndexRoute component={IssueList} />
        <Route path="issue/:IssueID" component={IssueDetail} />
      </Route>
    </Router>
  </Provider>,
  document.getElementsByTagName('main')[0]
);
