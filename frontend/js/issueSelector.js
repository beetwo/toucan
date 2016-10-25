import intersection from 'lodash/intersection'

const getFilteredIssues = function(issues, filters){
  let active_filters = {};

  // filter out any keys from filters that have an empty array
  // and thus do not take part in filtering
  for (let fp in filters) {
      if (filters[fp].length > 0) {
        active_filters[fp] = filters[fp]
      }
  }

  let filtered_issues = issues.filter((i) => {
    for (let fp in active_filters) {
      let prop = i[fp];
      let filter_values = filters[fp];

      if (fp === 'type') {
        prop = i.issue_types.map((it) => it.slug);
        return intersection(filter_values, prop).length;
      } else if (fp === 'organisation') {
        prop = i.organisation.name;
      }
      if (filter_values.indexOf(prop) === -1) {
        return false;
      }
    }
    return true;
  });
  return filtered_issues;
}

export default getFilteredIssues
