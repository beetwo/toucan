import React from "react";
import { Link, withRouter } from "react-router-dom";
import { connect } from "react-redux";
import cn from "classnames";

const ToucanLogo = require("../assets/toucan_logo.png");

class NavBar extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      open: false
    };
    this.toggle = this.toggle.bind(this);
  }

  toggle() {
    this.setState(state => ({ open: !state.open }));
  }

  render() {
    const { location, current_user } = this.props;
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
      <nav className="navbar navbar-default">
        <div className="container-fluid">
          <div className="navbar-header">
            <button
              type="button"
              onClick={this.toggle}
              className={cn("navbar-toggle", { collapsed: this.state.open })}
            >
              <span className="sr-only">Toggle navigation</span>
              <span className="icon-bar" />
              <span className="icon-bar" />
              <span className="icon-bar" />
            </button>
            <Link to="/" className="navbar-brand">
              <img
                alt="Toucan Logo"
                className="navbar-logo img-responsive"
                src={ToucanLogo}
              />
            </Link>
          </div>
          <div
            className={cn("collapse navbar-collapse", { in: this.state.open })}
            onClick={this.toggle}
          >
            <ul className="nav navbar-nav navbar-main">
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
            </ul>
            <ul className="nav navbar-nav navbar-right navbar-secondary">
              {support_link ? (
                <li className="nav-muted">
                  <a key={support_link.url} href={support_link.url}>
                    <span className="icon icon-support icon-lg" />
                    Support
                  </a>
                </li>
              ) : null}
              {logout_link ? (
                <li className="nav-muted" key={logout_link.url}>
                  <a href={logout_link.url}>
                    <span className="icon icon-logout icon-lg" />
                    Logout
                  </a>
                </li>
              ) : null}
            </ul>
          </div>
        </div>
      </nav>
    );
  }
}

const ToucanNav = connect((state, { location }) => {
  return {
    location,
    current_user: state.currentUser
  };
})(NavBar);

export default withRouter(ToucanNav);
