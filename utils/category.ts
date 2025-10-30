export type { CategorySlug } from "~/types/shared";

export const CATEGORY_SLUGS: CategorySlug[] = [
  "values-structures",
  "culture-skills",
  "communication-participation",
  "methods-processes",
];

export function isCategorySlug(slug: string) {
  return CATEGORY_SLUGS.includes(slug as CategorySlug);
}
