import React from 'react'
import { render } from 'react-dom'

import { Provider } from 'react-redux'
import thunkMiddleware from 'redux-thunk'
import { createStore, applyMiddleware, combineReducers } from 'redux'
import reducers from './reducers'
import App from './containers/app'
import IssueDetail from './containers/issueDetail'
import IssueList from './containers/issueList'
import UserDetail from './containers/userDetail'
import {requestIssues, fetchIssues, resetSelectedIssue} from './actions'

import { Router, Route, IndexRoute, useRouterHistory } from 'react-router'
import { syncHistoryWithStore, routerReducer } from 'react-router-redux'
import { createHistory } from 'history'

// create the root reducer
let issueTrackerApp = combineReducers({
  ...reducers,
  routing: routerReducer
})

// construct middleWare
let middleware = [thunkMiddleware];

// some more middleware in development mode
if (process.env.NODE_ENV !== 'production') {
  const createLogger = require('redux-logger');
  const loggerMiddleware = createLogger();
  middleware = [...middleware, loggerMiddleware];
}


// and create the store
let store = createStore(
  issueTrackerApp,
  applyMiddleware(...middleware)
)

// Create an enhanced history that syncs navigation events with the store
let bHistory = useRouterHistory(createHistory)({
  basename: '/map'
})
export const history = syncHistoryWithStore(bHistory, store);


render(
  <Provider store={store}>
    <Router history={history}>
      <Route path="/" component={App} name='issueList' >
        <IndexRoute component={IssueList} name='issueListIndex'/>
        <Route path="issue/:IssueID" component={IssueDetail} name='issueDetail'/>
        <Route path="users/:username" component={UserDetail} name='userDetail' />
      </Route>
    </Router>
  </Provider>,
  document.getElementsByTagName('main')[0]
);


// remove any alerts that were set by the backend after a timeout
if (window && document) {
  window.setTimeout(() => {
      let alerts = document.querySelectorAll('.alert.alert-dismissable')
      alerts.forEach((node) => {console.log(node); node.remove()})
  }, 7000)
}
