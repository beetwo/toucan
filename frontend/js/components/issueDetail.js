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


class IssueDetailsMain extends React.Component {

  render() {
    let {gjs, issue, children} = this.props;
    return <div className='issueDetailMain' ref='scrollbar'>
      <div className='row'>
        <div className='col-md-8'>
          <h3>
            { issue.issue_type ? <Icon name={getIconClassForIssueType(issue.issue_type)} /> : null }&nbsp;
            <span className='text-muted'>#{gjs.id}:</span>&nbsp;
            {issue.title}
          </h3>
        </div>
        <div className='col-md-4 text-right'>
          <h3>
            <Status status={issue.status} />&nbsp;
          </h3>
        </div>
      </div>
      <hr />
      <div className="panel panel-primary">
          <div className="panel-heading">
            created by <UserLink username={ issue.creator.username } /> <Timeago date={issue.created} />
          </div>
          <div className="panel-body" style={{whiteSpace: 'pre-line'}}>
            {issue.description || 'This issue has no description.'}
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
            <CommentForm onComment={this.props.onComment.bind(this, gjs.id)} status={issue.status} users={this.props.mentions}/>
          </div>);
  }
}

IssueDetailUI.propType = {
  onComment: PropTypes.func.isRequired
}

export default IssueDetailUI
