import React from "react";
import cn from "classnames";

const MapHandle = () => (
  <div className="text-center">
    <span className="mapHandle" />
  </div>
);

class SplitUIView extends React.Component {
  render() {
    let { map, issue_view, filter_interface = null } = this.props;

    return (
      <div className={cn("app-container")}>
        <div className="map-container">{map}</div>
        <div className="issues-container">
          <div className="filter-container">
            <MapHandle />
            {filter_interface}
          </div>
          {issue_view}
        </div>
      </div>
    );
  }
}

export { SplitUIView, MapHandle };
