import React, { PropTypes } from 'react'
import { Link } from 'react-router'

class UserLink extends React.Component {
  render() {
    let { username, linkTo } = this.props;
    let link = linkTo ?
      <a href={linkTo} target='_blank'>
        {username}
      </a> :
      <Link to={`/users/${username}`}>{username}</Link>;
    return link;
  }
}

UserLink.propTypes = {
  username: PropTypes.string.isRequired,
  linkTo: PropTypes.string
}

export default UserLink
