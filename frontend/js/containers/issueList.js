import React, {PropTypes} from 'react'
import { connect } from 'react-redux'
import IssueListUI from '../components/issueList'
import { browserHistory } from 'react-router'


class IssueListContainer extends React.Component {
  render() {
    return <IssueListUI { ...this.props } />
  }
}

const mapStateToProps = (state, ownProps) => {
  return {
    issues: state.redux_issues
  }
}

const mapDispatchToProps = (dispatch) => {
  console.log(dispatch);
  return {
    handleIssueChange: (issue) => {
      browserHistory.push(`issue/${issue.id}`)
    }
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(IssueListContainer)
