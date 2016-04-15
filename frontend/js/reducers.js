import { combineReducers } from 'redux';
import {REQUEST_ISSUES, RECEIVE_ISSUES, SELECT_ISSUE, REQUEST_ISSUE, RECEIVE_ISSUE } from './actions';

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
      return action.issue
    default:
      return state
  }
}

function issueDetail(state = {
  isLoading: true,
  didInvalidate: false,
  issue_data: {}
}, action) {
    console.log(action.type, state, action);
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


const reducers = {
  geojson,
  redux_issues: issues,
  selectedIssue,
  issueDetails
}

export default reducers;
