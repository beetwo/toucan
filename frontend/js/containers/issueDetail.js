import PropTypes from "prop-types";
import React from "react";
import { connect } from "react-redux";
import IssueDetailUI from "../components/issueDetail";
import {
  postComment,
  invalidateIssue,
  changeIssueStatus,
  selectIssue,
  fetchIssueIfNeeded,
  addIssueFilter,
  removeIssueFilter
} from "../actions";

import Loading from "../components/loading";

import Comments from "./comments";
import IssuesFilter from "./issuesFilter";

import isEmpty from "lodash/isEmpty";

class IssueDetailContainer extends React.Component {
  constructor(props) {
    super(props);
    this.props.loadIssue();
  }

  componentWillReceiveProps(newProps) {
    if (this.props.issue_id !== newProps.issue_id) {
      newProps.loadIssue();
    }
  }

  render() {
    if (!this.props.issue) {
      return <Loading />;
    }
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
  issue_id: PropTypes.number.isRequired,
  issue: PropTypes.object,
  users: PropTypes.array.isRequired,
  orgs: PropTypes.array.isRequired,
  mentions: PropTypes.array.isRequired,
  canComment: PropTypes.bool.isRequired
};

const mapStateToProps = (state, ownProps) => {
  let mentions = [...state.allUsers, ...state.allOrganisations];

  return {
    issue_id: ownProps.issue_id,
    issue: state.issueDetails[ownProps.issue_id],
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
      dispatch(postComment(issue_id, comment));
    },
    invalidateIssue: () => {
      dispatch(invalidateIssue(issue_id));
    },
    changeIssueStatus: status => {
      dispatch(changeIssueStatus(issue_id, status));
    },
    loadIssue: () => {
      dispatch(selectIssue(issue_id));
      dispatch(fetchIssueIfNeeded(issue_id));
    }
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(
  IssueDetailContainer
);
