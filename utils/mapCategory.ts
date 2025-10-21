export const categoryMappings = {
  culture_skills: "culture-skills",
  governance_values: "values-structures",
  methods_processes: "methods-processes",
  communication_involvement: "communication-participation",
} as const;

export const mapCategory = (
  slug: keyof typeof categoryMappings,
): (typeof categoryMappings)[keyof typeof categoryMappings] => {
  return categoryMappings[slug];
};
