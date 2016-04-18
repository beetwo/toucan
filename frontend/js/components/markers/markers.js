import  Leaflet  from 'leaflet';
import { Marker } from 'react-leaflet';

require('Leaflet.extra-markers/src/assets/css/leaflet.extra-markers.css')
let extraMarkers = require('Leaflet.extra-markers/src/assets/js/leaflet.extra-markers')

console.log(extraMarkers, Leaflet);

const defaulIconProps = {
    icon: 'fa-circle-o',
    // marker colors
    //'red', 'orange-dark', 'orange', 'yellow', 'blue-dark', 'cyan', 'purple',
    // 'violet', 'pink', 'green-dark', 'green', 'green-light', 'black', or 'white'
    markerColor: 'blue',
    //'circle', 'square', 'star', or 'penta'
    shape: 'circle',
    prefix: 'fa'
}

function getMarkerForIssue(issue={}, opts={}) {
  return Leaflet.ExtraMarkers.icon({
    ...defaulIconProps,
    ...opts
  });
}

export default getMarkerForIssue;
