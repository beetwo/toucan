import 'babel-polyfill';
import React from 'react';
import { render } from 'react-dom';
import { Router, Route, browserHistory, IndexRoute, Link } from 'react-router'
import { LeafletMap } from './map';
import getCookie from './utils';
var ReactMarkdown = require('react-markdown');

// require the css files
require('../css/app.css');

class CommentForm extends React.Component {
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

class Comment extends React.Component {
  render(){
    let c = this.props.comment;
    return (<li className='media'>
      <div className="media-body">
        <h4 className="media-heading">{c.created_by.username}</h4>
        <p>{c.comment}</p>
      </div>
    </li>);
  }
}

class CommentList extends React.Component {

  render() {
    let comments = this.props.comments;
    if (comments.length > 0) {
      let cn = comments.map((c) => <Comment key={c.id} comment={c} />);
      return (<div>
          <ul className='media-list'>{cn}</ul>
        </div>);
    }
    return <small>No comments</small>;
  }
}


class IssueDetail extends React.Component {

    constructor (props) {
        super(props)
        this.state = {
            loading: true,
            issue: null,
            comments: []
        }
        this.addComment = this.addComment.bind(this);
    }

    componentDidMount() {
        this.setState({
            loading: true
        });
        this.loadIssue()
    }

    componentWillReceiveProps(np) {
        this.loadIssue();
    }


    addComment(c) {
      let issue = this.state.issue;
      fetch(
        issue.comment_url,
        {
          method: 'post',
          credentials: 'same-origin',
          headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
            'X-CSRFToken': getCookie('csrftoken')
          },
          body: JSON.stringify({
            comment: c.comment
          })
        }
      ).then(response => this.loadComments());
    }

    loadComments() {
      let issue = this.state.issue,
          url = issue.comment_url;
      fetch(url)
            .then(response => response.json())
            .then(json =>  this.setState({comments: json}));
    }

    loadIssue() {
        let issue_id = parseInt(this.props.routeParams.IssueID);
        let issue = this.props.issues.find(issue => issue.id === issue_id);
        fetch(issue.issue_url)
            .then(response => response.json())
            .then(json => {
              this.setState({
                loading: false,
                issue: json.properties
              });
              this.loadComments();
            });
    }

    render() {
        if (this.state.loading) {
            return <div>Issue</div>;
        } else {
            let issue=this.state.issue,
                comments=this.state.comments;

            return (<div className='issueDetail'>
              <div className='issueDetailMain'>
                <div className="panel panel-default">
                    <div className="panel-heading">
                        <h3 className="panel-title">
                          {issue.title}
                        </h3>
                    </div>
                    <div className="panel-body">
                      <ReactMarkdown source={issue.description} />
                    </div>
                </div>
                <CommentList comments={comments} />
              </div>
              <div className='issueDetailBottom'>
                <CommentForm onComment={this.addComment}/>
              </div>
            </div>);
        }
    }
}

class UI extends React.Component {

    render() {
        return (<div className="app-container">
            <div className="map-container">
                <LeafletMap locations={this.props.locations} />
            </div>
            <div className="issues-container">
                {
                    this.props.children && React.cloneElement(
                        this.props.children, {
                            issues: this.props.issues
                    })
                }
            </div>
        </div>);
    }
}


class App extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            issues: null,
            extents: null
        };
    }

    componentWillMount() {
        fetch('/api/')
            .then(function(response){ return response.json();})
            .then(function(json){
                this.setState({
                    issues: json
                });
        }.bind(this));
    }

    render() {
        const geojson = this.state.issues;

        if (geojson === null) {
            return <h2>Loading ...</h2>;
        }

        // simplify the issue data
        let issues = geojson.features.map(function(f){
            return {
                id: f.id,
                ...f.properties
            }
        });

        return <UI locations={geojson} issues={issues} {...this.props} />;

    }
};

export default App
