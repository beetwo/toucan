import PropTypes from 'prop-types';
import React from "react";
import { connect } from "react-redux";
import OrganisationDetails from "../components/details/organisation";
import Loading from "../components/loading";

class OrganisationsList extends React.Component {
  render() {
    return (
      <div>
        <h1>Organisations</h1>
      </div>
    );
  }
}

const mapStateToProps = (state, ownProps) => {
  console.log(state, ownProps);
  return {};
};

const mapDispatchToProps = (dispatch, ownProps) => {
  return {};
};

export default connect(mapStateToProps, mapDispatchToProps)(OrganisationsList);
