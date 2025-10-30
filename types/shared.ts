export type Locale = "en" | "fr" | "nl";

export interface LocaleObject {
  label: string;
  value: Locale;
}

export type LocaleMap = Record<Locale, string>;

export type LevelMap = Record<string, LocaleMap>;

// Resource and Category types
export type ResourceIntensity = "low" | "medium" | "high";

export type CategorySlug =
  | "values-structures"
  | "culture-skills"
  | "communication-participation"
  | "methods-processes";

export type CategoryName =
  | "Values & Structures"
  | "Culture & Skills"
  | "Communication & Participation"
  | "Processes & Methods";
