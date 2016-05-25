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
      if (fp === 'type') {
        prop = i.issue_type.slug
      } else if (fp === 'organisation') {
        prop = i.organisation.name
      }

      if (filters[fp].indexOf(prop) === -1) {
        return false;
      }
    }
    return true;
  });
  return filtered_issues;
}

export default getFilteredIssues
