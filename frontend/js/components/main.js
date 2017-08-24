import React from "react";
import cn from "classnames";

const MapHandle = props =>
  <div className="issue-list-mapHandle">
    <a {...props} className="mapHandle">
      &nbsp;
    </a>
  </div>;

class SplitUIView extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      listExpanded: false
    };
    this.toggleExpand = this.toggleExpand.bind(this);
  }
  toggleExpand() {
    this.setState(state => ({
      listExpanded: !state.listExpanded
    }));
  }
  render() {
    let { map, issue_view } = this.props;
    return (
      <div
        className={cn("app-container", {
          listExpanded: this.state.listExpanded
        })}
      >
        <div className="map-container">
          {map}
        </div>
        <div className="issues-container">
          <MapHandle onClick={this.toggleExpand} />
          {issue_view}
        </div>
      </div>
    );
  }
}

export { SplitUIView, MapHandle };
