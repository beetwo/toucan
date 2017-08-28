import PropTypes from "prop-types";
import React from "react";
import { connect } from "react-redux";
import IssueListUI from "../components/issueList";
import getFilteredIssues from "../issueSelector";
import {
  addIssueFilter,
  removeIssueFilter,
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

const mapDispatchToProps = (dispatch, ownProps) => {
  return {
    addIssueFilter: (prop, value) => dispatch(addIssueFilter(prop, value)),
    removeIssueFilter: (prop, value) =>
      dispatch(removeIssueFilter(prop, value)),
    selectIssue: issue => ownProps.history.push(`/issue/${issue.id}/`)
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(IssueListUI);
