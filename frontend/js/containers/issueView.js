import React from "react";
import PropTypes from "prop-types";

import { connect } from "react-redux";
import { setMapBounds, setDetailZoom } from "../actions";

import { SplitUIView } from "../components/main";
import { ToucanMap } from "../components/map";
import { Marker } from "react-leaflet";
import getMarkerForIssue from "../components/map/markers";
import IssueDetail from "./issueDetail";
import IssueList from "./issueList";

const utils = {
  serializeLatLng: bounds => {
    let sw = bounds.getSouthWest();
    let ne = bounds.getNorthEast();
    return [[sw.lat, sw.lng], [ne.lat, ne.lng]];
  }
};

const getIssueMarker = (issue, selected = false, clickHandler) => {
  let position = [...issue.geometry.coordinates].reverse();
  let props = {
    position
  };
  let opts = {};
  if (selected) {
    opts.markerColor = "orange";
  }
  if (clickHandler) {
    props.onClick = () => clickHandler(issue.id);
  }

  let icon = getMarkerForIssue(issue.properties || issue, opts);
  if (icon != undefined) {
    props.icon = icon;
  }
  return <Marker key={issue.id} {...props} />;
};

class IssueContainer extends React.Component {
  render() {
    let {
      issue_detail,
      issue,
      issue_id,
      issues,
      map_bounds,
      navigateToIssue,
      changeBounds,
      ...props
    } = this.props;
    let markers = null;
    let content = null;

    // construct the map
    let map_props = {
      animate: true
    };
    // for selected issue
    if (issue_detail) {
      if (issue.isLoading === false) {
        const saveZoom = e => {
          this.props.setZoom(e.zoom);
        };
        map_props = {
          ...map_props,
          center: [...issue.issue_data.geometry.coordinates].reverse(),
          onViewportChanged: saveZoom,
          zoom: 13 // this should probably be saved in the global state object
        };
        markers = getIssueMarker(issue.issue_data, true);
      }
      content = <IssueDetail issue_id={issue_id} />;
    } else if (!issue_detail) {
      const onBoundsChanged = function(e) {
        changeBounds(utils.serializeLatLng(e.target.getBounds()));
      };
      map_props = {
        ...map_props,
        onZoomend: onBoundsChanged,
        onMoveend: onBoundsChanged,
        bounds: map_bounds
      };
      markers = issues.map(i => getIssueMarker(i, false, navigateToIssue));
      content = <IssueList />;
    }
    console.log(content);
    return (
      <SplitUIView
        map={
          <ToucanMap {...map_props}>
            {markers}
          </ToucanMap>
        }
        issue_view={content}
      />
    );
  }
}

IssueContainer.propTypes = {
  issue_detail: PropTypes.bool.isRequired,
  issue: PropTypes.object.isRequired,
  issues: PropTypes.array.isRequired
};

const mapStateToProps = (state, ownProps) => {
  let issue_detail = false;
  let issues = [];
  let issue = {};
  let issue_id = ownProps.issue_id ? parseInt(ownProps.issue_id, 10) : null;
  if (ownProps.issue_id) {
    issue_detail = true;
    issue = state.issueDetails[issue_id] || {};
  }
  return {
    issue,
    issue_id,
    issue_detail,
    content: ownProps.content,
    issues: state.redux_issues,
    navigateToIssue: id => ownProps.history.push(`/issue/${id}/`),
    detail_zoom: state.map.detail,
    map_bounds: state.map.list || state.initial_bounds
  };
};

const mapDispatchToProps = (dispatch, ownProps) => {
  return {
    changeBounds: e => {
      dispatch(setMapBounds(e));
    },
    setZoom: zoom => {
      dispatch(setDetailZoom(zoom));
    }
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(IssueContainer);
