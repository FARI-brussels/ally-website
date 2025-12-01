import type { LocalizedBlockWithMetadata } from "~/types/blocks/base";
import type { CategorySlug } from "~/types/shared";

export function applyQ7Logic({
  suggestedBlocks,
  q7Answer,
  allBlocks,
}: {
  suggestedBlocks: LocalizedBlockWithMetadata[];
  q7Answer: string;
  allBlocks: LocalizedBlockWithMetadata[];
}): LocalizedBlockWithMetadata[] {
  const TARGET_LENGTH = {
    low: 5,
    medium: 6,
    high: 8,
    undecided: 6,
  } as const;

  const target =
    q7Answer === "low"
      ? TARGET_LENGTH.low
      : q7Answer === "high"
        ? TARGET_LENGTH.high
        : q7Answer === "undecided"
          ? TARGET_LENGTH.undecided
          : TARGET_LENGTH.medium;

  function countByCategory(list: LocalizedBlockWithMetadata[]) {
    const counts: Record<string, number> = {};
    list.forEach((b) => {
      counts[b.category] = (counts[b.category] || 0) + 1;
    });
    return counts;
  }

  function ensureCategoryCoverage(list: LocalizedBlockWithMetadata[]) {
    const present = [...new Set(list.map((b) => b.category.slug))];
    const needed = (
      [
        "values-structures",
        "culture-skills",
        "communication-participation",
        "methods-processes",
      ] as CategorySlug[]
    ).filter((cat) => !present.includes(cat));

    if (!needed.length) return list;

    const selectedIds = new Set(list.map((b) => b.id));

    if (q7Answer === "low" || q7Answer === "undecided") {
      for (const cat of needed) {
        const candidate = allBlocks
          .filter((b) => b.category === cat && !selectedIds.has(b.id))[0]
        if (candidate) {
          list.push(candidate);
          selectedIds.add(candidate.id);
        }
      }
    } else {
      for (const cat of needed) {
        const candidate = allBlocks
          .filter((b) => b.category.slug === cat && !selectedIds.has(b.id))
          .sort((a, b) => {
            if (a.ranking !== b.ranking) return a.ranking - b.ranking;
            
            return Math.random() - 0.5;
          })[0];

        if (candidate) {
          list.push(candidate);
          selectedIds.add(candidate.id);
        }
      }
    }
    return list;
  }

  function trimToTarget(list: LocalizedBlockWithMetadata[]) {
    const counts = countByCategory(list);

    if (q7Answer === "low" || q7Answer === "undecided") {
      list.sort((a, b) => a.ranking - b.ranking);

      let i = 0;
      while (list.length > target && i < list.length) {
        const b = list[i];
        if (counts[b.category] > 1) {
          counts[b.category] -= 1;
          list.splice(i, 1);
        } else {
          i += 1;
        }
      }
    } else {
      list.sort((a, b) => b.ranking - a.ranking);
      let i = 0;
      while (list.length > target && i < list.length) {
        const b = list[i];
        if (counts[b.category] > 1) {
          counts[b.category] -= 1;
          list.splice(i, 1);
        } else {
          i += 1;
        }
      }
    }
    return list;
  }

  let result = [...suggestedBlocks];
  result = trimToTarget(result);
  result = ensureCategoryCoverage(result);
  if (result.length > target) result = trimToTarget(result);
  
  return result;
}
