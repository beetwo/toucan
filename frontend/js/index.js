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
import IssueContainer from "./containers/issueView";
import UserDetail from "./containers/userDetail";
import OrganisationsList from "./containers/organisationsIndex";
import OrganisationDetail from "./containers/organisationDetail";

import {
  BrowserRouter as Router,
  Route,
  Link,
  Switch,
  withRouter
} from "react-router-dom";
import createBrowserHistory from "history/createBrowserHistory";

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
    <Router basename="/map">
      <AppShell>
        <Nav />
        <Switch>
          <Route
            exact
            path="/issue/:IssueID/"
            render={props =>
              <IssueContainer
                issue_id={parseInt(props.match.params.IssueID, 10)}
                content={<IssueDetail {...props} />}
              />}
          />
          <Route
            exact
            path="/"
            render={props =>
              <IssueContainer content={<IssueList {...props} />} />}
          />
          <Route exact path="/orgs/" component={OrganisationsList} />
          <Route exact path="/orgs/:orgname/" component={OrganisationDetail} />
          <Route exact path="/detail/:username/" component={UserDetail} />
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
