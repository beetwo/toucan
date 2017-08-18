import { divIcon } from "leaflet";
import { Marker } from "react-leaflet";
import { getIconClassForIssueType } from "../icons/issueType";

function getMarkerForIssue(issue = {}, opts = {}) {
  let issue_type = issue.issue_types[0];
  let cls = getIconClassForIssueType(
    issue_type,
    "toucan-div-icon-marker marker-"
  );
  return divIcon({ className: cls });
}

export default getMarkerForIssue;
