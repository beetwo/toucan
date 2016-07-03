import React, { PropTypes } from 'react'
import Icon from 'react-fa'
import classNames from 'classnames'
import Status from './status'
import getIconClassForIssueType from './icons/issueType'

function CommentCount({count}) {
    return (<span className={classNames({'text-muted': count === 0})}>
        <Icon name='comment-o' size='lg'/>
        { count === 0 ? count : <strong>{count}</strong>}
    </span>);
}


class IssueFilter extends React.Component {

  handleToggle(prop_name, value, enable, e) {
    e.preventDefault();
    if (enable) {
      this.props.addIssueFilter(prop_name, value);
    } else {
      this.props.removeIssueFilter(prop_name, value);
    }
  }

  render() {
    let opts = this.props.filterOptions;
    let items = [];

    for (let k in opts.options) {
        let choices = opts.options[k]
        let selections = opts.selections[k] || []
        if (choices.length === 0) { continue; }
        // push the top level
        items.push(<li className="dropdown-header" key={'option-group-' + k}>
            {k}
        </li>)
        // create select links
        let choice_items = choices.map((c) => {
          let active = selections.indexOf(c) > -1;
          return <li key={k + '-choice-' + c}>
            <a href='#' onClick={this.handleToggle.bind(this, k, c, !active)}>
              { active ? <Icon name='check' /> : ' ' } &nbsp;
              {c}&nbsp;
              { k === 'type' ? <Icon name={getIconClassForIssueType({slug: c})} /> : null }
            </a>
          </li>
        })
        // and push those too
        Array.prototype.push.apply(items, choice_items);
    }


    let input_textual = [];
    for(let k in opts.selections) {
      Array.prototype.push.apply(input_textual, opts.selections[k] || []);
    }
    input_textual = input_textual.join(', ')


    return (<div className='input-group'>
      <div className="input-group-btn">
        <button className="btn btn-default dropdown-toggle" data-toggle="dropdown">
          <Icon name='filter' />&nbsp;
          Filter <span className="caret"></span>
        </button>
        <ul className="dropdown-menu">
            {items}
        </ul>
      </div>
      <input type="text" disabled className="form-control" value={input_textual}/>
    </div>)
  }
}

IssueFilter.propType = {
  addIssueFilter: PropTypes.func.isRequired,
  removeIssueFilter: PropTypes.func.isRequired
}


class IssueListUI extends React.Component {

    render() {
        let issues = this.props.issues || [];

        let rows = issues.map((issue, index) => {
            return (
              <tr key={issue.id} onClick={(e) => {e.preventDefault(); this.props.handleIssueChange(issue)}}>
                <td>
                  { issue.issue_type ? <Icon name={getIconClassForIssueType(issue.issue_type)} title={issue.issue_type.name} /> : null }
                </td>
                <td>
                    <a href='#'>
                      {issue.title}
                    </a>
                    <br />
                    <small>{issue.organisation !== null ? issue.organisation.name : null}</small>
                </td>
                <td>
                    <CommentCount count={issue.comment_count} />
                </td>
                <td>
                  <Status status={issue.status} />
                </td>
              </tr>);
        });
        return (
          <div>
            <div className="issue-list-form">
              <div className="issue-filter">
                <IssueFilter {...this.props} filterOptions={this.props.filterOptions}/>
              </div>
              <div className='issue-refresh'>
                <button className='btn' onClick={this.props.refreshIssueList}>
                  <Icon name='refresh' size='lg'/>
                </button>
              </div>
            </div>
            <hr />
            <table className="issues table table-hover">
            <tbody>
                {rows}
            </tbody>
        </table>
      </div>);
    }
}

IssueListUI.propTypes = {
  handleIssueChange: PropTypes.func.isRequired,
  issues: PropTypes.array.isRequired
}

export default IssueListUI
