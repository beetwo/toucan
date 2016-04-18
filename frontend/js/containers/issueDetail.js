import React, {PropTypes} from 'react'
import { connect } from 'react-redux'
import IssueDetailUI from '../components/issueDetail'
import { fetchIssueIfNeeded, postComment } from '../actions'

import isEmpty from 'lodash/isEmpty'

class IssueDetailContainer extends React.Component {

  componentWillMount() {
    this.props.loadIssue(this.props.params.IssueID)
  }

  render() {
    return <IssueDetailUI { ...this.props } />
  }
}

IssueDetailContainer.propTypes = {
  issue: PropTypes.object.isRequired
}

const mapStateToProps = (state, ownProps) => {
  return {
    issue: state.issueDetails[ownProps.routeParams.IssueID] || {}
  }
}

const mapDispatchToProps = (dispatch) => {
  return {
    loadIssue: (issue) => {
      dispatch(fetchIssueIfNeeded(issue))
    },
    onComment: (comment) => {
      dispatch(postComment(comment));
    }
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(IssueDetailContainer)
