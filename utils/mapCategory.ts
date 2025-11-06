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

// reverse mapping dashed -> underscored
export const reverseCategoryMappings = Object.fromEntries(
  Object.entries(categoryMappings).map(([k, v]) => [v, k]),
) as Record<
  (typeof categoryMappings)[keyof typeof categoryMappings],
  keyof typeof categoryMappings
>;

export const unmapCategory = (
  dashed: (typeof categoryMappings)[keyof typeof categoryMappings],
): keyof typeof categoryMappings => {
  return reverseCategoryMappings[dashed];
};

export type DashedCategory =
  (typeof categoryMappings)[keyof typeof categoryMappings];

export function normalizeCategorySlug(
  slug: string,
): DashedCategory | undefined {
  if ((slug as keyof typeof categoryMappings) in categoryMappings) {
    return mapCategory(slug as keyof typeof categoryMappings);
  }
  if ((slug as DashedCategory) in reverseCategoryMappings) {
    return slug as DashedCategory;
  }
  return undefined;
}
