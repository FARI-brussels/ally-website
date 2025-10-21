import type { DirectusContentBlock } from "./Content";
import type { Locale } from "../Locale";

export interface DirectusTranslation {
  id: number;
  ally_building_block_id: number;
  languages_code: Locale;
  title: string;
  description: string;
  content: {
    time: number;
    blocks: DirectusContentBlock[];
    version: string;
  };
}

type BuildingBlockCategory = "governance_values" | "culture_skills";

export interface BuildingBlockCategoryItem {
  slug: BuildingBlockCategory;
}

export interface ExternalLink {
  url: string;
  slug: string;
  title: {
    [locale in Locale]: string;
  };
  description: {
    [locale in Locale]: string;
  };
}

export interface DirectusExternalLink {
  slug: string;
  url: string;
  translations: Array<{
    id: number;
    ally_external_link_slug: string;
    languages_code: string;
    title: string;
    description: string;
  }>;
}

export interface DirectusBuildingBlock {
  id: number;
  status: string;
  sort: number | null;
  cost: string;
  effort: string;
  involvement: string;
  maintentance: "low" | "medium" | "high";
  time: "low" | "medium" | "high";
  maximum_hours_required: number;
  minimum_hours_required: number;
  alternative_building_blocks: DirectusBuildingBlock[];
  external_links: DirectusExternalLink[];
  category: {
    slug: string;
    translations: number[];
  };
  translations: DirectusTranslation[];
}
