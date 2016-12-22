import React from 'react';
import ReactDOM from 'react-dom';
import L from 'leaflet';
import { MapControl } from 'react-leaflet';

export default class LocationControl extends MapControl {

  componentWillMount() {
    const locationControl = L.control({position: 'topleft'});
    const jsx = (
      <div className='leaflet-bar'>
        <a href='#' onClick={this.props.locate}>
          <i className='fa fa-crosshairs'></i>
        </a>
      </div>
    );

    locationControl.onAdd = function (map) {
      let div = L.DomUtil.create('div', '');
      ReactDOM.render(jsx, div);
      return div;
    };

    this.leafletElement = locationControl;
  }
}
