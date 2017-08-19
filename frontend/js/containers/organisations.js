import React from "react";
import { connect } from "react-redux";

import OrganisationDetail from "./organisationDetail";

import { fetchOrganisations, fetchOrganisationDetail } from "../actions";

import OrganisationsList from "../components/organisationsList";

class OrganisationView extends React.Component {
  constructor(props) {
    super(props);
    console.log("Constructor...", props);
    if (this.props.detail_view) {
      this.props.loadOrganisationDetail(this.props.org_id);
    } else {
      this.props.loadOrganisations();
    }
  }
  render() {
    const { detail_view } = this.props;
    console.log(this.props);
    if (detail_view) {
      return <OrganisationDetail />;
    } else {
      return <OrganisationsList organisations={this.props.organisations} />;
    }
  }
}

const mapStateToProps = (state, ownProps) => {
  let detail_view = false;
  let org_id;
  if (ownProps.org_id) {
    detail_view = true;
    org_id = ownProps.org_id;
  }
  return {
    detail_view,
    org_id,
    organisations: Object.values(state.organisationsByID)
  };
};

const mapDispatchToProps = (dispatch, ownProps) => {
  return {
    loadOrganisations: () => dispatch(fetchOrganisations()),
    loadOrganisationDetail: org_id => dispatch(fetchOrganisationDetail())
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(OrganisationView);
