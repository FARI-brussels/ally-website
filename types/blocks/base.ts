import type {
  CategorySlug,
  ResourceIntensity,
  LocaleMap,
} from "~/types/shared";

export interface Block {
  id: number;
  title: LocaleMap;
  description?: LocaleMap;
  benefits?: LocaleMap;
  category: CategorySlug;
  cost: ResourceIntensity;
  effort: ResourceIntensity;
  time: ResourceIntensity;
  maintenance: ResourceIntensity;
  ranking: number;
  involvement: string;
}

export interface BlockWithMetadata extends Block {
  resourceIntensityScore: number;
}

export interface LocalizedBlock
  extends Omit<Block, "title" | "description" | "benefits"> {
  title: string;
  description?: string;
  benefits?: string;
}

export interface LocalizedBlockWithMetadata extends LocalizedBlock {
  resourceIntensityScore: number;
}
