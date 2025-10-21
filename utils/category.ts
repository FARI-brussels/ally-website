export type { CategorySlug } from "~/types/components";

export const CATEGORY_SLUGS: CategorySlug[] = [
  "governance_values",
  "culture_skills",
  "communication_involvement",
  "methods_processes",
];

export function isCategorySlug(slug: unknown): slug is CategorySlug {
  return CATEGORY_SLUGS.includes(slug as CategorySlug);
}
