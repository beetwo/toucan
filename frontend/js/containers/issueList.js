import React, {PropTypes} from 'react'
import { connect } from 'react-redux'
import IssueListUI from '../components/issueList'
import { browserHistory } from 'react-router'
import getFilteredIssues from '../issueSelector'
import { addIssueFilter, removeIssueFilter} from '../actions'

class IssueListContainer extends React.Component {
  render() {
    return <IssueListUI { ...this.props } />
  }
}

const mapStateToProps = (state, ownProps) => {
  return {
    issues: getFilteredIssues(state.redux_issues, state.issueFilters.selections),
    filterOptions: state.issueFilters
  }
}

const mapDispatchToProps = (dispatch) => {
  return {
    handleIssueChange: (issue) => {
      browserHistory.push(`issue/${issue.id}`)
    },
    addIssueFilter: (prop, value) => dispatch(addIssueFilter(prop, value)),
    removeIssueFilter: (prop, value) => dispatch(removeIssueFilter(prop, value))
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(IssueListContainer)
