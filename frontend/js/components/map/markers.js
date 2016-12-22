import  Leaflet  from 'leaflet';
import { Marker } from 'react-leaflet';
import getIconClassForIssueType from '../icons/issueType'

require('Leaflet.extra-markers/src/assets/css/leaflet.extra-markers.css')
let extraMarkers = require('Leaflet.extra-markers/src/assets/js/leaflet.extra-markers')


function getMarkerForIssue(issue={}, opts={}) {
  const defaulIconProps = {
      icon: getIconClassForIssueType(issue.issue_type, 'fa-'),
      // marker colors
      //'red', 'orange-dark', 'orange', 'yellow', 'blue-dark', 'cyan', 'purple',
      // 'violet', 'pink', 'green-dark', 'green', 'green-light', 'black', or 'white'
      markerColor: issue.status === 'closed' ? 'orange-dark' : 'cyan',
      //'circle', 'square', 'star', or 'penta'
      shape: 'circle',
      prefix: 'fa'
  }

  return Leaflet.ExtraMarkers.icon({
    ...defaulIconProps,
    ...opts
  });
}

export default getMarkerForIssue;
