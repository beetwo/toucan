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
  REMOVE_ISSUES_FILTER,
  FETCH_CURRENT_USER_DATA
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
    case RECEIVE_ISSUE:
      // update the issues array with the properties from the issue details
      let index = state.findIndex((i)=> { return i.id === action.issue_id; })
      if (index != -1) {
        let issue =  {
          ...state[index],
          ...action.payload.properties
        }
        return [].concat(...state.slice(0, index), issue, ...state.slice(index+1));
      }
      else {
        return state;
      }
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


function allOrganisations(
  state=[],
  action
) {
  switch (action.type) {
    case RECEIVE_ISSUE:
      let org_slug = action.payload.properties.organisation.short_name;
      return uniq([...state, org_slug])
    case RECEIVE_ISSUES:
      let org_slugs = action.issues.features.map((i) => i.properties.organisation.short_name)
      return uniq([...state, ...org_slugs])
    default:
      return state

  }
}


function currentUser(
  state={
    user: null,
    notificationAreas: [],
    canComment: false
  },
  action
) {
  switch (action.type) {
    case FETCH_CURRENT_USER_DATA:
      return action.payload;
    default:
      return state;
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
  allUsers,
  allOrganisations,
  currentUser
}

export default reducers;
