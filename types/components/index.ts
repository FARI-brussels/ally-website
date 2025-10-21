import type { BannerProps } from "./Banner";
import type { HeroProps } from "./Hero";
import type { CardProps, GlassCardProps } from "./Card";
import type { ButtonProps } from "./Button";
import type { ChipProps } from "./Chip";
import type { SectionProps } from "./Section";
import type { OptionProps, OptionsList } from "./Dropdown";
import type { Route, Routes } from "./Routes";

export type {
  BannerProps,
  HeroProps,
  CardProps,
  GlassCardProps,
  ButtonProps,
  ChipProps,
  SectionProps,
  OptionProps,
  OptionsList,
  Route,
  Routes
};

// Shared types for reuse across the app
export interface Category {
  title?: { [locale: string]: string };
  description?: { [locale: string]: string };
  slug: string;
}

export interface BlockCategory {
  slug: string;
  title?: { [locale: string]: string };
}

export interface Block {
  id: number;
  title?: { [locale: string]: string };
  description?: { [locale: string]: string };
  category?: BlockCategory;
  cost?: string;
  effort?: string;
}

export interface PagesStore {
  home?: {
    title?: { [locale: string]: string };
    content?: import("../parsers/Page").HomePageContent[];
    hero?: {
      media?: string;
      title?: { [locale: string]: string };
      description?: { [locale: string]: string };
    };
  };
}

export type CategorySlug =
  | "governance_values"
  | "culture_skills"
  | "communication_involvement"
  | "methods_processes";
