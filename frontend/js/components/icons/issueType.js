export const default_icon = 'circle-o'

export const icon_mapping = {
  medical: 'plus-square',
  general: 'question'
}

function getIconClassForIssueType(issueType, prefix='') {
  let cls = default_icon;
  if (issueType && issueType.slug) {
    cls = icon_mapping[issueType.slug] || default_icon;
  }
  return prefix + cls;
}

export default getIconClassForIssueType;
