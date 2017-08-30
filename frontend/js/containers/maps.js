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
    let markers = this.props.marker_objects.reduce((previous_markers, mo) => {
      let object_markers = this.props.getMarker(mo);
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
    console.warn(this.getClusterMarker, mc_options);

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
      getMarker: getMarkersForOrganisation,
      getClusterMarker: getOrganisationClusterMarker,
      selected_marker_objects: ownProps.selectedOrganisation
        ? [ownProps.selectedOrganisation]
        : null
    };
  },
  dispatch => {
    return {
      onBoundsChanged: bounds => dispatch(setOrgMapBounds(bounds))
    };
  }
)(FilterMap);

export { OrganisationMap };
