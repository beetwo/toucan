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
  componentWillMount() {
    this.props.loadIssue(this.props.issue_id);
  }

  componentWillReceiveProps(next_props) {
    if (
      next_props.issue_id != this.props.issue_id ||
      next_props.issue.didInvalidate
    ) {
      this.props.loadIssue(next_props.issue_id);
    }
  }

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
  console.warn("Detail view", ownProps);
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
  let issue_id = ownProps.issue_id;
  return {
    loadIssue: issue_id => {
      dispatch(selectIssue(issue_id));
      dispatch(fetchIssueIfNeeded(issue_id));
    },
    onComment: (issue_id, comment) => {
      dispatch(postComment(issue_id, comment));
    },
    invalidateIssue: issue_id => {
      dispatch(invalidateIssue(issue_id));
    },
    changeIssueStatus: status => {
      console.log(issue_id, status);
      dispatch(changeIssueStatus(issue_id, status));
    }
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(
  IssueDetailContainer
);
