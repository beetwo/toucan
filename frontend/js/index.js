import React from "react";
import { render } from "react-dom";

import { Provider } from "react-redux";
import thunkMiddleware from "redux-thunk";
import { createStore, applyMiddleware, combineReducers } from "redux";
import reducers from "./reducers";
import App from "./containers/issuesIndex";
import Nav from "./nav";

import IssueDetail from "./containers/issueDetail";
import IssueList from "./containers/issueList";
import UserDetail from "./containers/userDetail";
import OrganisationsList from "./containers/organisationsIndex";

import { BrowserRouter as Router, Route, Link, Switch } from "react-router-dom";

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

// Listen for changes to the current location and update the nav part
// this is currently a hack, but will be cleaned up once we upgrade
// react router or move to a completely client side rendered menu
// const unlisten = history.listen((location, action) => {
//   let parts = location.pathname.split("/");
//   let active = "needs";
//   if (parts[1] === "orgs") {
//     active = "orgs";
//   }
//   render(
//     <Nav active={active} push={history.push} />,
//     document.getElementById("react-navbar")
//   );
// });

render(
  <Provider store={store}>
    <Router basename="/map">
      <Switch>
        <Route
          path="/detail/:username"
          exact
          component={UserDetail}
          name="userDetail"
        />
        <Route>
          <App>
            <Switch>
              <Route
                path="/"
                exact
                component={IssueList}
                name="issueListIndex"
              />
              <Route
                path="issue/:IssueID"
                component={IssueDetail}
                name="issueDetail"
              />
              <Route
                exact
                path="orgs/"
                component={OrganisationsList}
                name="orglist"
              />
            </Switch>
          </App>
        </Route>
      </Switch>
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
