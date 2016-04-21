import 'babel-polyfill';

import React, {PropTypes} from 'react';
import { render } from 'react-dom';
import { Map, Marker, Popup, TileLayer, Circle } from 'react-leaflet';

require('leaflet/dist/leaflet.css');

class B2SelectorMap extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      position: this.props.position
    }
    this.onPositionChange = this.onPositionChange.bind(this);
  }

  onPositionChange(latLng) {
    if (this.props.editable) {
      this.setState({
        position: latLng
      })
    }
  }

  render () {
    const position = this.state.position;
    let marker = null;

    if (this.state.position) {
      let marker_props = {
        ref: 'marker',
        draggable: this.props.editable,
        onDragEnd: (e) => this.onPositionChange(e.target.getLatLng())
      };
      marker = <Marker {...marker_props} position={position} />;

      if (this.props.radius > 0) {
        marker = (<Circle center={position} radius={this.props.radius}>{marker}</Circle>);
      }
    }

    return (
      <Map center={this.props.position || {lng: 16.369620, lat:48.2092563}} onClick={(e) => this.onPositionChange(e.latlng)} zoom={12}>
        <TileLayer url='//{s}.tile.openstreetmap.org/{z}/{x}/{y}.png'
                   attribution='&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors' />
                 {marker}
      </Map>);
  }
  componentDidUpdate() {
    if (this.props.onPositionChange != undefined) {
      this.props.onPositionChange(this.state.position);
    }
  }
}

B2SelectorMap.propTypes = {
  onPositionChange: PropTypes.func,
  position: PropTypes.oneOfType([
    PropTypes.object,
    PropTypes.bool
  ]).isRequired,
  editable: PropTypes.bool,
  radius: PropTypes.number
}

B2SelectorMap.defaultProps = {
  onPositionChange: () => {},
  editable: false,
  position: false,
  radius: 0
}


function render_map(element, props={}) {
  let cb = function (new_props) {
    return render(<B2SelectorMap {...new_props} />, element);
  };
  // call it once
  cb(props);
  // and return as callback
  return cb;
}
window.render_map = render_map;

export default render_map
