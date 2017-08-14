import React from "react";
import { render } from "react-dom";

import { Provider } from "react-redux";
import thunkMiddleware from "redux-thunk";
import { createStore, applyMiddleware, combineReducers } from "redux";
import reducers from "./reducers";
import AppShell from "./containers/main";
import Nav from "./nav";

import IssueDetail from "./containers/issueDetail";
import IssueList from "./containers/issueList";
import UserDetail from "./containers/userDetail";
import OrganisationsList from "./containers/organisationsIndex";

import {
  BrowserRouter as Router,
  Route,
  Link,
  Switch,
  withRouter
} from "react-router-dom";
import createBrowserHistory from "history/createBrowserHistory";

// create the root reducer
let issueTrackerApp = combineReducers({
  ...reducers
});

// construct middleWare
let middleware = [thunkMiddleware];

// some more middleware in development mode
if (process.env.NODE_ENV !== "production") {
  const createLogger = require("redux-logger");
  const loggerMiddleware = createLogger();
  middleware = [...middleware, loggerMiddleware];
}

// and create the store
let store = createStore(issueTrackerApp, applyMiddleware(...middleware));

render(
  <Provider store={store}>
    <Router basename="/map">
      <AppShell>
        <Nav />
        <Route
          path="/jfsdkjfds/"
          children={props => {
            console.log("Always:", props);
            return null;
          }}
        />
        <Switch>
          <Route exact path="/issue/:IssueID/" component={IssueDetail} />
          <Route exact path="/orgs/" component={OrganisationsList} />
          <Route exact path="/detail/:username/" component={UserDetail} />
          <Route exact path="/" component={IssueList} />
          {/*<Route render={() => <h1>404</h1>} />*/}
        </Switch>
      </AppShell>
    </Router>
  </Provider>,
  document.getElementsByTagName("main")[0]
);

// safari does not implement forEach on Nodelists
// as returned by querySelectorAll
import forEach from "lodash/forEach";

// remove any alerts that were set by the backend after a timeout
if (window && document) {
  window.setTimeout(() => {
    let alerts = document.querySelectorAll(".alert.alert-dismissable");
    forEach(alerts, node => {
      console.log(node);
      node.remove();
    });
  }, 7000);
}
