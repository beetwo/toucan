import { combineReducers } from 'redux';
import {REQUEST_ISSUES, RECEIVE_ISSUES} from './actions';

function issues(state=[], action) {
  return state;
}

function selectedIssue(state=null, action) {
  return state;
}

const issueTrackerApp = combineReducers({
  redux_issues: issues,
  selectedIssue
})

export default issueTrackerApp;
