import React, {PropTypes} from 'react'
import { connect } from 'react-redux'
import IssueDetailUI from '../components/issueDetail'
import { fetchIssueIfNeeded } from '../actions'

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
  console.log(state);
  return {
    issue: state.issueDetails[ownProps.routeParams.IssueID] || {}
  }
}

const mapDispatchToProps = (dispatch) => {
  return {
    loadIssue: (issue) => {
      dispatch(fetchIssueIfNeeded(issue))
    }
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(IssueDetailContainer)
