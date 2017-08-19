import React from "react";
import { connect } from "react-redux";

import OrganisationDetail from "./organisationDetail";
import OrganisationsList from "./organisationsIndex";

class OrganisationView extends React.Component {
  render() {
    const { detail_view } = this.props;
    console.log(this.props);
    if (detail_view) {
      return <OrganisationDetail />;
    } else {
      return <OrganisationsList />;
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
  console.log(detail_view, ownProps);
  return {
    detail_view,
    org_id
  };
};

export default connect(mapStateToProps)(OrganisationView);
