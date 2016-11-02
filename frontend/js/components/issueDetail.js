import React, {PropTypes} from 'react'
import ReactDOM  from 'react-dom'
import Loading from './loading'
import isEmpty from 'lodash/isEmpty'
import {CommentList, CommentForm} from './comments'
import { Link } from 'react-router'
import Timeago from 'react-timeago'
import UserLink from './userLink'
import Status from './status'
import Icon from 'react-fa'
import getIconClassForIssueType from './icons/issueType'
import Remarkable from 'remarkable'

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

class IssueDetailsMain extends React.Component {

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

    return <div className='issueDetailMain' ref='scrollbar'>
      <div className='row'>
        <div className='col-md-8'>
          <h3>
            <span className='text-muted'>#{gjs.id}</span>&nbsp;
            {issue.title}
          </h3>

          <ul className='list-inline'>
            { issue.issue_types.map((issue_type, index) => <li key={index}><Icon key={index} name={getIconClassForIssueType(issue_type)} /></li>) }
          </ul>
          { issue.organisation ? <p>{issue.organisation.name}</p> : null}
        </div>
        <div className='col-md-4 text-right'>
          <h3>
            <Status status={issue.status} />
          </h3>
        </div>
      </div>
      <hr />
      <div className="panel panel-primary">
          <div className="panel-heading">
            created by <UserLink username={ issue.creator.username } />
            <Timeago date={issue.created} />
          </div>
          <div className='panel-body'>
            {body}
          </div>
      </div>
      {children}
    </div>
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

    return (<div className='issueDetail'>

            <ol className='breadcrumb' style={{backgroundColor: 'transparent'}}>
              <li>
                <Link to='/'>
                  Issue List
                </Link>
              </li>
              <li className='active'>
                Issue Detail
              </li>
            </ol>

            <IssueDetailsMain {...this.props} gjs={gjs} issue={issue} />

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

          </div>);
  }
}

IssueDetailUI.propType = {
  onComment: PropTypes.func.isRequired,
  canComment: PropTypes.bool.isRequired
}

export default IssueDetailUI
