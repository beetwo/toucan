import React from "react";
import { connect } from "react-redux";
import IssueFilter from "../components/issueFilter";
import {
  addIssueFilter,
  removeIssueFilter,
  resetIssueFilter
} from "../actions";

const mapStateToProps = (state, ownProps) => {
  return {
    ...ownProps,
    filterOptions: state.issueFilters
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

export default connect(mapStateToProps, mapDispatchToProps)(IssueFilter);
