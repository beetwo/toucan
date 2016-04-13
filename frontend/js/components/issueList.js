import React from 'react'
import Icon from 'react-fa'

class IssueList extends React.Component {

    render() {
        let issues = this.props.issues || [];
        let rows = issues.map((issue, index) => {
            return (
              <tr key={issue.id}>
                <td>
                    <a href='#' onClick={(e) => this.props.onIssueSelect(issue.id)}>
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

export default IssueList
