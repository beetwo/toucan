import 'babel-polyfill';

import React, {PropTypes} from 'react';
import { render } from 'react-dom';
import { Map, Marker, Popup, TileLayer, Circle } from 'react-leaflet';

import LocationControl from './components/map/locationControl';
import { defaultIssueLocation } from './globals';

require('leaflet/dist/leaflet.css');

class B2SelectorMap extends React.Component {
  constructor(props) {
    super(props)
    this._map = null
    this.state = {
      position: this.props.position,
      zoom: 12
    }

    this.onPositionChange = this.onPositionChange.bind(this);
    this.handleLocationFound = this.handleLocationFound.bind(this);
    this.handleLocationError = this.handleLocationError.bind(this);
  }

  componentDidMount() {
    this._map.leafletElement.locate();
  }

  handleLocationFound(e) {
    this.setPosition(e.latlng);
  }

  handleLocationError() {
    // this is called if the user blocks the geo location call
  }

  setPosition(position) {
    this.setState({
      position: position,
      zoom: this._map.leafletElement.getZoom()
    });
  }

  onPositionChange(latLng) {
    if (this.props.editable) {
      this.setPosition(latLng)
    }
  }

  render () {
    const position = this.state.position || defaultIssueLocation;
    let marker = null;

    if (position && position !== defaultIssueLocation) {
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
      <Map center={position} onClick={(e) => this.onPositionChange(e.latlng)} zoom={this.state.zoom} ref={(m) => this._map = m}
            onLocationfound={this.handleLocationFound} onLocationerror={this.handleLocationError} animate={true}>
        <TileLayer url='//{s}.tile.openstreetmap.org/{z}/{x}/{y}.png'
                   attribution='&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors' />
                 {marker}
         <LocationControl locate={()=> this._map.leafletElement.locate()} />
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
