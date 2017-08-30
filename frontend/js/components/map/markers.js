import React from "react";
import { divIcon } from "leaflet";
import { Marker } from "react-leaflet";
import { getIconClassForIssueType } from "../icons/issueType";
import history from "../../history";

function getMarkerForIssue(issue, selected = false) {
  let issue_type = issue.issue_types[0];
  let cls = getIconClassForIssueType(
    issue_type,
    `toucan-div-icon-marker ${selected ? "selected" : ""} marker-`
  );
  return (
    <Marker
      key={`issue-marker-${issue.id}`}
      icon={divIcon({ className: cls, iconSize: null })}
      position={issue.position}
      onClick={() => history.push(`/issue/${issue.id}/`)}
    />
  );
}

const getIssueMarkerCluster = cluster => {
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
const orgIcon = divIcon({
  className: "toucan-div-icon-marker marker-organisation",
  iconSize: null
});

const getMarkersForOrganisation = organisation => {
  const key = `organisation-marker-${organisation.id}`;
  const navigate = () => history.push(`/orgs/${organisation.id}/`);
  return organisation.locations.map(location => {
    return (
      <Marker
        key={`${key}-${location.id}`}
        icon={orgIcon}
        position={[...location.location.coordinates].reverse()}
        onClick={navigate}
      />
    );
  });
};

export {
  getOrganisationClusterMarker,
  getIssueMarkerCluster,
  getMarkerForIssue,
  getMarkersForOrganisation
};
