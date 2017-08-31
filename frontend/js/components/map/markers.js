import React from "react";
import { divIcon } from "leaflet";
import { Marker } from "react-leaflet";
import { getIconClassForIssueType } from "../icons/issueType";
import history from "../../history";

function getMarkerForIssue(issue, selected_issues = new Set()) {
  let issue_type = issue.issue_types[0];

  let cls = getIconClassForIssueType(
    issue_type,
    `toucan-div-icon-marker ${selected_issues.has(issue)
      ? "selected"
      : ""} marker-`
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

const orgIcon = (selected = false) =>
  divIcon({
    className: `toucan-div-icon-marker ${selected
      ? "selected"
      : ""} marker-organisation`,
    iconSize: null
  });

const getMarkersForOrganisation = (
  organisation,
  selected_organisations = new Set()
) => {
  const key = `organisation-marker-${organisation.id}`;
  const navigate = () => history.push(`/orgs/${organisation.id}/`);
  let selected = selected_organisations.has(organisation);
  return organisation.locations.map(location => {
    return (
      <Marker
        key={`${key}-${location.id}`}
        icon={orgIcon(selected)}
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
