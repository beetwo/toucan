import React, {PropTypes} from 'react'
import Timeago from 'react-timeago'
import Icon from 'react-fa'
import CommentEditor from '../containers/commentEditor'
import DraftEditor, { convertToRaw, convertFromRaw } from 'draft-js'
import concat from 'lodash/concat'
import isEmpty from 'lodash/isEmpty'
import { fromJS } from 'immutable'


export class CommentForm extends React.Component {
  constructor(props) {
    super(props);

    this.state = this._getInitialState()

    this.handleSubmit = this.handleSubmit.bind(this)
    this.handleChange = this.handleChange.bind(this)
    this.handleEditorStateChange = this.handleEditorStateChange.bind(this)
    this.handleStatusChange = this.handleStatusChange.bind(this)
  }

  _getInitialState() {
    return {
      editorState: CommentEditor.getEmptyEditorState(),
      toggleState: false
    }
  }
  handleSubmit(e) {
    e.preventDefault();
    let comment = {
      id: Date.now(),
      draft_struct: convertToRaw(this.state.editorState.getCurrentContent()),
      user: {
        username: 'You'
      }
    }

    if (this.state.toggleState) {
      if (this.props.status === 'open') {
        comment.closed = true;
      } else {
        comment.open = true;
      }
    }

    console.log(comment);
    
    this.props.onComment(comment);
    this.setState(
      this._getInitialState()
    );
  }

  handleEditorStateChange(state) {
    this.setState({
      editorState: state
    })
  }

  handleStatusChange(e) {
    this.setState({
      toggleState: !this.state.toggleState
    })
  }

  handleChange(e) {
    this.setState({comment: e.target.value});
  }

  render() {

    return (<form onSubmit={this.handleSubmit} ref={(e) => this._form =e }>
        <CommentEditor onStateChange={this.handleEditorStateChange} editorState={this.state.editorState}/>
      <div className='form-group text-right'>
        <div className="checkbox pull-left">
                     <label>
                       <input type="checkbox" checked={this.state.toggleState} onChange={this.handleStatusChange}/>
                       <small>
                         { this.props.status == 'open' ? 'close issue' : 're-open issue' }
                       </small>
                     </label>
         </div>
         <button className='btn btn-sm btn-primary' type='submit'>
           Comment
         </button>
      </div>
  </form>);

  }
}

CommentForm.propTypes = {
  onComment: PropTypes.func.isRequired,
  status: PropTypes.string.isRequired
}

export class Comment extends React.Component {
  render() {
    let c = this.props.comment
    if (isEmpty(c.draft_struct)) {
      return null;
    }
    let lines = c.comment.split('\n')
    return (<div className='panel panel-default'>
      <div className='panel-heading'>
        {c.user.username} commented <Timeago date={c.created} />
      </div>
      <div className="panel-body" style={{whiteSpace: 'pre-line'}}>
        {c.comment === '' ? <em>No comment was added.</em> : c.comment }
      </div>
    </div>);
  }
}

Comment.propTypes = {
  comment: PropTypes.object.isRequired
}


export class StatusChange extends React.Component {
  render() {
    let sc = this.props.statusChange;
    return <p className='text-right text-muted'>
      <a>{sc.user.username}</a>&nbsp;
      { sc.status === 'open' ? <span className='label label-success'>re-opened</span> : null }
      { sc.status === 'closed' ? <span className='label label-danger'>closed</span> : null }
      &nbsp;this issue.
    </p>;
  }
}

export class CommentList extends React.Component {

  flattenCommentsAndStatusChanges(comments=[], statusChanges=[]) {
    let m_comments = comments.map((c) => {
       return {type: 'comment', data: c, created: c.created}
    });
    let m_statusChanges = statusChanges.map((sc) => {
      return { type:'status', data: sc, created: sc.created}
    });
    let all = concat(m_comments, m_statusChanges);
    return all.sort(function(a,b) {
      return a.created < b.created ? -1 : (a.created > b.created ? 1 : 0)
    })
  }

  flattenUsers(users=[]) {
    return fromJS(
      users.map((u) => {
        return {
          name: u.username
        }
      })
    )
  }

  constructor(props) {
    super(props)
  }

  render() {

    let all = this.flattenCommentsAndStatusChanges(
      this.props.comments,
      this.props.statusChanges
    );
    let users = this.flattenUsers(this.props.users)
    let items = all.map((x) => {
      if (x.type === 'comment') {
        return <Comment key={'comment-' + x.data.id} comment={x.data} users={users} />
      }
      if (x.type === 'status') {
        return <StatusChange key={'status-' + x.data.id} statusChange={x.data}/>
      }
      return null;
    });
    return (<div>{items}</div>);
  }

}

CommentList.propTypes = {
  comments: PropTypes.array.isRequired,
  statusChanges: PropTypes.array.isRequired
}
