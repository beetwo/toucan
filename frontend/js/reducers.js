import { combineReducers } from 'redux';
import {
  REQUEST_ISSUES,
  RECEIVE_ISSUES,
  SELECT_ISSUE,
  REQUEST_ISSUE,
  RECEIVE_ISSUE,
  SET_COORDINATES,
  LOAD_COMMENTS,
  POST_COMMENT,
  RECEIVE_COMMENTS
 } from './actions';

function issues(state=[], action) {
  switch (action.type) {
    case RECEIVE_ISSUES:
      return action.issues.features.map((issue) => {
        return {
          id: issue.id,
          ...issue.properties
        }
      })
    default:
      return state
  }
}

function selectedIssue(state=null, action) {
  switch(action.type) {
    case SELECT_ISSUE:
      return action.issue_id
    default:
      return state
  }
}

function issueDetail(state = {
  isLoading: true,
  didInvalidate: false,
  issue_data: {}
}, action) {
    switch(action.type) {
      case SELECT_ISSUE:
        return {
          ...state,
          isLoading: true,
          didInvalidate: false
        }
      case REQUEST_ISSUE:
        return {
          ...state,
          isLoading: true,
          didInvalidate: false
        }
      case RECEIVE_ISSUE:
        return {
          ...state,
          isLoading: false,
          didInvalidate: false,
          issue_data: action.payload
        }
      default:
        return state
    }
  }

function issueDetails(state={}, action) {
  switch(action.type) {
    case SELECT_ISSUE:
    case REQUEST_ISSUE:
    case RECEIVE_ISSUE:
      return {
        ...state,
        [action.issue_id]: issueDetail(state[action.issue_id], action)
      }
    default:
      return state
  }
}

function geojson(state={}, action) {
  switch(action.type){
    case RECEIVE_ISSUES:
      return action.issues
    default:
      return state
  }
}

function coordinates(state=null, action) {
  switch (action.type) {
    case SET_COORDINATES:
      return action.latLng
    default:
      return state
  }
}

function issueComments(state={
  isLoading: true,
  comments: []
}, action) {
  switch (action.type) {
    case LOAD_COMMENTS:
      return {
        isLoading: true,
        comments: []
      }
    case RECEIVE_COMMENTS:
      return {
        isLoading: false,
        comments: action.payload
      }
    default:
      return state

  }
}

function commentsByIssueID(state={}, action) {
  switch (action.type) {
    case LOAD_COMMENTS:
    case RECEIVE_COMMENTS:
    case POST_COMMENT:
      return {
        ...state,
        [action.issue_id]: issueComments(state[action.issue_id], action)
      }
    default:
      return state

  }
}


const reducers = {
  geojson,
  redux_issues: issues,
  selectedIssue,
  issueDetails,
  coordinates,
  commentsByIssueID
}

export default reducers;
