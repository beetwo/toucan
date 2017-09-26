import React from "react";

import PropTypes from "prop-types";

class SimpleCommentEditor extends React.Component {
  constructor(props) {
    super(props);
  }

  render() {
    return (
      <textarea
        placeholder="Leave a comment"
        onChange={e => this.props.onStateChange(e.target.value)}
        value={this.props.editorState}
      />
    );
  }
}

SimpleCommentEditor.propTypes = {
  onStateChange: PropTypes.func.isRequired,
  editorState: PropTypes.string
};

export default SimpleCommentEditor;
