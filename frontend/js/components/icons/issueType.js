export const default_icon = "circle-o";

export const un_ocha_icon_mapping = {
  "core-relief-item": "core-relief-items", // FIXME
  shelter: null, // FIXME!
  health: "health",
  nutrition: "nutrition",
  "sanitation-water-hygiene": "water-hygiene", // FIXME
  logistics: "logistics",
  protection: "protection",
  "legal-advice": "legal-advice",
  education: "education",
  "camp-management": "camp-management"
};

function getIconClassForIssueType(issueType, prefix = "") {
  let cls = default_icon;
  switch (typeof issueType) {
    case "string":
      cls = un_ocha_icon_mapping[issueType] || default_icon;
      break;
    case "object":
      if (issueType.slug) {
        let key = issueType.slug;
        cls =
          un_ocha_icon_mapping[key] ||
          icon_mapping[key.toLowerCase()] ||
          default_icon;
        break;
      }
    default:
      cls = default_icon;
  }
  return prefix + cls;
}

export default getIconClassForIssueType;
