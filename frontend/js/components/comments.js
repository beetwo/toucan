import React, {PropTypes} from 'react'
import Timeago from 'react-timeago'
import Icon from 'react-fa'
import CommentEditor from '../containers/commentEditor'
import DraftEditor, { convertToRaw, convertFromRaw, EditorState, ContentState } from 'draft-js'
import concat from 'lodash/concat'
import isEmpty from 'lodash/isEmpty'
import without from 'lodash/without'
import { fromJS } from 'immutable'
import CommentView from './commentView'
import UserLink from './userLink'
import {ToucanUploader} from '../containers/fileUploader';


export class CommentForm extends React.Component {
  constructor(props) {
    super(props);
    this.state = this._getInitialState()
    this.handleSubmit = this.handleSubmit.bind(this)
    this.handleEditorStateChange = this.handleEditorStateChange.bind(this)
    this.handleStatusChangeAndSubmit = this.handleStatusChangeAndSubmit.bind(this)
    this.handleAttachmentAdded = this.handleAttachmentAdded.bind(this);
    this.handleAttachmentRemoved = this.handleAttachmentRemoved.bind(this)
  }

  _getInitialState() {
    return {
      editorState: CommentEditor.getEmptyEditorState(),
      toggleState: false,
      attachments: []
    }
  }

  resetEditorState() {
    let editorState = EditorState.push(
      this.state.editorState,
      ContentState.createFromText('')
    );
    this.setState({
      editorState,
      attachments: []
    })
  }

  handleSubmit(e) {
    e.preventDefault();
    this.postComment();
  }

  postComment() {
    let comment = {
      id: Date.now(),
      draft_struct: convertToRaw(this.state.editorState.getCurrentContent()),
      user: {
        username: 'You'
      },
      toggleState: this.state.toggleState,
      attachments: this.state.attachments
    }
    this.props.onComment(comment);
    this.resetEditorState();
    console.log(this.uploader);
    this.uploader.reset();
  }

  handleEditorStateChange(state) {
    this.setState({
      editorState: state
    })
  }

  handleStatusChangeAndSubmit(e) {
    this.setState({
        toggleState: true
      },
      () => {
        this.postComment()
      }
    );
  }

  handleAttachmentAdded(attachmentID) {
    this.setState((prevState, props) => {
      return {
        attachments: [...prevState.attachments, attachmentID]
      };
    });
  }

  handleAttachmentRemoved(attachment) {
    this.setState((prevState, props) => {
      return {
        attachments: without(prevState.attachments, attachmentID)
      };
    });
  }

  render() {
    return (<div className='commentForm'>
      <form onSubmit={this.handleSubmit} ref={(e) => this._form =e }>
        <CommentEditor onStateChange={this.handleEditorStateChange}
                       mention_suggestions={this.props.users}
                       editorState={this.state.editorState} />

        <div>
          <ToucanUploader ref={(uploader) => this.uploader = uploader} onAdded={this.handleAttachmentAdded} onRemove={this.handleAttachmentRemoved} />
        </div>

        <div className='btn-toolbar pull-right'>
           <button className='btn btn-sm btn-default' type='button' onClick={this.handleStatusChangeAndSubmit}>
             { this.props.status == 'open' ? 'Resolve issue' : 'Reopen issue' }
           </button>
           <button className='btn btn-sm btn-success' type='submit'>
             Comment
           </button>
        </div>

      </form>
    </div>);
  }
}

CommentForm.propTypes = {
  onComment: PropTypes.func.isRequired,
  status: PropTypes.string.isRequired,
  users: PropTypes.array.isRequired
}

export class Attachments extends React.Component {
  render() {
    let {attachments} = this.props;
    let imgStyles = {
      maxWidth: '70px',
      paddingBottom: '0.5em'
    }
    return <ul className="list-inline">
      {attachments.map((attachment, index) => {
        return <li key={index}>
          <img style={imgStyles} src={attachment.thumbnail_url} alt='thumbnail'/>
        </li>
      })}
    </ul>
  }
}


export class Comment extends React.Component {
  render() {
    let comment = this.props.comment;
    let hasAttachments = (comment.attachments || []).length > 0;
    return (<div className='panel panel-default'>
      <div className='panel-heading'>
        <UserLink username={comment.user.username} /> commented <Timeago date={comment.created} />
      </div>
      <div className="panel-body" style={{whiteSpace: 'pre-line'}}>
        {comment.comment === '' ?
          <em>No comment was added.</em> :
           <CommentView comment={comment.comment} /> }
      </div>
      { hasAttachments ?
        <div className='panel-footer'>
          <Attachments attachments={comment.attachments} />
        </div> : null }
    </div>);
  }
}

Comment.propTypes = {
  comment: PropTypes.object.isRequired
}


export class StatusChange extends React.Component {
  render() {
    let sc = this.props.statusChange;
    let txt = null;

    if (sc.status === 'open') {
      txt = <span>
        <span className='label label-danger'>re-opened</span>
        <span>this issue.</span>
      </span>;

    } else if (sc.status === 'closed') {
      txt = <span>
        <span>marked this issue as </span>
        <span className='label label-success'>resolved</span>
      </span>;
    };

    return <p className='text-right text-muted'>
      <a>{sc.user.username}</a>&nbsp;
      {txt}
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
