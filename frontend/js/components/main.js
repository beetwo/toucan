import React from "react";
import Map from "./map/index";
import NewIssue from "./newIssue";
import Icon from "react-fa";

import { mediumSize } from "./responsive";
import urls from "../urls";
import { DetailFooter, CustomLocationSelectedFooter } from "./map/footers";

require("../../css/app.scss");

function WrapMap(props) {
  let map = (
    <Map
      geojson={props.geojson}
      bounds={props.bounds}
      visibleIssueIDs={props.issues.map(i => i.id)}
      setCoordinates={props.setCoordinates}
      coordinates={props.coordinates}
      selectIssue={props.selectIssue}
      selectedIssue={props.selectedIssue}
    />
  );
  let selectedIssue = null;
  if (props.selectedIssue) {
    selectedIssue = props.geojson.features.filter(
      i => i.id === props.selectedIssue
    )[0];
  }

  return (
    <div className="map-container">
      {map}
      {/*{footer}*/}
    </div>
  );
}

class UI extends React.Component {
  render() {
    return (
      <div className="app-container">
        <WrapMap {...this.props} />
        <div className="issues-container">
          {this.props.coordinates === null
            ? null
            : <NewIssue
                coordinates={this.props.coordinates}
                removeAction={this.props.clearCoordinates}
              />}

          {this.props.children}
        </div>
      </div>
    );
  }
}

export default UI;
