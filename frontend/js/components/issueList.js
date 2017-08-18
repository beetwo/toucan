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
    console.log(opts);
    let items = [];

    Object.keys(opts.options).forEach(k => {
      let section = [];
      let body = [];
      let item = [];
      let choices = opts.options[k];
      let selections = opts.selections[k] || [];
      if (choices.length === 0) {
        return;
      }
      // push the top level

      item.push(
        <div
          className="filter-head flex-container flex-vCenter"
          key={"option-group-" + k}
        >
          <div className="flex-col">
            <h5 className="filter-heading">
              {k.charAt(0).toUpperCase() + k.slice(1)}
            </h5>
          </div>
          <div className="flex-col text-right">
            <a
              className="filter-toggle"
              href="#"
              data-toggle="collapse"
              data-target={"#issueFilter-" + k}
            >
              Toggle {k} <span className="icon icon-chevron" />
            </a>
          </div>
        </div>
      );
      // create select links
      let choice_items = choices.map(c => {
        let active = selections.indexOf(c) > -1;
        return (
          <div
            className={classNames("filter-item", { "is-active": active })}
            key={k + "-choice-" + c}
            onClick={this.handleToggle.bind(this, k, c, !active)}
          >
            <div className="filter-check text-center">
              {active && <span className="icon icon-lg icon-check" />}
            </div>
            <div className="filter-title">
              {k === "type" &&
                <ToucanIcon
                  key={c}
                  issue_type={c}
                  className="filter-icon icon-lg"
                />}
              {c}&nbsp;
            </div>
          </div>
        );
      });
      body.push(
        <div className={classNames("filter-body collapse", {'in' : k !== 'organisation'})} id={"issueFilter-" + k}>
          {choice_items}
        </div>
      );
      item.push(body);
      section.push(
        <div className="filter-section" key={`filter-section-${k}`}>
          {item}
        </div>
      );
      // and push those too
      Array.prototype.push.apply(items, section);
    });

    let input_textual = [];
    for (let k in opts.selections) {
      Array.prototype.push.apply(input_textual, opts.selections[k] || []);
    }
    input_textual = input_textual.join(", ");

    return (
      <div>
        <div className="filter collapse fullscreen-sm" id="issueFilter">
          <div className="fullscreen-header flex-container">
            <div className="flex-col">
              <a
                href="#"
                className="fullscreen-close"
                data-toggle="collapse"
                data-target="#issueFilter"
              >
                <span className="icon icon-close" /> Filter
              </a>
            </div>
            <div className="flex-col text-right">
              <a href="#">Reset</a>
            </div>
          </div>
          <div className="fullscreen-content">
            {items}
          </div>
          <div className="fullscreen-footer">
            <button
              className="btn btn-primary btn-block"
              data-toggle="collapse"
              data-target="#issueFilter"
            >
              Show results
            </button>
          </div>
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
    <Link to={`/issue/${issue.id}`} key={issue.id} className="issue media">
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
        {/* use for display of status badge */}
        {/*<div className="pull-right">
          <div className="badge badge-pill badge-status badge-inprogress">
            in progress
          </div>
        </div>*/}
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
      <div className="issue-list">
        <MapHandle />

        {/*the filtering interface*/}
        <div className="issue-list-form">
          <div className="issue-sortandfilter">
            <div className="flex-container">
              <div className="flex-col">
                <a
                  href="#"
                  className="dropdown-toggle"
                  data-toggle="collapse"
                  data-target="#issueFilter"
                >
                  <span className="icon icon-filter" />
                  Filter
                </a>
              </div>
              <div className="flex-col text-right">
                <a
                  href="#"
                  className="dropdown-toggle"
                  data-toggle="dropdown"
                  aria-haspopup="true"
                  aria-expanded="false"
                >
                  <span className="text-muted">Sort by: </span>
                  Newest <span className="icon icon-chevron" />
                </a>
                <ul className="dropdown-menu pull-right">
                  <li>
                    <a href="#">Newest</a>
                  </li>
                  <li>
                    <a href="#">Nearest</a>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>

        {/* the actual list of issues */}
        <div className="issue-list-body">
          <IssueFilter
            {...this.props}
            filterOptions={this.props.filterOptions}
          />
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
  issues: PropTypes.array.isRequired,
  selectIssue: PropTypes.func.isRequired
};

export default IssueListUI;
