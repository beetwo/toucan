import React, { PropTypes } from 'react'
import { Link } from 'react-router'

class UserLink extends React.Component {
  render() {
    let { username } = this.props;
    return <Link to={`/users/${username}`}>{username}</Link>
  }
}

UserLink.propTypes = {
  username: PropTypes.string.isRequired
}

export default UserLink
