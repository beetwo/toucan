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

    return (<div className='issueDetail'>
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

                {this.props.children}

              </div>
            <div className='issueDetailBottom'>
              <CommentForm onComment={this.props.onComment.bind(this, this.props.issueID)}/>
            </div>
          </div>);
  }
}

IssueDetailUI.propType = {
  onComment: PropTypes.func.isRequired
}

export default IssueDetailUI
