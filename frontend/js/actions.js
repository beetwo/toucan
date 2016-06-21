import fetch from 'isomorphic-fetch'
import getCookie, { jsonPost } from './utils';

export const REQUEST_ISSUES = 'REQUEST_ISSUES'
export const RECEIVE_ISSUES = 'RECEIVE_ISSUES'

export const SELECT_ISSUE = 'SELECT_ISSUE'
export const REQUEST_ISSUE = 'REQUEST_ISSUE'
export const RECEIVE_ISSUE = 'RECEIVE_ISSUE'
export const INVALIDATE_ISSUE = 'INVALIDATE_ISSUE'

export const SET_COORDINATES = 'SET_COORDINATES'
export const RESET_COORDINATES = 'RESET_COORDINATES'

export const LOAD_COMMENTS = 'LOAD_COMMENTS'
export const POST_COMMENT = 'POST_COMMENT'
export const RECEIVE_COMMENTS = 'RECEIVE_COMMENTS'

export const CHANGE_ISSUE_STATUS = 'CHANGE_ISSUE_STATUS'

export const ADD_ISSUES_FILTER = 'ADD_ISSUES_FILTER'
export const REMOVE_ISSUES_FILTER = 'REMOVE_ISSUES_FILTER'

export function requestIssues() {
  return {
    type: REQUEST_ISSUES
  }
}

export function receiveIssues(issues) {
    return {
        type: RECEIVE_ISSUES,
        issues: issues,
        receivedAt: Date.now()
    }
}

export function fetchIssues() {
    return dispatch => {
        dispatch(requestIssues())
        return fetch('/api/')
            .then(response => response.json())
            .then(json => dispatch(receiveIssues(json)))
    }
}

export function addIssueFilter(property, value) {
  return {
    type: ADD_ISSUES_FILTER,
    filter: {
      'property': property,
      'value': value
    }
  }
}

export function removeIssueFilter(property, value) {
  return {
    type: REMOVE_ISSUES_FILTER,
    filter: {
      'property': property,
      'value': value
    }
  }
}

export function selectIssue(issue_id) {
    return {
      type: SELECT_ISSUE,
      issue_id: parseInt(issue_id, 10)
    }
}

export function requestIssue(issue_id) {
    return {
        type: REQUEST_ISSUE,
        issue_id
    }
}

export function receiveIssue(issue_id, json) {
    return {
        type: RECEIVE_ISSUE,
        issue_id,
        payload: json
    }
}

export function invalidateIssue(issue_id) {
    return {
        type: INVALIDATE_ISSUE,
        issue_id
    }
}

export function fetchIssueIfNeeded(issue_id) {
    return (dispatch, getState) => {
        dispatch(selectIssue(issue_id))
        dispatch(requestIssue(issue_id))
        return fetch(`/api/issue/${issue_id}/`)
            .then(response => response.json())
            .then(json => {
              dispatch(receiveIssue(issue_id, json))
              // fetch all issues again, as the comment
              // count will have changed
              //dispatch(fetchIssues())
            })
    }
}

export function setCoordinates(latLng) {
  let action = {
    type: SET_COORDINATES,
    latLng: latLng
  };
  return action
}

export function resetCoordinates() {
  return {
    type: SET_COORDINATES,
    latLng: null
  }
}

export function receiveComments(issue_id, json) {
  return {
    type: RECEIVE_COMMENTS,
    issue_id,
    payload: json
  }
}

export function loadComments(issue_id) {
  return (dispatch, getState) => {
    return fetch(`/api/issue/${issue_id}/comment/`)
      .then(response => response.json())
      .then(json => dispatch(receiveComments(issue_id, json)))
  }
}

export function postComment(issue_id, comment) {
  return (dispatch, getState) => {
    let url = `/api/issue/${issue_id}/comment/`
    let data = {
      draft_struct: comment.draft_struct,
      open: comment.open,
      close: comment.closed
    }
    jsonPost(url, data)
      .then(
        response => dispatch(invalidateIssue(issue_id))
      )
  }
}

export function changeIssueStatus(issue_id, status) {
  return (dispatch, getState) => {
    let url = `/api/issue/${issue_id}/status/`
    let data = {status: status};
    jsonPost(url, data).then((response) => {
      return dispatch(fetchIssueIfNeeded(issue_id));
    })
  }
}

export function closeIssue(issue_id) {
  return changeIssueStatus(issue_id, 'closed')
}

export function openIssue(issue_id) {
  return changeIssueStatus(issue_id, 'open');
}
