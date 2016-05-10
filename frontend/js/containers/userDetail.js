import React, {PropTypes} from 'react'

class UserDetail extends React.Component {
  render() {
    console.log(this.props);
    let { username } = this.props.params;
    return <h1>{username}</h1>
  }
}

export default UserDetail;
