import PropTypes from "prop-types";
import React from "react";
import Icon from "react-fa";
import classNames from "classnames";

import ToucanIcon, { getIconClassForIssueType } from "./icons/issueType";

class IssueFilterForm extends React.Component {
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

    Object.keys(opts.options).forEach(k => {
      let section = [];
      let body = [];
      let item = [];
      let choices = opts.options[k];
      let selections = opts.selections[k] || [];
      if (choices.length === 0) {
        return;
      }
      // push the top level
      item.push(
        <div
          className="filter-head flex-container flex-vCenter"
          key={"option-group-" + k}
        >
          <div className="flex-col">
            <h5 className="filter-heading">
              {k.charAt(0).toUpperCase() + k.slice(1)}
            </h5>
          </div>
          <div className="flex-col text-right">
            <a
              className="filter-toggle"
              href="#"
              data-toggle="collapse"
              data-target={"#issueFilter-" + k}
            >
              Toggle {k} <span className="icon icon-chevron" />
            </a>
          </div>
        </div>
      );
      // create select links
      let choice_items = choices.map(c => {
        let active = selections.indexOf(c) > -1;
        return (
          <div
            className={classNames("filter-item", { "is-active": active })}
            key={k + "-choice-" + c}
            onClick={this.handleToggle.bind(this, k, c, !active)}
          >
            <div className="filter-check text-center">
              {active && <span className="icon icon-lg icon-check" />}
            </div>
            <div className="filter-title">
              {k === "type" && (
                <ToucanIcon
                  key={c}
                  issue_type={c}
                  className="filter-icon icon-issue icon-lg"
                />
              )}
              {c}&nbsp;
            </div>
          </div>
        );
      });
      body.push(
        <div
          className={classNames("filter-body collapse", {
            in: k !== "organisation"
          })}
          id={"issueFilter-" + k}
        >
          {choice_items}
        </div>
      );
      item.push(body);
      section.push(
        <div className="filter-section" key={`filter-section-${k}`}>
          {item}
        </div>
      );
      // and push those too
      Array.prototype.push.apply(items, section);
    });

    let input_textual = [];
    for (let k in opts.selections) {
      Array.prototype.push.apply(input_textual, opts.selections[k] || []);
    }
    input_textual = input_textual.join(", ");
    
    const { isDefault, selectedFiltersCount } = this.props.filterOptions;

    return (
      <div className="filter fullscreen-sm" id="issueFilter">
        <div className="fullscreen-header flex-container">
          <div className="flex-col">
            Filter {isDefault ? null : (<span>({selectedFiltersCount})</span>)}
            {isDefault ? null : (
              <a
                className="filter-reset"
                onClick={this.props.resetIssueFilter}
                href="#"
              >
                Reset
              </a>
            )}
          </div>
          <div className="flex-col text-right">
            <a
              href="#"
              onClick={this.props.toggleFilterForm}
              className="text-cancel"
            >
              Close
            </a>
          </div>
        </div>
        <div className="fullscreen-content">{items}</div>
        <div className="fullscreen-footer">
          <button
            className="btn btn-primary btn-block"
            onClick={this.props.toggleFilterForm}
          >
            Show results
          </button>
        </div>
      </div>
    );
  }
}

IssueFilterForm.propTypes = {
  addIssueFilter: PropTypes.func.isRequired,
  removeIssueFilter: PropTypes.func.isRequired,
  resetIssueFilter: PropTypes.func.isRequired,
  toggleFilterForm: PropTypes.func.isRequired
};

class IssueFilter extends React.Component {
  render() {
    let {
      issueCount = 0,
      toggleFilterForm,
      resetIssueFilter,
      showFilterForm = false
    } = this.props;

    const { isDefault, selectedFiltersCount } = this.props.filterOptions;

    return (
      <div className="issue-list-form">
        {/* header for triggering issue list form */}
        <div className="issue-sortandfilter">
          <div className="flex-container">
            <div className="flex-col">
              <a href="#" onClick={this.props.toggleFilterForm}>
                <span className="icon icon-filter" />
                Filter {isDefault ? null : (<span>({selectedFiltersCount})</span>)}
              </a>
              {isDefault ? null : (
                <a
                  className="filter-reset"
                  onClick={this.props.resetIssueFilter}
                  href="#"
                >
                  Reset
                </a>
              )}
            </div>
            <div className="flex-col text-right">
              <span className="text-subdued">
                {this.props.issueCount === 1 ? (
                  "One need"
                ) : (
                  `${this.props.issueCount} needs`
                )}
              </span>
            </div>
          </div>
        </div>

        {showFilterForm ? <IssueFilterForm {...this.props} /> : null}
      </div>
    );
  }
}

IssueFilter.propTypes = {
  toggleFilterForm: PropTypes.func.isRequired,
  showFilterForm: PropTypes.bool.isRequired,
  resetIssueFilter: PropTypes.func.isRequired,
  issueCount: PropTypes.number.isRequired
};

export default IssueFilter;
