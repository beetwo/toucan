import 'babel-polyfill';

import React, {PropTypes} from 'react';
import { render } from 'react-dom';
import { Map, Marker, Popup, TileLayer } from 'react-leaflet';

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

    return (
      <Map center={this.props.position || {lng: 16.369620, lat:48.2092563}} onClick={(e) => this.onPositionChange(e.latlng)} zoom={12}>
        <TileLayer url='//{s}.tile.openstreetmap.org/{z}/{x}/{y}.png'
                   attribution='&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors' />
                 {
                   this.state.position ?
                   <Marker ref='marker'
                           position={position}
                           draggable={this.props.editable}
                           onDragEnd={(e) => this.onPositionChange(e.target.getLatLng())}>
                   </Marker> :
                   null
                 }
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
  editable: PropTypes.bool
}

B2SelectorMap.defaultProps = {
  onPositionChange: () => {},
  editable: false,
  position: false
}


function render_map(element, props={}) {
  return render(<B2SelectorMap {...props} />, element);
}
window.render_map = render_map;

export default render_map
