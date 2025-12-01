import {
  createBlockMetadata,
  type BlockForMetadataInput,
} from "~/quickscan/blockData";
import type { Block } from "~/types/blocks/base";
import { applyQ7Logic, questionsToBlockIds } from "./logic/index";

export function calculateSuggestions({
  answers,
  blocks,
}: {
  answers: { [k: string]: string };
  blocks: Block[];
}): number[] {
  const blockMetaData = createBlockMetadata(
    blocks as unknown as BlockForMetadataInput[],
  );
  const suggestedBlockIDs: number[] = [];

  for (const qId in questionsToBlockIds) {
    const answerValue = answers[qId];
    const optionsMap = questionsToBlockIds[qId];

    if (answerValue && optionsMap[answerValue])
      suggestedBlockIDs.push(...optionsMap[answerValue]);
  }

  const suggestedBlocks = blockMetaData.filter((block) =>
    suggestedBlockIDs.includes(block.id),
  );

  const q7result = applyQ7Logic({
    suggestedBlocks,
    q7Answer: answers["Q7"],
    allBlocks: blockMetaData,
  });

  const finalIDs = q7result.map(({ id }: { id: number }) => id);

  return finalIDs;
}
