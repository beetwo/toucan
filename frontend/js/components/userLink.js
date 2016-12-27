import React, { PropTypes } from 'react'
import { Link } from 'react-router'

class UserLink extends React.Component {
  render() {
    let { username, linkTo, className } = this.props;
    let linkText = this.props.children ? this.props.children : username

    let link = linkTo ?
      <a href={linkTo} target='_blank' className={className}>
          {linkText}
      </a> :
      <Link to={`/detail/${username}`}>
          {linkText}
      </Link>;
    return link;
  }
}

UserLink.propTypes = {
  username: PropTypes.string.isRequired,
  linkTo: PropTypes.string
}

export default UserLink
