import React from "react";
import PropTypes from "prop-types";

import { connect } from "react-redux";
import IssueDetailUI from "../components/issueDetail";
import { fetchIssueIfNeeded, postComment, invalidateIssue } from "../actions";
import { addIssueFilter, removeIssueFilter, selectIssue } from "../actions";

import Comments from "./comments";
import { SplitUIView } from "../components/main";
import { ToucanMap } from "../components/map";
import { Marker } from "react-leaflet";
import getMarkerForIssue from "../components/map/markers";

const getIssueMarker = (issue, selected = false, clickHandler) => {
  let position = [...issue.geometry.coordinates].reverse();
  let props = {
    position
  };
  let opts = {};
  if (selected) {
    opts.markerColor = "orange";
  }
  if (clickHandler) {
    props.onClick = () => clickHandler(issue.id);
  }
  let icon = getMarkerForIssue(issue.properties || issue, opts);
  if (icon != undefined) {
    props.icon = icon;
  }
  return <Marker key={issue.id} {...props} />;
};

class IssueContainer extends React.Component {
  render() {
    let {
      content,
      issue_detail,
      issue,
      issues,
      initial_bounds,
      navigateToIssue,
      ...props
    } = this.props;
    let markers = null;

    // construct the map
    let map_props = {
      animate: true
    };
    // for selected issue
    if (issue_detail && issue.isLoading === false) {
      map_props = {
        center: [...issue.issue_data.geometry.coordinates].reverse(),
        zoom: 13 // this should probably be saved in the global state object
      };
      markers = getIssueMarker(issue.issue_data, true);
    } else if (!issue_detail) {
      map_props = {
        bounds: initial_bounds
      };
      markers = issues.map(i => getIssueMarker(i, false, navigateToIssue));
    }

    return (
      <SplitUIView
        map={
          <ToucanMap {...map_props}>
            {markers}
          </ToucanMap>
        }
        issue_view={content}
      />
    );
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
    issue,
    issue_detail,
    content: ownProps.content,
    issues: state.redux_issues,
    initial_bounds: state.initial_bounds,
    navigateToIssue: id => ownProps.history.push(`/issue/${id}/`)
  };
};

export default connect(mapStateToProps)(IssueContainer);
