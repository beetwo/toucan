import React from "react";
import { Link } from "react-router-dom";
import { SplitUIView } from "./main";
import Loading from "./loading";

import history from "../history";

const LocationDetail = ({ location }) => {
  return (
    <div className="media">
      <div className="media-left media-middle">
        <div className="icon icon-contact-address icon-xl" />
      </div>
      <a href="#" className="media-body media-middle">
        {location.name} <br />
        {location.city}
      </a>
    </div>
  );
};

const Membership = ({ membership }) => {
  const user = membership.user;
  return (
    <div className="org-detail-member">
      <div className="media">
        <div className="media-body">
          <div className="pull-right">
            <div className="org-detail-member-rights">
              <div className="label label-organisation">{membership.role}</div>
            </div>
          </div>
          <div className="org-detail-member-name">
            {user.first_name} {user.last_name}
          </div>
          <div className="org-detail-member-position">@{user.username}</div>
        </div>
      </div>
    </div>
  );
};

const ContactDetail = ({ type, value }) => {
  return (
    <div className="org-detail-contact">
      <div className="media">
        <div className="media-left media-middle">
          <div className={`icon icon-contact-${type} icon-xl`} />
        </div>
        <a href="#" className="media-body media-middle">
          {value}
        </a>
      </div>
    </div>
  );
};

const OrganisationContactDetails = ({ org }) => {
  let { phone, email, homepage } = org;
  if (![phone, email, homepage].some(Boolean)) {
    return null;
  }
  return (
    <div>
      {" "}
      <h2 className="org-detail-subhead">Contact</h2>
      {phone ? <ContactDetail key="phone" type="phone" value={phone} /> : null}
      {email ? <ContactDetail key="email" type="email" value={email} /> : null}
      {homepage ? (
        <ContactDetail key="web" type="web" value={homepage} />
      ) : null}
    </div>
  );
};

const OrgDetailLink = ({ href, children }) => {
  return (
    <div className="org-detail-edit">
      <a href={href} className="btn btn-primary btn-block btn-sm">
        {children}
      </a>
    </div>
  );
};

class OrganisationDetail extends React.Component {
  render() {
    let { org } = this.props;
    if (!org || !org.details_loaded) {
      return <Loading />;
    }

    let { edit_url, invite_url, location_description } = org;

    const content = (
      <div className="org-detail">
        <div className="org-detail-main">
          <div className="org-detail-header">
            <div className="issue-detail-close pull-right">
              <Link to="/orgs/">
                <span className="icon icon-close" />
              </Link>
            </div>
          </div>
          <div className="org-detail-content">
            <div className="org-detail-lead media">
              <div className="media-left media-middle">
                {org.logo ? (
                  <img
                    className="org-detail-logo"
                    width="194"
                    height="51"
                    src={org.logo}
                  />
                ) : null}
              </div>
              <div className="media-body">
                <h1 className="org-detail-title">{org.name}</h1>

                {location_description ? (
                  <div className="org-details">
                    <span className="icon icon-pin org-pin" />
                    <span className="org-location">{location_description}</span>
                  </div>
                ) : null}
              </div>
            </div>

            {edit_url ? (
              <OrgDetailLink href={edit_url}>
                Edit organisation details
              </OrgDetailLink>
            ) : (
              <hr />
            )}

            <div className="org-detail-desc">
              {org.description ? (
                org.description
              ) : (
                <span className="text-muted">No description provided.</span>
              )}
            </div>
            <div className="org-detail-contacts">
              <OrganisationContactDetails org={org} />

              <h2 className="org-detail-subhead">Locations</h2>
              <div className="org-detail-contact">
                {org.locations.map(l => (
                  <LocationDetail location={l} key={l.id} />
                ))}
              </div>
            </div>

            <div className="org-detail-members">
              <h2 className="org-detail-subhead">Members</h2>
              {org.members.map(m => (
                <Membership membership={m} key={m.user.username} />
              ))}
            </div>
            {invite_url ? (
              <OrgDetailLink href={invite_url}>
                Invite new members
              </OrgDetailLink>
            ) : (
              <hr />
            )}
          </div>
        </div>
      </div>
    );
    return content;
  }
}

export default OrganisationDetail;
