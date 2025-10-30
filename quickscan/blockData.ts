import { normalizeCategorySlug } from "~/utils/mapCategory";

import type { ResourceIntensity, Locale, CategorySlug } from "~/types/shared";
import type { Block, LocalizedBlockWithMetadata } from "~/types/blocks/base";

const INTENSITY_TO_SCORE: Record<ResourceIntensity, number> = {
  low: 1,
  medium: 3,
  high: 5,
};

export type BlockForMetadataInput = Block & {
  translations?: Array<{
    languages_code: Locale;
    title?: string;
    description?: string;
    benefits?: string;
  }>;
};

export function createBlockMetadata(
  rawBlocks: BlockForMetadataInput[],
): LocalizedBlockWithMetadata[] {
  const processedBlocks: LocalizedBlockWithMetadata[] = rawBlocks.map(
    (block) => {
      const resourceIntensityScore =
        (INTENSITY_TO_SCORE[block.cost] || 0) +
        (INTENSITY_TO_SCORE[block.effort] || 0) +
        (INTENSITY_TO_SCORE[block.time] || 0);

      const en = block.translations?.find((t) => t.languages_code === "en");
      const title =
        typeof block.title === "object"
          ? block.title?.["en"]
          : (block.title ?? en?.title ?? "");
      const description =
        typeof block.description === "object"
          ? block.description?.["en"]
          : (block.description ?? en?.description ?? "");
      const benefits =
        typeof block.benefits === "object"
          ? block.benefits?.["en"]
          : (block.benefits ?? en?.benefits);

      const cat =
        normalizeCategorySlug(block.category as unknown as string) ??
        (block.category as unknown as string);

      return {
        id: block.id,
        title,
        category: cat as CategorySlug,
        cost: block.cost,
        effort: block.effort,
        time: block.time,
        maintenance: block.maintenance,
        resourceIntensityScore,
        ranking: block.ranking,
        description,
        benefits,
      } as LocalizedBlockWithMetadata;
    },
  );

  return processedBlocks;
}
