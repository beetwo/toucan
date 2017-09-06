import PropTypes from "prop-types";
import React from "react";
import { connect } from "react-redux";
import IssueListUI from "../components/issueList";

import getFilteredIssues from "../issueSelector";
import { resetIssueFilter, fetchIssues, resetSelectedIssue } from "../actions";

const mapStateToProps = (state, ownProps) => {
  return {
    issues: ownProps.issues,
    filterOptions: state.issueFilters,
    loading: state.loadingStatus.issues
  };
};

export default connect(mapStateToProps)(IssueListUI);
