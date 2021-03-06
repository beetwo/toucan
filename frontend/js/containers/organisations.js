import React from "react";
import { connect } from "react-redux";
import history from "../history";
import PropTypes from "prop-types";
import { createSelector } from "reselect";

import { fetchOrganisations, fetchOrganisationDetails } from "../actions";
import { filterOrganisationsByBoundary } from "../orgSelector";

import OrganisationsList from "../components/organisationsList";
import OrganisationDetail from "../components/organisationDetail";

import { OrganisationMap } from "./maps";

import { SplitUIView } from "../components/main";

class OrganisationView extends React.Component {
  constructor(props) {
    super(props);
    this.loadData = this.loadData.bind(this);
    this.loadData(props.detail_view ? props.org_id : null);
  }

  loadData(org_id = null) {
    if (org_id) {
      this.props.loadOrganisationDetails(org_id);
    } else {
      this.props.loadOrganisations();
    }
  }

  componentWillReceiveProps(newProps) {
    if (
      this.props.detail_view !== newProps.detail_view ||
      this.props.org_id !== newProps.org_id
    ) {
      this.loadData(newProps.org_id);
    }
  }

  render() {
    const { detail_view } = this.props;
    let content = null;
    let map = null;
    if (detail_view) {
      content = <OrganisationDetail org={this.props.organisation} />;
      map = (
        <OrganisationMap
          organisations={this.props.organisations}
          bounds={this.props.bounds}
          selected_organisation={this.props.organisation}
        />
      );
    } else {
      content = (
        <OrganisationsList organisations={this.props.filteredOrganisations} />
      );
      map = (
        <OrganisationMap
          organisations={this.props.organisations}
          bounds={this.props.bounds}
        />
      );
    }

    return <SplitUIView map={map} issue_view={content} />;
  }
}

OrganisationView.propTypes = {
  detail_view: PropTypes.bool.isRequired,
  org_id: PropTypes.number
};

const organisationsSelector = state => state.organisationsByID;
const boundsSelector = state => {
  return state.map.org_list;
};

const getAllOrganisations = createSelector([organisationsSelector], orgsByIDs =>
  Object.values(orgsByIDs)
);

const getGeoFilteredOrganisations = createSelector(
  [getAllOrganisations, boundsSelector],
  filterOrganisationsByBoundary
);

const mapStateToProps = (state, ownProps) => {
  let detail_view = false;
  let org_id;
  if (ownProps.org_id) {
    detail_view = true;
    org_id = parseInt(ownProps.org_id, 10);
  }
  return {
    detail_view,
    org_id,
    organisations: getAllOrganisations(state),
    filteredOrganisations: getGeoFilteredOrganisations(state),
    bounds: boundsSelector(state),
    organisation: state.organisationsByID[org_id]
  };
};

const mapDispatchToProps = (dispatch, ownProps) => {
  return {
    loadOrganisations: () => dispatch(fetchOrganisations()),
    loadOrganisationDetails: org_id =>
      dispatch(fetchOrganisationDetails(org_id))
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(OrganisationView);
