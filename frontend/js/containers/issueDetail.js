import PropTypes from "prop-types";
import React from "react";
import { connect } from "react-redux";
import IssueDetailUI from "../components/issueDetail";
import {
  fetchIssueIfNeeded,
  postComment,
  invalidateIssue,
  changeIssueStatus
} from "../actions";
import { addIssueFilter, removeIssueFilter, selectIssue } from "../actions";

import Comments from "./comments";
import IssuesFilter from "./issuesFilter";

import isEmpty from "lodash/isEmpty";

class IssueDetailContainer extends React.Component {
  render() {
    return (
      <IssueDetailUI {...this.props}>
        <Comments
          issue_id={this.props.issue_id}
          users={this.props.usernames}
          mentions={this.props.mentions}
        />
      </IssueDetailUI>
    );
  }
}

IssueDetailContainer.propTypes = {
  issue: PropTypes.object.isRequired,
  issue_id: PropTypes.number.isRequired,
  users: PropTypes.array.isRequired,
  orgs: PropTypes.array.isRequired,
  mentions: PropTypes.array.isRequired
};

const mapStateToProps = (state, ownProps) => {
  let issue = state.issueDetails[ownProps.issue_id] || {};
  let mentions = [...state.allUsers, ...state.allOrganisations];
  return {
    issue,
    issue_id: ownProps.issue_id,
    users: state.allUsers,
    orgs: state.allOrganisations,
    mentions: mentions,
    canComment: state.currentUser.canComment || false
  };
};

const mapDispatchToProps = (dispatch, ownProps) => {
  const issue_id = ownProps.issue_id;
  return {
    onComment: comment => {
      console.warn(comment);
      dispatch(postComment(issue_id, comment));
    },
    invalidateIssue: () => {
      dispatch(invalidateIssue(issue_id));
    },
    changeIssueStatus: status => {
      dispatch(changeIssueStatus(issue_id, status));
    }
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(
  IssueDetailContainer
);
