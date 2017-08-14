import React from "react";
import { Link, withRouter } from "react-router-dom";
import { NavBar } from "simple-react-bootstrap";
import { connect } from "react-redux";
import cn from "classnames";

const ToucanLogo = require("../assets/toucan_logo.png");

const Nav = ({ location, current_user }) => {
  console.log("NAV:", current_user);
  const user = current_user.user || {};
  const links = current_user.links || [];
  let active =
    (location.pathname.split("/")[1] === "orgs" && "orgs") || "needs";
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

      <NavBar.Nav>
        <li className={cn({ active: active === "needs" })}>
          <Link to="/">
            <i className="fa fa-globe" /> Needs
          </Link>
        </li>
        <li className={cn({ active: active === "orgs" })}>
          <Link to="/orgs/">
            <i className="fa fa-address-card-o" /> Organisations
          </Link>
        </li>
      </NavBar.Nav>
      <NavBar.Nav className="navbar-right">
        <NavBar.Dropdown
          text={
            <span>
              <i className="fa  fa-user" /> {user.username || "urxn"}
            </span>
          }
        >
          {links.map(link =>
            <NavBar.Item key={link.url} href={link.url}>
              {link.name}
            </NavBar.Item>
          )}
        </NavBar.Dropdown>
      </NavBar.Nav>
    </NavBar>
  );
};

const ToucanNav = connect((state, ownProps) => {
  return { ...ownProps, current_user: state.currentUser };
})(Nav);

export default withRouter(ToucanNav);
