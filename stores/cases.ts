import { createDirectus, rest, readItems, readItem } from "@directus/sdk";
import type { DirectusCase, DirectusExternalLink } from "~/types/directus/Case";

const client = createDirectus("https://fari-cms.directus.app").with(rest());

export const useCasesStore = defineStore("cases", () => {
  const error = ref(null);
  const loading = ref(false);

  const cases = ref([]);
  const selectedCase = ref();

  async function getCases() {
    const data = (await client.request(
      readItems("ally_case", {
        fields: [
          "*.*",
          "blocks_used.ally_building_block_id.*",
          "blocks_used.ally_building_block_id.category.*",
          "blocks_used.ally_building_block_id.category.translations.*",
          "blocks_used.ally_building_block_id.translations.*",
          "blocks_used.ally_building_block_id.translations.languages_code"
        ],
      }),
    )) as DirectusCase[];

    cases.value = await Promise.all(
      data
        .map((item) => {
          delete item?.alternative_cases;
          return item;
        })
        .map(parseCase),
    );


  }
  

  async function findCase(id: number) {
    if (selectedCase.value?.id === id && isValidCase(selectedCase.value)) {
      return selectedCase.value;
    }

    if (!cases.value) return await getCase(id);

    if (cases.value) {
      const found = cases.value.find((block) => (block.id === id && block.blocks_used));
      if (found) selectedCase.value = found;
      else await getCase(id);
      return selectedCase.value;
    }
  }

  async function getCase(id: number) {
    let external_links: DirectusExternalLink[] = [];
    let alternative_cases: DirectusCase[] = [];
    const data = (await client.request(
      readItem("ally_case", id, {
        fields: [
          "*.*",
          "blocks_used.ally_building_block_id.*",
          "blocks_used.ally_building_block_id.category.*",
          "blocks_used.ally_building_block_id.category.translations.*",
          "blocks_used.ally_building_block_id.translations.*",
          "blocks_used.ally_building_block_id.translations.languages_code"
        ],
      }),
    )) as DirectusCase;

    if (data.external_links && data.external_links.length) {
      const slugs = data.external_links.map(
        ({ ally_external_link_slug }) => ally_external_link_slug,
      );

      external_links = await client.request(
        readItems("ally_external_link", {
          fields: ["*.*"],
          filter: {
            slug: {
              _in: slugs,
            },
          },
        }),
      );
    }

    if (data.alternative_cases && data.alternative_cases.length)
      alternative_cases = (await client.request(
        readItems("ally_case", {
          fields: ["*.*"],
          filter: {
            id: {
              _in: data.alternative_cases.map(({ id }) => id) || [],
            },
          },
        }),
      )) as DirectusCase[];

    delete alternative_cases?.alternative_cases;

    selectedCase.value = await parseCase({
      ...data,
      alternative_cases,
      external_links,
    });

    console.log(selectedCase.value)
  }

  return {
    cases,
    selectedCase,
    error,
    loading,
    findCase,
    getCase,
    getCases,
  };
});

async function parseCase(item) {
  const { id, image, translations, alternative_cases = [], blocks_used } = item;

  const caseItem = {
    title: {},
    description: {},
    content: {},
    image,
  };

  translations.forEach(({ title, description, content, languages_code }) => {
    caseItem.title[languages_code] = title;
    caseItem.description[languages_code] = description;
    caseItem.content[languages_code] = content;
  });


  const building_blocks_used = blocks_used?.map(({ ally_building_block_id }) => {
    const block = {
      id: ally_building_block_id.id,
      category: { 
        slug: mapCategory(ally_building_block_id.category.slug), 
        title: {},
        description: {}       
      },
      title: {},
      description: {},
      benefits: {},
      how_to_execute: {},
      kpis: {},
    };

    ally_building_block_id.category?.translations?.forEach((translation) => {
      const { languages_code, title, description } = translation;

      block.category.title[languages_code] = title;
      block.category.description[languages_code] = description;
    });

    ally_building_block_id.translations?.forEach((translation) => {
      const { languages_code, title, description, benefits, how_to_execute, kpis } = translation;
      block.title[languages_code] = title;
      block.description[languages_code] = description;
      block.benefits[languages_code] = benefits;
      block.how_to_execute[languages_code] = how_to_execute;
      block.kpis[languages_code] = kpis;
    });

    return block;
  });
console.log(building_blocks_used)
  return {
    id,
    alternative_cases: await Promise.all(alternative_cases.map(parseCase)),
    ...caseItem,
    building_blocks_used,
  };
}


function isValidCase(caseItem: unknown): caseItem is Case {
  if (!caseItem || typeof caseItem !== 'object') return false;
  
  if (typeof caseItem.id !== 'number') return false;
  if (typeof caseItem.title !== 'object' || !caseItem.title) return false;
  if (typeof caseItem.description !== 'object' || !caseItem.description) return false;
  if (typeof caseItem.content !== 'object' || !caseItem.content) return false;
  
  const hasTranslations = 
    Object.keys(caseItem.title).length > 0 &&
    Object.keys(caseItem.description).length > 0 &&
    Object.keys(caseItem.content).length > 0;
  
  if (!hasTranslations) return false;
  if (!Array.isArray(caseItem.building_blocks_used)) return false;
  
  const hasValidBlocks = caseItem.building_blocks_used.every((block: unknown) => {
    return block && typeof block.category === 'string' && block.category.length > 0;
  });
  
  if (!hasValidBlocks) return false;
  if (!Array.isArray(caseItem.alternative_cases)) return false;
  
  return true;
}

