import twitterText from 'twitter-text'
import React, { PropTypes } from 'react'
import UserLink from './userLink'

class Comment extends React.Component {
  render() {
    let {comment} = this.props;
    console.log(comment);
    let mentions = twitterText.extractMentionsWithIndices(comment);
    let parts = [];

    if (mentions.length > 0) {
      mentions.sort(function(a,b){ return a.indices[0] - b.indices[0]; });
      let begin_index = 0;
      let counter = 0;

      mentions.forEach((value, index, mentions) => {
        parts.push(<span key={counter++}>
          {comment.substring(begin_index, value.indices[0])}
          </span>
        )
        let username = comment.substring(value.indices[0], value.indices[1]);
        parts.push(<UserLink key={counter++} username={username} />)
        begin_index = value.indices[1]
      })
      parts.push(<span key={counter++}>{comment.substring(begin_index, comment.length)}</span>);

    }
    return <div>{parts.length > 0 ? parts : comment}</div>;
  }
}

Comment.propTypes = {
  comment: PropTypes.string.isRequired
}

export default Comment
