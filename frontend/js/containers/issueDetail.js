import React, {PropTypes} from 'react'
import { connect } from 'react-redux'
import IssueDetailUI from '../components/issueDetail'
import { fetchIssueIfNeeded, postComment } from '../actions'
import Comments from './comments'

import isEmpty from 'lodash/isEmpty'

class IssueDetailContainer extends React.Component {

  componentWillMount() {
    this.props.loadIssue(this.props.issueID)
  }

  componentWillReceiveProps(next_props) {
    if (next_props.issueID != this.props.issueID) {
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
  issue: PropTypes.object.isRequired
}

const mapStateToProps = (state, ownProps) => {
  let issue_id = ownProps.routeParams.IssueID;
  return {
    issue: state.issueDetails[issue_id] || {},
    issueID: issue_id,
    selectedIssue: state.selectedIssue
  }
}

const mapDispatchToProps = (dispatch) => {
  return {
    loadIssue: (issue) => {
      dispatch(fetchIssueIfNeeded(issue))
    },
    onComment: (issue_id, comment) => {
      dispatch(postComment(issue_id, comment));
    }
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(IssueDetailContainer)
