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

class IssueListContainer extends React.Component {
  constructor(props) {
    super(props);
    this.props.fetchIssues();
  }
  render() {
    return <IssueListUI {...this.props} />;
  }
}

const mapStateToProps = (state, ownProps) => {
  return {
    issues: getFilteredIssues(
      state.redux_issues,
      state.issueFilters.selections
    ),
    filterOptions: state.issueFilters,
    loading: state.loadingStatus.issues,
    geojson: state.geojson,
    initial_bounds: state.initial_bounds
  };
};

const mapDispatchToProps = (dispatch, ownProps) => {
  return {
    fetchIssues: () => dispatch(fetchIssues()),
    addIssueFilter: (prop, value) => dispatch(addIssueFilter(prop, value)),
    removeIssueFilter: (prop, value) =>
      dispatch(removeIssueFilter(prop, value)),
    selectIssue: issue => ownProps.history.push(`/issue/${issue.id}/`)
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(IssueListContainer);
