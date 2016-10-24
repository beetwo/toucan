import Editor from 'draft-js-plugins-editor'
import createMentionPlugin, { defaultSuggestionsFilter } from 'draft-js-mention-plugin'
import createLinkifyPlugin from 'draft-js-linkify-plugin'

import React, { PropTypes } from 'react'
import { EditorState, ContentState, convertToRaw, convertFromRaw  } from 'draft-js'
import { fromJS } from 'immutable';

import 'draft-js/dist/Draft.css'
import '../../css/editor_styles.css'
import 'draft-js-mention-plugin/lib/plugin.css'

import isEmpty from 'lodash/isEmpty'
import uniq from 'lodash/uniq'


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
    let initial_suggestions = this.props.mention_suggestions.map((u) => {return {name: u}});
    this.state = {
      mentions: fromJS(initial_suggestions),
      suggestions: fromJS([])
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
    if (value.length === 0) {
      this.setState({
        suggestions: this.state.mentions
      })
    } else if (value.length < this.minLengthSearch) {
      this.setState({
        suggestions: defaultSuggestionsFilter(value, this.state.mentions)
      });
    } else if (value.length >= this.minLengthSearch){
      let url = '/api/mentions/?search=' + encodeURIComponent(value);
      fetch(url,  {credentials: 'same-origin'})
        .then((response) => response.json())
        .then((data) => {
          let slugs = uniq(data.map((mention) => mention.slug));
          let mentions = slugs.map((slug) => {
            return {
              name: slug
            }
          })
          this.setState({
            suggestions: fromJS(mentions)
          })
        })
    }
  }

  render() {
    return (
      <div className='b2editor' onClick={ this.focus }>
        <Editor
          editorState={this.props.editorState}
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
  onStateChange: PropTypes.func,
  mention_suggestions: PropTypes.array.isRequired
}

export default CommentEditor
