import React from "react";
import { divIcon } from "leaflet";
import { Marker } from "react-leaflet";
import { getIconClassForIssueType } from "../icons/issueType";

function getMarkerForIssue(issue = {}, selected = false) {
  let issue_type = issue.issue_types[0];
  console.log(`toucan-div-icon-marker ${selected ? "selected" : ""} marker-`);
  let cls = getIconClassForIssueType(
    issue_type,
    `toucan-div-icon-marker ${selected ? "selected" : ""} marker-`
  );
  return divIcon({ className: cls, iconSize: null });
}

export default getMarkerForIssue;

const getIssueMarkerCluster = cluster => {
  console.log(cluster);
  return divIcon({
    html: `<span>${cluster.getChildCount()}</span>`,
    className: "toucan-div-icon-cluster marker-cluster-issue",
    iconSize: null
  });
};

const getOrganisationClusterMarker = cluster => {
  return divIcon({
    html: `<span>${cluster.getChildCount()}</span>`,
    className: "toucan-div-icon-cluster marker-cluster-organisation",
    iconSize: null
  });
};

export { getOrganisationClusterMarker, getIssueMarkerCluster };
