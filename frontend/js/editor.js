import React from 'react'
import { render } from 'react-dom'
import CommentEditor from './containers/commentEditor'
import { defaultSuggestionsFilter } from 'draft-js-mention-plugin';


let mentions = [
  {
    name: 'tester'
  },
  {
    name: 'admin'
  },
  {
    name: 'user'
  }
]


class TestEditor extends React.Component {
  constructor(props) {
    super(props)
    this.handleStateChange = this.handleEditorStateChange.bind(this)
    this.state = {
      editorState: CommentEditor.getEmptyEditorState()
    }
  }
  handleEditorStateChange(state) {
    this.setState({
      editorState: state
    })
  }
  render() {
    let ce1 = <CommentEditor key={1}
                         onStateChange={this.handleStateChange}
                         editorState={this.state.editorState}
                         suggestions={mentions}
          />;
    let ce2 = <CommentEditor key={2}
                   editorState={this.state.editorState}
                   onStateChange={(state) => console.log(state)}
                   suggestions={mentions}
    />;
    return <div className='flexy'>
      {ce1}
      {ce2}
    </div>;
  }
}

render(<TestEditor />, document.getElementById('main'));
