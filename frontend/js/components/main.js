import React from "react";

const SplitUIView = ({ map, issue_view }) => {
  return (
    <div className="app-container">
      <div className="map-container">
        {map}
      </div>
      <div className="issues-container">
        {issue_view}
      </div>
    </div>
  );
};

export { SplitUIView };
