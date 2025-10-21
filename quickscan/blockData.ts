// quickscan/block_data.ts
import { mapCategory, type CategorySlug } from "~/utils/mapCategory";

import type { DirectusBuildingBlock } from "~/types/directus/BuildingBlock";
export type Intensity = "low" | "medium" | "high";
export type CategoryName =
  | "Values & Structures"
  | "Culture & Skills"
  | "Communication & Participation"
  | "Processes & Methods";

export interface BlockMetadata {
  blockId: number;
  title: string;
  category: CategorySlug;
  cost: Intensity;
  effort: Intensity;
  time: Intensity;
  maintenance: Intensity;
  resourceIntensityScore: number;
  priorityLevel: number;
}

const INTENSITY_TO_SCORE: Record<Intensity, number> = {
  low: 1,
  medium: 2,
  high: 3,
};

/**
 * Creates the required BlockMetadata map (with calculated scores) from raw CMS blocks.
 * * @param rawBlocks The array of raw block objects fetched from the CMS store.
 * @returns A Map of Block ID to the enhanced BlockMetadata object.
 */
export function createBlockMetadata(
  rawBlocks: DirectusBuildingBlock[],
): Map<number, BlockMetadata> {
  const metadataMap = new Map<number, BlockMetadata>();

  const processedBlocks: BlockMetadata[] = rawBlocks.map((block) => {
    const resourceIntensityScore =
      (INTENSITY_TO_SCORE[block.cost as Intensity] || 0) +
      (INTENSITY_TO_SCORE[block.effort as Intensity] || 0) +
      (INTENSITY_TO_SCORE[block.time as Intensity] || 0) +
      (INTENSITY_TO_SCORE[block.maintenance as Intensity] || 0);

    let priorityLevel: number;

    if ([5, 7, 8, 16, 18, 22, 25].includes(block.id)) {
      priorityLevel = 1;
    } else if ([9, 12, 19, 20, 24].includes(block.id)) {
      priorityLevel = 2;
    } else if ([4, 6, 13, 15, 17, 21].includes(block.id)) {
      priorityLevel = 3;
    } else {
      priorityLevel = 4;
    }

    return {
      blockId: block.id,
      title: block.title.en,
      category: mapCategory(block.category.slug),
      cost: block.cost,
      effort: block.effort,
      time: block.time,
      maintenance: block.maintenance,
      resourceIntensityScore,
      priorityLevel,
      description: block.description?.en,
      benefits: block.benefits?.en,
    } as BlockMetadata;
  });

  processedBlocks.forEach((block) => metadataMap.set(block.blockId, block));
  return metadataMap;
}
