import Editor from 'draft-js-plugins-editor'
import createMentionPlugin from 'draft-js-mention-plugin'
import createLinkifyPlugin from 'draft-js-linkify-plugin';

import React from 'react'
import { EditorState, convertToRaw } from 'draft-js'
import { fromJS } from 'immutable';

import '../../css/editor_styles.css'
import 'draft-js-mention-plugin/lib/plugin.css'


const mentionPlugin = createMentionPlugin({
  entityMutability: 'IMMUTABLE',
  mentionPrefix: `@`
})
const linkifyPlugin = createLinkifyPlugin()
const { MentionSuggestions } = mentionPlugin
const plugins = [mentionPlugin, linkifyPlugin]


class CommentBox extends React.Component {

  constructor(props) {
    super(props)
    this.state = {
      editorState: EditorState.createEmpty(),
      suggestions: []
    }
    this.editor = null;
    this.onChange = this.onChange.bind(this)
    this.focus = this.focus.bind(this)
    this.onSearchChange = this.onSearchChange.bind(this)
  }

  onChange(editorState) {
    let contentState = editorState.getCurrentContent()
    console.log(convertToRaw(contentState));
    console.log(contentState.getPlainText());
    this.setState({
      editorState
    });
  }

  focus() {
    this.editor.focus();
  };

  onSearchChange({value}) {
    let url = '/api/users/?search=' + encodeURIComponent(value);
    fetch(url)
      .then((response) => response.json())
      .then((data) => {
        let users = data.map((u) => {
          return { name: u.username }
        })
        this.setState({
          suggestions: fromJS(users)
        })
      })
  }

  render() {
    return (
      <div className='b2editor' onClick={ this.focus }>
        <Editor
          editorState={ this.state.editorState }
          onChange={this.onChange}
          plugins={plugins}
          ref={(e) => this.editor = e }
        />
        <MentionSuggestions
          onSearchChange={ this.onSearchChange }
          suggestions={ this.state.suggestions }
        />
    </div>);
  }

}

export default CommentBox
