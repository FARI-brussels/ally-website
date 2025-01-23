import type { Locale } from "../Locale";
export interface CardProps {
  title?: string;
  description?: string;
  categories?: string[];
  url?: string | number;
  color?: "primary" | "secondary";
  image?: string;
  locale?: Locale;
  slug?: string;
}

export interface GlassCardProps {
  title?: string;
  description?: string;
  categories?: { label: string; value: string }[];
  url?: string;
}

export interface RequirementCardProps {
  locale: Locale;
  time: string;
  cost: string;
  effort: string;
  involvement: string;
  maintenance: string;
}
