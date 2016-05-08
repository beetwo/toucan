import React, {PropTypes} from 'react'
import { connect } from 'react-redux'
import { CommentList } from '../components/comments'
import {loadComments as loadCommentsAction} from '../actions'

export class Comments extends React.Component {

  render() {
    return <CommentList { ...this.props }/>
  }
}

Comments.propTypes = {
  comments: PropTypes.array.isRequired,
  statusChanges: PropTypes.array.isRequired,
  users: PropTypes.array.isRequired,
  issue_id: PropTypes.number.isRequired
}


const mapStateToProps = (state, ownProps) => {

  let issue_id = ownProps.issue_id;
  let comment_struct = state.commentsByIssueID[issue_id] || {}

  return {
    comments: comment_struct.comments || [],
    statusChanges: state.statusChangesByIssueID[issue_id] || [],
    users: state.usersByIssueID[issue_id] || []
  }
}

export default connect(mapStateToProps)(Comments)
