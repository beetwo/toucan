import React, {PropTypes} from 'react'
import ReactMarkdown from 'react-markdown'

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
      created_by: {
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
    return (<form className='form row' onSubmit={this.handleSubmit}>
      <div className='col-md-10'>
        <textarea rows={2} onChange={this.handleChange} className='form-control' required placeholder='Your comment goes here ...' value={this.state.comment}></textarea>
      </div>
      <div className='col-md-2'>
        <button className='form-control btn btn-sm btn-primary' type='submit'>Comment</button>
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
    return (<li className='media'>
      <div className="media-body">
        <h4 className="media-heading">{c.created_by.username}</h4>
        <p>
          {c.comment}
        </p>
      </div>
    </li>);
  }
}

Comment.propTypes = {
  comment: PropTypes.object.isRequired
}


export class CommentList extends React.Component {

  constructor(props) {
    super(props)
  }

  render() {
    let cn = this.props.comments.map((c) => <Comment key={c.id} comment={c} />);
    return (<div>
        <ul className='media-list'>{cn}</ul>
      </div>);
  }

}

CommentList.propTypes = {
  comments: PropTypes.array.isRequired
}
