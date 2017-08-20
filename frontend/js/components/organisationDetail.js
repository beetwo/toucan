import React from "react";
import { Link } from "react-router-dom";
import { SplitUIView } from "./main";
import Loading from "./loading";
import { OrganisationsListMap } from "./organisationsList";

import history from "../history";

const OrganisationDetail = ({ org }) => {
  if (!org) {
    return <Loading />;
  }

  let map = <OrganisationsListMap organisations={[org]} />;
  const content = (
    <div className="org-detail">
      <div className="org-detail-main">
        <div className="org-detail-header">
          <div className="issue-detail-close pull-right">
            <Link to="/orgs/">
              <span className="icon icon-close" />
            </Link>
          </div>
          <div className="issue-list-mapHandle">
            <a href="#" className="mapHandle">
              &nbsp;
            </a>
          </div>
        </div>
        <div className="org-detail-content">
          <div className="org-detail-lead media">
            <div className="media-left media-middle">
              <img
                className="org-detail-logo"
                width="194"
                height="51"
                src="/media/CACHE/images/fadrat-logo/3bab5950eb11ee876bba51d417c536ab.png"
              />
            </div>
            <div className="media-body">
              <h1 className="org-detail-title">
                {org.name}
              </h1>
              <div className="org-details">
                <span className="icon icon-pin org-pin" />
                <span className="org-location">
                  {"Unknown Location"}
                </span>
              </div>
            </div>
          </div>
          <div className="org-detail-edit">
            <div className="btn btn-primary btn-block btn-sm">
              Edit organisation details
            </div>
          </div>
          <div className="org-detail-desc">
            {org.detail
              ? org.detail
              : <span className="text-muted">No description provided.</span>}
          </div>
          <div className="org-detail-contacts">
            <h2 className="org-detail-subhead">Contact</h2>
            <div className="org-detail-contact">
              <div className="media">
                <div className="media-left media-middle">
                  <div className="icon icon-contact-phone icon-xl" />
                </div>
                <a href="#" className="media-body media-middle">
                  +30 69 40938140
                </a>
              </div>
            </div>
            <div className="org-detail-contact">
              <div className="media">
                <div className="media-left media-middle">
                  <div className="icon icon-contact-email icon-xl" />
                </div>
                <a href="#" className="media-body media-middle">
                  info@projectelea.org
                </a>
              </div>
            </div>
            <div className="org-detail-contact">
              <div className="media">
                <div className="media-left media-middle">
                  <div className="icon icon-contact-web icon-xl" />
                </div>
                <a href="#" className="media-body media-middle">
                  www.projectelea.org
                </a>
              </div>
            </div>
            <div className="org-detail-contact">
              <div className="media">
                <div className="media-left media-middle">
                  <div className="icon icon-contact-address icon-xl" />
                </div>
                <a href="#" className="media-body media-middle">
                  Agiou Polikarpou 87, Votanikos, <br />
                  Athina 118 55, Greece
                </a>
              </div>
            </div>
          </div>
          <div className="org-detail-members">
            <h2 className="org-detail-subhead">Members</h2>
            <div className="org-detail-member">
              <div className="media">
                <div className="media-body">
                  <div className="pull-right">
                    <div className="org-detail-member-rights">
                      <div className="label label-organisation">Admin</div>
                    </div>
                  </div>
                  <div className="org-detail-member-name">Maria Kotrou</div>
                  <div className="org-detail-member-position">
                    Camp Coordinator
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div className="org-detail-edit">
            <div className="btn btn-primary btn-block btn-sm">
              Invite new members
            </div>
          </div>
        </div>
      </div>
    </div>
  );
  return <SplitUIView map={map} issue_view={content} />;
};

export default OrganisationDetail;
