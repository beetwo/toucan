import fetch from "isomorphic-fetch";
import getCookie, { jsonPost, jsonGet } from "./utils";
import { latLngBounds } from "leaflet";

export const REQUEST_ISSUES = "REQUEST_ISSUES";
export const RECEIVE_ISSUES = "RECEIVE_ISSUES";

export const SELECT_ISSUE = "SELECT_ISSUE";
export const REQUEST_ISSUE = "REQUEST_ISSUE";
export const RECEIVE_ISSUE = "RECEIVE_ISSUE";
export const INVALIDATE_ISSUE = "INVALIDATE_ISSUE";

export const SET_COORDINATES = "SET_COORDINATES";
export const RESET_COORDINATES = "RESET_COORDINATES";

export const LOAD_COMMENTS = "LOAD_COMMENTS";
export const POST_COMMENT = "POST_COMMENT";
export const RECEIVE_COMMENTS = "RECEIVE_COMMENTS";

export const CHANGE_ISSUE_STATUS = "CHANGE_ISSUE_STATUS";

export const ADD_ISSUES_FILTER = "ADD_ISSUES_FILTER";
export const REMOVE_ISSUES_FILTER = "REMOVE_ISSUES_FILTER";
export const RESET_ISSUES_FILTER = "RESET_ISSUES_FILTER";

export const FETCH_CURRENT_USER_DATA = "FETCH_CURRENT_USER_DATA";
export const RECEIVE_USER_INFORMATION = "RECEIVE_USER_INFORMATION";

export const FETCH_ORGANISATIONS = "FETCH_ORGANISATIONS";
export const RECEIVE_ORGANISATIONS = "RECEIVE_ORGANISATIONS";

export const FETCH_ORGANISATION_DETAILS = "FETCH_ORGANISATION_DETAILS";
export const RECEIVE_ORGANISATION_DETAILS = "RECEIVE_ORGANISATION_DETAILS";

export const SET_ISSUE_MAP_BOUNDS = "SET_ISSUE_MAP_BOUNDS";
export const SET_ISSUE_DETAIL_ZOOM_LEVEL = "SET_ISSUE_DETAIL_ZOOM_LEVEL";

export const SET_ORG_MAP_BOUNDS = "SET_ORG_MAP_BOUNDS";
export const SET_ORG_DETAIL_ZOOM_LEVEL = "SET_ORG_DETAIL_ZOOM_LEVEL";

export const SET_GEOLOCATION = "SET_GEOLOCATION";

export function requestIssues() {
  return {
    type: REQUEST_ISSUES
  };
}

export function receiveIssues(issues) {
  return {
    type: RECEIVE_ISSUES,
    issues: issues,
    receivedAt: Date.now()
  };
}

export function fetchIssues() {
  return dispatch => {
    dispatch(requestIssues());
    return fetch("/api/", { credentials: "same-origin" })
      .then(response => response.json())
      .then(json => dispatch(receiveIssues(json)));
  };
}

export function addIssueFilter(property, value) {
  return {
    type: ADD_ISSUES_FILTER,
    filter: {
      property: property,
      value: value
    }
  };
}

export function removeIssueFilter(property, value) {
  return {
    type: REMOVE_ISSUES_FILTER,
    filter: {
      property: property,
      value: value
    }
  };
}

export function resetIssueFilter() {
  return {
    type: RESET_ISSUES_FILTER
  };
}

export function selectIssue(issue_id) {
  return {
    type: SELECT_ISSUE,
    issue_id: parseInt(issue_id, 10)
  };
}

export function resetSelectedIssue() {
  return {
    type: SELECT_ISSUE,
    issue_id: null
  };
}

export function requestIssue(issue_id) {
  return {
    type: REQUEST_ISSUE,
    issue_id
  };
}

export function receiveIssue(issue_id, json) {
  return {
    type: RECEIVE_ISSUE,
    issue_id,
    payload: json
  };
}

export function invalidateIssue(issue_id) {
  return {
    type: INVALIDATE_ISSUE,
    issue_id
  };
}

export function fetchIssueIfNeeded(issue_id) {
  return (dispatch, getState) => {
    dispatch(requestIssue(issue_id));
    return fetch(`/api/issue/${issue_id}/`, { credentials: "same-origin" })
      .then(response => response.json())
      .then(json => {
        dispatch(receiveIssue(issue_id, json));
        // fetch all issues again, as the comment
        // count will have changed
        //dispatch(fetchIssues())
      });
  };
}

export function setCoordinates(latLng) {
  let action = {
    type: SET_COORDINATES,
    latLng: latLng
  };
  return action;
}

export function resetCoordinates() {
  return {
    type: SET_COORDINATES,
    latLng: null
  };
}

export function receiveComments(issue_id, json) {
  return {
    type: RECEIVE_COMMENTS,
    issue_id,
    payload: json
  };
}

export function loadComments(issue_id) {
  return (dispatch, getState) => {
    return fetch(`/api/issue/${issue_id}/comment/`)
      .then(response => response.json())
      .then(json => dispatch(receiveComments(issue_id, json)));
  };
}

export function postComment(issue_id, comment) {
  return (dispatch, getState) => {
    let url = `/api/issue/${issue_id}/comment/`;
    let data = {
      comment: comment.comment,
      attachments: comment.attachments || []
    };
    jsonPost(url, data).then(response => dispatch(invalidateIssue(issue_id)));
  };
}

// 2 actions to fetch and dipatch the current user information
export function receiveCurrentUserInformation(json) {
  return {
    type: FETCH_CURRENT_USER_DATA,
    payload: json
  };
}

export function loadCurrentUserInformation() {
  return (dispatch, getState) => {
    return jsonGet("/api/aboutme/")
      .then(response => response.json())
      .then(json => dispatch(receiveCurrentUserInformation(json)));
  };
}

export function receiveUserInformation(username, json) {
  return {
    type: RECEIVE_USER_INFORMATION,
    payload: json,
    username: username
  };
}

export function loadUserInformation(username) {
  return (dispatch, getState) => {
    // dispatch with empty information
    dispatch(receiveUserInformation(username, {}));
    // get the real information and get going
    return jsonGet(`/api/about/${encodeURI(username)}/`)
      .then(response => response.json())
      .then(json => dispatch(receiveUserInformation(username, json)));
  };
}

export function changeIssueStatus(issue_id, status) {
  return (dispatch, getState) => {
    let url = `/api/issue/${issue_id}/status/`;
    let data = { status: status };
    jsonPost(url, data).then(response => {
      return dispatch(fetchIssueIfNeeded(issue_id));
    });
  };
}

// these are currently not used
export function closeIssue(issue_id) {
  return changeIssueStatus(issue_id, "closed");
}

export function openIssue(issue_id) {
  return changeIssueStatus(issue_id, "open");
}

export function fetchOrganisations() {
  return (dispatch, getState) => {
    dispatch({
      type: FETCH_ORGANISATIONS
    });
    let url = "/api/organisations/";
    jsonGet(url)
      .then(response => response.json())
      .then(data => {
        dispatch({
          type: RECEIVE_ORGANISATIONS,
          payload: data
        });
      });
  };
}

export function fetchOrganisationDetails(id) {
  return (dispatch, getState) => {
    dispatch({
      type: FETCH_ORGANISATION_DETAILS
    });
    let url = `/api/organisations/${id}/`;
    jsonGet(url)
      .then(response => response.json())
      .then(data => {
        dispatch({
          type: RECEIVE_ORGANISATION_DETAILS,
          payload: data
        });
      });
  };
}

export function setIssueMapBounds(latLng) {
  return {
    type: SET_ISSUE_MAP_BOUNDS,
    payload: latLng
  };
}

export function setIssueDetailZoom(zoom) {
  return {
    type: SET_ISSUE_DETAIL_ZOOM_LEVEL,
    payload: zoom
  };
}

export function setOrgMapBounds(latLng) {
  return {
    type: SET_ORG_MAP_BOUNDS,
    payload: latLng
  };
}

export function setOrgDetailZoom(zoom) {
  return {
    type: SET_ORG_DETAIL_ZOOM_LEVEL,
    payload: zoom
  };
}

const setGeoLocation = pos => {
  return {
    type: SET_GEOLOCATION,
    payload: pos
  };
};

const clearGeoLocation = () => {
  return {
    type: SET_GEOLOCATION,
    payload: false
  };
};

export function geolocate() {
  return (dispatch, getState) => {
    if (navigator && "geolocation" in navigator) {
      navigator.geolocation.watchPosition(
        // on success
        position =>
          dispatch(
            setGeoLocation([
              position.coords.latitude,
              position.coords.longitude
            ])
          ),
        // on err
        err => dispatch(clearGeoLocation())
      );
    }
  };
}
