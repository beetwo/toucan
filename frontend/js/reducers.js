import { combineReducers } from 'redux';
import {REQUEST_ISSUES, RECEIVE_ISSUES, SELECT_ISSUE} from './actions';

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
}

export default reducers;
