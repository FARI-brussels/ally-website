export type Locale = "en" | "fr" | "nl";

export interface LocaleObject {
  label: string;
  value: Locale;
}

// A map of locale codes to strings, e.g. { en: '...', fr: '...', nl: '...' }
export type LocaleMap = Record<Locale, string>;

// A map of arbitrary keys (e.g. 'low', 'medium', 'high') to LocaleMap
export type LevelMap = Record<string, LocaleMap>;
