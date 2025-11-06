import type { LocalizedBlockWithMetadata } from "~/types/blocks/base";
import type { CategorySlug } from "~/types/shared";

const cats: CategorySlug[] = [
  "values-structures",
  "culture-skills",
  "communication-participation",
  "methods-processes",
];

export function applyQ8Logic({
  q8Answer,
  initialSuggestions,
  allBlocks,
}: {
  q8Answer: string;
  initialSuggestions: LocalizedBlockWithMetadata[];
  allBlocks: LocalizedBlockWithMetadata[];
}): LocalizedBlockWithMetadata[] {
  const targetLength = initialSuggestions.length;
  let selected = [...initialSuggestions];

  // ---- UNDECIDED path (basics) ----
  if (q8Answer === "undecided") {
    const basicsIds = [17, 24, 13, 8];
    const perCategory = groupByCategory(selected);
    const toRemove: number[] = [];

    for (const cat of cats) {
      const list = perCategory[cat];
      if (list && list.length > 0) {
        list.sort((a, b) => {
          if (a.ranking !== b.ranking) return a.ranking - b.ranking; // lower ranking is better
          return a.resourceIntensityScore - b.resourceIntensityScore; // tie-breaker: lower resourceIntensityScore
        }); // worst first
        toRemove.push(list[0].id);
      }
    }

    selected = selected.filter((b) => !toRemove.includes(b.id));

    const basicsToAdd = basicsIds
      .map((id) => allBlocks.find((b) => b.id === id))
      .filter(Boolean) as LocalizedBlockWithMetadata[];

    selected = dedupeById([...selected, ...basicsToAdd]);
    selected = ensureOnePerCategoryWithSwap(selected, allBlocks, targetLength);
    return selected.slice(0, targetLength);
  }

  // ---- Validate category ----
  const targetCategory = (cats as readonly string[]).includes(q8Answer)
    ? (q8Answer as CategorySlug)
    : null;

  if (!targetCategory) {
    console.error("invalid category: " + q8Answer);
    return ensureOnePerCategoryWithSwap(selected, allBlocks, targetLength);
  }

  // ---- Prepare ----
  const counts = countByCategory(selected);
  const selectedIds = new Set(selected.map((b) => b.id));

  const needed = computeNeededCount({
    current: selected,
    cat: targetCategory,
    targetPercent: 40,
  });

  const allTargetBlocks = allBlocks
    .filter((b) => b.category.slug === targetCategory)
    .sort((a, b) => {
      if (a.ranking !== b.ranking) return a.ranking - b.ranking; // lower ranking is better
      return a.resourceIntensityScore - b.resourceIntensityScore; // tie-breaker: lower resourceIntensityScore
    });

  const selectedTargetBlocks = selected
    .filter((b) => b.category.slug === targetCategory)
    .slice()
    .sort((a, b) => {
      if (a.ranking !== b.ranking) return a.ranking - b.ranking; // lower ranking is better
      return a.resourceIntensityScore - b.resourceIntensityScore; // tie-breaker: lower resourceIntensityScore
    });

  let availableTargetToAdd = allTargetBlocks.filter(
    (b) => !selectedIds.has(b.id),
  );

  const removals: number[] = [];
  const additions: LocalizedBlockWithMetadata[] = [];

  // ---- STEP 1: Swap worst non-targets for best target blocks ----
  let idxAdd = 0;
  while (removals.length < needed && idxAdd < availableTargetToAdd.length) {
    const blockToAdd = availableTargetToAdd[idxAdd++];

    const candidateToRemove = selected
      .filter(
        (b) =>
          b.category.slug !== targetCategory &&
          counts[b.category.slug] > 1 &&
          !removals.includes(b.id),
      )
      .sort((a, b) => b.ranking - a.ranking)[0];

    if (!candidateToRemove) break;

    removals.push(candidateToRemove.id);
    counts[candidateToRemove.category.slug] -= 1;

    additions.push(blockToAdd);
    counts[targetCategory] = (counts[targetCategory] || 0) + 1;
    selectedIds.add(blockToAdd.id);
  }

  // ---- STEP 2: Optimize target blocks (swap worse selected for better available) ----
  availableTargetToAdd = allTargetBlocks.filter((b) => !selectedIds.has(b.id));
  const remainingSelectedTarget = selectedTargetBlocks.filter(
    (b) => !removals.includes(b.id),
  );

  const pairs = Math.min(
    availableTargetToAdd.length,
    remainingSelectedTarget.length,
  );
  for (let i = 0; i < pairs; i++) {
    const worse = remainingSelectedTarget[i];
    const better = availableTargetToAdd[i];
    if (!worse || !better) break;

    if (better.ranking < worse.ranking) {
      removals.push(worse.id);
      additions.push(better);
      selectedIds.add(better.id);
    } else break;
  }

  selected = selected.filter((b) => !removals.includes(b.id));
  selected = dedupeById([...selected, ...additions]);

  selected = ensureOnePerCategoryWithSwap(selected, allBlocks, targetLength);

  // ---- Defensive fill/trimming ----
  if (selected.length < targetLength) {
    const currentIds = new Set(selected.map((b) => b.id));
    const remainingCandidates = allBlocks
      .filter((b) => !currentIds.has(b.id))
      .sort((a, b) => {
        if (a.ranking !== b.ranking) return a.ranking - b.ranking; // lower ranking is better
        return a.resourceIntensityScore - b.resourceIntensityScore; // tie-breaker: lower resourceIntensityScore
      });

    let i = 0;
    while (selected.length < targetLength && i < remainingCandidates.length) {
      selected.push(remainingCandidates[i++]);
    }
    selected = dedupeById(selected).slice(0, targetLength);
  } else if (selected.length > targetLength) {
    selected = selected.slice(0, targetLength);
  }

  // ---- FINAL CHECK: Ensure 40% target category safely ----
  if (!hasFortyPercent({ list: selected, cat: targetCategory })) {
    const curCounts = countByCategory(selected);
    const curSelectedIds = new Set(selected.map((b) => b.id));
    const remainingTargets = allTargetBlocks.filter(
      (b) => !curSelectedIds.has(b.id),
    );
    let j = 0;

    while (
      !hasFortyPercent({ list: selected, cat: targetCategory }) &&
      j < remainingTargets.length
    ) {
      const blockToAdd = remainingTargets[j++];

      const removableCandidates = selected
        .filter((b) => b.category.slug !== targetCategory)
        .sort((a, b) => b.ranking - a.ranking);

      let blockToRemove: LocalizedBlockWithMetadata | undefined;
      for (const cand of removableCandidates) {
        const countInCat = selected.filter(
          (b) => b.category.slug === cand.category.slug,
        ).length;
        if (countInCat > 1) {
          blockToRemove = cand;
          break;
        }
      }

      if (!blockToRemove) break;

      selected = selected.filter((b) => b.id !== blockToRemove!.id);
      selected.push(blockToAdd);
      curCounts[blockToRemove!.category.slug] -= 1;
      curCounts[targetCategory] = (curCounts[targetCategory] || 0) + 1;
    }

    selected = ensureOnePerCategoryWithSwap(selected, allBlocks, targetLength);

    if (selected.length < targetLength) {
      const curIds = new Set(selected.map((b) => b.id));
      const remaining = allBlocks
        .filter((b) => !curIds.has(b.id))
        .sort((a, b) => {
          if (a.ranking !== b.ranking) return a.ranking - b.ranking; // lower ranking is better
          return a.resourceIntensityScore - b.resourceIntensityScore; // tie-breaker: lower resourceIntensityScore
        });
      let k = 0;
      while (selected.length < targetLength && k < remaining.length)
        selected.push(remaining[k++]);
      selected = dedupeById(selected).slice(0, targetLength);
    } else if (selected.length > targetLength) {
      selected = selected.slice(0, targetLength);
    }
  }
  
  return selected;
}

/* ---------------------------
   Helper functions
   --------------------------- */
function ensureOnePerCategoryWithSwap(
  list: LocalizedBlockWithMetadata[],
  all: LocalizedBlockWithMetadata[],
  targetLength: number,
): LocalizedBlockWithMetadata[] {
  let result = [...list];
  const present = new Set(result.map((b) => b.category.slug));
  const missing = cats.filter((c) => !present.has(c));

  if (missing.length === 0) return dedupeById(result);

  const selectedIds = new Set(result.map((b) => b.id));
  const counts = countByCategory(result);

  for (const cat of missing) {
    const bestFromMissing = all
      .filter((b) => b.category.slug === cat && !selectedIds.has(b.id))
      .sort((a, b) => {
        if (a.ranking !== b.ranking) return a.ranking - b.ranking; // lower ranking is better
        return a.resourceIntensityScore - b.resourceIntensityScore; // tie-breaker: lower resourceIntensityScore
      })[0];

    if (!bestFromMissing) continue;

    if (result.length < targetLength) {
      result.push(bestFromMissing);
      selectedIds.add(bestFromMissing.id);
      counts[cat] = (counts[cat] || 0) + 1;
    } else {
      const toSwapOut = result
        .filter((b) => counts[b.category.slug] > 1)
        .sort((a, b) => b.ranking - a.ranking)[0];

      if (toSwapOut) {
        counts[toSwapOut.category.slug] -= 1;
        result = result.filter((b) => b.id !== toSwapOut.id);
        result.push(bestFromMissing);
        selectedIds.add(bestFromMissing.id);
        counts[cat] = (counts[cat] || 0) + 1;
      }
    }
  }

  return dedupeById(result);
}

function groupByCategory(list: LocalizedBlockWithMetadata[]) {
  const grouped: Record<CategorySlug, LocalizedBlockWithMetadata[]> = {
    "values-structures": [],
    "culture-skills": [],
    "communication-participation": [],
    "methods-processes": [],
  };
  list.forEach((b) => grouped[b.category.slug as CategorySlug].push(b));
  return grouped;
}

function countByCategory(list: LocalizedBlockWithMetadata[]) {
  const counts: Record<string, number> = {};
  list.forEach((b) => {
    counts[b.category.slug] = (counts[b.category.slug] || 0) + 1;
  });
  return counts;
}

function hasFortyPercent({
  list,
  cat,
}: {
  list: LocalizedBlockWithMetadata[];
  cat: CategorySlug;
}) {
  const n = list.length || 1;
  const matches = list.filter((b) => b.category.slug === cat).length;
  return matches / n >= 0.4;
}

function computeNeededCount({
  current,
  cat,
  targetPercent,
}: {
  current: LocalizedBlockWithMetadata[];
  cat: CategorySlug;
  targetPercent: number;
}) {
  const n = current.length;
  const targetCount = Math.ceil((targetPercent / 100) * n);
  const currentCount = current.filter((b) => b.category.slug === cat).length;
  return Math.max(0, targetCount - currentCount);
}

function dedupeById(list: LocalizedBlockWithMetadata[]) {
  const seen = new Set<number>();
  const out: LocalizedBlockWithMetadata[] = [];
  for (const b of list) {
    if (!seen.has(b.id)) {
      seen.add(b.id);
      out.push(b);
    }
  }
  return out;
}
