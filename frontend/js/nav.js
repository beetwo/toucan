import React from "react";

const Nav = ({ active }) => {
  return (
    <ul className="nav navbar-nav">
      <li className={active === "needs" ? "active" : ""}>
        <a href="/map/">
          <i className="fa fa-globe" /> Needs
        </a>
      </li>
      <li className={active === "orgs" ? "active" : ""}>
        <a href="/map/orgs/">
          <i className="fa fa-address-card-o" /> Organisations
        </a>
      </li>
    </ul>
  );
};

export default Nav;
