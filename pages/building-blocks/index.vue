<template>
  <main class="main">
    <div class="search-container color-gray-light-mode-900" :class="{ mobile: isMobile }">
      <div v-if="pageData" class="search-container__text-content">
        <div class="page-section-wrapper" v-if="!isMobile">
          <PageSection
            html
            :title="pageData.title || ''"
            :description="pageData.content[0] || ''"
          />
        </div>
        <template v-else>
          <PageSection
            html
            :title="pageData.title || ''"
            :description="pageData.content[0] || ''"
          />
        </template>
      </div>

      <div class="search-filter" :class="{ mobile: isMobile, desktop: !isMobile }">
        <template v-if="isMobile">
          <div class="searchbar-row">
            <FormSearchBar v-model="searchTerm" />
          </div>
          <div class="dropdowns-grid">
            <FormDropDown
              v-model="selectedCategory"
              :options="categories"
              placeholder="Pillar"
            />
            <FormDropDown
              v-model="selectedCost"
              :options="cost"
              placeholder="Cost"
            />
            <FormDropDown
              v-model="selectedDifficulty"
              :options="difficulty"
              placeholder="Difficulty"
            />
            <FormDropDown
              v-model="selectedEffort"
              :options="effort"
              placeholder="Effort"
            />
          </div>
        </template>
        <template v-else>
          <FormSearchBar v-model="searchTerm" />
          <FormDropDown
            v-model="selectedCategory"
            :options="categories"
            placeholder="Pillar"
          />
          <FormDropDown
            v-model="selectedCost"
            :options="cost"
            placeholder="Cost"
          />
          <FormDropDown
            v-model="selectedDifficulty"
            :options="difficulty"
            placeholder="Difficulty"
          />
          <FormDropDown
            v-model="selectedEffort"
            :options="effort"
            placeholder="Effort"
          />
        </template>
      </div>
    </div>

    <div class="content-wrapper">
      <template v-for="cat in categoryConfigs" :key="cat.slug">
        <transition name="fade">
          <div v-if="selectedCategory.some(opt => opt.value === cat.slug) && cat.blocks.value.length">
            <PageSection v-if="cat.section.value" v-bind="cat.section.value" />
            <BlockList :blocks="cat.blocks.value" />
          </div>
        </transition>
      </template>
    </div>
  </main>
</template>

<script setup lang="ts">
import { mapCategory } from '~/utils/mapCategory';
import type { Category, Block, OptionProps } from '~/types/components';
import { isCategorySlug } from '~/utils/category';
import type { CategorySlug } from '~/utils/category';

const { locale, buildingBlockCategories } = storeToRefs(useGlobalStore());
const { pages } = storeToRefs(useStaticPageStore());
const { getStaticPage } = useStaticPageStore();
const { blocks } = storeToRefs(useBuildingBlockStore());
const { getBlocks } = useBuildingBlockStore();
const { getBuildingBlockCategories } = useGlobalStore();

const { isMobile } = useIsMobile();

onMounted(
  async () =>
    await Promise.all([
      getBuildingBlockCategories(),
      getBlocks(),
      getStaticPage("blocks"),
    ]),
);

type PageData = { title: string; content: string[] } | null;

const pageData = computed<PageData>(() => {
  const pagesValue = pages.value as Record<string, unknown>;
  const blocksPage = pagesValue && typeof pagesValue === 'object' && 'blocks' in pagesValue ? (pagesValue['blocks'] as { title?: Record<string, string>; content?: Array<Record<string, string>> }) : undefined;
  if (!blocksPage) return null;
  const title = blocksPage.title?.[locale.value] ?? '';
  const content = Array.isArray(blocksPage.content)
    ? blocksPage.content.map((c) => c?.[locale.value] ?? '')
    : [];
  return { title, content };
});

const searchTerm = ref<string>("");

const categories = [
  { label: "Values & structures", value: "governance_values" },
  { label: "Culture & skills", value: "culture_skills" },
  {
    label: "Communication & participation",
    value: "communication_involvement",
  },
  { label: "Methods & processes", value: "methods_processes" },
];

const cost = [
  { label: "Low", value: "low" },
  { label: "Medium", value: "medium" },
  { label: "High", value: "high" },
];

const difficulty = [
  { label: "Low", value: "low" },
  { label: "Medium", value: "medium" },
  { label: "High", value: "high" },
];

const effort = [
  { label: "Low", value: "low" },
  { label: "Medium", value: "medium" },
  { label: "High", value: "high" },
];

const selectedCategory = ref<OptionProps[]>(categories.filter(opt => opt.value !== null));
const selectedCost = ref<OptionProps[]>(cost.filter(opt => opt.value !== null));
const selectedDifficulty = ref<OptionProps[]>(difficulty.filter(opt => opt.value !== null));
const selectedEffort = ref<OptionProps[]>(effort.filter(opt => opt.value !== null));

const governanceSection = getSection('governance_values');
const cultureSection = getSection('culture_skills');
const communicationSection = getSection('communication_involvement');
const methodsSection = getSection('methods_processes');

const governanceBlocks = getBlocksForCategory('governance_values');
const cultureBlocks = getBlocksForCategory('culture_skills');
const communicationBlocks = getBlocksForCategory('communication_involvement');
const methodsBlocks = getBlocksForCategory('methods_processes');

function filterBlocks({ blocks, searchTerm }: { blocks: Block[]; searchTerm: string }): Block[] {
  if (!searchTerm || !searchTerm.length) return blocks;
  const lowerCaseSearchTerm = searchTerm.toLowerCase();
  function searchInObject(obj: Record<string, unknown>): boolean {
    for (const key in obj) {
      if (obj[key]) {
        const value = obj[key];
        if (typeof value === "string") {
          if (value.toLowerCase().includes(lowerCaseSearchTerm)) {
            return true;
          }
        } else if (typeof value === "object" && value !== null) {
          if (searchInObject(value as Record<string, unknown>)) {
            return true;
          }
        }
      }
    }
    return false;
  }
  return blocks.filter((block) => searchInObject(block as unknown as Record<string, unknown>));
}

const filteredBlocks = computed<Block[]>(() => {
  const blocksCopy = [...(blocks.value as Block[])];
  return filterBlocks({ searchTerm: searchTerm.value, blocks: blocksCopy });
});

function getBlocksForCategory(slug: CategorySlug) {
  return computed(() => {
    if (!selectedCategory.value.length || !selectedCost.value.length || !selectedDifficulty.value.length || !selectedEffort.value.length) return [];
    if (!filteredBlocks.value) return [];
    return filteredBlocks.value
      .filter((block) => isCategorySlug(block.category?.slug) && block.category?.slug === slug)
      .filter((block) => {
        return selectedDifficulty.value.some((opt: OptionProps) => opt.value === block.effort);
      })
      .filter((block) => {
        return selectedCost.value.some((opt: OptionProps) => opt.value === block.cost);
      })
      .filter((block) => {
        return selectedEffort.value.some((opt: OptionProps) => opt.value === block.effort);
      })
      .map((block) => ({
        ...block,
        id: block.id,
        title: typeof block.title === 'object' && block.title ? block.title[locale.value] ?? '' : '',
        description: typeof block.description === 'object' && block.description ? block.description[locale.value] ?? '' : '',
        category: mapCategory(isCategorySlug(block.category?.slug) ? block.category?.slug : 'governance_values'),
        categoryTitle: block.category?.title?.[locale.value],
        url: block.id,
      }));
  });
}

function getSection(slug: string) {
  return computed<{ title: string; description: string }>(() => {
    if (!buildingBlockCategories.value) return { title: '', description: '' };
    const section = (buildingBlockCategories.value as Category[]).find(
      (cat) => cat.slug === slug,
    );
    return {
      title: section?.title?.[locale.value] ?? '',
      description: section?.description?.[locale.value] ?? '',
    };
  });
}

const categoryConfigs = [
  {
    slug: 'governance_values',
    section: governanceSection,
    blocks: governanceBlocks,
  },
  {
    slug: 'culture_skills',
    section: cultureSection,
    blocks: cultureBlocks,
  },
  {
    slug: 'communication_involvement',
    section: communicationSection,
    blocks: communicationBlocks,
  },
  {
    slug: 'methods_processes',
    section: methodsSection,
    blocks: methodsBlocks,
  },
] as const;

</script>

<style scoped lang="scss">
@use "/assets/scss/colors" as *;
@use "/assets/scss/spacing" as *;

.search-container {
  border-radius: 0.8rem;
  width: 100%;
  display: flex;
  flex-direction: column;
  height: 100%;
  margin-bottom: 4rem;

  &__text-content {
    display: flex;
    flex-direction: column;
    gap: 1 rem;
    margin-bottom: 2rem;
  }

  &__title {
    text-align: center;
    font-size: 2.2rem;
    font-weight: 700;
  } 
  &__description {
    text-align: center;
    font-size: 1.3rem;
  }
}

.search-container.mobile {
  padding: 1rem;
}

.search-filter {
  width: 100%;
  gap: 1rem;
}

.search-filter.mobile {
  display: block;
  gap: 0;
}

.search-filter.desktop {
  display: grid;
  grid-template-columns: 2fr 1fr 1fr 1fr 1fr;
  align-items: center;
}

.search-filter.desktop .searchbar-row {
  grid-column: 1 / 2;
}

.search-filter.desktop .dropdowns-grid {
  display: contents;
}

.search-filter.desktop .dropdowns-grid > * {
  width: 100%;
}

.page-section-wrapper {
  width: 40%;
  min-width: 350px;
  max-width: 700px;
  margin-bottom: 2rem;
}

@media (min-width: 1200px) {
  .page-section-wrapper {
    width: 66%;
  }
}

.categories-overview {
  margin-top: 1rem;
  flex: 50%;
}

.categories-overview {
  margin-top: 2rem;
  display: flex;
  flex-wrap: wrap;
  gap: 2rem;
}

.card-container {
  display: flex;
  flex-wrap: wrap;
  gap: 2rem;
}

.card {
  height: 16rem;
  width: 36rem;
  color: $text-color;
  background-color: white;
  margin-bottom: 1rem;
  .title {
    font-weight: bold;
  }
}

.fade-enter-active, .fade-leave-active {
  transition: opacity 0.3s;
}
.fade-enter-from, .fade-leave-to {
  opacity: 0;
}
</style>
