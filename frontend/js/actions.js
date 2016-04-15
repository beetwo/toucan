import fetch from 'isomorphic-fetch'

export const REQUEST_ISSUES = 'REQUEST_ISSUES'
export const RECEIVE_ISSUES = 'RECEIVE_ISSUES'

export const SELECT_ISSUE = 'SELECT_ISSUE'
export const REQUEST_ISSUE = 'REQUEST_ISSUE'
export const RECEIVE_ISSUE = 'RECEIVE_ISSUE'


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
      issue_id
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
        console.log(getState());
        dispatch(requestIssue(issue_id))
        return fetch(`/api/issue/${issue_id}/`)
            .then(response => response.json())
            .then(json => dispatch(receiveIssue(issue_id, json)))
    }
}
