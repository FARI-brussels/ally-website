import { createDirectus, rest, readItems, readItem } from "@directus/sdk";
import type { Directuscase, DirectusExternalLink } from "~/types/directus/case";

const client = createDirectus("https://fari-cms.directus.app").with(rest());

export const useCasesStore = defineStore("cases", () => {
  const error = ref(null);
  const loading = ref(false);

  const cases = ref([]);
  const selectedCase = ref();

  async function getCases() {
    const data = (await client.request(
      readItems("ally_case", {
        fields: ["*.*"],
      }),
    )) as Directuscase[];

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
    if (selectedCase.value && selectedCase.value?.id === id)
      return selectedCase.value;

    if (!cases.value) return await getCase(id);

    if (cases.value) {
      const found = cases.value.find((block) => block.id === id);
      if (found) selectedCase.value = found;
      else await getCase(id);
      return selectedCase.value;
    }
  }

  async function getCase(id: number) {
    let external_links: DirectusExternalLink[] = [];
    let alternative_cases: Directuscase[] = [];
    const data = (await client.request(
      readItem("ally_case", id, {
    fields: ["*.*"],
      }),
    )) as Directuscase;

    console.log("data case", data);

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
      )) as Directuscase[];

    delete alternative_cases?.alternative_cases;

    selectedCase.value = await parseCase({
      ...data,
      alternative_cases,
      external_links,
    });
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

async function parseCase(caseItem) {
  const {
    id,
    translations,
    alternative_cases = [],
    blocks_used,
  } = caseItem;

  const block = {
    title: {},
    description: {},
    content: {},
  };


  const { findBlock } = useBuildingBlockStore();

  translations.forEach(({ title, description, content, languages_code }) => {
    block.title[languages_code] = title;
    block.description[languages_code] = description;
    block.content[languages_code] = content;
  });

  const building_blocks_used = blocks_used && await Promise.all(blocks_used.map(async (b) => await findBlock(b.ally_building_block_id)))

  return {
    id,
    alternative_cases: await Promise.all(alternative_cases.map(parseCase)),
    ...block,
    building_blocks_used
  };
}
