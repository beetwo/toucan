import React from 'react';
import ReactDOM from 'react-dom';
import L from 'leaflet';
import { MapControl } from 'react-leaflet';

export default class LocationControl extends MapControl {  // note we're extending MapControl from react-leaflet, not Component from react

  locateMe() {
    console.log('Locate!',arguments);
  }

  componentWillMount() {
    const locationControl = L.control({position: 'topleft'});  // see http://leafletjs.com/reference.html#control-positions for other positions
    const jsx = (
      <a href='#' onClick={this.props.locate}>
        Locate Me!
      </a>
    );

    locationControl.onAdd = function (map) {
      let div = L.DomUtil.create('div', '');
      ReactDOM.render(jsx, div);
      return div;
    };

    this.leafletElement = locationControl;
  }
}
