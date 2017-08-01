import React, {PropTypes} from 'react'
import ReactDOM  from 'react-dom'
import TimeAgo from 'react-timeago'
import { ScrollContainer } from 'react-router-scroll';
import isEmpty from 'lodash/isEmpty'
import { Link } from 'react-router'
import Icon from 'react-fa'
import Remarkable from 'remarkable'

import {CommentList, CommentForm} from './comments'
import DateDisplay from './date'
import UserLink from './userLink'
import Status from './status'
import getIconClassForIssueType from './icons/issueType'
import {HiddenMedium, VisibleMedium} from './responsive'
import Loading from './loading'


function MarkdownBody (props) {
  let md = new Remarkable();
  return <HtmlBody html={md.render(props.text)} />;
}

function HtmlBody (props) {
  return <div dangerouslySetInnerHTML={{'__html': props.html}}></div>;
}

function RawTextBody (props) {
  return <div style={{whiteSpace: 'pre-line'}}>{props.text}</div>;
}

class IssueDetailMain extends React.Component {

  render() {
    let {gjs, issue, children} = this.props;
    let description = issue.description;
    let body = null;

    switch(issue.description_format) {
      case 'html':
        body = <HtmlBody html={description} />;
        break;
      case 'markdown':
        body = <MarkdownBody text={description} />;
        break;
      default:
        body = <RawTextBody text={description} />;
    }
    return <div className='issue-detail-main' ref='scrollbar'>

    <div className="issue-detail-header media media-middle">
      <div className="media-left">
      <span className="icon icon-nutrition icon-xl"></span>
      </div>
      <div className="media-body">
        <h1 className="issue-detail-title">
          <div className="issue-detail-label">
          Nutrition
          </div>
          {issue.title}
        </h1>
      </div>
    </div>
      { /*issue.issue_types.map((issue_type, index) => <li key={index}><Icon key={index} name={getIconClassForIssueType(issue_type)} /></li>) */}



      <div className="flex-container flex-container--bordered">
        <div className="flex-col">
          {
            issue.organisation ?
              <div className="issue-detail-organisation">
                <div className="issue-detail-label">Organisation</div>
                <UserLink username={issue.organisation.short_name}>
                  {issue.organisation.name}
                </UserLink>
              </div> :
              null
          }
        </div>
        <div className="flex-col">
          <div className="issue-detail-status">
            <div className="issue-detail-label">Status</div>
            {issue.status} <a href="#" className="statusChange">change</a>
          </div>
        </div>
      </div>
      <div className="issue-detail-comments">
        <div className="comment comment-primary">
          <div className="comment-header">
            <UserLink username={ issue.creator.username } />, <span className="comment-time"><TimeAgo date={issue.created} /></span>
          </div>
          <div className='comment-body'>
            {body}
          </div>
        </div>
        {children}
      </div>
    </div>
  }
}

class IssueDetailFooter extends React.Component {
  render() {
    let {openMap} = this.props;
    return <footer className="bg-primary">
            <Link to='/' className="btn btn-primary">
              <Icon name="chevron-left"/>&nbsp;Issue List
            </Link>
          <button onClick={openMap} className="btn btn-primary pull-right">
                Show on Map&nbsp;
                <Icon name="map-o"/>
          </button>
    </footer>;
  }
}


class IssueDetailUI extends React.Component {

  render() {

    let issue_loader = this.props.issue;
    if (isEmpty(issue_loader) || (issue_loader.isLoading && isEmpty(issue_loader.issue_data))) {
      return Loading();
    }

    let gjs = issue_loader.issue_data;
    let issue = gjs.properties;

    return (<div className='issue-detail'>
      <ScrollContainer scrollKey='toucan-issue-detail'>
      <div className="issue-detail-body">

            <div className="issue-list-mapHandle">
              <a href="#" className="mapHandle">&nbsp;</a>
            </div>
            <div className="issue-detail-close pull-right">
              <Link to='/'>
                <span className="icon icon-close"></span>
              </Link>
            </div>

            <IssueDetailMain {...this.props} gjs={gjs} issue={issue} />

            {
              this.props.canComment ?
                <CommentForm onComment={this.props.onComment.bind(this, gjs.id)}
                             status={issue.status}
                             users={this.props.mentions}
                             />
                :
                  <p className='text-center text-muted'>
                    <em>Please login to comment.</em>
                  </p>


             }
        </div>
        </ScrollContainer>
        <HiddenMedium>
          <IssueDetailFooter openMap={this.props.openMap} />
        </HiddenMedium>
    </div>);
  }
}

IssueDetailUI.propType = {
  onComment: PropTypes.func.isRequired,
  canComment: PropTypes.bool.isRequired
}

export default IssueDetailUI
