import React, {PropTypes} from 'react'
import ReactMarkdown from 'react-markdown'
import Timeago from 'react-timeago'
import Icon from 'react-fa'

import concat from 'lodash/concat'


export class CommentForm extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      comment: ''
    };
    this.handleSubmit = this.handleSubmit.bind(this);
    this.handleChange = this.handleChange.bind(this);
  }
  handleSubmit(e) {
    e.preventDefault();
    let comment = {
      id: Date.now(),
      comment: this.state.comment,
      user: {
        username: 'You'
      }
    }
    this.props.onComment(comment);
    this.setState({
      comment: ''
    });
  }

  handleChange(e) {
    this.setState({comment: e.target.value});
  }

  render() {
    return (<form onSubmit={this.handleSubmit} ref={(e) => this._form =e }>
        <textarea className="form-control custom-control" rows="2" style={{resize: 'none'}} required value={this.state.comment} onChange={this.handleChange}></textarea>
      <div className='form-group text-right'>
        <button className='btn btn-sm btn-success' type='submit'>
          Close and comment
        </button>
        <button className='btn btn-sm btn-primary' type='submit'>
          Comment
        </button>
      </div>
  </form>);

  }
}

CommentForm.propTypes = {
  onComment: PropTypes.func.isRequired
}

export class Comment extends React.Component {
  render() {
    let c = this.props.comment
    return (<div className='panel panel-default'>
      <div className='panel-heading'>
        {c.user.username} commented <Timeago date={c.created} />
        {c.created}
      </div>
      <div className="panel-body">
        <ReactMarkdown source={c.comment} />
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

  constructor(props) {
    super(props)
  }

  render() {

    let all = this.flattenCommentsAndStatusChanges(
      this.props.comments,
      this.props.statusChanges
    );
    let items = all.map((x) => {
      if (x.type === 'comment') {
        return <Comment key={'comment-' + x.data.id} comment={x.data} />
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
