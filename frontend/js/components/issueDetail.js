import React, {PropTypes} from 'react'
import ReactDOM  from 'react-dom'
import Loading from './loading'
import isEmpty from 'lodash/isEmpty'
import {CommentList, CommentForm} from './comments'
import { Link } from 'react-router'
import DateDisplay from './date'
import UserLink from './userLink'
import Status from './status'
import Icon from 'react-fa'
import getIconClassForIssueType from './icons/issueType'
import Remarkable from 'remarkable'
import {HiddenMedium, VisibleMedium} from './responsive'

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

      <h3>
        <span className='text-muted'>#{gjs.id}</span>&nbsp;
        {issue.title}
      </h3>

      <h3 className="pull-right">
        <Status status={issue.status} />
      </h3>

      <ul className='list-inline'>
        { issue.issue_types.map((issue_type, index) => <li key={index}><Icon key={index} name={getIconClassForIssueType(issue_type)} /></li>) }
      </ul>

      {
        issue.organisation ?
          <p>
            <UserLink username={issue.organisation.short_name}>
              {issue.organisation.name}
            </UserLink>
          </p> :
          null
      }
      <hr />
      <div className="panel panel-primary">
          <div className="panel-heading">
            <span className="pull-right">
              <DateDisplay date={issue.created} />
            </span>
            <UserLink username={ issue.creator.username } />
          </div>
          <div className='panel-body'>
            {body}
          </div>
      </div>
      {children}
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

      <div className="issue-detail-body">

            <VisibleMedium>
            <ol className="breadcrumb" style={{'backgroundColor': 'transparent'}}>
              <li>
                <Link to='/'>
                <Icon name="list"/>&nbsp;Issue List
                </Link>
              </li>
              <li className="active">
                  #{gjs.id} {issue.title}
              </li>
            </ol>
            </VisibleMedium>

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
