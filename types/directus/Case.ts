import type { DirectusBuildingBlock } from "./BuildingBlock";

export interface Case {
  id: number;
  title: Record<string, string>;
  description: Record<string, string>;
  content?: Record<string, string>;
  building_blocks_used?: DirectusBuildingBlock;
  alternative_cases?: Case[];
}

export type Cases = Case[];
