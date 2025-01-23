export async function parseBlock(buildingBlock: DirectusBuildingBlock) {
  const {
    id,
    cost,
    effort,
    involvement,
    maximum_hours_required,
    minimum_hours_required,
    category,
    translations,
    alternative_building_blocks = [],
    external_links,
  } = buildingBlock;

  const { findBuildingBlockCategory } = useGlobalStore();

  const block = {
    title: {},
    description: {},
    sections: [],
  };

  const sectionMap = {};

  const blockCategory = await findBuildingBlockCategory(category?.slug);
  translations.forEach(({ title, description, content, languages_code }) => {
    block.title[languages_code] = title;
    block.description[languages_code] = description;

    let currentSection = null;
    let sectionIndex = 0;
    const { blocks } = content;

    blocks.forEach((contentBlock) => {
      if (contentBlock.type === "header") {
        currentSection = sectionMap[sectionIndex] || {
          title: {},
          description: {},
          action: null,
        };
        currentSection.title[languages_code] = contentBlock.data.text;
        sectionMap[sectionIndex] = currentSection;

        sectionIndex++;
      } else if (contentBlock.type === "paragraph" && currentSection) {
        currentSection.description[languages_code] = contentBlock.data.text;
      }
    });
  });

  Object.keys(sectionMap).forEach((index) => {
    block.sections.push(sectionMap[index]);
  });

  return {
    id,
    cost,
    effort,
    involvement,
    maximum_hours_required,
    minimum_hours_required,
    category: blockCategory,
    alternative_building_blocks: await Promise.all(
      alternative_building_blocks.map(parseBlock),
    ),
    external_links: external_links.map(parseExternalLink),
    ...block,
  };
}
