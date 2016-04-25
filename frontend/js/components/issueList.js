import React, { PropTypes } from 'react'
import Icon from 'react-fa'

function CommentCount(count) {
  if (count > 0) {
    return (<span className="fa-stack fa-lg">
      <Icon name='comment-o' stack='2x' />
      <strong className="fa-stack-1x">{count}</strong>
    </span>);
  }
  return null;
}

class IssueListUI extends React.Component {

    render() {
        let issues = this.props.issues || [];

        let rows = issues.map((issue, index) => {
            return (
              <tr key={issue.id}>
                <td>
                    <a href='#' onClick={(e) => this.props.handleIssueChange(issue)}>
                      {issue.title}
                    </a>
                </td>
                <td>
                  {issue.priority}
                </td>
                <td>
                  <sup>
                    { CommentCount(issue.comment_count) }
                  </sup>
                </td>
              </tr>);
        });
        return (<table className="table">
            <tbody>
                {rows}
            </tbody>
        </table>);
    }
}

IssueListUI.propTypes = {
  handleIssueChange: PropTypes.func.isRequired,
  issues: PropTypes.array.isRequired
}

export default IssueListUI
