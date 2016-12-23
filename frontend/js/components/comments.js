import React, {PropTypes} from 'react'
import Icon from 'react-fa'
import CommentEditor from '../containers/commentEditor'
import DraftEditor, { convertToRaw, convertFromRaw, EditorState, ContentState } from 'draft-js'
import concat from 'lodash/concat'
import isEmpty from 'lodash/isEmpty'
import without from 'lodash/without'
import { fromJS } from 'immutable'
import CommentView from './commentView'
import UserLink from './userLink'
import {ToucanUploader, UploadField} from '../containers/fileUploader'
import Gallery from './gallery'
import Dropzone from 'react-dropzone'
import DateDisplay from './date'

export class CommentForm extends React.Component {
  constructor(props) {
    super(props);
    this.state = this._getInitialState()
    this.handleSubmit = this.handleSubmit.bind(this)
    this.handleEditorStateChange = this.handleEditorStateChange.bind(this)
    this.handleStatusChangeAndSubmit = this.handleStatusChangeAndSubmit.bind(this)
    this.handleAttachmentAdded = this.handleAttachmentAdded.bind(this);
    this.handleAttachmentRemoved = this.handleAttachmentRemoved.bind(this);
    this.handleAttachmentDropped = this.handleAttachmentDropped.bind(this);
  }

  _getInitialState() {
    return {
      editorState: CommentEditor.getEmptyEditorState(),
      toggleState: false,
      attachments: [],
      files: [],
      isEmpty: true
    }
  }

  resetEditorState() {
    let editorState = EditorState.push(
      this.state.editorState,
      ContentState.createFromText('')
    );
    this.setState({
      editorState,
      attachments: [],
      files: []
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

  handleAttachmentDropped(acceptedFiles, rejectedFiles) {
    this.setState({
      files: [...this.state.files, ...acceptedFiles]
    })
  }

  handleFileSelectorClick = () => {
    console.log(this, this.dropzone);
    this.dropzone.open();
  }

  render() {

    let noText = !this.state.editorState.getCurrentContent().hasText(),
        noAttachments = this.state.attachments.length === 0,
        isEmpty = noText && noAttachments;

    let uploadControl = <ToucanUploader onAdded={this.handleAttachmentAdded}
                                        onRemove={this.handleAttachmentRemoved}
                                        files={this.state.files}
    />;

    let closeIssueButtonText = isEmpty ? 'Resolve issue' : 'Comment and resolve issue'
    let reopenIssueButtonText = isEmpty ? 'Reopen issue' : 'Comment and reopen issue'

    return (<form onSubmit={this.handleSubmit} ref={(e) => this._form =e }>
        <div className='panel panel-default'>
          <div className='panel-heading text-muted'>
            <Icon name='comment-o' />  Add comment
          </div>
          <div className='panel-body'>
            <Dropzone onDrop={this.handleAttachmentDropped}
                      ref={(node) => this.dropzone = node}
                      disableClick={true}
                      accept='image/*'
                      className='dropZoneWrapper0815'
                      >
              <CommentEditor onStateChange={this.handleEditorStateChange}
                           mention_suggestions={this.props.users}
                           editorState={this.state.editorState}
              />

              <p className="text-muted">
                Add image files by dropping them on this field or
                by <a href="#" onClick={this.handleFileSelectorClick}>selecting them</a>.
              </p>

            </Dropzone>
            {uploadControl}
          </div>
          <div className='panel-footer'>
            <div className='btn-toolbar' style={{marginTop: '0.3em'}}>

              <button className='btn btn-sm btn-success pull-right'
                      type='submit'
                      disabled={isEmpty}>
                Comment
              </button>
              <button className='btn btn-sm btn-default'
                      type='button'
                      onClick={this.handleStatusChangeAndSubmit}>
                  {
                    this.props.status == 'open' ?
                      closeIssueButtonText : reopenIssueButtonText
                  }
              </button>

           </div>
        </div>
    </div>
  </form>);
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
    return <Gallery images={attachments} />;
  }
}


export class Comment extends React.Component {
  render() {
    let comment = this.props.comment;
    let hasAttachments = (comment.attachments || []).length > 0;
    console.log(comment, hasAttachments, comment.comment === '');
    let isEmptyComment = comment.comment === '';
    if ( isEmptyComment && !hasAttachments ) { return null; };
    return (<div className='panel panel-default'>
      <div className='panel-heading'>
        <span className="pull-right">
            <DateDisplay date={comment.created} />
        </span>
        <UserLink username={comment.user.username} linkTo={comment.user.html_url}/>
      </div>
      <div className="panel-body" style={{whiteSpace: 'pre-line'}}>
        {isEmptyComment ?
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
        <span> this issue.</span>
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
