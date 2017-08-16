import PropTypes from "prop-types";
import React from "react";
import { connect } from "react-redux";

import { fetchOrganisations } from "../actions";
import OrganisationsList from "../components/organisationsList";

class OrganisationsApp extends React.Component {
  componentDidMount() {
    this.props.loadOrganisations();
  }
  render() {
    return <OrganisationsList organisations={this.props.organisations} />;
  }
}

const mapStateToProps = (state, ownProps) => {
  let organisations = Object.values(state.organisationsByID);
  return {
    organisations
  };
};

const mapDispatchToProps = (dispatch, ownProps) => {
  return {
    loadOrganisations: () => dispatch(fetchOrganisations())
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(OrganisationsApp);
