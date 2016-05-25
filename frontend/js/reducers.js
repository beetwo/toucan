import { combineReducers } from 'redux';
import {
  REQUEST_ISSUES,
  RECEIVE_ISSUES,
  SELECT_ISSUE,
  REQUEST_ISSUE,
  RECEIVE_ISSUE,
  INVALIDATE_ISSUE,
  SET_COORDINATES,
  LOAD_COMMENTS,
  POST_COMMENT,
  RECEIVE_COMMENTS,
  ADD_ISSUES_FILTER,
  REMOVE_ISSUES_FILTER
 } from './actions';

import uniq from 'lodash/uniq'

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
      case INVALIDATE_ISSUE:
        return {
          ...state,
          didInvalidate: true
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
    case INVALIDATE_ISSUE:
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
    case RECEIVE_ISSUE:
      return {
        isLoading: false,
        comments: action.payload.properties.comments || []
      }
    default:
      return state

  }
}

function commentsByIssueID(state={}, action) {
  switch (action.type) {
    case RECEIVE_ISSUE:
      return {
        ...state,
        [action.issue_id]: issueComments(
          state[action.issue_id],
          action
        )
      }
    default:
      return state
  }
}

function statusChangesByIssueID(state={}, action) {
  switch (action.type) {
    case RECEIVE_ISSUE:
      return {
        ...state,
        [action.issue_id]: action.payload.properties.status_changes
      }
    default:
      return state

  }
}


function usersByIssueID(state={}, action) {
  switch (action.type) {
    case RECEIVE_ISSUE:
        return {
          ...state,
          [action.issue_id]: action.payload.properties.users
        }
    default:
      return state

  }
}


function issueFiltersOptions(state={}, action) {
  switch (action.type) {
    case RECEIVE_ISSUES:
      return {
          ...state,
          status: uniq(action.issues.features.map((i) => i.properties.status)),
          type: uniq(action.issues.features.map((i) =>  i.properties.issue_type.slug)),
          organisation: uniq(action.issues.features.map((i) => i.properties.organisation.name))
      }
    default:
      return state
  }
}

function issueFiltersSelections(state, action) {
  let {property, value} = action.filter;
  let cs = [...state[property]];
  let s = {
    ...state
  };
  switch (action.type) {
    case ADD_ISSUES_FILTER:
        if (cs.indexOf(value) === -1) {
          cs.push(value)
        }
        s[property] = cs
        return s
    case REMOVE_ISSUES_FILTER:
        s[property] = cs.filter((x) => x != value)
        return s
    default:
      return state
  }
}

function issueFilters(state={
    options: {
      status: [],
      type: [],
      organisation: []
    },
    selections: {
      status: ['open'],
      type: [],
      organisation: []
    }
  }, action) {
  switch (action.type) {
    case RECEIVE_ISSUES:
      return {
        ...state,
        options: issueFiltersOptions(state.options, action)
      }
    case ADD_ISSUES_FILTER:
    case REMOVE_ISSUES_FILTER:
      return {
        ...state,
        selections: issueFiltersSelections(state.selections, action)
      }
    default:
      return state
  }
}

function allUsers(
  state = [],
  action
) {
  switch (action.type) {
    case RECEIVE_ISSUE:
      let users = new Set(action.payload.properties.users.map((u) => u.username) || []);
      state.forEach((u) => users.add(u));
      return Array.from(users.values())
    default:
      return state
  }
}


const reducers = {
  geojson,
  redux_issues: issues,
  issueFilters,
  selectedIssue,
  issueDetails,
  coordinates,
  commentsByIssueID,
  statusChangesByIssueID,
  usersByIssueID,
  allUsers
}

export default reducers;
