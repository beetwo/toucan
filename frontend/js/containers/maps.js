import React from "react";
import PropTypes from "prop-types";

import { connect } from "react-redux";

import { ToucanMap, ToucanMarkerClusterGroup } from "../components/map";
import { serializeBounds } from "../components/map/utils";

import {
  setIssueDetailZoom,
  setIssueMapBounds,
  setOrgDetailZoom,
  setOrgMapBounds
} from "../actions";

import {
  getOrganisationClusterMarker,
  getIssueMarkerCluster,
  getMarkerForIssue,
  getMarkersForOrganisation
} from "../components/map/markers";

class FilterMap extends React.Component {
  constructor(props) {
    super(props);

    this.getMarkers = this.getMarkers.bind(this);
    this.getClusterMarker = this.getClusterMarker.bind(this);
    this.state = {
      viewport: null
    };

    this.map = null;
  }

  getMarkers() {
    let selection;
    if (this.props.selected_marker_objects) {
      selection = new Set(this.props.selected_marker_objects);
    }
    let selected_markers = [];
    let markers = this.props.marker_objects.reduce((previous_markers, mo) => {
      if (selection && selection.has(mo)) {
        console.log("Is selected", mo);
      }
      let object_markers = this.props.getMarker(mo, selection);
      if (!Array.isArray(object_markers)) {
        object_markers = [object_markers];
      }
      return previous_markers.concat(object_markers);
    }, []);
    return markers;
  }

  getClusterMarker(cluster) {
    return this.props.getClusterMarker(cluster);
  }

  render() {
    const markers = this.getMarkers();
    const mc_options = {
      iconCreateFunction: this.getClusterMarker
    };
    return (
      <ToucanMap
        bounds={this.props.bounds}
        onBoundsChanged={this.props.onBoundsChanged}
      >
        <ToucanMarkerClusterGroup options={mc_options}>
          {markers}
        </ToucanMarkerClusterGroup>
      </ToucanMap>
    );
  }
}

FilterMap.propTypes = {
  marker_objects: PropTypes.arrayOf(PropTypes.object).isRequired,
  selected_marker_objects: PropTypes.arrayOf(PropTypes.object),
  getMarker: PropTypes.func.isRequired,
  getClusterMarker: PropTypes.func.isRequired,
  onBoundsChanged: PropTypes.func.isRequired,
  bounds: PropTypes.array.isRequired
};

const OrganisationMap = connect(
  (state, ownProps) => {
    return {
      marker_objects: ownProps.organisations,
      bounds: ownProps.bounds,
      selected_marker_objects: ownProps.selected_organisation
        ? [ownProps.selected_organisation]
        : null,
      getMarker: getMarkersForOrganisation,
      getClusterMarker: getOrganisationClusterMarker
    };
  },
  dispatch => {
    return {
      onBoundsChanged: bounds => dispatch(setOrgMapBounds(bounds))
    };
  }
)(FilterMap);

const IssueMap = connect(
  (state, ownProps) => {
    return {
      marker_objects: ownProps.issues,
      bounds: ownProps.bounds,
      selected_marker_objects: ownProps.selectedIssue
        ? [ownProps.selectedIssue]
        : null,
      getMarker: getMarkerForIssue,
      getClusterMarker: getIssueMarkerCluster
    };
  },
  dispatch => {
    return {
      onBoundsChanged: bounds => dispatch(setIssueMapBounds(bounds))
    };
  }
)(FilterMap);

export { OrganisationMap, IssueMap };
