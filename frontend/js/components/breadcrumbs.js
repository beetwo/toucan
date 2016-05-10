import React from 'react'
import Breadcrumbs from 'react-bootstrap-breadcrumbs'

class BreadCrumbs extends React.Component {

  getTitle(name, route, params) {
    return name;
  }

  render() {
    return <Breadcrumbs getTitle={this.getTitle.bind(this)} {...this.props} />
  }
}

export default BreadCrumbs;
