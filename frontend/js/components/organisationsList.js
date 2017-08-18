import React from "react";
import OrganisationDetails from "./details/organisation";
import { SplitUIView } from "./main";
import Loading from "./loading";
import { DummyMap } from "./map";
import { Link } from "react-router-dom";

const OrgListItem = ({ org }) => {
  console.log(org);
  return (
      <Link className="org" to={`/orgs/${org.short_name}/`} key={org.pk}>
        <div className="flex-container flex-vCenter">
          <div className="flex-col col-lg">
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
      </Link>
  );
};

class OrganisationsList extends React.Component {
  render() {
    const map = <DummyMap />;
    const org_list = (
      <div className="issue-list">
        <div className="issue-list-mapHandle">
          <a href="#" className="mapHandle">
            &nbsp;
          </a>
        </div>
        <div className="issue-list-form">
          <div className="issue-sortandfilter">
            <div className="flex-container">
              <div className="flex-col">
                <a
                  href="#"
                  className="dropdown-toggle"
                  data-toggle="collapse"
                  data-target="#orgFilter"
                >
                  <span className="icon icon-filter" />
                  Filter
                </a>
              </div>
              <div className="flex-col text-right">
                <span className="text-muted">Sort by: </span>
                <a href="#">
                  Nearest <span className="icon icon-chevron" />
                </a>
              </div>
            </div>
          </div>
        </div>
        <div className="org-list-body">
          <div>
            <div className="filter collapse fullscreen-sm" id="orgFilter">
              <div className="fullscreen-header flex-container">
                <div className="flex-col">
                  <a
                    href="#"
                    className="fullscreen-close"
                    data-toggle="collapse"
                    data-target="#orgFilter"
                  >
                    <span className="icon icon-close" /> Filter
                  </a>
                </div>
                <div className="flex-col text-right">
                  <a href="#">Reset</a>
                </div>
              </div>
              <div className="fullscreen-content">
              Put filter options here
              </div>
              <div className="fullscreen-footer">
                <button
                  className="btn btn-primary btn-block"
                  data-toggle="collapse"
                  data-target="#orgFilter"
                >
                  Show results
                </button>
              </div>
            </div>
          </div>
        
          {this.props.organisations.map(org =>
            <OrgListItem org={org} key={org.pk} />
          )}
        </div>
      </div>
    );
    return <SplitUIView map={map} issue_view={org_list} />;
  }
}

export default OrganisationsList;
