import React from "react";

const Nav = ({ active, push }) => {
  const navigate = e => {
    e.preventDefault();
    console.log(e.target.href);
    push(e.target.getAttribute("href"));
  };
  console.log("rendering nav.");
  return (
    <ul className="nav navbar-nav">
      <li className={active === "needs" ? "active" : ""}>
        <a href="/" onClick={navigate}>
          <i className="fa fa-globe" /> Needs
        </a>
      </li>
      <li className={active === "orgs" ? "active" : ""}>
        <a href="/orgs/" onClick={navigate}>
          <i className="fa fa-address-card-o" /> Organisations
        </a>
      </li>
    </ul>
  );
};

export default Nav;
