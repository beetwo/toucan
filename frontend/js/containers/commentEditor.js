import React from "react";

import PropTypes from "prop-types";
import cn from "classnames";

import ReactTextareaAutocomplete from "@webscopeio/react-textarea-autocomplete";
import "@webscopeio/react-textarea-autocomplete/dist/default-style.css";

const MentionItem = ({ entity, selected }) => {
  console.log("Itemm...", entity);
  return (
    <div key={entity.value} className={cn("mentionMenuItem", { active: true })}>
      {entity.value}
    </div>
  );
};

const Loading = ({ data }) => <div>Loading</div>;

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
      <ReactTextareaAutocomplete
        loadingComponent={Loading}
        trigger={{
          "@": {
            output: (item, trigger) => `@${item.value} `,
            dataProvider: this.queryMentions,
            component: MentionItem
          }
        }}
      />
    );
  }
}

SimpleCommentEditor.propTypes = {
  onStateChange: PropTypes.func.isRequired,
  editorState: PropTypes.string
};

export default SimpleCommentEditor;
