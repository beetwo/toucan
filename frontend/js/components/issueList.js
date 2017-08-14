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

function CommentCount({ count }) {
  return (
    <span className={classNames("comments", { "text-muted": count === 0 })}>
      <span className="icon icon-comment icon-lg" />
      {count}
    </span>
  );
}

class IssueFilter extends React.Component {
  handleToggle(prop_name, value, enable, e) {
    e.preventDefault();
    if (enable) {
      this.props.addIssueFilter(prop_name, value);
    } else {
      this.props.removeIssueFilter(prop_name, value);
    }
  }

  render() {
    let opts = this.props.filterOptions;
    let items = [];

    for (let k in opts.options) {
      let choices = opts.options[k];
      let selections = opts.selections[k] || [];
      if (choices.length === 0) {
        continue;
      }
      // push the top level
      items.push(
        <li className="dropdown-header" key={"option-group-" + k}>
          {k}
        </li>
      );
      // create select links
      let choice_items = choices.map(c => {
        let active = selections.indexOf(c) > -1;
        return (
          <li key={k + "-choice-" + c}>
            <a href="#" onClick={this.handleToggle.bind(this, k, c, !active)}>
              {active ? <Icon name="check" /> : " "} &nbsp;
              {c}&nbsp;
              {k === "type"
                ? <Icon name={getIconClassForIssueType({ slug: c })} />
                : null}
            </a>
          </li>
        );
      });
      // and push those too
      Array.prototype.push.apply(items, choice_items);
    }

    let input_textual = [];
    for (let k in opts.selections) {
      Array.prototype.push.apply(input_textual, opts.selections[k] || []);
    }
    input_textual = input_textual.join(", ");

    return (
      <div className="flex-container">
        <div className="flex-col">
          <a href="#" className="dropdown-toggle" data-toggle="dropdown">
            <span className="icon icon-filter" />
            Filter
          </a>
          <ul className="dropdown-menu">
            {items}
          </ul>
        </div>
        <div className="flex-col text-right">
          <span className="text-muted">Sort by: </span>
          <a href="#">
            Newest <span className="icon icon-chevron" />
          </a>
        </div>
      </div>
    );
  }
}

IssueFilter.propTypes = {
  addIssueFilter: PropTypes.func.isRequired,
  removeIssueFilter: PropTypes.func.isRequired,
  fetchIssues: PropTypes.func.isRequired,
  loading: PropTypes.bool.isRequired
};

const IssueListItem = ({ issue }) => {
  return (
    <Link to={`/issue/${issue.id}`} key={issue.id}>
      <div className="issue media">
        <div className="issue-icon media-left media-middle">
          {issue.issue_types.map(it => {
            return <ToucanIcon key={it.slug} issue_type={it} />;
          })}
        </div>
        <div className="media-body">
          <div className="issue-basics">
            <span className="issue-title">
              {issue.title}
            </span>
            <span className="issue-comments">
              <CommentCount count={issue.comment_count} />
            </span>
          </div>
          <div className="issue-details">
            <span className="issue-organisation">
              {issue.organisation ? issue.organisation.name + ", " : null}
            </span>
            <span className="issue-date">
              <TimeAgo date={issue.created} />
            </span>
          </div>
        </div>
      </div>
    </Link>
  );
};

const MapHandle = () =>
  <div className="issue-list-mapHandle">
    <a href="#" className="mapHandle">
      &nbsp;
    </a>
  </div>;

class IssueListUI extends React.Component {
  render() {
    let issues = this.props.issues || [];
    let rows = issues.map((issue, index) =>
      <IssueListItem key={issue.id} issue={issue} />
    );
    return (
      <div className="app-container">
        <div className="issue-list">
          <MapHandle />

          {/*the filtering interface*/}
          <div className="issue-list-form">
            <IssueFilter
              {...this.props}
              filterOptions={this.props.filterOptions}
            />
          </div>

          {/* the actual list of issues */}
          <div className="issue-list-body">
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
        <div className="map-container">Here be map</div>
      </div>
    );
  }
}

IssueListUI.propTypes = {
  issues: PropTypes.array.isRequired
};

export default IssueListUI;
