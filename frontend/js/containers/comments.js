import React, {PropTypes} from 'react'
import { connect } from 'react-redux'
import { CommentList } from '../components/comments'
import {loadComments as loadCommentsAction} from '../actions'

export class Comments extends React.Component {
  componentWillMount() {
    this.props.loadComments(this.props.issue_id)
  }

  componentWillReceiveProps(next_props) {
    if (this.props.issue_id != next_props.issue_id) {
      this.props.loadComments(next_props.issue_id)
    }
  }

  render() {
    console.log(this.props)
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

const mapDispatchToProps = (dispatch) => {
  return {
    loadComments: (issue) => {
      dispatch(loadCommentsAction(issue))
    }
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(Comments)
