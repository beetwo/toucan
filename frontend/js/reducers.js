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
  RESET_ISSUES_FILTER,
  FETCH_CURRENT_USER_DATA,
  RECEIVE_USER_INFORMATION,
  RECEIVE_ORGANISATIONS,
  RECEIVE_ORGANISATION_DETAILS,
  SET_ISSUE_MAP_BOUNDS,
  SET_ISSUE_DETAIL_ZOOM_LEVEL,
  SET_ORG_MAP_BOUNDS,
  SET_ORG_DETAIL_ZOOM_LEVEL,
  SET_GEOLOCATION
} from "./actions";

import { defaultMapBounds } from "./globals";
import uniq from "lodash/uniq";
import isEqual from "lodash/isEqual";
import flattenDeep from "lodash/flattenDeep";
import { getBoundsFromPoints } from "./components/map/utils";

function issues(state = [], action) {
  switch (action.type) {
    case RECEIVE_ISSUES:
      return action.issues.map(issue => {
        return {
          ...issue,
          position: [...issue.location.coordinates].reverse()
        };
      });
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
    didInvalidate: false
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
        ...action.payload,
        position: [...action.payload.location.coordinates].reverse()
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
        comments: action.payload.comments || []
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
        [action.issue_id]: action.payload.status_changes
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
        [action.issue_id]: action.payload.users
      };
    default:
      return state;
  }
}

function issueFiltersOptions(state = [], action) {
  switch (action.type) {
    case RECEIVE_ISSUES:
      let organisations = {};
      let issueTypes = {};
      let issueStatus = {};

      action.issues.forEach(issue => {
        let { organisation, issue_types, status } = issue;
        if (organisation) {
          organisations[organisation.id] = {
            name: organisation.name,
            value: organisation.id
          };
        }
        if (status) {
          issueStatus[status] = {
            name: status,
            value: status
          };
        }
        if (issue_types) {
          issue_types.forEach(it => {
            issueTypes[it.slug] = {
              name: it.name,
              value: it.slug
            };
          });
        }
      });
      const sortByName = (a, b) => a.name.localeCompare(b.name);
      return [
        {
          name: "Status",
          key: "status",
          options: Object.values(issueStatus).sort(sortByName)
        },
        {
          name: "Type",
          key: "type",
          options: Object.values(issueTypes).sort(sortByName)
        },
        {
          name: "Organisation",
          key: "organisation",
          options: Object.values(organisations).sort(sortByName)
        }
      ];
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

const defaultFilterSelection = {
  status: ["open", "in progress"],
  type: [],
  organisation: []
};

function issueFilters(
  state = {
    options: {
      status: [],
      type: [],
      organisation: []
    },
    selections: defaultFilterSelection,
    isDefault: true
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
      let selections = issueFiltersSelections(state.selections, action);
      let isDefault = isEqual(defaultFilterSelection, selections);
      const selectedFiltersCount = Object.values(selections).reduce(
        (pc, selection) => pc + selection.length,
        0
      );
      return {
        ...state,
        selections,
        isDefault,
        selectedFiltersCount
      };
    case RESET_ISSUES_FILTER:
      return {
        ...state,
        selections: defaultFilterSelection,
        isDefault: true,
        selectedFiltersCount: 2
      };
    default:
      return state;
  }
}

function allUsers(state = [], action) {
  switch (action.type) {
    case RECEIVE_ISSUE:
      let users = new Set(action.payload.users.map(u => u.username) || []);
      state.forEach(u => users.add(u));
      return Array.from(users.values());
    default:
      return state;
  }
}

function allOrganisations(state = [], action) {
  switch (action.type) {
    case RECEIVE_ISSUE:
      if (action.payload.organisation !== null) {
        let org_slug = action.payload.organisation.short_name;
        return uniq([...state, org_slug]);
      }
      return state;
    case RECEIVE_ISSUES:
      let issues_with_orgs = action.issues.filter(i => i.organisation !== null);
      let org_slugs = issues_with_orgs.map(i => i.organisation.short_name);
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
        let id = parseInt(org.id, 10);
        new_state[id] = org;
      });
      return new_state;
    case RECEIVE_ORGANISATION_DETAILS:
      let id = parseInt(action.payload.id, 10);
      return {
        ...state,
        [id]: {
          ...state[id],
          ...action.payload,
          details_loaded: true
        }
      };
    default:
      return state;
  }
}

function map(
  state = {
    issue_detail: 13,
    org_detail: 13,
    issue_list: defaultMapBounds,
    org_list: defaultMapBounds,
    geolocation: false
  },
  action
) {
  switch (action.type) {
    case RECEIVE_ISSUES:
      // only set bounds for the intial loading of issues
      if (state.issue_list === defaultMapBounds) {
        let locations = action.issues.map(i =>
          [...i.location.coordinates].reverse()
        );
        state = {
          ...state,
          issue_list: getBoundsFromPoints(locations)
        };
      }
      return state;
    case SET_ISSUE_MAP_BOUNDS:
      return {
        ...state,
        issue_list: action.payload
      };
    case SET_ISSUE_DETAIL_ZOOM_LEVEL:
      return {
        ...state,
        issue_detail: action.payload
      };
    case SET_ORG_MAP_BOUNDS:
      return {
        ...state,
        org_list: action.payload
      };
    case SET_ORG_DETAIL_ZOOM_LEVEL:
      return {
        ...state,
        org_detail: action.payload
      };
    case RECEIVE_ORGANISATIONS:
      if (state.org_list === defaultMapBounds) {
        let location_coordinates = action.payload.reduce(
          (coords, organisation) => {
            let location_coords = organisation.locations.map(l =>
              [...l.location.coordinates].reverse()
            );
            return coords.concat(location_coords);
          },
          []
        );
        return {
          ...state,
          org_list: getBoundsFromPoints(location_coordinates)
        };
      } else {
        return state;
      }
    case SET_GEOLOCATION:
      return {
        ...state,
        geolocation: action.payload
      };
    default:
      return state;
  }
}

const reducers = {
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
  map
};

export default reducers;
