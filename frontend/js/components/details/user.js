/**
 * Created by sean on 22/12/16.
 */
import React from "react";
import UserLink from "../userLink";
import { OrganisationLink } from "../links";
import DetailTable from "./table";

class UserDetails extends React.Component {
  render() {
    let { username, first_name, last_name, membership, html_url } = this.props;
    let org = membership.org;
    console.warn(this.props);
    let items = [
      ["Username", username],
      [
        "Full name",
        first_name || last_name ? (
          `${first_name} ${last_name}`
        ) : (
          <span className="text-muted">Not given</span>
        )
      ],
      [
        "Organisation",
        <OrganisationLink org_id={org.id}>{org.name}</OrganisationLink>
      ]
    ];
    return (
      <div>
        <h1>Profile for user {username}</h1>
        <DetailTable items={items} />
        <UserLink linkTo={html_url} className="btn btn-default pull-right">
          More
        </UserLink>
      </div>
    );
  }
}

export default UserDetails;
