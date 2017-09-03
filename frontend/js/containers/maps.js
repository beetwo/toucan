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
  getMarkersForOrganisation,
  GeoLocationMarker
} from "../components/map/markers";

import history from "../history";
import { withRouter } from "react-router";

class FilterMap extends React.Component {
  constructor(props) {
    super(props);

    this.getMarkers = this.getMarkers.bind(this);
    this.getClusterMarker = this.getClusterMarker.bind(this);
    this.markerCallback = this.markerCallback.bind(this);
    this.navigateToCluster = this.navigateToCluster.bind(this);
    this.state = {
      viewport: null
    };

    this.map = null;
  }

  markerCallback(marker_object, marker) {
    // console.warn("Callback", marker_object, marker);
  }

  navigateToCluster(cluster) {
    // this.props.onBoundsChanged(serializeBounds(cluster.getBounds()));
    this.props.onClusterNavigate &&
      this.props.onClusterNavigate(serializeBounds(cluster.getBounds()));
  }

  getMarkers() {
    let selection;
    if (this.props.selected_marker_objects) {
      selection = new Set(this.props.selected_marker_objects);
    }
    let selected_markers = [];
    let markers = this.props.marker_objects.reduce((previous_markers, mo) => {
      let object_markers = this.props.getMarker(mo, selection);
      if (!Array.isArray(object_markers)) {
        object_markers = [object_markers];
      }
      object_markers.forEach(m => this.markerCallback(mo, m));

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
        {this.props.geolocation ? (
          <GeoLocationMarker position={this.props.geolocation} />
        ) : null}
        <ToucanMarkerClusterGroup
          options={mc_options}
          onClusterClick={this.navigateToCluster}
        >
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
  bounds: PropTypes.array.isRequired,
  geolocation: PropTypes.array
};

const OrganisationMap = withRouter(
  connect(
    (state, ownProps) => {
      return {
        marker_objects: ownProps.organisations,
        bounds: ownProps.bounds,
        selected_marker_objects: ownProps.selected_organisation
          ? [ownProps.selected_organisation]
          : null,
        getMarker: getMarkersForOrganisation,
        getClusterMarker: getOrganisationClusterMarker,
        geolocation: state.map.geolocation
      };
    },
    (dispatch, { history, location }) => {
      return {
        onClusterNavigate: bounds => {
          console.log("Cluster navigate orgs");
          if (location.pathname !== "/orgs/") {
            history.push("/orgs/");
          }
        },
        onBoundsChanged: bounds => dispatch(setOrgMapBounds(bounds))
      };
    }
  )(FilterMap)
);

class IssueFilterMap extends FilterMap {
  markerCallback(issue, marker) {
    // console.warn("Issue Marker callback", issue, marker);
  }
}

const IssueMap = withRouter(
  connect(
    (state, ownProps) => {
      return {
        ...ownProps,
        marker_objects: ownProps.issues,
        bounds: ownProps.bounds,
        selected_marker_objects: ownProps.selectedIssue
          ? [ownProps.selectedIssue]
          : null,
        getMarker: getMarkerForIssue,
        getClusterMarker: getIssueMarkerCluster,
        geolocation: state.map.geolocation
      };
    },
    (dispatch, { history, location, ...ownProps }) => {
      return {
        onClusterNavigate: bounds => {
          if (location.pathname !== "/") {
            history.push("/");
          }
        },
        onBoundsChanged: bounds => {
          dispatch(setIssueMapBounds(bounds));
        }
      };
    }
  )(IssueFilterMap)
);

export { OrganisationMap, IssueMap };
