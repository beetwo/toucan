import React from "react";
import { connect } from "react-redux";
import { loadCurrentUserInformation } from "../actions";

class AppShell extends React.Component {
  constructor(props) {
    super(props);
    console.log(props);
    this.props.loadUser();
  }
  render() {
    return (
      <div className="toucan-main">
        {this.props.children}
      </div>
    );
  }
}

export default connect(null, dispatch => ({
  loadUser: () => dispatch(loadCurrentUserInformation())
}))(AppShell);
