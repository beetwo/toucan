import React, {PropTypes} from 'react'
import { connect } from 'react-redux'
import UI from '../components/main'

import { selectIssue, fetchIssues } from '../actions'


class IssueTrackerApp extends React.Component {

  componentDidMount() {
    this.props.fetchIssues()
  }

  render() {
    return <UI {...this.props} />
  }
}

IssueTrackerApp.propType = {
  fetchIssues: PropTypes.func.isRequired,
  issues: PropTypes.array.isRequired,
  // Injected by React Router
  children: PropTypes.node,

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
    fetchIssues: () => {
      dispatch(fetchIssues())
    }
  };
}

const RootUI = connect(
  mapStateToProps,
  mapDispatchToProps
)(IssueTrackerApp)

export default RootUI
