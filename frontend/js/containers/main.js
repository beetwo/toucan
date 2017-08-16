import React from "react";
import { connect } from "react-redux";
import { withRouter } from "react-router-dom";
import { loadCurrentUserInformation } from "../actions";

class AppShell extends React.Component {
  constructor(props) {
    super(props);
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

export default withRouter(
  connect(null, dispatch => ({
    loadUser: () => dispatch(loadCurrentUserInformation())
  }))(AppShell)
);
