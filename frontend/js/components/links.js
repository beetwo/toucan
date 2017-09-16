import React from "react";
import { Link } from "react-router-dom";

const OrganisationLink = ({ org_id, children }) => {
  return <Link to={`/orgs/${org_id}/`}>{children}</Link>;
};

const UserLink = ({ username, children }) => {
  return <Link to={`/detail/${username}/`}>{children}</Link>;
};

export { UserLink, OrganisationLink };
