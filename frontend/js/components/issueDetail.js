import PropTypes from "prop-types";
import React from "react";
import ReactDOM from "react-dom";
import TimeAgo from "react-timeago";
import isEmpty from "lodash/isEmpty";
import { Link } from "react-router-dom";
import Icon from "react-fa";
import Remarkable from "remarkable";

import { CommentList, CommentForm } from "./comments";
import DateDisplay from "./date";
import UserLink from "./userLink";
import Status from "./status";
import { HiddenMedium, VisibleMedium } from "./responsive";
import Loading from "./loading";
import ToucanIcon, { getIconClassForIssueType } from "./icons/issueType";

function MarkdownBody(props) {
  let md = new Remarkable();
  return <HtmlBody html={md.render(props.text)} />;
}

function HtmlBody(props) {
  return <div dangerouslySetInnerHTML={{ __html: props.html }} />;
}

function RawTextBody(props) {
  return (
    <div style={{ whiteSpace: "pre-line" }}>
      {props.text}
    </div>
  );
}

class IssueDetailMain extends React.Component {
  render() {
    let { gjs, issue, children } = this.props;
    console.log(this.props);
    let description = issue.description;
    let body = null;
    let issue_type = issue.issue_types[0] || {};
    switch (issue.description_format) {
      case "html":
        body = <HtmlBody html={description} />;
        break;
      case "markdown":
        body = <MarkdownBody text={description} />;
        break;
      default:
        body = <RawTextBody text={description} />;
    }
    return (
      <div className="issue-detail-main" ref="scrollbar">
        <div className="issue-detail-header">
          <div className="issue-detail-close pull-right">
            <Link to="/">
              <span className="icon icon-close" />
            </Link>
          </div>
          <div className="issue-list-mapHandle">
            <a href="#" className="mapHandle">
              &nbsp;
            </a>
          </div>
        </div>
        <div className="issue-detail-content">
          <div className="issue-detail-lead media">
            <div className="media-left media-middle">
              <ToucanIcon issue_type={issue_type} className="icon-xl" />
            </div>
            <div className="media-body">
              <h1 className="issue-detail-title">
                <div className="issue-detail-label">
                  {issue_type.name}
                </div>
                {issue.title}
              </h1>
            </div>
          </div>

          <div className="flex-container flex-container--bordered">
            <div className="flex-col">
              {issue.organisation
                ? <div className="issue-detail-organisation">
                    <div className="issue-detail-label">Organisation</div>
                    <UserLink username={issue.organisation.short_name}>
                      {issue.organisation.name}
                    </UserLink>
                  </div>
                : null}
            </div>
            <div className="flex-col">
              <div className="issue-detail-status">
                <div className="dropdown">
                  <div className="issue-detail-label">Status</div>
                  {issue.status}{" "}
                  <a
                    href="#"
                    className="statusChange dropdown-toggle"
                    data-toggle="dropdown"
                    aria-haspopup="true"
                    aria-expanded="true"
                  >
                    change
                  </a>
                  <ul className="dropdown-menu">
                    <li>
                      <a
                        href="#"
                        onClick={() => this.props.changeIssueStatus("open")}
                        className="text-open"
                      >
                        open
                      </a>
                    </li>
                    <li>
                      <a
                        href="#"
                        onClick={() =>
                          this.props.changeIssueStatus("in_progress")}
                        className="text-inprogress"
                      >
                        in progress
                      </a>
                    </li>
                    <li>
                      <a
                        href="#"
                        onClick={() => this.props.changeIssueStatus("closed")}
                        className="text-resolved"
                      >
                        resolved
                      </a>
                    </li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
          <div className="issue-detail-comments">
            <div className="comment comment-primary">
              <div className="comment-header">
                <UserLink username={issue.creator.username} />,{" "}
                <span className="comment-time">
                  <TimeAgo date={issue.created} />
                </span>
              </div>
              <div className="comment-body">
                {body}
              </div>
            </div>
            {children}
          </div>
          {this.props.canComment
            ? <CommentForm
                onComment={this.props.onComment.bind(this, gjs.id)}
                status={issue.status}
                users={this.props.mentions}
              />
            : <p className="text-center text-muted">
                <em>Please login to comment.</em>
              </p>}
        </div>
      </div>
    );
  }
}

class IssueDetailFooter extends React.Component {
  render() {
    let { openMap } = this.props;
    return (
      <footer className="bg-primary">
        <Link to="/" className="btn btn-primary">
          <Icon name="chevron-left" />&nbsp;Issue List
        </Link>
        <button onClick={openMap} className="btn btn-primary pull-right">
          Show on Map&nbsp;
          <Icon name="map-o" />
        </button>
      </footer>
    );
  }
}

class IssueDetailUI extends React.Component {
  render() {
    let issue_loader = this.props.issue;
    if (
      isEmpty(issue_loader) ||
      (issue_loader.isLoading && isEmpty(issue_loader.issue_data))
    ) {
      return Loading();
    }

    let gjs = issue_loader.issue_data;
    let issue = gjs.properties;

    return (
      <div className="issue-detail">
        <IssueDetailMain {...this.props} gjs={gjs} issue={issue} />

        {/*
        <HiddenMedium>
          <IssueDetailFooter openMap={this.props.openMap} />
        </HiddenMedium>*/}
      </div>
    );
  }
}

IssueDetailUI.propType = {
  onComment: PropTypes.func.isRequired,
  canComment: PropTypes.bool.isRequired
};

export default IssueDetailUI;
