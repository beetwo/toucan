import Editor from 'draft-js-plugins-editor'
import createMentionPlugin from 'draft-js-mention-plugin'
import createLinkifyPlugin from 'draft-js-linkify-plugin'

import React, { PropTypes } from 'react'
import { EditorState, ContentState, convertToRaw, convertFromRaw  } from 'draft-js'
import { fromJS } from 'immutable';

import '../../css/editor_styles.css'
import 'draft-js-mention-plugin/lib/plugin.css'
import isEmpty from 'lodash/isEmpty'

const mentionPlugin = createMentionPlugin({
  entityMutability: 'IMMUTABLE',
  mentionPrefix: `@`
})
const linkifyPlugin = createLinkifyPlugin()
const { MentionSuggestions } = mentionPlugin
const plugins = [mentionPlugin, linkifyPlugin]


class CommentEditor extends React.Component {

  constructor(props) {
    super(props)

    this.state = {
      suggestions: []
    }
    this.minLengthSearch = props.minLengthSearch || 3

    this.editor = null;
    this.focus = this.focus.bind(this)
    this.onSearchChange = this.onSearchChange.bind(this)
  }

  static getEmptyEditorState() {
    return EditorState.createEmpty()
  }

  focus() {
    this.editor.focus();
  };

  onSearchChange({value}) {
    if (value.length < this.minLengthSearch) {
      return
    }

    let url = '/api/users/?search=' + encodeURIComponent(value);
    fetch(url)
      .then((response) => response.json())
      .then((data) => {
        let users = data.map((u) => {
          return {
            name: u.username
         }
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
          editorState={ this.props.editorState }
          onChange={this.props.onStateChange}
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


CommentEditor.propTypes = {
  editorState: PropTypes.object,
  onStateChange: PropTypes.func
}

export default CommentEditor
