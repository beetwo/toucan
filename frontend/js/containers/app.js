import { connect } from 'react-redux'
import UI from '../components/main'

import { selectIssue } from '../actions'

const mapStateToProps = (state) => {
  let geo_issues = state.redux_issues.features || [];

  let issues = geo_issues.map((issue) => {
      return {
        id:issue.id,
        ...issue.properties
      }
    })

  return {
    issues
  }
}

const mapDispatchToProps = (dispatch) => {
  return {
    onIssueSelect: (issue_id) => {
      dispatch(selectIssue(issue_id))
    }
  };
}

const RootUI = connect(
  mapStateToProps,
  mapDispatchToProps
)(UI)

export default RootUI
