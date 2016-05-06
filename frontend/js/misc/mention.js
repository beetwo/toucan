
// It is important to import the Editor which accepts plugins.
import Editor from 'draft-js-plugins-editor';
import createMentionPlugin, {defaultSuggestionsFilter} from 'draft-js-mention-plugin';
import React from 'react';
import {render} from 'react-dom';
import { fromJS } from 'immutable';
import { EditorState, convertToRaw } from 'draft-js';
import { convertDraft } from '../utils'

import '../../css/editor_styles.css'
import 'draft-js-mention-plugin/lib/plugin.css';

const mentions = fromJS([
  {
    name: 'Matthew Russell',
    link: 'https://twitter.com/mrussell247',
    avatar: 'https://pbs.twimg.com/profile_images/517863945/mattsailing_400x400.jpg',
  },
  {
    name: 'Julian Krispel-Samsel',
    link: 'https://twitter.com/juliandoesstuff',
    avatar: 'https://pbs.twimg.com/profile_images/477132877763579904/m5bFc8LF_400x400.png',
  },
  {
    name: 'Jyoti Puri',
    link: 'https://twitter.com/jyopur',
    avatar: 'https://pbs.twimg.com/profile_images/705714058939359233/IaJoIa78_400x400.jpg',
  },
  {
    name: 'Max Stoiber',
    link: 'https://twitter.com/mxstbr',
    avatar: 'https://pbs.twimg.com/profile_images/681114454029942784/PwhopfmU_400x400.jpg',
  },
  {
    name: 'Nik Graf',
    link: 'https://twitter.com/nikgraf',
    avatar: 'https://pbs.twimg.com/profile_images/535634005769457664/Ppl32NaN_400x400.jpeg',
  },
  {
    name: 'Pascal Brandt',
    link: 'https://twitter.com/psbrandt',
    avatar: 'https://pbs.twimg.com/profile_images/688487813025640448/E6O6I011_400x400.png',
  },
]);


const mentionPlugin = createMentionPlugin({
  mentionPrefix: '@'
});

const { MentionSuggestions } = mentionPlugin;
const plugins = [mentionPlugin];

const mentionPlugin2 = createMentionPlugin();
const plugins2 = [mentionPlugin2];

class TestEditor extends React.Component {

  constructor(props) {
    super(props)
    this.state = {
      editorState: EditorState.createEmpty(),
      editorState2: EditorState.createEmpty(),
      suggestions: []
    }
  }

  onChange(state) {
    let content = state.getCurrentContent()
    this.setState({
      editorState: state,
      editorState2: EditorState.createWithContent(content)
    })
  }

  onSearchChange({ value }) {
    console.log(value);
    this.setState({
      suggestions: defaultSuggestionsFilter(value, mentions),
    });
  };

  focus() {
    this.refs.editor.focus();
  };

  render() {
    return <div styles={{display: 'flex'}}>
      <h1>Editor</h1>

      <hr />

      <div onClick={this.focus.bind(this)}>
        <Editor
          editorState={ this.state.editorState }
          onChange={this.onChange.bind(this)}
          plugins={plugins}
          ref="editor"
        />
        <MentionSuggestions
          onSearchChange={ this.onSearchChange.bind(this) }
          suggestions={ this.state.suggestions }
        />
      </div>

      <hr />

        <Editor
          editorState={ this.state.editorState2 }
          readOnly={true}
          onChange={(s) => console.log(s)}
          plugins={plugins2}
          />
          <hr />
          <pre>
            {
              convertDraft(this.state.editorState2.getCurrentContent())
            }
          </pre>
    </div>;
  }
}

render(
  <TestEditor />,
  document.getElementById('main')
)
