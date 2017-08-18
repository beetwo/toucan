import React from "react";
export const default_icon = "fa fa-circle-o";

export const un_ocha_icon_mapping = {
  "core-relief-item": "core-relief-item",
  shelter: "shelter",
  health: "health",
  nutrition: "nutrition",
  "sanitation-water-hygiene": "sanitation-water-hygiene",
  logistics: "logistics",
  protection: "protection",
  "legal-advice": "legal-advice",
  education: "education",
  "camp-management": "camp-management"
};

export function getIconClassForIssueType(issueType, prefix = "icon-") {
  let cls;
  switch (typeof issueType) {
    case "string":
      cls = un_ocha_icon_mapping[issueType];
      break;
    case "object":
      if (issueType.slug) {
        let key = issueType.slug;
        cls =
          un_ocha_icon_mapping[key] || un_ocha_icon_mapping[key.toLowerCase()];
        break;
      }
  }
  if (cls) {
    return `${prefix}${cls}`;
  } else {
    return default_icon;
  }
}

const ToucanIcon = ({ issue_type, className = "" }) => {
  return (
    <span
      className={`${getIconClassForIssueType(
        issue_type,
        " icon icon-"
      )} ${className}`}
      title={issue_type.name}
    />
  );
};

export default ToucanIcon;
