import Leaflet from "leaflet";
import { Marker } from "react-leaflet";
import { getIconClassForIssueType } from "../icons/issueType";

require("Leaflet.extra-markers/src/assets/css/leaflet.extra-markers.css");
let extraMarkers = require("Leaflet.extra-markers/src/assets/js/leaflet.extra-markers");

function getMarkerForIssue(issue = {}, opts = {}) {
  let issue_type = issue.issue_types[0];
  const defaulIconProps = {
    icon: getIconClassForIssueType(issue_type),
    // marker colors
    //'red', 'orange-dark', 'orange', 'yellow', 'blue-dark', 'cyan', 'purple',
    // 'violet', 'pink', 'green-dark', 'green', 'green-light', 'black', or 'white'
    markerColor: issue.status === "closed" ? "orange-dark" : "cyan",
    //'circle', 'square', 'star', or 'penta'
    shape: "circle",
    prefix: ""
  };

  return Leaflet.ExtraMarkers.icon({
    ...defaulIconProps,
    ...opts
  });
}

export default getMarkerForIssue;
