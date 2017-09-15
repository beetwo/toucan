import PropTypes from "prop-types";
import React from "react";
import Icon from "react-fa";
import TimeAgo from "react-timeago";
import classNames from "classnames";
import urls from "../urls";
import Status from "./status";
import ToucanIcon, { getIconClassForIssueType } from "./icons/issueType";
import { DateOnlyDisplay, DateOrTimeDisplay } from "./date";
import { Link } from "react-router-dom";
import Map from "./map";
import IssueFilter from "../containers/issueFilter";

function CommentCount({ count }) {
  return (
    <span className={classNames("comments", { "text-muted": count === 0 })}>
      <span className="icon icon-comment icon-lg" />
      {count}
    </span>
  );
}

const IssueListItem = ({ issue }) => {
  return (
    <Link to={`/issue/${issue.id}/`} key={issue.id} className={classNames("issue media", {'issue-resolved' : issue.status === 'resolved'})}>
      <div className="issue-icon media-left media-middle">
        {issue.issue_types.map(it => {
          return <ToucanIcon key={it.slug} issue_type={it} />;
        })}
      </div>
      <div className="media-body">
        <div className="issue-basics">
          <span className="issue-title">{issue.title}</span>
          <span className="issue-comments">
            <CommentCount count={issue.comment_count} />
          </span>
        </div>
        <div className="issue-details">
          {/* conditional display this when issue.status is inprogress */}
          <div className="pull-right">
            <div className="badge badge-status badge-inprogress">{issue.status}</div>
          </div>
          <span className="issue-organisation">
            {issue.organisation ? issue.organisation.name + ", " : null}
          </span>
          <span className="issue-date">
            <TimeAgo date={issue.created} />
          </span>
        </div>
      </div>
    </Link>
  );
};

const MapHandle = () => (
  <div className="issue-list-mapHandle">
    <a href="#" className="mapHandle">
      &nbsp;
    </a>
  </div>
);

class IssueListUI extends React.Component {
  render() {
    let issues = this.props.issues || [];

    let rows = issues.map((issue, index) => (
      <IssueListItem key={issue.id} issue={issue} />
    ));
    return (
      <div className="issue-list">
        {/*the filtering interface*/}

        {/* the actual list of issues */}
        <div className="issue-list-body">
          <IssueFilter issueCount={rows.length} />
          {/*adding new items*/}
          <div className="issues">
            <a href={urls.createIssue()} className="issue issue-addNew media">
              <div className="issue-icon media-left media-middle">
                <span className="icon icon-plus" />
              </div>
              <div className="media-body media-middle">Add Need</div>
            </a>
            {rows}
          </div>
        </div>
      </div>
    );
  }
}

IssueListUI.propTypes = {
  issues: PropTypes.array.isRequired
};

export default IssueListUI;
