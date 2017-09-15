import React from "react";
import { Link, withRouter } from "react-router-dom";
import { NavBar } from "simple-react-bootstrap";
import { connect } from "react-redux";
import cn from "classnames";

const ToucanLogo = require("../assets/toucan_logo.png");

const Nav = ({ location, current_user }) => {
  const user = current_user.user || {};
  let active =
    (location.pathname.split("/")[1] === "orgs" && "orgs") || "needs";

  const links = current_user.links || [];
  const keyed_links = links.reduce(
    (prev, link) => ({ ...prev, [link.key]: link }),
    {}
  );
  // the actual links
  const settings_link = keyed_links.settings;
  const logout_link = keyed_links.logout;
  const support_link = keyed_links.support;

  return (
    <NavBar>
      <NavBar.Header>
        <NavBar.Brand>
          <Link to="/">
            <img
              alt="Toucan Logo"
              className="navbar-logo img-responsive"
              src={ToucanLogo}
            />
          </Link>
        </NavBar.Brand>
        <NavBar.Toggle />
      </NavBar.Header>

      <NavBar.Nav className="navbar-main">
        <li className={cn("nav-issues", { active: active === "needs" })}>
          <Link to="/">Needs</Link>
        </li>
        <li className={cn("nav-orgs", { active: active === "orgs" })}>
          <Link to="/orgs/">Organisations</Link>
        </li>
        {/* this one comes from the server and might not be available at first render*/}
        {settings_link ? (
          <li className="nav-settings">
            <a href={settings_link.url}>Profile and Settings</a>
          </li>
        ) : null}
      </NavBar.Nav>
      <NavBar.Nav className="navbar-secondary navbar-right">
        {support_link ? (
          <NavBar.Item
            className="nav-muted"
            key={support_link.url}
            href={support_link.url}
          >
            <span className="icon icon-support icon-lg" />
            Support
          </NavBar.Item>
        ) : null}
        {logout_link ? (
          <NavBar.Item
            className="nav-muted"
            key={logout_link.url}
            href={logout_link.url}
          >
            <span className="icon icon-logout icon-lg" />
            Logout
          </NavBar.Item>
        ) : null}
      </NavBar.Nav>
    </NavBar>
  );
};

const ToucanNav = connect((state, { location }) => {
  return {
    location,
    current_user: state.currentUser
  };
})(Nav);

export default withRouter(ToucanNav);
