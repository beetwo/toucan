import PropTypes from "prop-types";
import React from "react";
import Icon from "react-fa";
import classNames from "classnames";

import ToucanIcon, { getIconClassForIssueType } from "./icons/issueType";

class Modal extends React.Component {
  componentDidMount() {
    document.getElementsByTagName("body")[0].classList.add("modal-open");
  }

  componentWillUnmount() {
    document.getElementsByTagName("body")[0].classList.remove("modal-open");
  }

  render() {
    return this.props.children;
  }
}

const IssueFilterOption = ({ option, active, toggle, showIcon = false }) => {
  return (
    <div
      className={classNames("filter-item", { "is-active": active })}
      key={option.value}
      onClick={() => toggle(option.value, !active)}
    >
      <div className="filter-check text-center">
        {active && <span className="icon icon-lg icon-check" />}
      </div>
      <div className="filter-title">
        {showIcon ? (
          <ToucanIcon
            issue_type={option.value}
            className="filter-icon icon-issue icon-lg"
          />
        ) : null}
        {option.name}&nbsp;
      </div>
    </div>
  );
};

class OptionGroup extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      expanded: this.props.expanded || false
    };
    this.toggleOptions = this.toggleOptions.bind(this);
  }

  toggleOptions() {
    this.setState(state => ({ expanded: !state.expanded }));
  }
  render() {
    const { name, key, options } = this.props.option_group;
    const { selection } = this.props;

    return (
      <div className="filter-section">
        <div className="filter-head flex-container flex-vCenter" key={key}>
          <div className="flex-col">
            <h5 className="filter-heading">{name}</h5>
          </div>
          <div className="flex-col text-right">
            <a className="filter-toggle" href="#" onClick={this.toggleOptions}>
              Toggle {name} <span className="icon icon-chevron" />
            </a>
          </div>
        </div>
        {this.state.expanded ? (
          <div className="filter-body">
            {options.map(o => (
              <IssueFilterOption
                option={o}
                key={`${key}-${o.value}`}
                active={selection.includes(o.value)}
                toggle={this.props.handleToggle}
                showIcon={key === "type"}
              />
            ))}
          </div>
        ) : null}
      </div>
    );
  }
}

class IssueFilterForm extends React.Component {
  constructor(props) {
    super(props);
  }

  handleToggle(prop_name, value, enable) {
    // e.preventDefault();
    if (enable) {
      this.props.addIssueFilter(prop_name, value);
    } else {
      this.props.removeIssueFilter(prop_name, value);
    }
  }

  render() {
    const { selections, options } = this.props.filterOptions;
    let option_groups = options.map(og => {
      const selection = selections[og.key] || [];
      return (
        <OptionGroup
          key={og.key}
          handleToggle={this.handleToggle.bind(this, og.key)}
          option_group={og}
          selection={selection}
          expanded={selection.length || og.key !== "organisation"}
        />
      );
    });

    const { isDefault, selectedFiltersCount } = this.props.filterOptions;

    return (
      <div className="filter fullscreen-sm" id="issueFilter">
        <div className="fullscreen-header flex-container">
          <div className="flex-col">
            Filter {isDefault ? null : <span>({selectedFiltersCount})</span>}
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
        <div className="fullscreen-content">{option_groups}</div>
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
  constructor(props) {
    super(props);
    this.state = {
      show_filter_form: false
    };
    this.toggleFilterForm = this.toggleFilterForm.bind(this);
  }

  toggleFilterForm() {
    this.setState(state => ({ show_filter_form: !state.show_filter_form }));
  }

  render() {
    let { issueCount = 0, toggleFilterForm, resetIssueFilter } = this.props;

    const { isDefault, selectedFiltersCount } = this.props.filterOptions;

    return (
      <div className="issue-list-form">
        {/* header for triggering issue list form */}
        <div className="issue-sortandfilter">
          <div className="flex-container">
            <div className="flex-col">
              <a href="#" onClick={this.toggleFilterForm}>
                <span className="icon icon-filter" />
                Filter{" "}
                {isDefault ? null : <span>({selectedFiltersCount})</span>}
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

        {this.state.show_filter_form ? (
          <Modal>
            <IssueFilterForm
              {...this.props}
              toggleFilterForm={this.toggleFilterForm}
            />
          </Modal>
        ) : null}
      </div>
    );
  }
}

IssueFilter.propTypes = {
  resetIssueFilter: PropTypes.func.isRequired,
  issueCount: PropTypes.number.isRequired
};

export default IssueFilter;
