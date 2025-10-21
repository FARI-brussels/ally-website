import type { BlockMetadata } from "~/quickscan/blockData";

//Q1-Q6 Maps (Block IDs only), potentially arbitrary values of importance, can be replaced later on
type QuestionIdMap = Record<string, number[]>;

const q1Options: QuestionIdMap = {
  small: [16, 4, 8],
  medium: [8, 24, 19],
  large: [8, 24, 13, 9, 18],
  xlarge: [8, 24, 13, 9, 18],
};
const q2Options: QuestionIdMap = {
  public: [11, 10],
  private: [20, 17],
  nonprofit: [13, 4],
};
const q3Options: QuestionIdMap = {
  develop: [25],
  buy: [21, 24],
  both: [21, 24, 25],
  unknown: [6],
};
const q4Options: QuestionIdMap = {
  low: [17, 16, 14],
  medium: [17, 13, 15],
  high: [13, 15],
};
const q5Options: QuestionIdMap = {
  Yes: [5, 19, 12],
  No: [19],
};
const q6Options: QuestionIdMap = {
  low: [5],
  medium: [13, 11],
  high: [9, 22, 7, 12],
  undecided: [5],
};

const allOptions: Record<string, QuestionIdMap> = {
  Q1: q1Options,
  Q2: q2Options,
  Q3: q3Options,
  Q4: q4Options,
  Q5: q5Options,
  Q6: q6Options,
};

//Filtering based on Resource Intensity Score
function applyQ7Logic(
  suggestedBlockIDs: number[],
  q7Answer: string,
  fullBlockMetadataMap: Map<number, BlockMetadata>,
): number[] {
  let maxResourceScore: number;

  if (q7Answer === "low") {
    maxResourceScore = 8;
  } else if (q7Answer === "medium" || q7Answer === "undecided") {
    maxResourceScore = 10;
  } else {
    maxResourceScore = 12;
  }

  return suggestedBlockIDs.filter((id) => {
    const block = fullBlockMetadataMap.get(id);
    if (!block) return false;

    return block.resourceIntensityScore <= maxResourceScore;
  });
}

const CATEGORY_MAP = {
  values_structures: "values-structures",
  processes_methods: "methods-processes",
  culture_skills: "culture-skills",
  communication_participation: "communication-participation",
  undecided: null,
};

function applyQ8Logic(
  q8Answer: keyof typeof CATEGORY_MAP,
  initialSuggestionIDs: number[],
  fullBlockMetadataMap: Map<number, BlockMetadata>,
  allBlocksMetadata: BlockMetadata[],
): number[] {
  const targetCategoryName = CATEGORY_MAP[q8Answer];

  if (q8Answer === "undecided" || !targetCategoryName)
    return initialSuggestionIDs;

  const currentMixMap = new Map<number, BlockMetadata>();
  initialSuggestionIDs
    .map((id) => fullBlockMetadataMap.get(id))
    .filter((b): b is BlockMetadata => !!b)
    .forEach((b) => currentMixMap.set(b.blockId, b));

  const finalMixMetadata = Array.from(currentMixMap.values());

  const TOTAL_SUGGESTIONS_SIZE = finalMixMetadata.length;
  const MIN_TARGET_PERCENTAGE = 0.4; // 40%

  const targetCategoryBlocks = finalMixMetadata.filter(
    (b) => b.category === targetCategoryName,
  );
  const targetNeeded = Math.ceil(
    TOTAL_SUGGESTIONS_SIZE * MIN_TARGET_PERCENTAGE,
  );
  let swapCount = targetNeeded - targetCategoryBlocks.length;

  if (swapCount <= 0) {
    return initialSuggestionIDs;
  }

  const allCategories = [
    "values-structures",
    "culture-skills",
    "communication-participation",
    "methods-processes",
  ];
  const otherCategories = allCategories.filter((c) => c !== targetCategoryName);

  // Identify Essential Blocks (Lowest priorityLevel = Highest Importance)
  const essentialBlockIDs = new Set<number>();
  for (const cat of otherCategories) {
    // Find the highest priority block (lowest priorityLevel number) currently in the mix for non-target categories
    const highestPriorityBlock = finalMixMetadata
      .filter((b) => b.category === cat)
      .sort((a, b) => a.priorityLevel - b.priorityLevel)[0];
    if (highestPriorityBlock) {
      essentialBlockIDs.add(highestPriorityBlock.blockId);
    }
  }

  //Identify Candidates for Swapping Out (Lowest Importance, Non-Essential)
  const blocksToSwapOut = finalMixMetadata
    .filter(
      (b) =>
        b.category !== targetCategoryName && !essentialBlockIDs.has(b.blockId),
    )
    // Sort by lowest importance (highest priorityLevel) first
    .sort((a, b) => b.priorityLevel - a.priorityLevel);

  //Identify Candidates for Swapping In (Highest Importance, Target Category, NOT currently in the mix)
  const blocksToSwapIn = allBlocksMetadata
    .filter(
      (b) => b.category === targetCategoryName && !currentMixMap.has(b.blockId),
    )
    // Sort by highest importance (lowest priorityLevel) first
    .sort((a, b) => a.priorityLevel - b.priorityLevel);

  let swapInIndex = 0;

  //Perform Swaps
  while (swapCount > 0 && swapInIndex < blocksToSwapIn.length) {
    const blockIn = blocksToSwapIn[swapInIndex];
    const blockOut = blocksToSwapOut.shift();

    if (blockOut) {
      currentMixMap.delete(blockOut.blockId);
      currentMixMap.set(blockIn.blockId, blockIn);
      swapCount--;
    } else {
      break;
    }

    swapInIndex++;
  }

  return Array.from(currentMixMap.keys());
}

export function calculateSuggestions(
  answers: Record<string, string>,
  fullBlockMetadataMap: Map<number, BlockMetadata>,
  allBlocksMetadata: BlockMetadata[],
): BlockMetadata[] {
  const suggestedBlockIDs: number[] = [];

  // Accumulate suggestions from Q1-Q6 (Assuming allOptions map is available)
  for (const qId in allOptions) {
    const answerValue = answers[qId];
    const optionsMap = allOptions[qId];

    if (answerValue && optionsMap[answerValue]) {
      suggestedBlockIDs.push(...optionsMap[answerValue]);
    }
  }

  let finalIDs = Array.from(new Set(suggestedBlockIDs));

  finalIDs = applyQ7Logic(finalIDs, answers["Q7"], fullBlockMetadataMap);

  finalIDs = applyQ8Logic(
    answers["Q8"],
    finalIDs,
    fullBlockMetadataMap,
    allBlocksMetadata,
  );

  const finalSuggestions = finalIDs
    .map((id) => fullBlockMetadataMap.get(id))
    .filter((b): b is BlockMetadata => !!b);

  finalSuggestions.sort((a, b) => {
    if (a.priorityLevel !== b.priorityLevel) {
      return a.priorityLevel - b.priorityLevel; // Sort by highest importance (lowest number)
    }
    return a.category.localeCompare(b.category);
  });

  return finalSuggestions;
}
