import  Leaflet  from 'leaflet';
import { Marker } from 'react-leaflet';

require('drmonty-leaflet-awesome-markers/css/leaflet.awesome-markers.css');
let aws = require('drmonty-leaflet-awesome-markers/js/leaflet.awesome-markers.js');

function getMarkerForIssue(issue) {
  let it = issue.issue_type;
  if (it && it.svg) {
      return Leaflet.icon({
        iconUrl: it.svg,
        iconSize: [30,30]
      });
  };
}

export default getMarkerForIssue;
