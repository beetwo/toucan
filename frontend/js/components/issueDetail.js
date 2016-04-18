import React, {PropTypes} from 'react'
import Loading from './loading'
import ReactMarkdown from 'react-markdown'
import isEmpty from 'lodash/isEmpty'
import {CommentList, CommentForm} from './comments'

class IssueDetailUI extends React.Component {
  render() {

    let issue_loader = this.props.issue;
    if (isEmpty(issue_loader) || issue_loader.isLoading) {
      return Loading();
    }

    let gjs = issue_loader.issue_data;
    let issue = gjs.properties;

    return (<div className='container'>
      <div className='row'>
        <div className='col-md-12'>
          <div className='issueDetail'>
              <div className='issueDetailMain'>
                <div className="panel panel-default">
                    <div className="panel-heading">
                        <h3 className="panel-title">
                          {issue.title}
                        </h3>
                    </div>
                    <div className="panel-body">
                      <ReactMarkdown source={issue.description || ''} />
                    </div>
                </div>
              </div>
            </div>

            { issue.comments.length > 0 ? <CommentList comments={issue.comments} /> : null }

            <div className='issueDetailBottom'>
               <CommentForm onComment={this.props.onComment}/>
            </div>
        </div>
      </div>
    </div>);
  }
}

IssueDetailUI.propType = {
  onComment: PropTypes.func.isRequired
}

export default IssueDetailUI
