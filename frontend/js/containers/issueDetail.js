import React, {PropTypes} from 'react'
import { connect } from 'react-redux'
import IssueDetailUI from '../components/issueDetail'
import { fetchIssueIfNeeded, postComment, invalidateIssue } from '../actions'
import Comments from './comments'

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
      <Comments issue_id={this.props.issueID} />
    </IssueDetailUI>
  }
}

IssueDetailContainer.propTypes = {
  issue: PropTypes.object.isRequired,
  issueID: PropTypes.number.isRequired
}

const mapStateToProps = (state, ownProps) => {
  let issue_id = parseInt(ownProps.routeParams.IssueID, 10);
  return {
    issue: state.issueDetails[issue_id] || {},
    issueID: issue_id
  }
}

const mapDispatchToProps = (dispatch, ownProps) => {
  return {
    loadIssue: (issue_id) => {
      dispatch(fetchIssueIfNeeded(issue_id))
    },
    onComment: (comment) => {
      dispatch(postComment(issue_id, comment));
    },
    invalidateIssue: () => {
      dispatch(invalidateIssue(issue_id));
    }

  }
}

export default connect(mapStateToProps, mapDispatchToProps)(IssueDetailContainer)
