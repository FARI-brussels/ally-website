import type { DirectusBuildingBlock } from "./BuildingBlock";


export interface CaseTranslation {
  id: number;
  ally_case_id: number;
  languages_code: string;
  title: string;
  description: string;
  content: string;
}

export interface BuildingBlockUsed {
  id: DirectusBuildingBlock; // The full building block object
  category: string; // The category slug
  translations?: unknown[];
}

export interface Case {
  id: number;
  title: Record<string, string>; // { en: "...", nl: "..." }
  description: Record<string, string>;
  content: Record<string, string>;
  image: string | null;
  building_blocks_used: BuildingBlockUsed[];
  alternative_cases: Case[];
}

// Raw Directus types
export interface DirectusCase {
  id: number;
  status: string;
  image: string | null;
  blocks_used?: Array<{
    id: number;
    ally_case_id: number;
    ally_building_block_id: number | unknown; // Can be ID or full object
  }>;
  translations: CaseTranslation[];
  alternative_cases?: unknown[];
  external_links?: unknown[];
}

export type Cases = Case[]
