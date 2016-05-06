import Editor from 'draft-js-plugins-editor'
import createMentionPlugin from 'draft-js-mention-plugin'
import createLinkifyPlugin from 'draft-js-linkify-plugin';

import React from 'react'
import { EditorState, ContentState, convertToRaw, convertFromRaw  } from 'draft-js'

import '../../css/editor_styles.css'
import 'draft-js-mention-plugin/lib/plugin.css'

const linkifyPlugin = createLinkifyPlugin()


class Comment extends React.Component {
  render() {
    let mentionPlugin = createMentionPlugin({
      //entityMutability: 'IMMUTABLE',
      mentionPrefix: `@`,
      mentions: this.props.users
    })

    let { MentionSuggestions } = mentionPlugin
    let plugins = [mentionPlugin, linkifyPlugin]
    let struct = convertFromRaw(this.props.content);
    let contentState = ContentState.createFromBlockArray(struct)
    let editorState = EditorState.createWithContent(contentState)
    return <Editor
        editorState={editorState}
        plugins={plugins}
        onChange={() => null}
        readOnly={true}
      />

  ;
  }
}

export default Comment
