import React, {PropTypes} from 'react'
import Loading from './loading'
import ReactMarkdown from 'react-markdown'
import isEmpty from 'lodash/isEmpty'
import {CommentList, CommentForm} from './comments'

import Status from './status'

class IssueDetailUI extends React.Component {
  render() {
    let issue_loader = this.props.issue;
    if (isEmpty(issue_loader) || issue_loader.isLoading) {
      return Loading();
    }

    let gjs = issue_loader.issue_data;
    let issue = gjs.properties;

    return (<div className='issueDetail'>
              <div className='issueDetailMain'>
                <div className='row'>
                  <div className='col-md-8'>
                    <h3>
                      <span className='text-muted'>#{gjs.id}:</span>&nbsp;
                      {issue.title}
                    </h3>
                  </div>
                  <div className='col-md-4 text-right'>
                    <Status status={issue.status}
                            onOpen={this.props.openIssue.bind(this, gjs.id)}
                            onClose={this.props.closeIssue.bind(this, gjs.id)} />
                  </div>
                </div>
                <hr />
                <div className="panel panel-primary">
                    <div className="panel-body">
                      <ReactMarkdown source={issue.description || ''} />
                    </div>
                </div>

                {this.props.children}

              </div>
            <div className='issueDetailBottom'>
              <CommentForm onComment={this.props.onComment.bind(this, this.props.issueID)} status={issue.status}/>
            </div>
          </div>);
  }
}

IssueDetailUI.propType = {
  onComment: PropTypes.func.isRequired
}

export default IssueDetailUI
