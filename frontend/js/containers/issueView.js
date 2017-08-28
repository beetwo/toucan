import React from "react";
import PropTypes from "prop-types";

import { connect } from "react-redux";
import { setMapBounds, setDetailZoom } from "../actions";
import { createSelector } from "reselect";

import { SplitUIView } from "../components/main";
import { ToucanMap } from "../components/map";
import { Marker } from "react-leaflet";
import getMarkerForIssue from "../components/map/markers";
import IssueDetail from "./issueDetail";
import IssueList from "./issueList";

import filter_issues from "../issueSelector";

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
  constructor(props) {
    super(props);
    this.onViewportChanged = this.onViewportChanged.bind(this);
    this.state = {
      detail_zoom_level: 13,
      viewport: null
    };
  }
  onViewportChanged(viewport, bounds) {
    console.warn(this.props.issue_detail ? "Detail" : "List", viewport, bounds);
    if (this.props.issue_detail) {
      // set the detail zoom level
      this.props.setZoom(viewport.zoom);
    } else {
      // set the viewport
      this.props.changeBounds(utils.serializeLatLng(bounds));
      this.setState({ viewport });
    }
  }

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
      animate: false,
      onViewportChanged: this.onViewportChanged,
      bounds: map_bounds
    };

    // for selected issue
    if (issue_detail) {
      if (issue.isLoading === false) {
        map_props = {
          ...map_props,
          center: [...issue.issue_data.geometry.coordinates].reverse(),
          zoom: this.state.detail_zoom_level
        };
        markers = getIssueMarker(issue.issue_data, true);
      }
      content = <IssueDetail issue_id={issue_id} />;
    } else if (!issue_detail) {
      markers = issues.map(i => getIssueMarker(i, false, navigateToIssue));
      if (this.state.viewport) {
        map_props = {
          ...map_props,
          viewport: this.state.viewport
        };
      }
      content = <IssueList issues={issues} />;
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

// some state selectors
const issuesSelector = state => state.redux_issues;
const filterSelector = state => state.issueFilters.selections;
const boundsSelector = state => state.map.list || state.initial_bounds;

// a function to filter the whole stuff
const getFilteredIssues = createSelector(
  [issuesSelector, filterSelector, boundsSelector],
  filter_issues
);

const mapStateToProps = (state, ownProps) => {
  let issue_detail = false;
  let issue = {};
  let issue_id = ownProps.issue_id ? parseInt(ownProps.issue_id, 10) : null;
  if (ownProps.issue_id) {
    issue_detail = true;
    issue = state.issueDetails[issue_id] || {};
  }

  console.log(getFilteredIssues(state));
  return {
    issue,
    issue_id,
    issue_detail,
    content: ownProps.content,
    issues: getFilteredIssues(state),
    detail_zoom: state.map.detail,
    map_bounds: state.initial_bounds
  };
};

const mapDispatchToProps = (dispatch, ownProps) => {
  return {
    changeBounds: e => {
      dispatch(setMapBounds(e));
    },
    setZoom: zoom => {
      dispatch(setDetailZoom(zoom));
    },
    navigateToIssue: id => ownProps.history.push(`/issue/${id}/`)
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(IssueContainer);
