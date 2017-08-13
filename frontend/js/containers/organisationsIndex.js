import PropTypes from "prop-types";
import React from "react";
import { connect } from "react-redux";
import OrganisationDetails from "../components/details/organisation";

import { fetchOrganisations } from "../actions";

import Loading from "../components/loading";

class OrganisationsApp extends React.Component {
  componentDidMount() {
    this.props.loadOrganisations();
  }
  render() {
    return (
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
        {this.props.organisations.map(org => {
          return (
            <div className="org-list-body">
              <div
                className="org"
                key={org.pk}
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
                      <span className="org-location">Athens, Greece</span>
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
        })}
      </div>
    );
  }
}

const mapStateToProps = (state, ownProps) => {
  console.log(state);
  let organisations = Object.values(state.organisationsByID);
  return {
    organisations
  };
};

const mapDispatchToProps = (dispatch, ownProps) => {
  console.log(fetchOrganisations);
  return {
    loadOrganisations: () => dispatch(fetchOrganisations())
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(OrganisationsApp);
