import type { Locale } from "../Locale.ts";
import type { PositiveInteger } from "../Utility.js";
import type { ExternalLink } from "~/types/directus/BuildingBlock";

type BlockValue = "low" | "medium" | "high";

export interface ParsedBuildingBlock {
  id: number;
  cost: BlockValue;
  effort: BlockValue;
  time: BlockValue;
  maintenance: BlockValue;
  involvement: string;
  ranking: PositiveInteger<number>;
  category: string;
  alternative_building_blocks: ParsedBuildingBlock[];
  external_links: ExternalLink[];
}

interface Action {
  url: string;
  label: {
    [locale in Locale]: string;
  };
}

export interface Section {
  title: {
    [locale in Locale]: string;
  };
  description: {
    [locale in Locale]: string;
  };
  action?: Action;
}

export interface Page {
  slug: string;
  title: {
    [locale in Locale]: string;
  };
  sections: Section[];
}

// --- Added for home/index page types ---
export interface HomePageContent {
  [locale: string]: string;
}
export interface HomePageHero {
  media?: string;
  title?: { [locale: string]: string };
  description?: { [locale: string]: string };
}
export interface HomePage {
  title?: { [locale: string]: string };
  content?: HomePageContent[];
  hero?: HomePageHero;
}
