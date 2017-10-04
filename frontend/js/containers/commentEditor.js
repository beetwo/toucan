import React from "react";

import PropTypes from "prop-types";
import cn from "classnames";
import {
  MentionWrapper,
  MentionMenu
} from "@mcallistersean/react-githubish-mentions";

const MentionItem = ({ active, value }) => {
  return (
    <div className={cn("mentionMenuItem", { active: active })}>{value}</div>
  );
};

class SimpleCommentEditor extends React.Component {
  constructor(props) {
    super(props);
    this.queryMentions = this.queryMentions.bind(this);
  }

  queryMentions(query) {
    let suggestions = this.props.mention_suggestions || [];
    if (query) {
      query = query.toLowerCase();
      return suggestions
        .filter(s => s.toLowerCase().startsWith(query))
        .map(s => ({ value: s }));
    }
    return suggestions.slice(0, 5).map(s => ({ value: s }));
  }

  render() {
    return (
      <MentionWrapper
        className="form-control"
        placeholder="Leave a comment"
        onChange={e => this.props.onStateChange(e.target.value)}
        value={this.props.editorState}
      >
        <MentionMenu
          className="mentionMenu"
          trigger="@"
          item={MentionItem}
          resolve={this.queryMentions}
        />
      </MentionWrapper>
    );
  }
}

SimpleCommentEditor.propTypes = {
  onStateChange: PropTypes.func.isRequired,
  editorState: PropTypes.string
};

export default SimpleCommentEditor;
