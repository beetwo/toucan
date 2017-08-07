import PropTypes from 'prop-types';
import React from 'react';
import Icon from 'react-fa'
import TimeAgo from 'react-timeago'
import classNames from 'classnames'
import urls from '../urls'
import { ScrollContainer } from 'react-router-scroll';
import Status from './status'
import getIconClassForIssueType from './icons/issueType'
import {DateOnlyDisplay, DateOrTimeDisplay} from './date'


function CommentCount({count}) {
    return (<span className={classNames('comments', {'text-muted': count === 0})}>
        <span className='icon icon-comment icon-lg'/>
        {count}
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

    return (
      <div className="flex-container">
        <div className="flex-col">
          <a href="#" className="dropdown-toggle" data-toggle="collapse" data-target="#issueFilter">
            <span className="icon icon-filter"></span>
            Filter
          </a>
          <ul className="dropdown-menu">
              {items}
          </ul>
        </div>
        <div className="flex-col text-right">
          <span className="text-muted">Sort by: </span><a href="#">Newest <span className="icon icon-chevron"></span></a>
        </div>
      </div>
    );
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
        return <footer className="issue-list-footer bg-primary">
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
              <div className="issue media" key={issue.id} onClick={(e) => {e.preventDefault(); this.props.handleIssueChange(issue)}}>
                <div className="issue-icon media-left media-middle">
                  <span className="icon icon-health"></span>
                  {/*{issue.issue_types.map((it) => <Icon key={it.slug} name={getIconClassForIssueType(it)} title={it.name} /> )}*/}
                </div>
                <div className="media-body">
                  <div className="issue-basics">
                    <span className="issue-title">
                      {issue.title}
                    </span>
                    <span className="issue-comments">
                      <CommentCount count={issue.comment_count} />
                    </span>
                  </div>
                  <div className="issue-details">
                    <span className="issue-organisation">
                      {issue.organisation ? issue.organisation.name : null}
                    </span>
                    <span className="issue-date">
                      , <TimeAgo date={issue.created} />
                    </span>
                  </div>
                </div>
              </div>);
        });
        return (
          <div className="issue-list">
            <div className="issue-list-mapHandle">
              <a href="#" className="mapHandle">&nbsp;</a>
            </div>
            {/*the filtering interface*/}
            <div className="issue-list-form">
            <div className="issue-sortandfilter">
                <IssueFilter {...this.props} filterOptions={this.props.filterOptions}/>
            </div>

            <div className="filter collapse" id="issueFilter">
              <div className="filter-section">
                <div className="filter-head flex-container flex-vCenter">
                  <div className="flex-col">
                  <h5 className="filter-heading">
                    Categories
                  </h5>
                  </div>
                  <div className="flex-col text-right">
                    <a className="filter-toggle" href="#" data-toggle="collapse" data-target="#issueFilterCategories">Hide categories <span className="icon icon-chevron"></span></a>
                  </div>
                </div>
                <div className="filter-body collapse in" id="issueFilterCategories">
                  <div className="filter-item">
                    <div className="filter-check text-center">
                      <input type="checkbox"></input>
                    </div>
                    <div className="filter-title">
                      <span className="filter-icon icon icon-lg icon-core-relief-items"></span>
                      Core Relief Items
                    </div>
                  </div>
                  <div className="filter-item">
                    <div className="filter-check text-center">
                      <input type="checkbox"></input>
                    </div>
                    <div className="filter-title">
                      <span className="filter-icon icon icon-lg icon-shelter"></span>
                      Shelter
                    </div>
                  </div>
                  <div className="filter-item">
                    <div className="filter-check text-center">
                      <input type="checkbox"></input>
                    </div>
                    <div className="filter-title">
                      <span className="filter-icon icon icon-lg icon-health"></span>
                      Health
                    </div>
                  </div>
                </div>
              </div>
              <div className="filter-section">
                <div className="filter-head flex-container flex-vCenter">
                  <div className="flex-col">
                  <h5 className="filter-heading">
                    Status
                  </h5>
                  </div>
                  <div className="flex-col text-right">
                    <a className="filter-toggle" href="#" data-toggle="collapse" data-target="#issueFilterStatus">Hide status <span className="icon icon-chevron"></span></a>
                  </div>
                </div>
                <div className="filter-body collapse in" id="issueFilterStatus">
                  <div className="filter-item">
                    <div className="filter-check text-center">
                      <input type="checkbox"></input>
                    </div>
                    <div className="filter-title">
                      Open
                    </div>
                  </div>
                  <div className="filter-item">
                    <div className="filter-check text-center">
                      <input type="checkbox"></input>
                    </div>
                    <div className="filter-title">
                      In Progress
                    </div>
                  </div>
                  <div className="filter-item">
                    <div className="filter-check text-center">
                      <input type="checkbox"></input>
                    </div>
                    <div className="filter-title">
                      Resolved
                    </div>
                  </div>
                </div>
              </div>
              <div className="filter-section">
                <div className="filter-head flex-container flex-vCenter">
                  <div className="flex-col">
                  <h5 className="filter-heading">
                    Organisations
                  </h5>
                  </div>
                  <div className="flex-col text-right">
                    <a className="filter-toggle" href="#" data-toggle="collapse" data-target="#issueFilterOrg">More <span className="icon icon-chevron"></span></a>
                  </div>
                </div>
                <div className="filter-body collapse" id="issueFilterOrg">
                  <div className="filter-item">
                    <div className="filter-check text-center">
                      <input type="checkbox"></input>
                    </div>
                    <div className="filter-title">
                      Fadrat
                    </div>
                  </div>
                </div>
              </div>
              <div className="filter-foot">
              <button className="btn btn-info btn-block btn-sm">See results</button>
              </div>
            </div>
            </div>
            <ScrollContainer scrollKey='toucan-issue-list'>
            {/* the actual list of issues */}
            <div className="issue-list-body">
                {/*adding new items*/}
                <div className="issues">
                  <a href={urls.createIssue()} className="issue issue-addNew media">
                    <div className="issue-icon media-left media-middle">
                      <span className="icon icon-plus"></span>
                    </div>
                    <div className="media-body media-middle">
                      Add Need
                    </div>
                  </a>
                  {rows}
                </div>
            </div>
            </ScrollContainer>

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
