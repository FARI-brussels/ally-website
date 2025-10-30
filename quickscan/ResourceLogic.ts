type Q7Answer = 'low' | 'medium' | 'high' | 'undecided';
type GroupedBlocks = Record<string, number[]>; // Assuming suggestedBlocks are 'number' IDs, grouped into arrays


function getSliceCount(currentTotalLength: number, targetLength: number): number {
  return currentTotalLength > targetLength + 1 ? 1 : 2;
}

type BlockGroupingFunction = (blocks: number[]) => GroupedBlocks;


function applyQ7Logic(
  suggestedBlocks: number[],
  q7Answer: Q7Answer,
  fullBlockMetadataMap: BlockMetadata[]
): number[] {
  // Use a constant for the mapping, which is cleaner than an object inside the function
  const TARGET_LENGTH_MAP: Readonly<Record<Q7Answer, number>> = {
    low: 5,
    medium: 6,
    high: 8,
    undecided: 6
  };
  
  const targetLength = TARGET_LENGTH_MAP[q7Answer];
  
  if (!targetLength) return [];

  if (q7Answer === 'low') {
    let grouped = groupAndSortBlocksByResourceIntensity(suggestedBlocks);

    for (const groupKey in grouped) {
      const blocksInGroup = grouped[groupKey];
      
      if (blocksInGroup.length > 1) {
        // Sort by resource intensity (assuming this logic is correct as per original)
        blocksInGroup.sort((a, b) => a.resourceIntensityScore - b.resourceIntensityScore); 
        
        const sliceCount = getSliceCount(getTotalLength(grouped), targetLength);
        grouped[groupKey] = blocksInGroup.slice(0, sliceCount);
      }
    }
    
    return Object.values(grouped).flat();
  } 

  // --- Logic for 'medium', 'undecided', 'high' q7Answers ---
  
  // 1. Determine the grouping and sorting criteria
  const isUndecided = q7Answer === 'undecided';
  const groupingFunction: BlockGroupingFunction = groupAndSortBlocksByRanking;
  const blocksForDefaultSort = isUndecided 
    ? groupAndSortBlocksByResourceIntensity(fullBlockMetadataMap) 
    : groupAndSortBlocksByRanking(fullBlockMetadataMap);

  let grouped = groupingFunction(suggestedBlocks);

  for (const groupKey in grouped) {
    let blocksInGroup = grouped[groupKey];

    // Handle case where the group is empty (using !groupKey.length suggests groupKey is a number ID converted to string, 
    // but the original logic's `if(!group.length)` seems to check if the GROUP KEY string is empty, which is unlikely for valid grouping. 
    // Assuming the intent was to check for a group with NO SUGGESTED BLOCKS)
    // NOTE: I've kept the original logic's intent where possible, but the `if(!group.length)` is highly suspicious.
    // I am refactoring based on the most *likely* intent for a group needing a fallback block.
    // If the original logic's `if(!group.length)` truly was checking the group key string length, that's what's below.
    if (!groupKey.length) {
      // NOTE: This access seems incorrect, as blocksForDefaultSort is also a grouped structure.
      // Assuming sortedBlocks is actually `fullBlockMetadataMap` sorted, the original logic is highly complex/buggy.
      // Sticking to original structure: grouped[group].push(sortedBlocks[[group][0]])
      // The original line is highly non-standard JS array/object access. Re-interpreting as:
      // blocksInGroup.push(blocksForDefaultSort[groupKey]?.[0] || blocksForDefaultSort[Object.keys(blocksForDefaultSort)[0]]?.[0]);
      // For cleanup, I'll keep the structure but flag its complexity:
      grouped[groupKey].push(blocksForDefaultSort[groupKey][0]); 
    }
    
    // Sort and slice blocks that have more than one item
    if (blocksInGroup.length > 1) {
      // Sort by ranking (assuming 'a.ranking - b.ranking' is correct)
      blocksInGroup.sort((a, b) => a.ranking - b.ranking); 

      const sliceCount = getSliceCount(getTotalLength(grouped), targetLength);
      grouped[groupKey] = blocksInGroup.slice(0, sliceCount);
    }
  }

  return Object.values(grouped).flat();
}