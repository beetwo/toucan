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

    return (<div className="input-group">
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
      <span className="input-group-addon" onClick={this.props.refreshIssueList}>
        <Icon spin={this.props.loading} name='refresh' />
      </span>
    </div>);
  }
}

IssueFilter.propTypes = {
  addIssueFilter: PropTypes.func.isRequired,
  removeIssueFilter: PropTypes.func.isRequired,
  refreshIssueList: PropTypes.func.isRequired,
  loading: PropTypes.bool.isRequired
}

class IssueListFooter extends React.Component {
    render() {
        return <footer className="issue-list-footer">
            <div className="btn btn-primary btn-block" onClick={this.props.openMap}>
                <Icon name="map-o"/>&nbsp;Show Map
            </div>
        </footer>
    }
}

class IssueListUI extends React.Component {

    render() {
        let issues = this.props.issues || [];
        let rows = issues.map((issue, index) => {
            return (
              <tr key={issue.id} onClick={(e) => {e.preventDefault(); this.props.handleIssueChange(issue)}}>
                <td>
                    <a href='#'>
                      {issue.title}
                    </a>
                    <br />
                    <small>{issue.organisation ? issue.organisation.name : null}</small>
                </td>
                <td>
                  <Status status={issue.status} />
                </td>
                <td>
                    {issue.issue_types.map((it) => <Icon key={it.slug} name={getIconClassForIssueType(it)} title={it.name} /> )}
                </td>
                <td>
                    <CommentCount count={issue.comment_count} />
                </td>
              </tr>);
        });
        return (
          <div className="issue-list">
            {/*the filtering interface*/}
            <div className="issue-list-form">
                <IssueFilter {...this.props} filterOptions={this.props.filterOptions}/>
            </div>

            {/* the actual table of issues */}
            <div className="issue-list-body">
                <table className="issues table table-hover table-striped">
                <thead>
                    <tr>
                        <th>Issue</th>
                        <th>Status</th>
                        <th>Type(s)</th>
                        <th>Discussion</th>
                    </tr>
                </thead>
                <tbody>
                    {rows}
                </tbody>
                </table>
            </div>

            {/*issue list control*/}
            {
                this.props.mapOpenable ?
                <IssueListFooter openMap={this.props.openMap}/>
                : null
            }
      </div>);
    }
}

IssueListUI.propTypes = {
  handleIssueChange: PropTypes.func.isRequired,
  issues: PropTypes.array.isRequired
}

export default IssueListUI
