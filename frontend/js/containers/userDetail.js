import PropTypes from "prop-types";
import React from "react";
import { connect } from "react-redux";
import { loadUserInformation } from "../actions";
import UserDetails from "../components/details/user";
import OrganisationDetails from "../components/details/organisation";
import Loading from "../components/loading";

export const Single = function(props) {
  return <div className="container">{props.children}</div>;
};

class UserDetail extends React.Component {
  constructor(props) {
    super(props);
  }
  componentDidMount() {
    this.props.fetchUserInformation();
  }
  componentWillReceiveProps(next_props) {
    if (next_props.username !== this.props.username) {
      next_props.fetchUserInformation();
    }
  }
  render() {
    let { username, fetchUserInformation, userInformation } = this.props;
    if (!userInformation) {
      return <Loading />;
    }

    let results = [];

    let users = userInformation.user || [];
    let organisations = userInformation.organisation || [];

    // actually only one of these arrays will have a single value
    users.forEach(u => results.push(<UserDetails key={u.id} {...u} />));
    organisations.forEach(o =>
      results.push(<OrganisationDetails key={o.id} {...o} />)
    );

    return <Single>{results}</Single>;
  }
}

const mapStateToProps = (state, ownProps) => {
  console.log(ownProps);
  let username = ownProps.username,
    userInformation = state.userInformationByUsername[username] || false;

  return {
    username,
    userInformation
  };
};

const mapDispatchToProps = (dispatch, ownProps) => {
  let username = ownProps.username;
  return {
    fetchUserInformation: () => {
      dispatch(loadUserInformation(username));
    }
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(UserDetail);
