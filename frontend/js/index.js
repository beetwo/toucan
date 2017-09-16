import React from "react";
import { render } from "react-dom";

import { Provider } from "react-redux";
import thunkMiddleware from "redux-thunk";
import { createStore, applyMiddleware, combineReducers } from "redux";
import reducers from "./reducers";
import AppShell from "./containers/main";
import Nav from "./nav";

import IssueContainer from "./containers/issueView";
import OrgContainer from "./containers/organisations";
import UserDetail from "./containers/userDetail";

import { Route, Link, Switch, withRouter } from "react-router-dom";

import { Router } from "./history";

require("../css/app.scss");

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
    <Router>
      <AppShell>
        <Nav />
        <Switch>
          <Route
            exact
            path="/issue/:IssueID/"
            render={props => (
              <IssueContainer
                history={props.history}
                issue_id={props.match.params.IssueID}
              />
            )}
          />
          <Route
            exact
            path="/"
            render={props => <IssueContainer history={props.history} />}
          />
          <Route path="/orgs/">
            <Switch>
              <Route exact path="/orgs/" render={props => <OrgContainer />} />
              <Route
                exact
                path="/orgs/:org_id/"
                render={props => <OrgContainer {...props.match.params} />}
              />
            </Switch>
          </Route>
          <Route
            exact
            path="/detail/:username/"
            render={props => <UserDetail {...props.match.params} />}
          />
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
      node.remove();
    });
  }, 7000);
}
