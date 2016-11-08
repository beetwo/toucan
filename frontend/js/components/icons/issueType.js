export const default_icon = 'circle-o'

export const icon_mapping = {
  general: 'question',
  medical: 'medkit',
  legaladvice: 'legal',
  supplies: 'cubes',
  fooditem: 'cutlery',
  nonfooditem: 'support',
  accommodation: 'building-o',
}

function getIconClassForIssueType(issueType, prefix='') {
  let cls = default_icon;
  if (issueType && issueType.slug) {
    cls = icon_mapping[issueType.slug] || default_icon;
  }
  return prefix + cls;
}

export default getIconClassForIssueType;
