import React from "react";
import PropTypes from "prop-types";

import { connect } from "react-redux";
import { createSelector } from "reselect";
import { Marker } from "react-leaflet";

import {
  setIssueMapBounds,
  setIssueDetailZoom,
  fetchIssues,
  selectIssue,
  fetchIssueIfNeeded
} from "../actions";

import { SplitUIView } from "../components/main";
import { ToucanMap, ToucanMarkerClusterGroup } from "../components/map";
import { serializeBounds } from "../components/map/utils";
import getMarkerForIssue, {
  getIssueMarkerCluster
} from "../components/map/markers";
import IssueDetail from "./issueDetail";
import IssueList from "./issueList";

import { filterByFilterOptions, filterByBoundary } from "../issueSelector";

const getIssueMarker = (issue, selected = false, clickHandler) => {
  if (selected) {
    console.warn(issue);
  }
  let position = [...issue.geometry.coordinates].reverse();
  let props = {
    position
  };

  if (clickHandler) {
    props.onClick = () => clickHandler(issue.id);
  }

  let icon = getMarkerForIssue(issue.properties || issue, selected);
  if (icon != undefined) {
    props.icon = icon;
  }
  return <Marker key={issue.id} {...props} />;
};

const clusterOptions = { iconCreateFunction: getIssueMarkerCluster };

class IssueContainer extends React.Component {
  constructor(props) {
    super(props);

    this.onViewportChanged = this.onViewportChanged.bind(this);
    this.getIssueMarkers = this.getIssueMarkers.bind(this);

    this.state = {
      detail_zoom_level: 13,
      viewport: null
    };
    if (props.issue_detail) {
      this.props.fetchSingleIssue();
    }
    this.props.fetchIssues();
  }

  componentWillReceiveProps(next_props) {
    if (
      next_props.issue_id != this.props.issue_id ||
      next_props.issue.didInvalidate
    ) {
      next_props.fetchSingleIssue();
    }
  }

  onViewportChanged(viewport, bounds) {
    console.warn(this.props.issue_detail ? "Detail" : "List", viewport, bounds);
    if (this.props.issue_detail) {
      // set the detail zoom level
      this.props.setZoom(viewport.zoom);
    } else {
      // set the viewport
      this.props.changeBounds(serializeBounds(bounds));
      this.setState({ viewport });
    }
  }

  getIssueMarkers() {
    let issues = this.props.filteredIssues;
    let markers = [];
    if (
      this.props.issue_detail &&
      this.props.issue.issue_data &&
      Object.keys(this.props.issue.issue_data).length
    ) {
      issues = issues.filter(i => i.id !== this.props.issue_id);
      markers = [getIssueMarker(this.props.issue.issue_data, true)];
    }
    return markers.concat(
      issues.map(i => getIssueMarker(i, false, this.props.navigateToIssue))
    );
  }
  render() {
    let {
      issue_detail,
      issue,
      issue_id,
      filteredIssues,
      geoFilteredIssues,
      map_bounds,
      navigateToIssue,
      changeBounds,
      ...props
    } = this.props;

    let content = null;

    // construct the map
    let map_props = {
      animate: true,
      onViewportChanged: this.onViewportChanged,
      bounds: map_bounds
    };

    let markers = this.getIssueMarkers();

    // for selected issue
    if (issue_detail) {
      if (issue.isLoading === false) {
        map_props = {
          ...map_props,
          center: [...issue.issue_data.geometry.coordinates].reverse(),
          zoom: this.state.detail_zoom_level,
          bounds: null
        };
      }
      content = <IssueDetail issue_id={issue_id} />;
    } else if (!issue_detail) {
      if (this.state.viewport) {
        map_props = {
          ...map_props,
          viewport: this.state.viewport
        };
      }
      content = <IssueList issues={geoFilteredIssues} />;
    }
    return (
      <SplitUIView
        map={
          <ToucanMap {...map_props}>
            <ToucanMarkerClusterGroup options={clusterOptions}>
              {markers}
            </ToucanMarkerClusterGroup>
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
  filteredIssues: PropTypes.array.isRequired,
  geoFilteredIssues: PropTypes.array.isRequired,
  navigateToIssue: PropTypes.func.isRequired
};

// some state selectors
const issuesSelector = state => state.redux_issues;
const filterSelector = state => state.issueFilters.selections;
const boundsSelector = state => state.map.issue_list;

// a function to filter the issues by filterOptions
const getFilteredIssues = createSelector(
  [issuesSelector, filterSelector],
  filterByFilterOptions
);

// and to filter those by bounds
const getGeoFilteredIssues = createSelector(
  [getFilteredIssues, boundsSelector],
  filterByBoundary
);

const mapStateToProps = (state, ownProps) => {
  let issue_detail = false;
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
    filteredIssues: getFilteredIssues(state),
    geoFilteredIssues: getGeoFilteredIssues(state),
    detail_zoom: state.map.detail,
    map_bounds: boundsSelector(state)
  };
};

const mapDispatchToProps = (dispatch, ownProps) => {
  const issue_id = ownProps.issue_id;
  return {
    changeBounds: e => {
      dispatch(setIssueMapBounds(e));
    },
    setZoom: zoom => {
      dispatch(setIssueDetailZoom(zoom));
    },
    navigateToIssue: id => ownProps.history.push(`/issue/${id}/`),
    fetchIssues: () => dispatch(fetchIssues()),
    fetchSingleIssue: () => {
      if (issue_id) {
        dispatch(selectIssue(issue_id));
        dispatch(fetchIssueIfNeeded(issue_id));
      }
    }
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(IssueContainer);
