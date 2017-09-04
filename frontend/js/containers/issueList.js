import PropTypes from "prop-types";
import React from "react";
import { connect } from "react-redux";
import IssueListUI from "../components/issueList";

import getFilteredIssues from "../issueSelector";
import {
  addIssueFilter,
  removeIssueFilter,
  resetIssueFilter,
  fetchIssues,
  resetSelectedIssue
} from "../actions";

const mapStateToProps = (state, ownProps) => {
  return {
    issues: ownProps.issues,
    filterOptions: state.issueFilters,
    loading: state.loadingStatus.issues
  };
};

const mapDispatchToProps = dispatch => {
  return {
    addIssueFilter: (prop, value) => dispatch(addIssueFilter(prop, value)),
    removeIssueFilter: (prop, value) =>
      dispatch(removeIssueFilter(prop, value)),
    resetIssueFilter: () => dispatch(resetIssueFilter())
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(IssueListUI);
