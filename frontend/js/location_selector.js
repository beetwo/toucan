import 'babel-polyfill';

import React from 'react';
import { render } from 'react-dom';
import { Map, Marker, Popup, TileLayer } from 'react-leaflet';

require('leaflet/dist/leaflet.css');

class B2SelectorMap extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      position: {
          lat: 48,
          lng: 16
      }
    }
    this._initial_position ={...this.state.position}
    this.onPositionChange = this.onPositionChange.bind(this)
  }

  onPositionChange(latLng) {
    this.setState({
      position: latLng
    })
  }

  render () {
    const position = this.state.position;
    return (
      <Map center={this._initial_position} onClick={(e) => this.onPositionChange(e.latlng)} zoom={12}>
        <TileLayer url='//{s}.tile.openstreetmap.org/{z}/{x}/{y}.png'
                   attribution='&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors' />
                 <Marker ref='marker'
                   position={position} draggable={true} onDragEnd={(e) => this.onPositionChange(e.target.getLatLng())}></Marker>
      </Map>);
  }
  componentDidUpdate() {
    this.props.onCoordinatesChange(this.state.latLng);
  }

}


function render_map(element, cb) {
  return render(<B2SelectorMap onCoordinatesChange={cb}/>, element);
}
window.render_map = render_map;

export default render_map
