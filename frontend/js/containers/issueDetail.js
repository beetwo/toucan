import React, {PropTypes} from 'react'
import { connect } from 'react-redux'
import IssueDetailUI from '../components/issueDetail'
import { fetchIssueIfNeeded, postComment, invalidateIssue } from '../actions'
import { addIssueFilter, removeIssueFilter} from '../actions'

import Comments from './comments'
import IssuesFilter from './issuesFilter'

import isEmpty from 'lodash/isEmpty'

class IssueDetailContainer extends React.Component {

  componentWillMount() {
    this.props.loadIssue(this.props.issueID);
  }

  componentWillReceiveProps(next_props) {
    if (
      (next_props.issueID != this.props.issueID) ||
      next_props.issue.didInvalidate
    ) {
      this.props.loadIssue(next_props.issueID)
    }
  }

  render() {
    return <IssueDetailUI { ...this.props } >
      <Comments issue_id={this.props.issueID} users={this.props.usernames}/>
    </IssueDetailUI>
  }
}

IssueDetailContainer.propTypes = {
  issue: PropTypes.object.isRequired,
  issueID: PropTypes.number.isRequired,
  users: PropTypes.array.isRequired,
  orgs: PropTypes.array.isRequired,
  mentions: PropTypes.array.isRequired
}

const mapStateToProps = (state, ownProps) => {
  let issue_id = parseInt(ownProps.routeParams.IssueID, 10);
  let issue = state.issueDetails[issue_id] || {};
  let mentions = [
    ...state.allUsers,
    ...state.allOrganisations
  ];
  return {
    issue ,
    issueID: issue_id,
    users: state.allUsers,
    orgs: state.allOrganisations,
    mentions: mentions
  }
}

const mapDispatchToProps = (dispatch, ownProps) => {
  return {
    loadIssue: (issue_id) => {
      dispatch(fetchIssueIfNeeded(issue_id))
    },
    onComment: (issue_id, comment) => {
      dispatch(postComment(issue_id, comment));
    },
    invalidateIssue: (issue_id) => {
      dispatch(invalidateIssue(issue_id));
    }
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(IssueDetailContainer)
