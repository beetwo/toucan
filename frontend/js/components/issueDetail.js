import React, {PropTypes} from 'react'
import ReactDOM  from 'react-dom'
import Loading from './loading'
import isEmpty from 'lodash/isEmpty'
import {CommentList, CommentForm} from './comments'
import { Link } from 'react-router'

import Status from './status'


class IssueDetailsMain extends React.Component {

  render() {
    let {gjs, issue, children} = this.props;
    return <div className='issueDetailMain' ref='scrollbar'>
      <div className='row'>
        <div className='col-md-8'>
          <h3>
            <span className='text-muted'>#{gjs.id}:</span>&nbsp;
            {issue.title}
          </h3>
        </div>
        <div className='col-md-4 text-right'>
          <Status status={issue.status} />
        </div>
      </div>
      <hr />
      <div className="panel panel-primary">
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
            <CommentForm onComment={this.props.onComment} status={issue.status}/>
            
          </div>);
  }
}

IssueDetailUI.propType = {
  onComment: PropTypes.func.isRequired
}

export default IssueDetailUI
