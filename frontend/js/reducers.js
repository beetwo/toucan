import { combineReducers } from 'redux';
import {REQUEST_ISSUES, RECEIVE_ISSUES, SELECT_ISSUE} from './actions';

function issues(state=[], action) {
  switch (action.type) {
    case RECEIVE_ISSUES:
      return action.issues
    default:
      return state
  }
}

function selectedIssue(state=null, action) {
  console.log(arguments);
  switch(action.type) {
    case SELECT_ISSUE:
      return action.issue_id
    default:
      return state
  }
}

const issueTrackerApp = combineReducers({
  redux_issues: issues,
  selectedIssue
})

export default issueTrackerApp;
