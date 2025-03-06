import { createDirectus, rest, readItems, readItem } from "@directus/sdk";
import type {
  DirectusBuildingBlock,
  DirectusExternalLink,
  ExternalLink,
} from "~/types/directus/BuildingBlock";
import { useGlobalStore } from "./global";

const client = createDirectus("https://fari-cms.directus.app").with(rest());

export const useBuildingBlockStore = defineStore("buildingBlocks", () => {
  const error = ref(null);
  const loading = ref(false);

  const blocks = ref([]);
  const selectedBlock = ref();

  async function getBlocks() {
    const data = (await client.request(
      readItems("ally_building_block", {
        fields: ["*.*"],
        filter: {
          status: {
            _eq: "published",
          },
        },
      }),
    )) as DirectusBuildingBlock[];

    blocks.value = await Promise.all(
      data
        .map((item) => {
          delete item?.alternative_building_blocks;
          return item;
        })
        .map(parseBlock),
    );
  }

  async function findBlock(id: number) {
    if (selectedBlock.value && selectedBlock.value?.id === id)
      return selectedBlock.value;

    if (!blocks.value) return await getBlock(id);

    if (blocks.value) {
      const found = blocks.value.find((block) => block.id === id);
      if (found) selectedBlock.value = found;
      else await getBlock(id);
      return selectedBlock.value;
    }
  }

  async function getBlock(id) {
    let external_links = [];
    const alternative_building_blocks = [];
    let alternatives;

    try {
      const data = await client.request(
        readItem("ally_building_block", id, {
          fields: ["*.*"],
          filter: {
            status: {
              _eq: "published",
            },
          },
        }),
      );

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

      if (
        data.alternative_building_blocks &&
        data.alternative_building_blocks.length
      ) {
        const ids = data.alternative_building_blocks.map(
          ({ related_ally_building_block_id }) =>
            related_ally_building_block_id,
        );

        alternatives = await client.request(
          readItems("ally_building_block", {
            fields: ["*.*"],
            filter: {
              id: {
                _in: ids,
              },
              status: {
                _eq: "published",
              },
            },
          }),
        );

        delete alternative_building_blocks?.alternative_building_blocks;
      }

      selectedBlock.value = await parseBlock({
        ...data,
        alternative_building_blocks,
        alternatives,
        external_links,
      });
    } catch (error) {
      console.error(
        `Failed to fetch block with id ${id}:`,
        error.message || error,
      );
      // Return null or any falsy value to indicate a graceful fallback.
      return null;
    }
  }

  // async function getBlock(id: number) {
  //   let external_links: DirectusExternalLink[] = [];
  //   const alternative_building_blocks: DirectusBuildingBlock[] = [];

  //   let alternatives;

  //   const data = (await client.request(
  //     readItem("ally_building_block", id, {
  //       fields: ["*.*"],
  //       filter: {
  //         status: {
  //           _eq: 'published'
  //         }
  //       }
  //     }),
  //   )) as DirectusBuildingBlock;

  //   if (data.external_links && data.external_links.length) {
  //     const slugs = data.external_links.map(
  //       ({ ally_external_link_slug }) => ally_external_link_slug,
  //     );

  //     external_links = await client.request(
  //       readItems("ally_external_link", {
  //         fields: ["*.*"],
  //         filter: {
  //           slug: {
  //             _in: slugs,
  //           },
  //         },
  //       }),
  //     );
  //   }

  //   if (
  //     data.alternative_building_blocks &&
  //     data.alternative_building_blocks.length
  //   ) {
  //     const ids = data.alternative_building_blocks.map(
  //       ({ related_ally_building_block_id }) => related_ally_building_block_id,
  //     );

  //     alternatives = (await client.request(
  //       readItems("ally_building_block", {
  //         fields: ["*.*"],
  //         filter: {
  //           id: {
  //             _in: ids,
  //           },
  //           status: {
  //             _eq: 'published'
  //           }
  //         },
  //       }),
  //     )) as DirectusBuildingBlock[];

  //     delete alternative_building_blocks?.alternative_building_blocks;
  //   }

  //   selectedBlock.value = await parseBlock({
  //     ...data,
  //     alternative_building_blocks,
  //     alternatives,
  //     external_links,
  //   });

  // }

  return {
    blocks,
    selectedBlock,
    error,
    loading,
    findBlock,
    getBlock,
    getBlocks,
  };
});

async function parseBlock(buildingBlock: DirectusBuildingBlock) {
  const {
    id,
    cost,
    effort,
    involvement,
    time,
    maintenance,
    category,
    translations,

    alternatives = [],
    external_links,
  } = buildingBlock;

  const { findBuildingBlockCategory } = useGlobalStore();

  const block = {
    title: {},
    description: {},
    benefits: {},
    how_to_execute: {},
    kpis: {},
  };

  const blockCategory = await findBuildingBlockCategory(category?.slug);

  translations.forEach(
    ({
      title,
      description,
      benefits,
      how_to_execute,
      kpis,
      languages_code,
    }) => {
      block.title[languages_code] = title;
      block.description[languages_code] = description;
      block.benefits[languages_code] = benefits;
      block.how_to_execute[languages_code] = how_to_execute;
      block.kpis[languages_code] = kpis;
    },
  );

  return {
    id,
    cost,
    effort,
    involvement: parseInvolvementContent(involvement?.blocks[0]?.data),
    time,
    maintenance,
    category: blockCategory,
    alternative_building_blocks: await Promise.all(
      alternatives.map(parseBlock),
    ),
    external_links: external_links.map(parseExternalLink),
    ...block,
  };
}

function parseExternalLink(link: DirectusExternalLink): ExternalLink {
  const { url, slug, translations } = link;

  const item = {
    url,
    slug,
    title: {},
    description: {},
  } as ExternalLink;

  translations?.forEach(
    ({ languages_code, title, description, long_description }) => {
      item.title[languages_code] = title;
      item.description[languages_code] = description || long_description;
    },
  );

  return item;
}

function parseInvolvementContent(data) {
  if (!data) return null;
  let involvement = "";
  //replace this later
  console.log({data});
  data?.items?.forEach(({ content }) => {
    involvement = `${involvement} \n ${content}`;
  });
  return involvement;
}
