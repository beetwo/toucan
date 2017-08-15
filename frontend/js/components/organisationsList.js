import React from "react";
import OrganisationDetails from "./details/organisation";
import { SplitUIView } from "./main";
import Loading from "./loading";
import { DummyMap } from "./map";

const OrgListItem = ({ org }) => {
  return (
    <div className="org-list-body" key={org.pk}>
      <div
        className="org"
        onClick={e => {
          e.preventDefault();
          window.location.href = org.profile_url;
        }}
      >
        <div className="flex-container flex-vCenter">
          <div className="flex-col">
            <div className="issue-basics">
              <span className="issue-title">
                {org.name}
              </span>
            </div>
            <div className="org-details">
              <span className="icon icon-pin org-pin" />
              <span className="org-location">
                {org.location || "Athens, Greece"}
              </span>
            </div>
          </div>
          <div className="flex-col">
            <div className="org-logo">
              <img src={org.logo} alt="" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

class OrganisationsList extends React.Component {
  render() {
    const map = <DummyMap />;
    const org_list = (
      <div>
        <div className="issue-list-mapHandle">
          <a href="#" className="mapHandle">
            &nbsp;
          </a>
        </div>
        <div className="issue-list-form">
          <div className="flex-container">
            <div className="flex-col">
              <a href="#" className="dropdown-toggle" data-toggle="dropdown">
                <span className="icon icon-filter" />
                Filter
              </a>
              <ul className="dropdown-menu" />
            </div>
            <div className="flex-col text-right">
              <span className="text-muted">Sort by: </span>
              <a href="#">
                Nearest <span className="icon icon-chevron" />
              </a>
            </div>
          </div>
        </div>
        {this.props.organisations.map(org =>
          <OrgListItem org={org} key={org.pk} />
        )}
      </div>
    );
    return <SplitUIView map={map} issue_view={org_list} />;
  }
}

export default OrganisationsList;
