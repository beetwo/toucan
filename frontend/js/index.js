import 'babel-polyfill'
import React from 'react'
import { render } from 'react-dom'

import { Provider } from 'react-redux'
import thunkMiddleware from 'redux-thunk'
import createLogger from 'redux-logger'
import { createStore, applyMiddleware } from 'redux'
import issueTrackerApp from './reducers'
import App from './containers/app'

const loggerMiddleware = createLogger()

let store = createStore(
  issueTrackerApp,
  applyMiddleware(
    thunkMiddleware,
    loggerMiddleware
  )
)

render(
  <Provider store={store}>
    <App />
  </Provider>,
  document.getElementsByTagName('main')[0]
);

import { fetchIssues } from './actions'
store.dispatch(fetchIssues())

{/*
  import { Router, Route, browserHistory, IndexRoute, Link } from 'react-router'


    <Router history={browserHistory}>
        <Route path="/" component={App}>
            <IndexRoute component={Issues} />
            <Route path="issue/:IssueID" component={IssueDetail} />
        </Route>
    </Router>
*/}
