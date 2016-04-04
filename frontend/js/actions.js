import fetch from 'isomorphic-fetch'

export const REQUEST_ISSUES = 'REQUEST_ISSUES'
export const RECEIVE_ISSUES = 'RECEIVE_ISSUES'


export const REQUEST_ISSUE = 'REQUEST_ISSUE'
export const RECEIVE_ISSUE = 'REQUEST_ISSUE'
export const SELECT_ISSUE = 'SELECT_ISSUE'


export function requestIssues() {
    return {
        type: REQUEST_ISSUES
    }
}

export function receiveIssues(issues) {
    return {
        type: RECEIVE_POSTS,
        issues: issues,
        receivedAt: Date.now()
    }
}

export function fetchIssues() {
    return dispatch => {
        dispatch(requestIssues())
        return fetch('/api/')
            .then(function(response){ return response.json();})
            .then(json => dispatch(receiveIssues(json)))
    }
}


export function requestIssue(issue) {
    return {
        type: REQUEST_ISSUE,
        issue
    }
}

export function receiveIssue(issue) {
    return {
        type: RECEIVE_ISSUE,
        issue: issue
    }
}

export function fetchIssue(issue) {
    return dispatch => {
        dispatch(requestIssue(issue))
        return fetch(issue.properties.issue_url)
            .then(response => response.json())
            .then(json => dispatch(receiveIssue(json)))
    }
}