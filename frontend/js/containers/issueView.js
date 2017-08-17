import React from "react";
import PropTypes from "prop-types";

import { connect } from "react-redux";
import IssueDetailUI from "../components/issueDetail";
import { fetchIssueIfNeeded, postComment, invalidateIssue } from "../actions";
import { addIssueFilter, removeIssueFilter, selectIssue } from "../actions";

import Comments from "./comments";
import { SplitUIView } from "../components/main";
import { DummyMap, ToucanMap } from "../components/map";

class IssueContainer extends React.Component {
  render() {
    console.log(issue);
    let { content, issue_detail, issue, ...props } = this.props;
    // construct the map
    let map_props = {
      animate: true
    };
    if (issue_detail) {
      map_props = {};
    }
    return <SplitUIView map={<DummyMap />} issue_view={content} />;
  }
}

IssueContainer.propTypes = {
  content: PropTypes.node.isRequired,
  issue_detail: PropTypes.bool.isRequired,
  issue: PropTypes.object.isRequired,
  issues: PropTypes.array.isRequired
};

const mapStateToProps = (state, ownProps) => {
  let issue_detail = false;
  let issues = [];
  let issue = {};

  if (ownProps.issue_id) {
    issue_detail = true;
    let issue_id = parseInt(ownProps.issue_id, 10);
    issue = state.issueDetails[issue_id] || {};
  }
  return {
    content: ownProps.content,
    issue,
    issues: state.redux_issues,
    issue_detail
  };
};

export default connect(mapStateToProps)(IssueContainer);
