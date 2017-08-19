import { combineReducers } from "redux";
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
  FETCH_CURRENT_USER_DATA,
  RECEIVE_USER_INFORMATION,
  RECEIVE_ORGANISATIONS,
  SET_MAP_BOUNDS,
  SET_DETAIL_ZOOM_LEVEL
} from "./actions";

import { defaultMapBounds } from "./globals";
import uniq from "lodash/uniq";
import flattenDeep from "lodash/flattenDeep";
import geojsonExtent from "geojson-extent";

function issues(state = [], action) {
  switch (action.type) {
    case RECEIVE_ISSUES:
      return action.issues.features.map(issue => {
        return {
          id: issue.id,
          ...issue.properties,
          geometry: issue.geometry
        };
      });
    case RECEIVE_ISSUE:
      // update the issues array with the properties from the issue details
      let index = state.findIndex(i => {
        return i.id === action.issue_id;
      });
      if (index != -1) {
        let issue = {
          ...state[index],
          ...action.payload.properties,
          geometry: action.payload.geometry
        };
        return [...state.slice(0, index), issue, ...state.slice(index + 1)];
      } else {
        return state;
      }
    default:
      return state;
  }
}

function selectedIssue(state = null, action) {
  switch (action.type) {
    case SELECT_ISSUE:
      return action.issue_id;
    default:
      return state;
  }
}

function issueDetail(
  state = {
    isLoading: true,
    didInvalidate: false,
    issue_data: {}
  },
  action
) {
  switch (action.type) {
    case SELECT_ISSUE:
      return {
        ...state,
        isLoading: true,
        didInvalidate: false
      };
    case REQUEST_ISSUE:
      return {
        ...state,
        isLoading: true,
        didInvalidate: false
      };
    case RECEIVE_ISSUE:
      return {
        ...state,
        isLoading: false,
        didInvalidate: false,
        issue_data: action.payload
      };
    case INVALIDATE_ISSUE:
      return {
        ...state,
        didInvalidate: true
      };
    default:
      return state;
  }
}

function issueDetails(state = {}, action) {
  switch (action.type) {
    case SELECT_ISSUE:
    case REQUEST_ISSUE:
    case RECEIVE_ISSUE:
    case INVALIDATE_ISSUE:
      return {
        ...state,
        [action.issue_id]: issueDetail(state[action.issue_id], action)
      };
    default:
      return state;
  }
}

function geojson(state = { features: [] }, action) {
  switch (action.type) {
    case RECEIVE_ISSUES:
      return action.issues;
    default:
      return state;
  }
}

function coordinates(state = null, action) {
  switch (action.type) {
    case SET_COORDINATES:
      return action.latLng;
    default:
      return state;
  }
}

function issueComments(
  state = {
    isLoading: true,
    comments: []
  },
  action
) {
  switch (action.type) {
    case RECEIVE_ISSUE:
      return {
        isLoading: false,
        comments: action.payload.properties.comments || []
      };
    default:
      return state;
  }
}

function commentsByIssueID(state = {}, action) {
  switch (action.type) {
    case RECEIVE_ISSUE:
      return {
        ...state,
        [action.issue_id]: issueComments(state[action.issue_id], action)
      };
    default:
      return state;
  }
}

function statusChangesByIssueID(state = {}, action) {
  switch (action.type) {
    case RECEIVE_ISSUE:
      return {
        ...state,
        [action.issue_id]: action.payload.properties.status_changes
      };
    default:
      return state;
  }
}

function usersByIssueID(state = {}, action) {
  switch (action.type) {
    case RECEIVE_ISSUE:
      return {
        ...state,
        [action.issue_id]: action.payload.properties.users
      };
    default:
      return state;
  }
}

function issueFiltersOptions(state = {}, action) {
  switch (action.type) {
    case RECEIVE_ISSUES:
      let issues_with_orgs = action.issues.features.filter(i => {
        return i.properties.organisation !== null;
      });
      let org_names = uniq(
        issues_with_orgs.map(i => i.properties.organisation.name)
      );
      return {
        ...state,
        status: uniq(action.issues.features.map(i => i.properties.status)),
        type: uniq(
          flattenDeep(
            action.issues.features.map(i =>
              i.properties.issue_types.map(issue_type => issue_type.slug)
            )
          )
        ),
        organisation: org_names
      };
    default:
      return state;
  }
}

function issueFiltersSelections(state, action) {
  let { property, value } = action.filter;
  let cs = [...state[property]];
  let s = {
    ...state
  };
  switch (action.type) {
    case ADD_ISSUES_FILTER:
      if (cs.indexOf(value) === -1) {
        cs.push(value);
      }
      s[property] = cs;
      return s;
    case REMOVE_ISSUES_FILTER:
      s[property] = cs.filter(x => x != value);
      return s;
    default:
      return state;
  }
}

function issueFilters(
  state = {
    options: {
      status: [],
      type: [],
      organisation: []
    },
    selections: {
      status: ["open"],
      type: [],
      organisation: []
    }
  },
  action
) {
  switch (action.type) {
    case RECEIVE_ISSUES:
      return {
        ...state,
        options: issueFiltersOptions(state.options, action)
      };
    case ADD_ISSUES_FILTER:
    case REMOVE_ISSUES_FILTER:
      return {
        ...state,
        selections: issueFiltersSelections(state.selections, action)
      };
    default:
      return state;
  }
}

function allUsers(state = [], action) {
  switch (action.type) {
    case RECEIVE_ISSUE:
      let users = new Set(
        action.payload.properties.users.map(u => u.username) || []
      );
      state.forEach(u => users.add(u));
      return Array.from(users.values());
    default:
      return state;
  }
}

function allOrganisations(state = [], action) {
  switch (action.type) {
    case RECEIVE_ISSUE:
      if (action.payload.properties.organisation !== null) {
        let org_slug = action.payload.properties.organisation.short_name;
        return uniq([...state, org_slug]);
      }
      return state;
    case RECEIVE_ISSUES:
      let issues_with_orgs = action.issues.features.filter(
        i => i.properties.organisation !== null
      );
      let org_slugs = issues_with_orgs.map(
        i => i.properties.organisation.short_name
      );
      return uniq([...state, ...org_slugs]);
    default:
      return state;
  }
}

function currentUser(
  state = {
    user: {},
    notificationAreas: [],
    canComment: false,
    bbox: defaultMapBounds
  },
  action
) {
  switch (action.type) {
    case FETCH_CURRENT_USER_DATA:
      return {
        ...state,
        ...action.payload
      };
    default:
      return state;
  }
}

function userInformationByUsername(state = {}, action) {
  switch (action.type) {
    case RECEIVE_USER_INFORMATION:
      let key = action.username;
      return {
        ...state,
        [key]: action.payload
      };
    default:
      return state;
  }
}

function loadingStatus(
  state = {
    issues: false
  },
  action
) {
  switch (action.type) {
    case REQUEST_ISSUES:
      return {
        ...state,
        issues: true
      };
    case RECEIVE_ISSUES:
      return {
        ...state,
        issues: false
      };
    default:
      return state;
  }
}

function organisationsByID(state = {}, action) {
  switch (action.type) {
    case RECEIVE_ORGANISATIONS:
      let new_state = {};
      action.payload.forEach(org => {
        new_state[parseInt(org.pk, 10)] = org;
      });
      return new_state;
    default:
      return state;
  }
}

const initial_bounds = (state = defaultMapBounds, action) => {
  switch (action.type) {
    case RECEIVE_ISSUES:
      // geojsonExtent somehow alters the geojson object, so copy before use
      let extents = geojsonExtent(Object.assign({}, action.issues));
      let point1 = extents.slice(0, 2).reverse();
      let point2 = extents.slice(2, 4).reverse();
      if (point1[0] === point2[0] && point1[1] === point2[1]) {
        // zoom out if point1 and point2 are equal
        const x = 0.01;
        return [
          [point1[0] - x, point1[1] - x],
          [point2[0] + x, [point2[1] + x]]
        ];
      }
      return [point1, point2];
    default:
      return state;
  }
};

function map(state = { detail: 13, list: false }, action) {
  switch (action.type) {
    case SET_MAP_BOUNDS:
      return {
        ...state,
        list: action.payload
      };
    case SET_DETAIL_ZOOM_LEVEL:
      return {
        ...state,
        detail: action.payload
      };
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
  currentUser,
  userInformationByUsername,
  loadingStatus,
  organisationsByID,
  initial_bounds,
  map
};

export default reducers;
