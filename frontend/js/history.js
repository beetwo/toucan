import React from "react";
import { Router as RRouter } from "react-router-dom";
import createBrowserHistory from "history/createBrowserHistory";

const history = createBrowserHistory({ basename: "/map" });

export default history;

const Router = (props = {}) =>
  <RRouter history={history} {...props}>
    {props.children}
  </RRouter>;

export { Router };
