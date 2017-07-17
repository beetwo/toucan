import React, { PropTypes } from "react";
import { connect } from "react-redux";
import OrganisationDetails from "../components/details/organisation";

import { fetchOrganisations } from "../actions";

import Loading from "../components/loading";

console.log(fetchOrganisations);

class OrganisationsApp extends React.Component {
  componentDidMount() {
    this.props.loadOrganisations();
  }
  render() {
    return (
      <div>
        <h1>Organisations</h1>
        {this.props.organisations.map(org => {
          return (
            <pre key={org.pk}>
              {JSON.stringify(org, null, 2)}
            </pre>
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
