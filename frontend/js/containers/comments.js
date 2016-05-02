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
    return <CommentList comments={this.props.comments.comments || []} statusChanges={this.props.statusChanges || []}/>
  }
}

Comments.propTypes = {
  comments: PropTypes.object.isRequired,
  statusChanges: PropTypes.array.isRequired,
  issue_id: PropTypes.number.isRequired
}


const mapStateToProps = (state, ownProps) => {
  let issue_id = parseInt(ownProps.issue_id, 10);
  return {
    comments: state.commentsByIssueID[issue_id] || {},
    statusChanges: state.statusChangesByIssueID[issue_id] || [],
    issue_id: issue_id
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
