import  Leaflet  from 'leaflet';
import { Marker } from 'react-leaflet';

require('Leaflet.extra-markers/src/assets/css/leaflet.extra-markers.css')
let extraMarkers = require('Leaflet.extra-markers/src/assets/js/leaflet.extra-markers')

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
  let attribs = {}
  switch (issue.issue_type.slug) {
    case 'medical':
      attribs.icon = 'fa-plus-square';
      break;
    case 'general':
      attribs.icon = 'fa-question';
      break;
    default:
      console.warn('Unknown issue type encountered ', issue.issue_type.slug)
      break;
  }
  return Leaflet.ExtraMarkers.icon({
    ...defaulIconProps,
    ...opts,
    ...attribs
  });
}

export default getMarkerForIssue;
