import React from "react";
import cn from "classnames";

const MapHandle = () => <div className="issue-list-mapHandle" />;

class SplitUIView extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      filter_opened: false
    };
    this.toggleFilter = this.toggleFilter.bind(this);
  }

  toggleFilter() {
    this.setState(state => ({ filter_opened: !state.filter_opened }));
  }

  render() {
    let { map, issue_view, filter_interface = null } = this.props;

    if (filter_interface) {
      filter_interface = React.cloneElement(filter_interface, {
        toggleFilterForm: this.toggleFilter,
        showFilterForm: this.state.filter_opened
      });
    }

    return (
      <div
        className={cn("app-container", {
          "modal-open": this.state.filter_opened
        })}
      >
        <div className="map-container">{map}</div>
        <div className="issues-container">
          <MapHandle />
          {filter_interface}
          {issue_view}
        </div>
      </div>
    );
  }
}

export { SplitUIView, MapHandle };
