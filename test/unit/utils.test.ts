import { describe, it, expect } from "vitest";
import { applyQ7Logic } from "../../quickscan/logic/q7";
import { applyQ8Logic } from "../../quickscan/logic/q8";
import type { LocalizedBlockWithMetadata } from "../../types/blocks/base";
import type { CategorySlug } from "../../types/shared";

function makeBlock({
  id,
  category,
  ranking,
  ris,
  title,
}: {
  id: number;
  category: CategorySlug;
  ranking: number;
  ris: number;
  title?: string;
}): LocalizedBlockWithMetadata {
  return {
    id,
    title: title || `Block ${id}`,
    category: {
      slug: category,
      title: { en: category },
      description: { en: `${category} description` },
    },
    involvement: "",
    cost: "low",
    effort: "low",
    time: "low",
    maintenance: "low",
    ranking,
    resourceIntensityScore: ris,
    description: { en: `Description for block ${id}` },
    benefits: { en: `Benefits for block ${id}` },
  };
}

describe("Q7 logic", () => {
  const all: LocalizedBlockWithMetadata[] = [
    // values-structures
    makeBlock({ id: 1, category: "values-structures", ranking: 1, ris: 1 }),
    makeBlock({ id: 2, category: "values-structures", ranking: 5, ris: 5 }),
    // culture-skills
    makeBlock({ id: 3, category: "culture-skills", ranking: 2, ris: 2 }),
    makeBlock({ id: 4, category: "culture-skills", ranking: 6, ris: 4 }),
    // communication
    makeBlock({
      id: 5,
      category: "communication-participation",
      ranking: 3,
      ris: 3,
    }),
    makeBlock({
      id: 6,
      category: "communication-participation",
      ranking: 7,
      ris: 5,
    }),
    // methods
    makeBlock({ id: 7, category: "methods-processes", ranking: 4, ris: 2 }),
    makeBlock({ id: 8, category: "methods-processes", ranking: 8, ris: 4 }),
  ];

  it("low: trims highest resource to 5 and ensures 1 per category", () => {
    const suggested = [all[0], all[1], all[3], all[5], all[7], all[2]];
    const res = applyQ7Logic({
      suggestedBlocks: suggested,
      q7Answer: "low",
      allBlocks: all,
    });
    expect(res.length).toBe(5);
    const cats = new Set(res.map((b) => b.category.slug));
    expect(cats.size).toBe(4);
  });

  it("medium: trims lowest importance to 6 and ensures 1 per category", () => {
    const suggested = [all[0], all[1], all[3], all[5], all[7], all[2], all[4]];
    const res = applyQ7Logic({
      suggestedBlocks: suggested,
      q7Answer: "medium",
      allBlocks: all,
    });

    expect(res.length).toBe(6);

    const cats = new Set(res.map((b) => b.category.slug));
    expect(cats.size).toBe(4);
  });

  it("high: trims lowest importance to <= 8 and ensures 1 per category", () => {
    const suggested = [...all];
    const res = applyQ7Logic({
      suggestedBlocks: suggested,
      q7Answer: "high",
      allBlocks: all,
    });
    expect(res.length).toBeLessThanOrEqual(8);
    const cats = new Set(res.map((b) => b.category.slug));
    expect(cats.size).toBe(4);
  });

  it("undecided: behaves like low (resource-based) to 6 with coverage", () => {
    const suggested = [all[0], all[1], all[3], all[5], all[7], all[2]];
    const res = applyQ7Logic({
      suggestedBlocks: suggested,
      q7Answer: "undecided",
      allBlocks: all,
    });
    expect(res.length).toBe(6);
    const cats = new Set(res.map((b) => b.category.slug));
    expect(cats.size).toBe(4);
  });
});

describe("Q8 logic", () => {
  const all: LocalizedBlockWithMetadata[] = [
    // values-structures (5 blocks)
    makeBlock({ id: 19, category: "values-structures", ranking: 1, ris: 3 }),
    makeBlock({ id: 17, category: "values-structures", ranking: 2, ris: 13 }),
    makeBlock({ id: 18, category: "values-structures", ranking: 3, ris: 5 }),
    makeBlock({ id: 22, category: "values-structures", ranking: 4, ris: 9 }),
    makeBlock({ id: 21, category: "values-structures", ranking: 7, ris: 5 }),

    // culture-skills (4 blocks)
    makeBlock({ id: 16, category: "culture-skills", ranking: 1, ris: 13 }),
    makeBlock({ id: 13, category: "culture-skills", ranking: 2, ris: 9 }),
    makeBlock({ id: 9, category: "culture-skills", ranking: 3, ris: 9 }),
    makeBlock({ id: 14, category: "culture-skills", ranking: 5, ris: 5 }),

    // communication-participation (4 blocks)
    makeBlock({
      id: 10,
      category: "communication-participation",
      ranking: 1,
      ris: 7,
    }),
    makeBlock({
      id: 8,
      category: "communication-participation",
      ranking: 2,
      ris: 9,
    }),
    makeBlock({
      id: 11,
      category: "communication-participation",
      ranking: 3,
      ris: 9,
    }),
    makeBlock({
      id: 12,
      category: "communication-participation",
      ranking: 4,
      ris: 13,
    }),

    // methods-processes (4 blocks)
    makeBlock({ id: 25, category: "methods-processes", ranking: 1, ris: 3 }),
    makeBlock({ id: 24, category: "methods-processes", ranking: 2, ris: 13 }),
    makeBlock({ id: 6, category: "methods-processes", ranking: 3, ris: 5 }),
    makeBlock({ id: 5, category: "methods-processes", ranking: 4, ris: 9 }),
  ];

  describe("Target category focus", () => {
    it("values-structures: reaches at least 40% with best blocks", () => {
      // Start with 8 blocks, only 1 values-structures
      const initial = [
        all[2], // values-structures id 18, ranking 3
        all[6], // culture-skills id 13, ranking 2
        all[5], // culture-skills id 16, ranking 1
        all[9], // communication-participation id 10, ranking 1
        all[10], // communication-participation id 8, ranking 2
        all[13], // methods-processes id 25, ranking 1
        all[14], // methods-processes id 24, ranking 2
        all[8], // culture-skills id 9, ranking 3
      ];

      const res = applyQ8Logic({
        q8Answer: "values-structures",
        initialSuggestions: initial,
        allBlocks: all,
      });

      // Should have 8 blocks
      expect(res.length).toBe(8);

      // Should have at least 40% values-structures (4 out of 8)
      const vsBlocks = res.filter(
        (b) => b.category.slug === "values-structures",
      );
      expect(vsBlocks.length).toBeGreaterThanOrEqual(4);
      expect(vsBlocks.length / res.length).toBeGreaterThanOrEqual(0.4);

      // Should have best values-structures blocks (ids: 19, 17, 18, 22)
      const vsIds = vsBlocks.map((b) => b.id).sort((a, b) => a - b);
      expect(vsIds).toEqual([17, 18, 19, 22]);

      // Should maintain 1 from each category
      const cats = new Set(res.map((b) => b.category.slug));
      expect(cats.size).toBe(4);
    });

    it("culture-skills: reaches at least 40% with best blocks", () => {
      // Start with 6 blocks, only 1 culture-skills
      const initial = [
        all[6], // culture-skills id 13, ranking 2
        all[10], // communication-participation id 8, ranking 2
        all[0], // values-structures id 19, ranking 1
        all[1], // values-structures id 17, ranking 2
        all[13], // methods-processes id 25, ranking 1
        all[14], // methods-processes id 24, ranking 2
      ];

      const res = applyQ8Logic({
        q8Answer: "culture-skills",
        initialSuggestions: initial,
        allBlocks: all,
      });

      expect(res.length).toBe(6);

      // Should have at least 40% culture-skills (3 out of 6)
      const csBlocks = res.filter((b) => b.category.slug === "culture-skills");
      expect(csBlocks.length).toBeGreaterThanOrEqual(3);
      expect(csBlocks.length / res.length).toBeGreaterThanOrEqual(0.4);

      // Should have best culture-skills blocks (ids: 16, 13, 9)
      const csIds = csBlocks.map((b) => b.id).sort((a, b) => a - b);
      expect(csIds).toEqual([9, 13, 16]);

      // Should maintain 1 from each category
      const cats = new Set(res.map((b) => b.category.slug));
      expect(cats.size).toBe(4);
    });

    it("methods-processes: reaches at least 40% with best blocks", () => {
      // Start with 5 blocks, only 1 methods-processes
      const initial = [
        all[6], // culture-skills id 13, ranking 2
        all[10], // communication-participation id 8, ranking 2
        all[4], // values-structures id 21, ranking 7
        all[15], // methods-processes id 5, ranking 4
        all[16], // methods-processes id 6, ranking 3
      ];

      const res = applyQ8Logic({
        q8Answer: "methods-processes",
        initialSuggestions: initial,
        allBlocks: all,
      });

      expect(res.length).toBe(5);

      // Should have at least 40% methods-processes (2 out of 5)
      const mpBlocks = res.filter(
        (b) => b.category.slug === "methods-processes",
      );
      expect(mpBlocks.length).toBeGreaterThanOrEqual(2);
      expect(mpBlocks.length / res.length).toBeGreaterThanOrEqual(0.4);

      // Should have best methods-processes blocks (ids: 25, 24)
      const mpIds = mpBlocks.map((b) => b.id).sort((a, b) => a - b);
      expect(mpIds).toEqual([24, 25]);

      // Should maintain 1 from each category
      const cats = new Set(res.map((b) => b.category.slug));
      expect(cats.size).toBe(4);
    });

    it("communication-participation: reaches at least 40% with best blocks", () => {
      // Start with 5 blocks, only 1 communication-participation
      const initial = [
        all[6], // culture-skills id 13, ranking 2
        all[11], // communication-participation id 11, ranking 3
        all[0], // values-structures id 19, ranking 1
        all[13], // methods-processes id 25, ranking 1
        all[14], // methods-processes id 24, ranking 2
      ];

      const res = applyQ8Logic({
        q8Answer: "communication-participation",
        initialSuggestions: initial,
        allBlocks: all,
      });

      expect(res.length).toBe(5);

      // Should have at least 40% communication-participation (2 out of 5)
      const cpBlocks = res.filter(
        (b) => b.category.slug === "communication-participation",
      );
      expect(cpBlocks.length).toBeGreaterThanOrEqual(2);
      expect(cpBlocks.length / res.length).toBeGreaterThanOrEqual(0.4);

      // Should have best communication-participation blocks (ids: 10, 8)
      const cpIds = cpBlocks.map((b) => b.id).sort((a, b) => a - b);
      expect(cpIds).toEqual([8, 10]);

      // Should maintain 1 from each category
      const cats = new Set(res.map((b) => b.category.slug));
      expect(cats.size).toBe(4);
    });
  });

  describe("Already at 40%", () => {
    it("maintains blocks when target category already at 40% with optimal blocks", () => {
      const initial = [
        all[0], // values-structures id 19, ranking 1
        all[1], // values-structures id 17, ranking 2
        all[5], // culture-skills id 16, ranking 1
        all[9], // communication-participation id 10, ranking 1
        all[13], // methods-processes id 25, ranking 1
      ];

      const res = applyQ8Logic({
        q8Answer: "values-structures",
        initialSuggestions: initial,
        allBlocks: all,
      });

      expect(res.length).toBe(5);

      // Should still have 40% values-structures
      const vsBlocks = res.filter(
        (b) => b.category.slug === "values-structures",
      );
      expect(vsBlocks.length / res.length).toBeGreaterThanOrEqual(0.4);

      // Should keep the best blocks
      const vsIds = vsBlocks.map((b) => b.id).sort((a, b) => a - b);
      expect(vsIds).toEqual([17, 19]);
    });
  });

  describe("Undecided (basics) path", () => {
    it("swaps lowest importance from each category with basics IDs", () => {
      const initial = [
        all[2], // values-structures id 18, ranking 3
        all[4], // values-structures id 21, ranking 7
        all[7], // culture-skills id 9, ranking 3
        all[8], // culture-skills id 14, ranking 5
        all[11], // communication-participation id 11, ranking 3
        all[12], // communication-participation id 12, ranking 4
        all[15], // methods-processes id 5, ranking 4
        all[16], // methods-processes id 6, ranking 3
      ];

      const res = applyQ8Logic({
        q8Answer: "undecided",
        initialSuggestions: initial,
        allBlocks: all,
      });

      expect(res.length).toBe(8);

      // Should contain the 4 basics blocks
      const ids = new Set(res.map((b) => b.id));
      expect(ids.has(17)).toBe(true); // Build internal support
      expect(ids.has(24)).toBe(true); // Manage change
      expect(ids.has(13)).toBe(true); // Encourage open communication
      expect(ids.has(8)).toBe(true); // Co-create with users

      // Should maintain 1 from each category
      const cats = new Set(res.map((b) => b.category.slug));
      expect(cats.size).toBe(4);
    });

    it("handles basics when some basics already in suggestions", () => {
      const initial = [
        all[1], // values-structures id 17 - already a basic!
        all[6], // culture-skills id 13 - already a basic!
        all[0], // values-structures id 19
        all[9], // communication-participation id 10
        all[13], // methods-processes id 25
      ];

      const res = applyQ8Logic({
        q8Answer: "undecided",
        initialSuggestions: initial,
        allBlocks: all,
      });

      expect(res.length).toBeLessThanOrEqual(5);

      // Should still contain all 4 basics (no duplicates)
      const ids = new Set(res.map((b) => b.id));
      expect(ids.has(17)).toBe(true);
      expect(ids.has(24)).toBe(true);
      expect(ids.has(13)).toBe(true);
      expect(ids.has(8)).toBe(true);
    });
  });

  describe("Category coverage", () => {
    it("ensures at least one block from each category", () => {
      // Start with only 3 categories
      const initial = [
        all[0], // values-structures id 19
        all[5], // culture-skills id 16
        all[6], // culture-skills id 13
        all[9], // communication-participation id 10
        all[10], // communication-participation id 8
      ];

      const res = applyQ8Logic({
        q8Answer: "values-structures",
        initialSuggestions: initial,
        allBlocks: all,
      });

      // Should have all 4 categories
      const cats = new Set(res.map((b) => b.category.slug));
      expect(cats.size).toBe(4);
    });

    it("adds best block from missing category", () => {
      // Start without methods-processes
      const initial = [
        all[0], // values-structures id 19
        all[1], // values-structures id 17
        all[5], // culture-skills id 16
        all[9], // communication-participation id 10
        all[10], // communication-participation id 8
      ];

      const res = applyQ8Logic({
        q8Answer: "values-structures",
        initialSuggestions: initial,
        allBlocks: all,
      });

      // Should have methods-processes
      const mpBlocks = res.filter(
        (b) => b.category.slug === "methods-processes",
      );
      expect(mpBlocks.length).toBeGreaterThan(0);

      // Should be the best available (id 25, ranking 1)
      expect(mpBlocks[0].id).toBe(25);
    });
  });

  describe("Length preservation", () => {
    it("maintains target length from Q7", () => {
      const initial5 = [all[0], all[5], all[9], all[13], all[14]];
      const res5 = applyQ8Logic({
        q8Answer: "values-structures",
        initialSuggestions: initial5,
        allBlocks: all,
      });
      expect(res5.length).toBe(5);

      const initial6 = [all[0], all[5], all[6], all[9], all[13], all[14]];
      const res6 = applyQ8Logic({
        q8Answer: "culture-skills",
        initialSuggestions: initial6,
        allBlocks: all,
      });
      expect(res6.length).toBe(6);

      const initial8 = [
        all[0],
        all[1],
        all[2],
        all[5],
        all[6],
        all[9],
        all[13],
        all[14],
      ];
      const res8 = applyQ8Logic({
        q8Answer: "values-structures",
        initialSuggestions: initial8,
        allBlocks: all,
      });
      expect(res8.length).toBe(8);
    });
  });

  describe("Invalid input handling", () => {
    it("handles invalid category gracefully", () => {
      const initial = [all[0], all[5], all[9], all[13], all[14]];
      const res = applyQ8Logic({
        q8Answer: "invalid-category",
        initialSuggestions: initial,
        allBlocks: all,
      });

      // Should return with category coverage maintained
      expect(res.length).toBe(5);
      const cats = new Set(res.map((b) => b.category.slug));
      expect(cats.size).toBe(4);
    });
  });
});
