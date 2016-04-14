import React, { PropTypes } from 'react'
import Icon from 'react-fa'

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
                  { issue.comment_count > 0 ? <Icon name='comment-o' /> : null}
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
