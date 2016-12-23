import React, {PropTypes} from 'react'
import { connect } from 'react-redux'
import IssueListUI from '../components/issueList'
import { history } from '../index'
import getFilteredIssues from '../issueSelector'
import { addIssueFilter, removeIssueFilter, fetchIssues, resetSelectedIssue} from '../actions'

class IssueListContainer extends React.Component {
  componentDidMount(){
    this.props.resetSelectedIssue();
  }
  render() {
    return <IssueListUI { ...this.props } />
  }
}

const mapStateToProps = (state, ownProps) => {
  return {
    issues: getFilteredIssues(state.redux_issues, state.issueFilters.selections),
    filterOptions: state.issueFilters,
    loading: state.loadingStatus.issues
  }
}

const mapDispatchToProps = (dispatch) => {
  return {
    handleIssueChange: (issue) => {
      history.push(`issue/${issue.id}`)
    },
    refreshIssueList: () => {
      dispatch(fetchIssues());
    },
    addIssueFilter: (prop, value) => dispatch(addIssueFilter(prop, value)),
    removeIssueFilter: (prop, value) => dispatch(removeIssueFilter(prop, value)),
    resetSelectedIssue: () => dispatch(resetSelectedIssue())
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(IssueListContainer)
