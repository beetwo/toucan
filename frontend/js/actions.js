import fetch from 'isomorphic-fetch'
import getCookie from './utils';

export const REQUEST_ISSUES = 'REQUEST_ISSUES'
export const RECEIVE_ISSUES = 'RECEIVE_ISSUES'

export const SELECT_ISSUE = 'SELECT_ISSUE'
export const REQUEST_ISSUE = 'REQUEST_ISSUE'
export const RECEIVE_ISSUE = 'RECEIVE_ISSUE'

export const SET_COORDINATES = 'SET_COORDINATES'
export const RESET_COORDINATES = 'RESET_COORDINATES'

export const LOAD_COMMENTS = 'LOAD_COMMENTS'
export const POST_COMMENT = 'POST_COMMENT'
export const RECEIVE_COMMENTS = 'RECEIVE_COMMENTS'

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

export function fetchIssueIfNeeded(issue_id) {
    return (dispatch, getState) => {
        dispatch(selectIssue(issue_id))
        dispatch(requestIssue(issue_id))
        return fetch(`/api/issue/${issue_id}/`)
            .then(response => response.json())
            .then(json => dispatch(receiveIssue(issue_id, json)))
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
    fetch(`/api/issue/${issue_id}/comment/`,
        {
          method: 'post',
          credentials: 'same-origin',
          headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
            'X-CSRFToken': getCookie('csrftoken')
          },
          body: JSON.stringify({
            comment: comment.comment
          })
        }
      )
      .then(response => dispatch(loadComments(issue_id)))
    }
}
