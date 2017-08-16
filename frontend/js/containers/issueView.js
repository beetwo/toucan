import React from "react";
import PropTypes from "prop-types";

class IssueContainer extends React.Component {
  constructor(props) {
    super(props);
    if (props.issue_id) {
      console.warn("Single Issue!!!");
    }
  }
  componentWillReceiveProps(newProps) {
    if (newProps.issue_id && newProps.issue_id !== this.props.issue_id) {
      // TODO: load Issue
      console.warn("Single Issue on re-render");
    }
  }
  render() {
    let { content, ...props } = this.props;
    console.log(content, this.props);
    return content;
  }
}

IssueContainer.propTypes = {
  content: PropTypes.node.isRequired,
  issue_id: PropTypes.number
};

export default IssueContainer;
