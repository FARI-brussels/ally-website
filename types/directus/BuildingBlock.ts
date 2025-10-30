import type { DirectusContentBlock } from "./Content";
import type { ResourceIntensity, Locale } from "~/types/shared";
export interface DirectusTranslation {
  id: number;
  ally_building_block_id: number;
  languages_code: Locale;
  title: string;
  description: string;
  benefits?: string;
  how_to_execute?: string;
  kpis?: string;
  content: {
    time: number;
    blocks: DirectusContentBlock[];
    version: string;
  };
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
    long_description?: string;
  }>;
}

//import building block here and extend it with

export interface DirectusBuildingBlock {
  id: number;
  status: string;
  sort: number | null;
  cost: ResourceIntensity;
  maintenance: ResourceIntensity;
  time: ResourceIntensity;
  effort: ResourceIntensity;
  involvement: string;
  ranking: number;
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
