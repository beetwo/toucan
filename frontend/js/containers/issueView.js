import React from "react";
import PropTypes from "prop-types";

import { connect } from "react-redux";
import { createSelector } from "reselect";

import {
  setIssueMapBounds,
  setIssueDetailZoom,
  fetchIssues,
  selectIssue,
  fetchIssueIfNeeded
} from "../actions";

import { SplitUIView } from "../components/main";

import IssueDetail from "./issueDetail";
import IssueList from "./issueList";

import { filterByFilterOptions, filterByBoundary } from "../issueSelector";
import { IssueMap } from "./maps";

class IssueContainer extends React.Component {
  constructor(props) {
    super(props);

    this.isDetailView = this.isDetailView.bind(this);

    this.props.fetchIssues();
  }

  isDetailView() {
    return Boolean(this.props.issue_id);
  }

  render() {
    let map = null;
    let content = null;

    // for selected issue
    if (this.isDetailView()) {
      content = <IssueDetail issue_id={this.props.issue_id} />;
      map = (
        <IssueMap
          bounds={this.props.bounds}
          issues={this.props.filteredIssues}
          selectedIssue={this.props.selectedIssue}
        />
      );
    } else {
      content = <IssueList issues={this.props.geoFilteredIssues} />;
      map = (
        <IssueMap
          bounds={this.props.bounds}
          issues={this.props.filteredIssues}
        />
      );
    }
    return <SplitUIView map={map} issue_view={content} />;
  }
}

IssueContainer.propTypes = {
  issue_id: PropTypes.number,
  selectedIssue: PropTypes.object,
  filteredIssues: PropTypes.array.isRequired,
  geoFilteredIssues: PropTypes.array.isRequired
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
  let issue_id = ownProps.issue_id ? parseInt(ownProps.issue_id, 10) : null;
  let selectedIssue = null;
  if (issue_id) {
    selectedIssue = issuesSelector(state).find(i => i.id === issue_id);
  }
  return {
    issue_id,
    selectedIssue,
    filteredIssues: getFilteredIssues(state),
    geoFilteredIssues: getGeoFilteredIssues(state),
    bounds: boundsSelector(state)
  };
};

const mapDispatchToProps = (dispatch, ownProps) => {
  const issue_id = ownProps.issue_id;
  return {
    onBoundsChanged: e => {
      dispatch(setIssueMapBounds(e));
    },
    setZoom: zoom => {
      dispatch(setIssueDetailZoom(zoom));
    },
    fetchIssues: () => dispatch(fetchIssues())
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(IssueContainer);
