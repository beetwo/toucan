import React, {PropTypes} from 'react'
import { connect } from 'react-redux'
import UI from '../components/main'

import { selectIssue, fetchIssues } from '../actions'


class IssueTrackerApp extends React.Component {

  componentDidMount() {
    this.props.dispatch(fetchIssues())
  }

  render() {
    return <UI {...this.props} />
  }
}

IssueTrackerApp.propType = {
  dispatch: PropTypes.func.isRequired,
  issues: PropTypes.array.isRequired
}

const mapStateToProps = (state) => {
  return {
    issues: state.redux_issues,
    geojson: state.geojson,
    selectedIssue: state.selectedIssue
  }
}

const mapDispatchToProps = (dispatch) => {
  return {
    dispatch: dispatch,
    onIssueSelect: (issue_id) => {
      dispatch(selectIssue(issue_id))
    }
  };
}

const RootUI = connect(
  mapStateToProps,
  mapDispatchToProps
)(IssueTrackerApp)

export default RootUI
