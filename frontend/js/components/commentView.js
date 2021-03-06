import twitterText from 'twitter-text'
import PropTypes from 'prop-types';
import React from 'react';
import UserLink from './userLink'

class Comment extends React.Component {
  render() {
    let {comment} = this.props;
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
        let username = value.screenName,
            linkText = comment.substring(value.indices[0], value.indices[1]);
          parts.push(
              <UserLink key={counter++}
                        username={username}>
                  {linkText}
              </UserLink>
          )
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
