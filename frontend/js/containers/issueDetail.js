import React, {PropTypes} from 'react'
import { connect } from 'react-redux'
import IssueDetailUI from '../components/issueDetail'
import { selectIssue } from '../actions'

import isEmpty from 'lodash/isEmpty'

class IssueDetailContainer extends React.Component {

  componentWillMount() {
    this.props.loadIssue(this.props.params.IssueID)
  }

  render() {
    return <IssueDetailUI { ...this.props } />
  }
}

const mapStateToProps = (state, ownProps) => {
  return {
    issue: state.selectedIssue
  }
}

const mapDispatchToProps = (dispatch) => {
  return {
    loadIssue: (issue) => {
      dispatch(selectIssue(issue))
    }
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(IssueDetailContainer)
